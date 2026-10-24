// Prepara los recursos de la verificación de lentes por cámara para que funcionen sin depender de servicios externos:
//  1. copia los runtimes WebAssembly (ONNX Runtime y MediaPipe) a public/vision
//  2. descarga los modelos (detector de rostros y codificador de imagen MobileCLIP) a public/vision/models
//  3. precalcula los embeddings de texto de cada clase ("con lentes" / "sin lentes") en src/config/glasses-embeddings.json
// Uso: npm run setup:vision   (solo hace falta volver a correrlo si se cambian los textos de PROMPTS)
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public', 'vision');
const HF = 'https://huggingface.co/Xenova/mobileclip_s0/resolve/main';
const FACE_MODEL = 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite';
const HAND_MODEL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

// Cada clase promedia varias descripciones (prompt ensembling) para que la clasificación sea más estable.
const PROMPTS = {
  glasses: [
    'a photo of a person wearing glasses',
    'a close-up photo of a face wearing eyeglasses',
    'a selfie of a person wearing glasses',
    'a webcam photo of a person wearing eyeglasses',
    'a photo of a person wearing sunglasses'
  ],
  noGlasses: [
    'a photo of a person',
    'a close-up photo of a face',
    'a selfie of a person',
    'a webcam photo of a person',
    'a portrait of a person with bare eyes'
  ]
};

const copyDir = (from, to, filter) => {
  mkdirSync(to, { recursive: true });
  for (const f of readdirSync(from)) if (filter(f)) copyFileSync(join(from, f), join(to, f));
};
async function download(url, to) {
  if (existsSync(to)) return console.log('  ya existe', to.replace(root, '.'));
  mkdirSync(dirname(to), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} al descargar ${url}`);
  writeFileSync(to, Buffer.from(await res.arrayBuffer()));
  console.log('  descargado', to.replace(root, '.'));
}

console.log('1/3 Runtimes WebAssembly');
copyDir(join(root, 'node_modules/onnxruntime-web/dist'), join(pub, 'ort'), f => /^ort-wasm-simd-threaded\.asyncify\.(mjs|wasm)$/.test(f));
copyDir(join(root, 'node_modules/@mediapipe/tasks-vision/wasm'), join(pub, 'mediapipe'), f => /^vision_wasm_(nosimd_)?internal\.(js|wasm)$/.test(f));

console.log('2/3 Modelos');
await download(FACE_MODEL, join(pub, 'models/blaze_face_short_range.tflite'));
await download(HAND_MODEL, join(pub, 'models/hand_landmarker.task'));
for (const f of ['config.json', 'preprocessor_config.json', 'onnx/vision_model_fp16.onnx']) await download(`${HF}/${f}`, join(pub, 'models/mobileclip_s0', f));

console.log('3/3 Embeddings de texto');
const { AutoTokenizer, CLIPTextModelWithProjection } = await import('@huggingface/transformers');
const tokenizer = await AutoTokenizer.from_pretrained('Xenova/mobileclip_s0');
const textModel = await CLIPTextModelWithProjection.from_pretrained('Xenova/mobileclip_s0', { dtype: 'fp32' });
const embed = async texts => {
  const { text_embeds } = await textModel(tokenizer(texts, { padding: 'max_length', truncation: true }));
  const rows = text_embeds.normalize().tolist();
  const mean = rows[0].map((_, i) => rows.reduce((s, r) => s + r[i], 0) / rows.length);
  const norm = Math.hypot(...mean);
  return mean.map(v => +(v / norm).toFixed(6));
};
const out = { model: 'Xenova/mobileclip_s0', prompts: PROMPTS, glasses: await embed(PROMPTS.glasses), noGlasses: await embed(PROMPTS.noGlasses) };
writeFileSync(join(root, 'src/config/glasses-embeddings.json'), JSON.stringify(out));
console.log('  listo: src/config/glasses-embeddings.json');
