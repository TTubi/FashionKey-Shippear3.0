// Identidad, textos de la landing y datos de demostración de FashionKey.
// Editar acá para adaptar el sitio sin tocar componentes.
// Criterio de redacción: solo se presenta como disponible lo que la demo realmente hace
// (modelo 3D, tienda demo, detección de lentes y gesto por cámara). NFC, biometría y criptografía son concepto.
export const site = {
  brand: {
    name: 'FashionKey',
    slogan: 'Seguridad que se luce, se usa',
    description: 'FashionKey propone una nueva forma de pensar la autenticación digital: un accesorio inteligente que combina diseño premium y tecnología para ayudarte a proteger las acciones que más importan.',
    event: 'Proyecto en desarrollo para la Hackatón Shippear'
  },
  nav: [
    { label: 'Solución', href: '/#solucion' },
    { label: 'Cómo funciona', href: '/#como-funciona' },
    { label: 'Productos', href: '/#productos' },
    { label: 'Casos de uso', href: '/#casos' }
  ],
  navCta: { label: 'Conocé FashionKey', href: '/#solucion' },
  hero: {
    eyebrow: 'FashionKey · Accesorio inteligente',
    title: ['Tu identidad', 'también puede', 'llevar estilo.'],
    subtitle: 'FashionKey propone una nueva forma de pensar la autenticación digital: un accesorio inteligente que combina diseño premium y tecnología para ayudarte a proteger las acciones que más importan.',
    backgroundWord: 'FASHIONKEY',
    primaryCta: { label: 'Descubrí cómo funciona', href: '#como-funciona' },
    secondaryCta: { label: 'Explorá el concepto', href: '#solucion' },
    scrollTarget: '#problema',
    hint: 'ARRASTRÁ · USÁ LAS FLECHAS · TOCÁ LOS LENTES'
  },
  problem: {
    eyebrow: 'El desafío',
    title: 'En un mundo de identidades digitales, la confianza importa.',
    text: 'Cada vez más operaciones importantes se hacen en línea, y demostrar que quien las autoriza es realmente quien dice ser se volvió más difícil.',
    items: [
      { icon: 'mask', title: 'Suplantación de identidad', text: 'Alguien se hace pasar por otra persona para acceder a sus cuentas o autorizar operaciones en su nombre.' },
      { icon: 'scan', title: 'Deepfakes', text: 'Audio, imagen o video generados para imitar a una persona de forma cada vez más convincente.' },
      { icon: 'mail', title: 'Phishing', text: 'Mensajes y sitios que imitan a servicios legítimos para obtener datos de acceso.' },
      { icon: 'key', title: 'Robo de credenciales', text: 'Contraseñas o códigos expuestos que permiten a terceros entrar donde no deberían.' }
    ]
  },
  solution: {
    eyebrow: 'La propuesta',
    title: 'Diseñado para lucirse. Pensado para proteger.',
    text: 'FashionKey integra moda y autenticación digital en un accesorio físico: unos anteojos que suman un factor de confianza a las acciones que más importan.',
    // status: 'demo' = se puede probar en este sitio; 'concept' = forma parte del concepto o del desarrollo futuro.
    pillars: [
      { icon: 'fingerprint', title: 'Identidad', text: 'Autenticación del usuario mediante un sensor de huella integrado en la patilla, detrás de la oreja.', status: 'demo', statusText: 'En la demo: la cámara detecta los lentes puestos y el gesto sobre el sensor. La lectura de huella es parte del concepto.' },
      { icon: 'nfc', title: 'Tecnología', text: 'Uso propuesto de NFC y credenciales criptográficas para validar cada autorización.', status: 'concept', statusText: 'Concepto en desarrollo: todavía no implementado en el prototipo.' },
      { icon: 'gem', title: 'Diseño', text: 'Un accesorio premium de acetato con detalles dorados que integra la tecnología en la experiencia cotidiana.', status: 'demo', statusText: 'Explorá el prototipo en 3D en cada modelo.' }
    ]
  },
  how: {
    eyebrow: 'Cómo funciona',
    title: 'Una nueva forma de autenticarte.',
    text: 'Así funcionaría FashionKey según la arquitectura propuesta.',
    steps: [
      { icon: 'fingerprint', title: 'Autenticación', text: 'Verificás tu identidad con el mecanismo previsto: los anteojos puestos y el dedo sobre el sensor de la patilla.' },
      { icon: 'link', title: 'Autorización', text: 'Se genera una prueba criptográfica vinculada a esa solicitud específica, según la arquitectura propuesta.' },
      { icon: 'shield', title: 'Verificación', text: 'El servicio valida la prueba antes de autorizar la operación.' }
    ],
    note: 'Arquitectura propuesta, en desarrollo. En esta demo el primer paso se simula con la cámara y los pasos criptográficos todavía no están implementados.',
    cta: { label: 'Probá la demo de compra', href: '#productos' }
  },
  catalog: {
    eyebrow: 'Productos',
    title: 'Tres modelos. Un mismo concepto.',
    text: 'Modelos conceptuales para explorar la propuesta. Nombres, precios e imágenes son temporales y referenciales, y la compra es una demostración.'
  },
  differentials: {
    eyebrow: 'Diferenciales',
    title: 'La seguridad también es parte de tu estilo.',
    items: [
      { icon: 'gem', title: 'Diseño premium', text: 'Un accesorio que se elige por cómo se ve, no solo por lo que hace.' },
      { icon: 'tap', title: 'Experiencia sencilla', text: 'Una autenticación pensada para resolverse con un gesto natural.' },
      { icon: 'nfc', title: 'Físico + digital', text: 'Integración propuesta entre un accesorio que llevás puesto y la seguridad de tus servicios digitales.' },
      { icon: 'shield', title: 'Menos riesgo de suplantación', text: 'Un factor físico adicional que busca reducir determinados riesgos de suplantación de identidad.' }
    ]
  },
  useCases: {
    eyebrow: 'Casos de uso',
    title: 'Pensado para las acciones que importan.',
    text: 'Usos previstos para la propuesta. No representan integraciones comerciales existentes.',
    items: [
      { icon: 'globe', title: 'Autenticación en plataformas digitales', text: 'Un factor adicional para iniciar sesión en servicios que lo requieran.' },
      { icon: 'check', title: 'Confirmación de operaciones sensibles', text: 'Transferencias, compras o cambios de datos que conviene confirmar con algo más que una contraseña.' },
      { icon: 'lock', title: 'Accesos de alto riesgo', text: 'Protección adicional para acciones críticas en cuentas personales o de trabajo.' }
    ]
  },
  finalCta: {
    title: 'El futuro de la seguridad también se lleva puesto.',
    text: 'Conocé FashionKey y descubrí una nueva forma de unir diseño, identidad y tecnología.',
    cta: { label: 'Explorá FashionKey', href: '#productos' }
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
  footer: 'Los productos, precios y procesos de compra de este sitio son demostrativos.'
};
