// Verificación por cámara, 100 % en el navegador: ningún fotograma sale del dispositivo.
//  1. Lentes: MediaPipe Face Detector confirma que hay exactamente un rostro y lo ubica; MobileCLIP (fp16: la versión int8 pierde precisión)
//     compara el recorte con las descripciones "con lentes" / "sin lentes" (embeddings en src/config/glasses-embeddings.json, `npm run setup:vision`).
//  2. Gesto de huella: MediaPipe Hand Landmarker ubica las yemas de los dedos; si una queda junto a una oreja
//     (donde va el sensor de la patilla) durante un instante, se toma como si se hubiera apoyado el dedo.
import embeddings from '@/config/glasses-embeddings.json';

export type Point = { x: number; y: number }; // normalizado 0..1 sobre el video
export type FaceBox = { x: number; y: number; w: number; h: number };
export type FaceInfo = { box: FaceBox; ears: Point[] };
export type FrameAnalysis =
  | { face: 'none' }
  | ({ face: 'multiple' | 'small' } & FaceInfo)
  | ({ face: 'ok'; glasses: number } & FaceInfo); // glasses: probabilidad 0..1 de que lleve lentes (NaN si no se clasificó)

// Decisión de lentes. threshold: probabilidad mínima por fotograma; se aceptan cuando `accept` de los últimos `window`
// fotogramas la superan; con `maxFrames` fotogramas válidos sin lograrlo, se rechaza.
export const glassesPolicy = { threshold: 0.6, window: 5, accept: 4, maxFrames: 16, minFaceWidth: 0.16 };
// Gesto de huella. reach: distancia máxima yema–oreja (en anchos de cara); side: qué tan afuera del centro de la cara
// debe estar la yema (evita que tocarse la mejilla cuente); holdMs: tiempo sostenido; earMemoryMs: cuánto se recuerda
// la oreja si la mano tapa la cara y el detector la pierde un momento.
export const touchPolicy = { reach: 0.55, side: 0.32, holdMs: 700, earMemoryMs: 1500 };

export type GlassesDetector = {
  analyze: (video: HTMLVideoElement, timestamp: number, options?: { classify?: boolean }) => Promise<FrameAnalysis>;
};
export type HandTracker = { fingertips: (video: HTMLVideoElement, timestamp: number) => Point[] };

const dot = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i], 0);
const FINGERTIPS = [8, 12, 16]; // índice, medio y anular

// ¿Alguna yema está junto a una oreja y al costado de la cabeza? Coordenadas normalizadas; W/H del video para medir en píxeles.
export function fingerAtEar(tips: Point[], face: FaceInfo, W: number, H: number) {
  const faceW = face.box.w * W, centerX = (face.box.x + face.box.w / 2) * W;
  return tips.some(t => face.ears.some(e =>
    Math.hypot((t.x - e.x) * W, (t.y - e.y) * H) < touchPolicy.reach * faceW &&
    Math.abs(t.x * W - centerX) > touchPolicy.side * faceW));
}

let mediapipe: Promise<{ vision: typeof import('@mediapipe/tasks-vision'); fileset: Awaited<ReturnType<typeof import('@mediapipe/tasks-vision').FilesetResolver.forVisionTasks>> }> | null = null;
function loadMediapipe() {
  mediapipe ??= (async () => {
    silenceMediapipeInfo();
    const vision = await import('@mediapipe/tasks-vision');
    return { vision, fileset: await vision.FilesetResolver.forVisionTasks('/vision/mediapipe') };
  })().catch(e => { mediapipe = null; throw e; });
  return mediapipe;
}

let loading: Promise<GlassesDetector> | null = null;
export function loadGlassesDetector() {
  loading ??= createGlassesDetector().catch(e => { loading = null; throw e; });
  return loading;
}
let handLoading: Promise<HandTracker> | null = null;
export function loadHandTracker() {
  handLoading ??= createHandTracker().catch(e => { handLoading = null; throw e; });
  return handLoading;
}

