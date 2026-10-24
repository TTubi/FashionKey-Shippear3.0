'use client';
import Link from 'next/link';
import { useEffect, useReducer, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { site } from '@/config/site';
import { useCart, type CartLine } from '@/lib/cart';
import { authReducer, initialAuth, scenarios } from '@/lib/authEngine';
import { formatPrice } from '@/lib/format';
import { ProductMedia } from '@/components/ProductArt';
import { CheckIcon, CloseIcon } from '@/components/ui/Icons';
import { FingerprintScanner } from './Scanners';
import { GlassesCamera } from './GlassesCamera';
import './checkout.css';

const STEPS = ['Resumen', 'Entrega', 'Pago', 'Identidad', 'Lentes', 'Huella', 'Autorización', 'Confirmación'];
type Order = { id: string; lines: CartLine[]; subtotal: number; currency: string; payment: string };
const newOrderId = () => `FK-DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

// Checkout de demostración: todos los datos son ficticios y nada se envía a servicios externos.
export function Checkout() {
  const cart = useCart();
  const reduced = !!useReducedMotion();
  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState(site.demo.payments[0].id);
  const [auth, dispatch] = useReducer(authReducer, undefined, () => initialAuth());
  const [order, setOrder] = useState<Order | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const focusPending = useRef(false);

  // El foco pasa al título del nuevo paso cuando termina su fundido de entrada (ver onAnimationComplete).
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    focusPending.current = true;
    const top = heading.current?.closest('.checkout-layout')?.getBoundingClientRect().top ?? 0;
    if (top < 80) window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }, [step, reduced]);

  if (!cart.ready) return <div className="container checkout"><div className="scene-loading">CARGANDO CHECKOUT DEMO</div></div>;
  if (!order && cart.lines.length === 0) return <div className="container checkout"><div className="empty-state"><h2>Tu carrito demo está vacío</h2><p>Agregá un modelo conceptual para probar el proceso de compra.</p><Link className="btn btn-primary" href="/#productos">Ver productos</Link></div></div>;

  const lines = order ? order.lines : cart.lines;
  const subtotal = order ? order.subtotal : cart.subtotal;
  const currency = order ? order.currency : cart.currency;
  const device = lines[0].product;
  const paymentInfo = site.demo.payments.find(p => p.id === (order?.payment ?? payment)) ?? site.demo.payments[0];
  const toScenario = () => { dispatch({ type: 'reset' }); setStep(3); };
  const confirm = () => {
    setOrder({ id: newOrderId(), lines: cart.lines, subtotal: cart.subtotal, currency: cart.currency, payment });
    cart.clear();
    setStep(7);
  };

  const panel = (title: string, intro: ReactNode, body: ReactNode, actions: ReactNode) => <>
    <h2 id="step-title" ref={heading} tabIndex={-1}>{title}</h2>
    {intro && <p className="step-intro">{intro}</p>}
    {body}
    <div className="step-actions">{actions}</div>
  </>;
  const back = (to: number) => <button type="button" className="btn btn-ghost" onClick={() => setStep(to)}>← Volver</button>;
  const next = (to: number, label = 'Continuar', disabled = false) => <button type="button" className="btn btn-primary" disabled={disabled} onClick={() => setStep(to)}>{label}</button>;

  const steps: (() => ReactNode)[] = [
    () => panel('Revisá tu pedido', 'Estos son los modelos conceptuales de tu carrito demo.',
      <ul className="review-list">{lines.map(l => <li key={`${l.slug}-${l.variant}`}><ProductMedia product={l.product} frameColor={l.variantInfo.color} /><div><strong>{l.product.name}</strong><small>{l.variantInfo.name} · {l.qty} × {formatPrice(l.product.price, l.product.currency)}</small></div><span>{formatPrice(l.total, l.product.currency)}</span></li>)}</ul>,
      <><Link className="btn btn-ghost" href="/carrito">Editar carrito</Link>{next(1)}</>),
    () => panel('Datos de entrega', 'Usamos datos de ejemplo. Este checkout no solicita ni guarda información personal.',
      <dl className="data-list">{site.demo.customer.map(f => <div key={f.label}><dt>{f.label}<small>Dato de ejemplo</small></dt><dd>{f.value}</dd></div>)}</dl>,
      <>{back(0)}{next(2)}</>),
    () => panel('Medio de pago simulado', 'Elegí un medio ficticio. No se solicitan números de tarjeta ni datos bancarios.',
      <div className="choice-grid" role="radiogroup" aria-label="Medio de pago">{site.demo.payments.map(p => <label key={p.id} className="choice"><input type="radio" name="payment" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} /><span className="choice-mark" /><span><strong>{p.name}</strong><small>{p.detail}</small></span></label>)}</div>,
      <>{back(1)}{next(3)}</>),
    () => panel('Confirmación de identidad', 'La cuenta demo ya está verificada. La autorización pide dos factores, en este orden: tus lentes y tu huella.',
      <>
        <div className="account-card"><span className="avatar">UD</span><div><strong>{site.demo.account.name}</strong><small>{site.demo.account.email} · Lentes vinculados: {device.name} ({site.demo.account.deviceId})</small></div></div>
        <ul className="scenario-list">{scenarios.map(s => <li key={s.label}><span className="choice-tag">{s.label}</span><div><strong>{s.title}</strong><small>{s.description}</small></div></li>)}</ul>
        <label className="choice"><input type="checkbox" checked={auth.unlinked} onChange={e => dispatch({ type: 'unlinked', value: e.target.checked })} /><span className="choice-mark choice-check" /><span><strong>Probar escenario C</strong><small>Simular que los lentes que muestres no están vinculados a esta cuenta.</small></span></label>
        <p className="sim-note">{site.disclaimers.simulation}</p>
      </>,
      <>{back(2)}{next(4, 'Iniciar autenticación')}</>),
    () => panel('Lentes y huella', site.camera.intro,
      <GlassesCamera device={auth.device} biometric={auth.biometric} expectTouch={!auth.unlinked} onResult={(glasses, source) => dispatch({ type: 'device:result', glasses, source })} onTouch={() => dispatch({ type: 'biometric:gesture' })} onRetry={() => dispatch({ type: 'device:reset' })} />,
      <><button type="button" className="btn btn-ghost" onClick={toScenario}>← Volver</button>{auth.device === 'registered' && auth.biometric !== 'confirmed' ? <button type="button" className="btn btn-ghost" onClick={() => setStep(5)}>Usar sensor en pantalla</button> : next(6, 'Ver resultado', auth.device === 'pending')}</>),
    () => panel('Huella · sensor en pantalla', 'Alternativa al gesto con la cámara: mantené presionado el sensor simulado (o la barra espaciadora). No se captura ninguna huella: es una animación.',
      <FingerprintScanner state={auth.biometric} reduced={reduced} onStart={() => dispatch({ type: 'biometric:start' })} onCancel={() => dispatch({ type: 'biometric:cancel' })} onConfirm={() => dispatch({ type: 'biometric:confirm' })} />,
      <>{back(4)}{next(6, 'Ver resultado', auth.biometric !== 'confirmed')}</>),
    () => {
      const r = auth.result;
      if (!r) return panel('Autorización pendiente', 'Completá los dos factores para continuar.', null, <button type="button" className="btn btn-primary" onClick={toScenario}>Volver a empezar</button>);
      const lensLabel = auth.device === 'registered' ? 'detectados' : auth.device === 'none' ? 'no detectados' : 'no vinculados';
      return panel('Resultado de la autorización', null,
        <div className={`result ${r.approved ? 'ok' : 'bad'}`} role="status">
          <span className="result-icon">{r.approved ? <CheckIcon size={44} /> : <CloseIcon size={44} />}</span>
          <h3>{r.title}</h3>
          <p>{r.reason}</p>
          <div className="factor-list">
            <span className={`factor ${auth.device === 'registered' ? 'ok' : 'bad'}`}>Lentes · {lensLabel}{auth.source === 'simulated' ? ' (simulado)' : ' (cámara)'}</span>
            <span className={`factor ${auth.biometric === 'confirmed' ? 'ok' : ''}`}>Huella · {auth.biometric !== 'confirmed' ? 'no solicitada' : auth.biometricSource === 'gesture' ? 'confirmada (gesto)' : 'confirmada (sensor)'}</span>
          </div>
          <p className="sim-note">{site.disclaimers.simulation}</p>
        </div>,
        r.approved ? <>{back(auth.biometricSource === 'gesture' ? 4 : 5)}<button type="button" className="btn btn-primary" onClick={confirm}>Confirmar compra demo</button></>
          : <><Link className="btn btn-ghost" href="/carrito">Volver al carrito</Link><button type="button" className="btn btn-primary" onClick={toScenario}>Probar otro escenario</button></>);
    },
    () => panel('¡Compra demo confirmada!', null,
      <div className="result ok">
        <span className="result-icon"><CheckIcon size={44} /></span>
        <span className="order-id">{order?.id}</span>
        <p>Pago simulado con {paymentInfo.name} · Total {formatPrice(subtotal, currency)}</p>
        <div className="disclaimer-box">{site.disclaimers.order}</div>
      </div>,
      <><Link className="btn btn-ghost" href="/">Volver al inicio</Link><Link className="btn btn-primary" href="/#productos">Seguir explorando</Link></>)
  ];

  return <div className="container checkout">
    <span className="eyebrow">Checkout de demostración</span>
    <h1>Finalizá tu compra demo</h1>
    <ol className="steps" aria-label="Progreso del checkout">{STEPS.map((s, i) => <li key={s} className={i < step ? 'done' : i === step ? 'current' : ''} aria-current={i === step ? 'step' : undefined}><span>{s}</span></li>)}</ol>
    <p className="steps-caption">Paso {step + 1} de {STEPS.length} · {STEPS[step]}</p>
    <div className="checkout-layout">
      <section className="step-panel" aria-labelledby="step-title">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} className="step-body"
            initial={{ opacity: 0, y: reduced ? 0 : 14, filter: reduced ? 'none' : 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: reduced ? 0 : 0.38, ease: [0.2, 0.8, 0.2, 1] } }}
            exit={{ opacity: 0, y: reduced ? 0 : -10, filter: reduced ? 'none' : 'blur(4px)', transition: { duration: reduced ? 0 : 0.22, ease: 'easeIn' } }}
            onAnimationComplete={() => { if (focusPending.current) { focusPending.current = false; heading.current?.focus({ preventScroll: true }); } }}>
            {steps[step]()}
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
