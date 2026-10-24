import { site } from '@/config/site';
import { featureIcons, type FeatureIcon } from '@/components/ui/Icons';

// Secciones informativas de la landing de FashionKey. Todo el contenido sale de src/config/site.ts.
const Icon = ({ name, size = 24 }: { name: string; size?: number }) => {
  const Svg = featureIcons[name as FeatureIcon];
  return Svg ? <Svg size={size} /> : null;
};

function SectionHead({ eyebrow, title, text, id }: { eyebrow: string; title: string; text?: string; id: string }) {
  return <div className="section-head">
    <div><span className="eyebrow">{eyebrow}</span><h2 id={id}>{title}</h2></div>
    {text && <p>{text}</p>}
  </div>;
}

// Problema: los riesgos de identidad digital que motivan la propuesta (sin estadísticas ni promesas absolutas).
export function Problem() {
  const s = site.problem;
  return <section id="problema" className="home-section" aria-labelledby="problema-title">
    <div className="container">
      <SectionHead id="problema-title" eyebrow={s.eyebrow} title={s.title} text={s.text} />
      <ul className="card-grid cols-4">{s.items.map(i => <li key={i.title} className="feature-card"><span className="feature-icon"><Icon name={i.icon} /></span><h3>{i.title}</h3><p>{i.text}</p></li>)}</ul>
    </div>
  </section>;
}

// Solución: los tres pilares, cada uno con su estado real (se puede probar en la demo / es concepto).
export function Solution() {
  const s = site.solution;
  return <section id="solucion" className="home-section" aria-labelledby="solucion-title">
    <div className="container">
      <SectionHead id="solucion-title" eyebrow={s.eyebrow} title={s.title} text={s.text} />
      <ul className="card-grid cols-3">{s.pillars.map((p, i) => <li key={p.title} className="feature-card pillar-card">
        <div className="pillar-top"><span className="feature-icon"><Icon name={p.icon} /></span><span className="pillar-index">0{i + 1}</span></div>
        <h3>{p.title}</h3>
        <p>{p.text}</p>
        <p className={`status-tag status-${p.status}`}>{p.statusText}</p>
      </li>)}</ul>
    </div>
  </section>;
}

// Cómo funciona: flujo de tres pasos según la arquitectura propuesta.
export function HowItWorks() {
  const s = site.how;
  return <section id="como-funciona" className="home-section" aria-labelledby="como-funciona-title">
    <div className="container">
      <SectionHead id="como-funciona-title" eyebrow={s.eyebrow} title={s.title} text={s.text} />
      <ol className="flow">{s.steps.map((step, i) => <li key={step.title} className="flow-step">
        <span className="flow-number">0{i + 1}</span>
        <span className="feature-icon"><Icon name={step.icon} size={26} /></span>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </li>)}</ol>
      <div className="flow-foot"><p className="status-tag status-concept">{s.note}</p><a className="btn btn-ghost" href={s.cta.href}>{s.cta.label}</a></div>
    </div>
  </section>;
}

export function Differentials() {
  const s = site.differentials;
  return <section id="diferenciales" className="home-section" aria-labelledby="diferenciales-title">
    <div className="container">
      <SectionHead id="diferenciales-title" eyebrow={s.eyebrow} title={s.title} />
      <ul className="card-grid cols-4">{s.items.map(i => <li key={i.title} className="feature-card"><span className="feature-icon"><Icon name={i.icon} /></span><h3>{i.title}</h3><p>{i.text}</p></li>)}</ul>
    </div>
  </section>;
}

// Casos de uso: presentados como usos previstos, no como integraciones existentes.
export function UseCases() {
  const s = site.useCases;
  return <section id="casos" className="home-section" aria-labelledby="casos-title">
    <div className="container">
      <SectionHead id="casos-title" eyebrow={s.eyebrow} title={s.title} text={s.text} />
      <ul className="card-grid cols-3">{s.items.map(i => <li key={i.title} className="feature-card use-card"><span className="feature-icon"><Icon name={i.icon} /></span><span className="use-tag">Caso previsto</span><h3>{i.title}</h3><p>{i.text}</p></li>)}</ul>
    </div>
  </section>;
}

export function FinalCta() {
  const s = site.finalCta;
  return <section className="final-cta" aria-labelledby="final-cta-title">
    <div className="container">
      <span className="eyebrow">{site.brand.name}</span>
      <h2 id="final-cta-title">{s.title}</h2>
      <p>{s.text}</p>
      <a className="btn btn-primary" href={s.cta.href}>{s.cta.label}</a>
      <p className="final-slogan">“{site.brand.slogan}”</p>
    </div>
  </section>;
}