// MediaPipe informa por console.error que activó el delegado de CPU; no es un error y el overlay de Next lo mostraría como tal.
let silenced = false;
function silenceMediapipeInfo() {
  if (silenced) return;
  silenced = true;
  const original = console.error;
  console.error = (...args: unknown[]) => { if (typeof args[0] === 'string' && args[0].startsWith('INFO: Created TensorFlow Lite')) return; original(...args); };
}

async function createGlassesDetector(): Promise<GlassesDetector> {
  const [{ vision, fileset }, tf] = await Promise.all([loadMediapipe(), import('@huggingface/transformers')]);
  tf.env.allowRemoteModels = false;
  tf.env.allowLocalModels = true;
  tf.env.localModelPath = '/vision/models/';
  const wasm = tf.env.backends.onnx.wasm;
  if (wasm) { wasm.wasmPaths = '/vision/ort/'; wasm.numThreads = 1; }

  const faces = await vision.FaceDetector.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: '/vision/models/blaze_face_short_range.tflite', delegate: 'CPU' },
    runningMode: 'VIDEO',
    minDetectionConfidence: 0.6
  });
  const processor = await tf.AutoProcessor.from_pretrained('mobileclip_s0');
  const clip = await tf.CLIPVisionModelWithProjection.from_pretrained('mobileclip_s0', { dtype: 'fp16', device: 'wasm' });

  const crop = document.createElement('canvas');
  crop.width = crop.height = 256;
  const ctx = crop.getContext('2d', { willReadFrequently: true })!;

  return {
    async analyze(video, timestamp, { classify = true } = {}) {
      const W = video.videoWidth, H = video.videoHeight;
      if (!W || !H) return { face: 'none' };
      const found = faces.detectForVideo(video, timestamp).detections.filter(d => d.boundingBox);
      if (!found.length) return { face: 'none' };
      const b = found[0].boundingBox!;
      const box = { x: b.originX / W, y: b.originY / H, w: b.width / W, h: b.height / H };
      // Puntos de BlazeFace: 0-1 ojos, 2 nariz, 3 boca, 4-5 orejas (tragus).
      const ears = (found[0].keypoints ?? []).slice(4, 6).map(k => ({ x: k.x, y: k.y }));
      if (found.length > 1) return { face: 'multiple', box, ears };
      if (box.w < glassesPolicy.minFaceWidth) return { face: 'small', box, ears };
      if (!classify) return { face: 'ok', box, ears, glasses: NaN };
      // Recorte cuadrado centrado en la zona de los ojos, con margen para ver el marco completo.
      const size = Math.max(b.width, b.height) * 1.25;
      const cx = b.originX + b.width / 2, cy = b.originY + b.height * 0.42;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 256, 256);
      ctx.drawImage(video, cx - size / 2, cy - size / 2, size, size, 0, 0, 256, 256);
      const { image_embeds } = await clip(await processor(tf.RawImage.fromCanvas(crop)));
      const v = (image_embeds.normalize().tolist() as number[][])[0];
      const withGlasses = 100 * dot(v, embeddings.glasses), without = 100 * dot(v, embeddings.noGlasses);
      return { face: 'ok', box, ears, glasses: 1 / (1 + Math.exp(without - withGlasses)) };
    }
  };
}

async function createHandTracker(): Promise<HandTracker> {
  const { vision, fileset } = await loadMediapipe();
  const hands = await vision.HandLandmarker.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: '/vision/models/hand_landmarker.task', delegate: 'CPU' },
    runningMode: 'VIDEO',
    numHands: 2,
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5
  });
  return {
    fingertips(video, timestamp) {
      if (!video.videoWidth) return [];
      return hands.detectForVideo(video, timestamp).landmarks.flatMap(hand => FINGERTIPS.map(i => ({ x: hand[i].x, y: hand[i].y })));
    }
  };
}
