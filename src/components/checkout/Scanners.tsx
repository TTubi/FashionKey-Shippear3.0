'use client';
import { useEffect, useRef, type CSSProperties } from 'react';
import type { AuthState } from '@/lib/authEngine';
import { FingerprintIcon } from '@/components/ui/Icons';

// Sensor de huella simulado: hay que mantenerlo presionado. No captura ningún dato; solo anima un estado.
export function FingerprintScanner({ state, onStart, onCancel, onConfirm, reduced }: { state: AuthState['biometric']; onStart: () => void; onCancel: () => void; onConfirm: () => void; reduced: boolean }) {
  const timer = useRef<number | undefined>(undefined);
  const hold = reduced ? 500 : 1400;
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const begin = () => { if (state !== 'pending') return; onStart(); timer.current = window.setTimeout(onConfirm, hold); };
  const end = () => { if (state !== 'scanning') return; window.clearTimeout(timer.current); onCancel(); };
  const status = state === 'pending' ? 'Mantené presionado el sensor' : state === 'scanning' ? 'Leyendo huella simulada…' : 'Huella confirmada (simulación)';
  return <div className="scanner">
    <button type="button" className={`fingerprint is-${state}`} style={{ '--hold': `${hold}ms` } as CSSProperties} disabled={state === 'confirmed'}
      aria-label="Sensor de huella simulado: mantener presionado"
      onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); begin(); }}
      onPointerUp={end} onPointerCancel={end}
      onKeyDown={e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); begin(); } }}
      onKeyUp={e => { if (e.key === ' ' || e.key === 'Enter') end(); }}
      onContextMenu={e => e.preventDefault()}>
      <svg className="ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" pathLength={100} /></svg>
      <FingerprintIcon size={84} />
      <span className="scanline" />
    </button>
    <p className={`scanner-status ${state === 'confirmed' ? 'ok' : ''}`} aria-live="polite">{status}</p>
  </div>;
}
