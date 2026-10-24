// Catálogo editable. Para reemplazar los conceptos por modelos reales, cambiar los datos acá:
// el resto de la aplicación (home, detalle, carrito y checkout) se actualiza sola.
export type ProductStatus = 'concept' | 'preorder' | 'available';
export type Variant = { id: string; name: string; color: string };
// kind define qué modelo 3D y qué representación se muestran: anteojos, aros o colgante.
export type ProductKind = 'glasses' | 'earring' | 'pendant';
type ProductBase = {
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
  variants: Variant[]; // la primera es la predeterminada; en joyas, color es el del metal
  features: string[];
  images: { src: string; alt: string }[]; // vacío = se muestran representaciones conceptuales
};
export type GlassesFrame = { width: number; height: number; radius: number }; // abertura de cada lente (ancho, alto, radio de esquinas)
export type Product = ProductBase & ({ kind: 'glasses'; frame: GlassesFrame } | { kind: 'earring' } | { kind: 'pendant' });

export const products: Product[] = [
  {
    slug: 'fashionkey-one',
    name: 'FashionKey One',
    tagline: 'Tu llave de seguridad, con estilo.',
    description: 'Anteojos de acetato con el sensor de huella oculto en la punta de la patilla, para autorizar compras y operaciones sensibles con un segundo factor físico.',
    kind: 'glasses',
    category: 'Lentes inteligentes',
    status: 'concept',
    price: 249,
    currency: 'USD',
    priceIsSimulated: true,
    color: '#56E39F',
    light: '#C3F6DC',
    frame: { width: 0.86, height: 0.69, radius: 0.1 }, // proporciones del prototipo (Ejemplos/Prototipo_Angulo_2.jpeg)
    variants: [
      { id: 'negro-mate', name: 'Negro mate', color: '#141416' },
      { id: 'grafito', name: 'Grafito', color: '#3a3e46' },
      { id: 'humo', name: 'Cristal humo', color: '#8b9099' }
    ],
    features: ['Sensor de huella oculto en la punta de la patilla', 'Credencial NFC conceptual en la patilla', 'Pensado para autorizar compras y operaciones sensibles', 'Vinculación con un dispositivo compatible'],
    images: []
  },
  {
    slug: 'fashionkey-aros',
    name: 'FashionKey Aros',
    kind: 'earring',
    tagline: 'Brillo adelante, seguridad detrás.',
    description: 'Concepto de aros de joyería con el sensor de huella oculto en la traba, del lado de atrás del lóbulo.',
    category: 'Joyería inteligente',
    status: 'concept',
    price: 349,
    currency: 'USD',
    priceIsSimulated: true,
    color: '#56E39F',
    light: '#C3F6DC',
    variants: [
      { id: 'oro-rosado', name: 'Oro rosado', color: '#E3B48E' },
      { id: 'oro-amarillo', name: 'Oro amarillo', color: '#DDB45F' },
      { id: 'platino', name: 'Platino', color: '#D7DADF' }
    ],
    features: ['Sensor de huella oculto en la traba, detrás del lóbulo', 'Diseño de joyería con halo de piedras (concepto)', 'Mismo concepto de autenticación que los anteojos'],
    images: []
  },
  {
    slug: 'fashionkey-colgante',
    name: 'FashionKey Colgante',
    kind: 'pendant',
    tagline: 'La seguridad, cerca del corazón.',
    description: 'Concepto de colgante con el sensor de huella bajo un cristal ahumado, rodeado por un halo de piedras.',
    category: 'Joyería inteligente',
    status: 'concept',
    price: 449,
    currency: 'USD',
    priceIsSimulated: true,
    color: '#00CF9F',
    light: '#9BEBD6',
    variants: [
      { id: 'oro-rosado', name: 'Oro rosado', color: '#E3B48E' },
      { id: 'oro-amarillo', name: 'Oro amarillo', color: '#DDB45F' },
      { id: 'platino', name: 'Platino', color: '#D7DADF' }
    ],
    features: ['Sensor de huella bajo un cristal ahumado', 'Halo de piedras y cadena (concepto)', 'Se autentica con un toque, sin sacártelo'],
    images: []
  }
];

export const getProduct = (slug: string) => products.find(p => p.slug === slug);

// Comparación entre modelos del mismo tipo (se muestra en el detalle cuando hay más de uno). Claves: slug de cada producto.
export const comparison: { label: string; values: Record<string, string> }[] = [];

export const faq = [
  { q: '¿Puedo comprar los lentes hoy?', a: 'No. Todos los modelos son conceptos en desarrollo. El carrito y el checkout son una demostración: no se procesan pagos ni se generan pedidos reales.' },
  { q: '¿Los precios son definitivos?', a: 'No. Son valores referenciales simulados para mostrar cómo funcionaría la tienda.' },
  { q: '¿El sitio toma mi huella o mis datos?', a: 'No. La huella del checkout es una animación. La cámara solo se usa para detectar si llevás lentes: la imagen se analiza en tu navegador y no se guarda ni se envía. No se capturan datos biométricos, personales ni bancarios.' },
  { q: '¿La cámara reconoce mis lentes registrados?', a: 'No. En esta demostración la cámara detecta si hay lentes puestos, no de quién son. Vincular un accesorio específico a una cuenta requeriría la credencial NFC del producto final.' },
  { q: '¿Cualquier chip NFC sirve para autenticar?', a: 'No. La propuesta contempla credenciales criptográficas en hardware seguro. Un chip NFC convencional no ofrece esa protección por sí solo.' },
  { q: '¿Con qué teléfonos funcionaría?', a: 'La compatibilidad todavía no está definida. Dependerá de los dispositivos con lectura NFC y verificación biométrica disponibles al momento del lanzamiento.' }
];
