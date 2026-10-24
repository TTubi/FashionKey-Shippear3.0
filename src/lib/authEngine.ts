// Motor de la autorización de demostración. Orden de los factores:
//   1. Lentes: la cámara comprueba (en el navegador) que la persona lleva lentes puestos.
//   2. Huella: con la cámara todavía abierta, el gesto de llevar el dedo al sensor de la patilla (detrás de la oreja)
//      cuenta como apoyarlo. Alternativa: el sensor animado en pantalla. En ningún caso se captura una huella.
// La detección de lentes es real pero solo visual: no identifica a la persona ni lee una credencial NFC.
// El escenario C ("lentes no vinculados") se simula con un interruptor, porque una cámara no puede saber de quién son los lentes.
export type DeviceReading = 'registered' | 'none' | 'unknown';
export type DeviceSource = 'camera' | 'simulated';
export type BiometricSource = 'gesture' | 'sensor';
export type AuthResult = { approved: boolean; title: string; reason: string };
export type AuthState = {
  unlinked: boolean;
  device: 'pending' | DeviceReading;
  source: DeviceSource | null;
  biometric: 'pending' | 'scanning' | 'confirmed';
  biometricSource: BiometricSource | null;
  result: AuthResult | null;
};
export type AuthAction =
  | { type: 'unlinked'; value: boolean }
  | { type: 'device:result'; glasses: boolean; source: DeviceSource }
  | { type: 'device:reset' }
  | { type: 'biometric:start' }
  | { type: 'biometric:cancel' }
  | { type: 'biometric:confirm' }
  | { type: 'biometric:gesture' }
  | { type: 'reset' };

export const scenarios = [
  { label: 'A', title: 'Operación autorizada', description: 'Mostrás tus lentes a la cámara y llevás el dedo al sensor detrás de la oreja.' },
  { label: 'B', title: 'Sin lentes', description: 'Si la cámara no detecta lentes, la operación se rechaza aunque tengas huella.' },
  { label: 'C', title: 'Lentes no vinculados', description: 'Se detectan lentes, pero no son los registrados en la cuenta. Activalo con la opción de abajo.' }
];

export const initialAuth = (unlinked = false): AuthState => ({ unlinked, device: 'pending', source: null, biometric: 'pending', biometricSource: null, result: null });

// Ambos factores son obligatorios: sin lentes válidos ni siquiera se pide la huella.
export function evaluate(device: DeviceReading, biometricConfirmed: boolean): AuthResult {
  if (device === 'none') return { approved: false, title: 'Autorización rechazada', reason: 'La cámara no detectó lentes. Sin el accesorio, la operación no puede autorizarse.' };
  if (device === 'unknown') return { approved: false, title: 'Operación bloqueada', reason: 'Se detectaron lentes, pero no corresponden a los vinculados a esta cuenta. La transacción simulada se bloqueó.' };
  if (!biometricConfirmed) return { approved: false, title: 'Autorización rechazada', reason: 'No se confirmó la huella.' };
  return { approved: true, title: 'Operación autorizada', reason: 'Los dos factores se completaron: lentes detectados y huella confirmada.' };
}

export function authReducer(s: AuthState, a: AuthAction): AuthState {
  switch (a.type) {
    case 'unlinked': return initialAuth(a.value);
    case 'device:result': {
      if (s.device !== 'pending') return s;
      const device: DeviceReading = !a.glasses ? 'none' : s.unlinked ? 'unknown' : 'registered';
      return { ...s, device, source: a.source, result: device === 'registered' ? null : evaluate(device, false) };
    }
    case 'device:reset': return { ...initialAuth(s.unlinked) };
    case 'biometric:start': return s.device === 'registered' && s.biometric === 'pending' ? { ...s, biometric: 'scanning' } : s;
    case 'biometric:cancel': return s.biometric === 'scanning' ? { ...s, biometric: 'pending' } : s;
    case 'biometric:confirm': return s.biometric === 'scanning' ? { ...s, biometric: 'confirmed', biometricSource: 'sensor', result: evaluate('registered', true) } : s;
    case 'biometric:gesture': return s.device === 'registered' && s.biometric !== 'confirmed' ? { ...s, biometric: 'confirmed', biometricSource: 'gesture', result: evaluate('registered', true) } : s;
    case 'reset': return initialAuth(s.unlinked);
  }
}
