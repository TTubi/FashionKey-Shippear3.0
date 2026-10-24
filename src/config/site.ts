// Textos, marca y datos de demostración. Editar acá para adaptar la plataforma sin tocar componentes.
export const site = {
  brand: { name: 'FashionKey', slogan: 'Moda segura', concept: 'FashionKey Trust' },
  nav: [
    { label: 'Productos', href: '/#productos' },
    { label: 'Tecnología', href: '/#tecnologia' }
  ],
  hero: {
    eyebrow: 'FashionKey · Moda segura',
    title: ['Tu identidad.', 'Tu seguridad.', 'Tu futuro.'],
    subtitle: 'Conocé una nueva forma de proteger tus operaciones digitales mediante dispositivos inteligentes y autenticación avanzada.',
    backgroundWord: 'TRUST',
    primaryCta: { label: 'Explorar tecnología', href: '#tecnologia' },
    secondaryCta: { label: 'Conocer productos', href: '#productos' },
    hint: 'ARRASTRÁ · USÁ LAS FLECHAS · TOCÁ LOS LENTES'
  },
  catalog: {
    eyebrow: 'Catálogo conceptual',
    title: 'Tres conceptos. Una misma capa de confianza.',
    text: 'Modelos en etapa conceptual. Nombres, precios e imágenes son temporales y referenciales.'
  },
  trust: {
    eyebrow: 'FashionKey Trust',
    title: 'Una nueva capa de confianza digital.',
    text: 'Dos factores independientes: algo que sos y algo que tenés.',
    steps: [
      { title: 'Seleccioná una compra', text: 'Elegís un producto y avanzás al checkout como en cualquier tienda.' },
      { title: 'Mostrá tus lentes', text: 'Primer factor: la cámara comprueba que llevás puestos tus lentes FashionKey.' },
      { title: 'Tocá el sensor', text: 'Segundo factor: apoyás el dedo en el sensor de huella de la patilla, detrás de la oreja.' },
      { title: 'Operación autorizada', text: 'La autorización queda asociada a esa operación específica.' }
    ],
    cta: 'Elegir un modelo y probar el checkout'
  },
  technologyBrief: [
    { icon: 'nfc', title: 'Credencial NFC', text: 'Los lentes integrarían una credencial de proximidad. La propuesta contempla hardware seguro con desafíos criptográficos; un chip NFC convencional no ofrece esa protección por sí solo.' },
    { icon: 'fingerprint', title: 'Biometría en tu dispositivo', text: 'La huella se verificaría en el dispositivo compatible del usuario, sin que FashionKey necesite almacenar datos biométricos.' },
    { icon: 'link', title: 'Autorización por operación', text: 'Cada autorización se vincularía a una operación específica, para dificultar que pueda reutilizarse en otra.' }
  ],
  statusLabels: { concept: 'Concepto en desarrollo', preorder: 'Preventa simulada', available: 'Disponible (demo)' },
  disclaimers: {
    concept: 'Producto conceptual en desarrollo. El modelo 3D y las imágenes son representaciones ilustrativas.',
    price: 'Precio referencial simulado',
    demo: 'Modo demostración — no es una compra real. No se solicitan ni guardan datos personales o de pago.',
    simulation: 'Demostración — la cámara solo detecta si hay lentes puestos y el gesto de la mano; la huella no se lee. No es una verificación de identidad, biométrica ni criptográfica real.',
    order: 'Esta confirmación no constituye una compra comercial real. No se procesó ningún pago, no se envió información a terceros y no se generará ningún envío.'
  },
  // Textos del encuadre "Chip de huella" en el visor 3D del producto.
  chip: {
    title: 'Sensor de huella integrado',
    text: 'Está en la punta de la patilla, rodeado por un aro dorado. Al usar los lentes queda detrás de la oreja, así que no se ve. Probá "Plegar lentes" para ver cómo se guarda detrás del frente.',
    folded: 'Al plegarlos, la punta de la patilla se guarda detrás del frente y el sensor queda mirando hacia adentro, protegido de golpes y rayones.'
  },
  camera: {
    intro: 'La cámara comprueba primero que llevás puestos tus lentes y después el gesto de apoyar el dedo en el sensor de huella de la patilla, detrás de la oreja. Mirá de frente, con buena luz.',
    privacy: 'La imagen se analiza en tu navegador: no se graba, no se guarda y no se envía a ningún servidor. La cámara se apaga al terminar la comprobación.'
  },
  // Datos ficticios precargados en el checkout. No se piden datos reales al usuario.
  demo: {
    customer: [
      { label: 'Nombre', value: 'Usuario Demo' },
      { label: 'Correo', value: 'usuario@demo.fashionkey' },
      { label: 'Dirección', value: 'Av. Ejemplo 1234' },
      { label: 'Ciudad', value: 'Ciudad Demo' },
      { label: 'Código postal', value: '0000' },
      { label: 'País', value: 'Argentina' }
    ],
    account: { name: 'Usuario Demo', email: 'usuario@demo.fashionkey', deviceId: 'FK-DEMO-0001' },
    payments: [
      { id: 'card', name: 'Tarjeta demo', detail: '•••• 0000 · no es una tarjeta real' },
      { id: 'wallet', name: 'Billetera demo', detail: 'Saldo ficticio' },
      { id: 'transfer', name: 'Transferencia demo', detail: 'Sin datos bancarios' }
    ]
  },
  footer: 'FashionKey es una marca conceptual. Los productos, precios y procesos de compra de este sitio son demostrativos.'
};
