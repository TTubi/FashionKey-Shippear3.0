'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { site } from '@/config/site';
import type { AuthState } from '@/lib/authEngine';
import type { FaceBox, FaceInfo, FrameAnalysis, Point } from '@/lib/glassesDetector';

type Phase = 'idle' | 'starting' | 'scanning' | 'touch' | 'error';
const FACE_HINTS: Record<FrameAnalysis['face'], string> = {
  none: 'Ubicá tu rostro dentro del marco',
  multiple: 'Debe haber una sola persona frente a la cámara',
  small: 'Acercate un poco más a la cámara',
  ok: 'Analizando si llevás lentes…'
};
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const mirror = (p: Point) => ({ left: `${(1 - p.x) * 100}%`, top: `${p.y * 100}%` });

// Una sola sesión de cámara para los dos factores:
//  1. busca un único rostro y decide si lleva lentes;
//  2. si los lentes son válidos, sigue abierta y espera el gesto de llevar el dedo al sensor de la patilla, detrás de la oreja.
// Si la cámara no está disponible, ofrece una simulación claramente identificada.
export function GlassesCamera({ device, biometric, expectTouch, onResult, onTouch, onRetry }: {
  device: AuthState['device'];
  biometric: AuthState['biometric'];
  expectTouch: boolean;
  onResult: (glasses: boolean, source: 'camera' | 'simulated') => void;
  onTouch: () => void;
  onRetry: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [face, setFace] = useState<FrameAnalysis['face']>('none');
  const [box, setBox] = useState<FaceBox | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [ears, setEars] = useState<Point[]>([]);
  const [tips, setTips] = useState<Point[]>([]);
  const [touch, setTouch] = useState(0);
  const [aspect, setAspect] = useState(4 / 3);
  const [live, setLive] = useState(false);

  const stop = () => { stream.current?.getTracks().forEach(t => t.stop()); stream.current = null; setLive(false); };
  useEffect(() => stop, []);

  const start = async () => {
    setError('');
    setPhase('starting');
    setStatus('Pidiendo acceso a la cámara…');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw Object.assign(new Error(), { name: 'NotSupportedError' });
      const [media, vision] = await Promise.all([
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false }),
        import('@/lib/glassesDetector')
      ]);
      stream.current = media;
      const el = video.current!;
      el.srcObject = media;
      await el.play();
      setLive(true);
      setAspect(el.videoWidth / el.videoHeight || 4 / 3);
      setStatus('Cargando el detector de lentes…');
      const handsLoading = expectTouch ? vision.loadHandTracker() : null;
      handsLoading?.catch(() => {}); // se precarga mientras se analizan los lentes
      const detector = await vision.loadGlassesDetector();
      setPhase('scanning');

      // Factor 1 · lentes: decide con varios fotogramas, no con uno solo.
      const { glassesPolicy, touchPolicy, fingerAtEar } = vision;
      const scores: number[] = [];
      let accepted = false;
      while (stream.current) {
        const r = await detector.analyze(el, performance.now());
        if (!stream.current) return;
        setFace(r.face);
        setBox(r.face === 'none' ? null : r.box);
        if (r.face === 'ok') {
          scores.push(r.glasses);
          setScore(r.glasses);
          const recent = scores.slice(-glassesPolicy.window);
          if (recent.filter(p => p >= glassesPolicy.threshold).length >= glassesPolicy.accept) { accepted = true; break; }
          if (scores.length >= glassesPolicy.maxFrames) { stop(); onResult(false, 'camera'); return; }
        }
        await sleep(120);
      }
      if (!accepted) return;
      onResult(true, 'camera');
      if (!expectTouch) { stop(); return; }

      // Factor 2 · gesto de huella: yema del dedo junto a la oreja, sostenida un instante.
      setPhase('touch');
      setStatus('Cargando el detector de manos…');
      const hands = await handsLoading!;
      setStatus('');
      let lastFace: FaceInfo | null = null, lastFaceAt = 0, heldSince: number | null = null;
      while (stream.current) {
        const now = performance.now();
        const r = await detector.analyze(el, now, { classify: false });
        if (r.face !== 'none' && r.ears.length) { lastFace = { box: r.box, ears: r.ears }; lastFaceAt = now; }
        const current = lastFace && now - lastFaceAt < touchPolicy.earMemoryMs ? lastFace : null;
        const found = hands.fingertips(el, performance.now());
        if (!stream.current) return;
        setBox(current?.box ?? null);
        setEars(current?.ears ?? []);
        setTips(found);
        if (current && fingerAtEar(found, current, el.videoWidth, el.videoHeight)) {
          heldSince ??= now;
          const progress = Math.min(1, (now - heldSince) / touchPolicy.holdMs);
          setTouch(progress);
          if (progress >= 1) { stop(); onTouch(); return; }
        } else { heldSince = null; setTouch(0); }
        await sleep(60);
      }
    } catch (e) {
      console.error('[FashionKey] verificación por cámara:', e);
      stop();
      const name = (e as Error)?.name;
      setError(name === 'NotAllowedError' ? 'No diste permiso para usar la cámara.' : name === 'NotFoundError' ? 'No encontramos una cámara en este dispositivo.' : name === 'NotSupportedError' ? 'Este navegador no permite usar la cámara aquí (requiere https o localhost).' : 'No se pudo iniciar la verificación por cámara.');
      setPhase('error');
    }
  };

  const retry = () => { stop(); setScore(null); setBox(null); setFace('none'); setEars([]); setTips([]); setTouch(0); setPhase('idle'); onRetry(); };
  const touching = phase === 'touch' && device === 'registered' && biometric !== 'confirmed' && live;
  const final = device === 'none' || device === 'unknown' || (device === 'registered' && !touching);
  const scanning = phase === 'scanning' && device === 'pending';
  const pct = Math.round((score ?? 0) * 100);
  const outcome = device === 'none' ? 'bad' : final ? 'ok' : '';
  const outcomeText = device === 'none' ? 'No detectamos lentes' : device === 'registered' && biometric === 'confirmed' ? 'Lentes y huella confirmados' : 'Lentes detectados';

  return <div className="camera-check">
    <div className={`camera-frame ${scanning ? 'is-scanning' : ''} ${touching ? 'is-touch' : ''} ${outcome && `is-${outcome}`}`} style={{ aspectRatio: aspect } as CSSProperties}>
      <video ref={video} muted playsInline aria-hidden="true" className={phase === 'idle' && device === 'pending' ? '' : 'is-live'} />
      {phase === 'idle' && device === 'pending' && <div className="camera-placeholder"><span className="camera-guide" />Tu rostro va a aparecer acá</div>}
      {box && (scanning || touching) && <span className={`face-box face-${touching ? 'ok' : face}`} style={{ left: `${(1 - box.x - box.w) * 100}%`, top: `${box.y * 100}%`, width: `${box.w * 100}%`, height: `${box.h * 100}%` }} />}
      {touching && ears.map((e, i) => <span key={i} className={`ear-target ${touch > 0 ? 'is-hit' : ''}`} style={mirror(e)} />)}
      {touching && tips.map((t, i) => <span key={i} className="finger-dot" style={mirror(t)} />)}
      {scanning && <span className="camera-scanline" />}
      {final && <div className="camera-outcome">{outcomeText}</div>}
    </div>

    <div className="camera-panel" aria-live="polite">
      {phase === 'starting' && <p className="scanner-status">{status}</p>}
      {scanning && <>
        <p className="scanner-status">{FACE_HINTS[face]}</p>
        <div className="meter" aria-label={`Confianza de lentes ${pct}%`}><span style={{ width: `${pct}%` }} /></div>
        <small className="meter-label">Confianza del modelo: {score === null ? '—' : `${pct}%`}</small>
      </>}
      {touching && <>
        <p className="scanner-status ok">✓ Lentes detectados</p>
        <p className="touch-hint"><strong>Ahora la huella:</strong> llevá el dedo a la patilla, detrás de tu oreja, como si apoyaras el sensor.</p>
        {status ? <p className="scanner-status">{status}</p> : <>
          <div className="meter meter-touch" aria-label={`Gesto de huella ${Math.round(touch * 100)}%`}><span style={{ width: `${touch * 100}%` }} /></div>
          <small className="meter-label">{touch > 0 ? 'Mantené el dedo ahí…' : tips.length ? 'Vemos tu mano: acercala a la oreja' : 'Levantá la mano hacia la oreja'}</small>
        </>}
      </>}
      {final && <p className={`scanner-status ${device === 'none' ? 'bad' : 'ok'}`}>
        {device === 'none' ? 'La cámara no encontró lentes puestos en tu rostro.' : biometric === 'confirmed' ? 'Se detectaron lentes y el gesto sobre el sensor de huella.' : 'Se detectaron lentes en tu rostro.'}
      </p>}
      {phase === 'error' && device === 'pending' && <p className="scanner-status bad">{error}</p>}

      <div className="camera-actions">
        {phase === 'idle' && device === 'pending' && <button type="button" className="btn btn-primary" onClick={start}>Activar cámara</button>}
        {(scanning || phase === 'starting' || touching) && <button type="button" className="btn btn-ghost" onClick={() => { stop(); if (phase !== 'touch') setPhase('idle'); }}>Detener cámara</button>}
        {final && <button type="button" className="btn btn-ghost" onClick={retry}>Volver a intentar</button>}
        {phase === 'error' && device === 'pending' && <button type="button" className="btn btn-ghost" onClick={retry}>Reintentar</button>}
      </div>

      {device === 'pending' && <details className="camera-fallback" open={phase === 'error'}>
        <summary>¿Sin cámara? Usar simulación</summary>
        <p>Elegí el resultado de la comprobación. Queda registrado como simulado.</p>
        <div><button type="button" className="btn btn-ghost" onClick={() => { stop(); onResult(true, 'simulated'); }}>Simular con lentes</button><button type="button" className="btn btn-ghost" onClick={() => { stop(); onResult(false, 'simulated'); }}>Simular sin lentes</button></div>
      </details>}
      <p className="fine-print">{site.camera.privacy}</p>
    </div>
  </div>;
}
