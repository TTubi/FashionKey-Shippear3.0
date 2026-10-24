'use client';
import Link from 'next/link';
import { useEffect, useReducer, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { site } from '@/config/site';
import { useCart, type CartLine } from '@/lib/cart';
import { authReducer, initialAuth } from '@/lib/authEngine';
import { formatPrice } from '@/lib/format';
import { ProductMedia } from '@/components/ProductArt';
import { CheckIcon, CloseIcon } from '@/components/ui/Icons';
import { FingerprintScanner } from './Scanners';
import { GlassesCamera } from './GlassesCamera';
import './checkout.css';

type Step = 'summary' | 'delivery' | 'identity' | 'camera' | 'sensor' | 'result' | 'done';
// Pasos visibles en la barra de progreso. El sensor en pantalla es la alternativa al gesto y comparte el paso "Lentes y huella".
const STEPS: { label: string; steps: Step[] }[] = [
  { label: 'Resumen', steps: ['summary'] },
  { label: 'Entrega y pago', steps: ['delivery'] },
  { label: 'Identidad', steps: ['identity'] },
  { label: 'Lentes y huella', steps: ['camera', 'sensor'] },
  { label: 'Autorización', steps: ['result'] },
  { label: 'Confirmación', steps: ['done'] }
];
// Pausas de los avances automáticos: lo justo para leer el resultado antes de pasar a la siguiente pantalla.
const AUTO = { toResult: 1400, toConfirmation: 2800 };
type Order = { id: string; lines: CartLine[]; subtotal: number; currency: string };
const newOrderId = () => `FK-DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

// Checkout de demostración de FashionKey: todos los datos son ficticios y nada se envía a servicios externos.
export function Checkout() {
  const cart = useCart();
  const reduced = !!useReducedMotion();
  const [step, setStep] = useState<Step>('summary');
  const [auth, dispatch] = useReducer(authReducer, undefined, () => initialAuth());
  const [order, setOrder] = useState<Order | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const focusPending = useRef(false);
  const confirmRef = useRef<() => void>(() => {});

  // El foco pasa al título del nuevo paso cuando termina su fundido de entrada (ver onAnimationComplete).
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    focusPending.current = true;
    const top = heading.current?.closest('.checkout-layout')?.getBoundingClientRect().top ?? 0;
    if (top < 80) window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }, [step, reduced]);

  // Avance automático 1: cuando la cámara (o el sensor en pantalla) resuelve la autorización, se muestra el resultado.
  useEffect(() => {
    if (!auth.result || (step !== 'camera' && step !== 'sensor')) return;
    const t = window.setTimeout(() => setStep('result'), AUTO.toResult);
    return () => window.clearTimeout(t);
  }, [auth.result, step]);
  // Avance automático 2: si la operación fue autorizada, se confirma la compra demo.
  useEffect(() => {
    if (step !== 'result' || !auth.result?.approved) return;
    const t = window.setTimeout(() => confirmRef.current(), AUTO.toConfirmation);
    return () => window.clearTimeout(t);
  }, [step, auth.result]);

  if (!cart.ready) return <div className="container checkout"><div className="scene-loading">CARGANDO CHECKOUT DEMO</div></div>;
  if (!order && cart.lines.length === 0) return <div className="container checkout"><div className="empty-state"><h2>Tu carrito demo está vacío</h2><p>Agregá un modelo conceptual para probar el proceso de compra.</p><Link className="btn btn-primary" href="/#productos">Ver productos</Link></div></div>;

  const lines = order ? order.lines : cart.lines;
  const subtotal = order ? order.subtotal : cart.subtotal;
  const currency = order ? order.currency : cart.currency;
  const device = lines[0].product;
  const payment = site.demo.payment;
  const retry = () => { dispatch({ type: 'reset' }); setStep('camera'); };
  const confirm = () => {
    if (order) return;
    setOrder({ id: newOrderId(), lines: cart.lines, subtotal: cart.subtotal, currency: cart.currency });
    cart.clear();
    setStep('done');
  };
  confirmRef.current = confirm;

  const panel = (title: string, intro: ReactNode, body: ReactNode, actions: ReactNode) => <>
    <h2 id="step-title" ref={heading} tabIndex={-1}>{title}</h2>
    {intro && <p className="step-intro">{intro}</p>}
    {body}
    <div className="step-actions">{actions}</div>
  </>;
  const back = (to: Step) => <button type="button" className="btn btn-ghost" onClick={() => setStep(to)}>← Volver</button>;
  const next = (to: Step, label = 'Continuar', disabled = false) => <button type="button" className="btn btn-primary" disabled={disabled} onClick={() => setStep(to)}>{label}</button>;

  const views: Record<Step, () => ReactNode> = {
    summary: () => panel('Revisá tu pedido', 'Estos son los modelos conceptuales de tu carrito demo.',
      <ul className="review-list">{lines.map(l => <li key={`${l.slug}-${l.variant}`}><ProductMedia product={l.product} frameColor={l.variantInfo.color} /><div><strong>{l.product.name}</strong><small>{l.variantInfo.name} · {l.qty} × {formatPrice(l.product.price, l.product.currency)}</small></div><span>{formatPrice(l.total, l.product.currency)}</span></li>)}</ul>,
      <><Link className="btn btn-ghost" href="/carrito">Editar carrito</Link>{next('delivery')}</>),
    delivery: () => panel('Entrega y pago', 'Usamos datos de ejemplo. Este checkout no solicita ni guarda información personal ni bancaria.',
      <>
        <h3 className="step-subtitle">Datos de entrega</h3>
        <dl className="data-list">{site.demo.customer.map(f => <div key={f.label}><dt>{f.label}<small>Dato de ejemplo</small></dt><dd>{f.value}</dd></div>)}</dl>
        <h3 className="step-subtitle">Medio de pago</h3>
        <div className="pay-card" aria-label={`Medio de pago: ${payment.name}`}>
          <span className="pay-chip" aria-hidden="true" />
          <div><strong>{payment.name}</strong><small>{payment.detail}</small></div>
          <span className="pay-check"><CheckIcon size={16} /> Seleccionada</span>
        </div>
      </>,
      <>{back('summary')}{next('identity')}</>),
    identity: () => panel('Confirmación de identidad', 'La cuenta demo ya está verificada. Para autorizar la compra vas a mostrar tus lentes a la cámara y llevar el dedo al sensor de la patilla, detrás de la oreja.',
      <>
        <div className="account-card"><span className="avatar">UD</span><div><strong>{site.demo.account.name}</strong><small>{site.demo.account.email} · Lentes vinculados: {device.name} ({site.demo.account.deviceId})</small></div></div>
        <p className="sim-note">{site.disclaimers.simulation}</p>
      </>,
      <>{back('delivery')}{next('camera', 'Iniciar autenticación')}</>),
    camera: () => panel('Lentes y huella', site.camera.intro,
      <GlassesCamera device={auth.device} biometric={auth.biometric} onResult={(glasses, source) => dispatch({ type: 'device:result', glasses, source })} onTouch={() => dispatch({ type: 'biometric:gesture' })} onRetry={() => dispatch({ type: 'device:reset' })} />,
      <>{back('identity')}{auth.result ? <span className="auto-note">Pasando al resultado…</span> : auth.device === 'registered' && <button type="button" className="btn btn-ghost" onClick={() => setStep('sensor')}>Usar sensor en pantalla</button>}</>),
    sensor: () => panel('Huella · sensor en pantalla', 'Alternativa al gesto con la cámara: mantené presionado el sensor simulado (o la barra espaciadora). No se captura ninguna huella: es una animación.',
      <FingerprintScanner state={auth.biometric} reduced={reduced} onStart={() => dispatch({ type: 'biometric:start' })} onCancel={() => dispatch({ type: 'biometric:cancel' })} onConfirm={() => dispatch({ type: 'biometric:confirm' })} />,
      <>{back('camera')}{auth.result && <span className="auto-note">Pasando al resultado…</span>}</>),
    result: () => {
      const r = auth.result;
      if (!r) return panel('Autorización pendiente', 'Completá los dos factores para continuar.', null, <button type="button" className="btn btn-primary" onClick={retry}>Volver a empezar</button>);
      return panel('Resultado de la autorización', null,
        <div className={`result ${r.approved ? 'ok' : 'bad'}`} role="status">
          <span className="result-icon">{r.approved ? <CheckIcon size={44} /> : <CloseIcon size={44} />}</span>
          <h3>{r.title}</h3>
          <p>{r.reason}</p>
          <div className="factor-list">
            <span className={`factor ${auth.device === 'registered' ? 'ok' : 'bad'}`}>Lentes · {auth.device === 'registered' ? 'detectados' : 'no detectados'}{auth.source === 'simulated' ? ' (simulado)' : ' (cámara)'}</span>
            <span className={`factor ${auth.biometric === 'confirmed' ? 'ok' : ''}`}>Huella · {auth.biometric !== 'confirmed' ? 'no solicitada' : auth.biometricSource === 'gesture' ? 'confirmada (gesto)' : 'confirmada (sensor)'}</span>
          </div>
          {r.approved && <div className="auto-progress" aria-hidden="true"><span style={{ animationDuration: `${AUTO.toConfirmation}ms` }} /></div>}
          <p className="sim-note">{site.disclaimers.simulation}</p>
        </div>,
        r.approved ? <><span className="auto-note">Confirmando tu compra demo…</span><button type="button" className="btn btn-primary" onClick={confirm}>Confirmar ahora</button></>
          : <><Link className="btn btn-ghost" href="/carrito">Volver al carrito</Link><button type="button" className="btn btn-primary" onClick={retry}>Volver a intentar</button></>);
    },
    done: () => panel('¡Compra demo confirmada!', null,
      <div className="result ok">
        <span className="result-icon"><CheckIcon size={44} /></span>
        <span className="order-id">{order?.id}</span>
        <p>Pago simulado con {payment.name} · Total {formatPrice(subtotal, currency)}</p>
        <div className="disclaimer-box">{site.disclaimers.order}</div>
      </div>,
      <><Link className="btn btn-ghost" href="/">Volver al inicio</Link><Link className="btn btn-primary" href="/#productos">Seguir explorando</Link></>)
  };

  const current = STEPS.findIndex(s => s.steps.includes(step));
  return <div className="container checkout">
    <span className="eyebrow">Checkout de demostración</span>
    <h1>Finalizá tu compra demo</h1>
    <ol className="steps" aria-label="Progreso del checkout">{STEPS.map((s, i) => <li key={s.label} className={i < current ? 'done' : i === current ? 'current' : ''} aria-current={i === current ? 'step' : undefined}><span>{s.label}</span></li>)}</ol>
    <p className="steps-caption">Paso {current + 1} de {STEPS.length} · {STEPS[current].label}</p>
    <div className="checkout-layout">
      <section className="step-panel" aria-labelledby="step-title">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} className="step-body"
            initial={{ opacity: 0, y: reduced ? 0 : 14, filter: reduced ? 'none' : 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: reduced ? 0 : 0.38, ease: [0.2, 0.8, 0.2, 1] } }}
            exit={{ opacity: 0, y: reduced ? 0 : -10, filter: reduced ? 'none' : 'blur(4px)', transition: { duration: reduced ? 0 : 0.22, ease: 'easeIn' } }}
            onAnimationComplete={() => { if (focusPending.current) { focusPending.current = false; heading.current?.focus({ preventScroll: true }); } }}>
            {views[step]()}
          </motion.div>
        </AnimatePresence>
      </section>
      <aside className="order-summary" aria-label="Resumen del pedido">
        <h2>Tu pedido</h2>
        {lines.map(l => <div key={`${l.slug}-${l.variant}`} className="summary-line"><ProductMedia product={l.product} frameColor={l.variantInfo.color} /><div>{l.product.name} × {l.qty}<small>{l.variantInfo.name}</small></div><span>{formatPrice(l.total, l.product.currency)}</span></div>)}
        <div className="totals-row"><span>Subtotal</span><strong>{formatPrice(subtotal, currency)}</strong></div>
        <div className="totals-row"><span>Envío</span><strong>Sin costo (demo)</strong></div>
        <div className="totals-row total"><span>Total</span><strong>{formatPrice(subtotal, currency)}</strong></div>
        <p className="price-note">Precios referenciales simulados</p>
      </aside>
    </div>
  </div>;
}
