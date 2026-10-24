// Catálogo editable. Para reemplazar los conceptos por modelos reales, cambiar los datos acá:
// el resto de la aplicación (home, detalle, carrito y checkout) se actualiza sola.
export type ProductStatus = 'concept' | 'preorder' | 'available';
export type Variant = { id: string; name: string; color: string };
export type Product = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  status: ProductStatus;
  price: number | null; // null = "A definir"
  currency: string;
  priceIsSimulated: boolean;
  color: string; // acento de iluminación del modelo
  light: string;
  frame: { width: number; height: number; radius: number }; // abertura de cada lente en el modelo 3D (ancho, alto, radio de esquinas)
  variants: Variant[]; // la primera es la predeterminada
  features: string[];
  images: { src: string; alt: string }[]; // vacío = se muestran representaciones conceptuales
};

export const products: Product[] = [
  {
    slug: 'fashionkey-one',
    name: 'FashionKey One',
    tagline: 'Autenticación digital para todos los días.',
    description: 'Modelo de entrada orientado a autorizar compras y operaciones cotidianas con un segundo factor físico.',
    category: 'Lentes inteligentes',
    status: 'concept',
    price: 249,
    currency: 'USD',
    priceIsSimulated: true,
    color: '#56E39F',
    light: '#C3F6DC',
    frame: { width: 0.84, height: 0.67, radius: 0.14 },
    variants: [
      { id: 'negro-mate', name: 'Negro mate', color: '#141416' },
      { id: 'grafito', name: 'Grafito', color: '#3a3e46' },
      { id: 'humo', name: 'Cristal humo', color: '#8b9099' }
    ],
    features: ['Sensor de huella oculto en la punta de la patilla', 'Credencial NFC conceptual en la patilla', 'Pensado para autorizar compras cotidianas', 'Vinculación con un dispositivo compatible'],
    images: []
  },
  {
    slug: 'fashionkey-pro',
    name: 'FashionKey Pro',
    tagline: 'Más control para operaciones que lo exigen.',
    description: 'Concepto de dispositivo avanzado para usuarios que requieren funcionalidades adicionales y autorizaciones reforzadas.',
    category: 'Lentes inteligentes',
    status: 'concept',
    price: 399,
    currency: 'USD',
    priceIsSimulated: true,
    color: '#00CF9F',
    light: '#9BEBD6',
    frame: { width: 0.86, height: 0.69, radius: 0.1 },
    variants: [
      { id: 'negro-mate', name: 'Negro mate', color: '#141416' },
      { id: 'azul-noche', name: 'Azul noche', color: '#1d2a4d' },
      { id: 'titanio', name: 'Titanio', color: '#9aa0a8' }
    ],
    features: ['Concepto de gestión de varios dispositivos vinculados', 'Autorizaciones reforzadas para operaciones de mayor valor', 'Indicador luminoso de estado'],
    images: []
  },
  {
    slug: 'fashionkey-vision',
    name: 'FashionKey Vision',
    tagline: 'Una mirada hacia lo que viene.',
    description: 'Concepto de producto futuro con posibilidades ampliadas de integración digital.',
    category: 'Lentes inteligentes',
    status: 'concept',
    price: 649,
    currency: 'USD',
    priceIsSimulated: true,
    color: '#8FA391',
    light: '#D2DDD3',
    frame: { width: 0.9, height: 0.66, radius: 0.2 },
    variants: [
      { id: 'negro-mate', name: 'Negro mate', color: '#141416' },
      { id: 'grafito', name: 'Grafito', color: '#3a3e46' },
      { id: 'hielo', name: 'Hielo', color: '#d5dde8' }
    ],
    features: ['Exploración de integraciones digitales ampliadas', 'Diseño envolvente conceptual', 'Plataforma pensada para evolucionar'],
    images: []
  }
];

export const getProduct = (slug: string) => products.find(p => p.slug === slug);

// Comparación conceptual: describe el posicionamiento de cada modelo, no especificaciones técnicas.
export const comparison: { label: string; values: Record<string, string> }[] = [
  { label: 'Credencial NFC conceptual', values: { 'fashionkey-one': 'Prevista', 'fashionkey-pro': 'Prevista', 'fashionkey-vision': 'Prevista' } },
  { label: 'Autorización de compras', values: { 'fashionkey-one': 'Cotidianas', 'fashionkey-pro': 'Reforzadas', 'fashionkey-vision': 'En exploración' } },
  { label: 'Dispositivos vinculados', values: { 'fashionkey-one': 'Uno', 'fashionkey-pro': 'Varios (concepto)', 'fashionkey-vision': 'En exploración' } },
  { label: 'Integraciones digitales', values: { 'fashionkey-one': '—', 'fashionkey-pro': 'Básicas (concepto)', 'fashionkey-vision': 'Ampliadas (concepto)' } }
];

export const faq = [
  { q: '¿Puedo comprar los lentes hoy?', a: 'No. Todos los modelos son conceptos en desarrollo. El carrito y el checkout son una demostración: no se procesan pagos ni se generan pedidos reales.' },
  { q: '¿Los precios son definitivos?', a: 'No. Son valores referenciales simulados para mostrar cómo funcionaría la tienda.' },
  { q: '¿El sitio toma mi huella o mis datos?', a: 'No. La huella del checkout es una animación. La cámara solo se usa para detectar si llevás lentes: la imagen se analiza en tu navegador y no se guarda ni se envía. No se capturan datos biométricos, personales ni bancarios.' },
  { q: '¿La cámara reconoce mis lentes registrados?', a: 'No. En esta demostración la cámara detecta si hay lentes puestos, no de quién son. Vincular un accesorio específico a una cuenta requeriría la credencial NFC del producto final.' },
  { q: '¿Cualquier chip NFC sirve para autenticar?', a: 'No. La propuesta contempla credenciales criptográficas en hardware seguro. Un chip NFC convencional no ofrece esa protección por sí solo.' },
  { q: '¿Con qué teléfonos funcionaría?', a: 'La compatibilidad todavía no está definida. Dependerá de los dispositivos con lectura NFC y verificación biométrica disponibles al momento del lanzamiento.' }
];
