# FashionKey

**“Seguridad que se luce, se usa”.**

FashionKey es una propuesta de accesorio inteligente premium, inicialmente unos anteojos, que busca combinar diseño y tecnología para reforzar la autenticación de identidad en operaciones digitales sensibles. Este repositorio contiene la **landing y la demo interactiva** del proyecto, desarrollado para la **Hackatón Shippear**.

🔗 **Demo publicada:** https://fashion-key-shippear3-0.vercel.app

> **Proyecto conceptual.** Los productos, precios y el proceso de compra son demostrativos: no se procesan pagos, no se piden datos reales y no se generan pedidos. NFC, lectura de huella y credenciales criptográficas forman parte del concepto y todavía no están implementados.

---

## Qué incluye

| Sección | Qué hace |
|---|---|
| **Landing** | Hero con el prototipo 3D, problema, solución, cómo funciona, productos, diferenciales, casos de uso y cierre. |
| **Prototipos 3D** | Modelados por código a partir de las fotos de `Ejemplos/`: **anteojos** (sensor en la punta de la patilla, con plegado), **aros** (sensor en la traba, detrás del lóbulo, con la traba desmontable) y **colgante** (sensor bajo un cristal ahumado). Se giran, admiten zoom y tienen encuadres predefinidos, incluido el del sensor de huella, y fondo blanco u oscuro. |
| **Tienda demo** | FashionKey One (anteojos), FashionKey Aros y FashionKey Colgante, con página de detalle, carrito persistente en el navegador y checkout. |
| **Checkout con autenticación por cámara** | Resumen → Entrega y pago → Identidad → **Lentes y huella** → Autorización → Confirmación. La cámara comprueba que la persona lleva lentes y después detecta el gesto de llevar el dedo al sensor, detrás de la oreja. Al completarse, avanza solo hasta la confirmación. |

### Verificación por cámara: qué es real y qué es simulado

- ✅ **Real (en el navegador):** detección de un único rostro, clasificación con lentes o sin lentes y detección de la mano junto a la oreja.
- ⚠️ **Simulado:** la huella no se lee; el gesto representa apoyar el dedo en el sensor. Tampoco se verifica identidad, credencial NFC ni criptografía.
- 🔒 **Privacidad:** la imagen se analiza localmente; no se graba, no se guarda ni se envía a ningún servidor.
- Si no hay cámara o no se da el permiso, el sitio muestra el motivo y permite reintentar. Una vez detectados los lentes, la huella también puede confirmarse con un sensor en pantalla.

**Limitaciones conocidas:** una foto de una persona con lentes mostrada a la cámara también se aprueba (no hay prueba de vida), y la cámara no puede saber de quién son los lentes. En celulares la cámara requiere **https**, como en el sitio publicado.

---

## Tecnologías

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Three.js** + **React Three Fiber**: modelo y visor 3D
- **Motion**: transiciones y microinteracciones
- **Tailwind CSS 4** (configurado) y CSS propio por sección
- **MediaPipe Tasks Vision**: detección de rostro y de manos
- **Transformers.js** + **MobileCLIP S0 (fp16)**: clasificación con lentes o sin lentes
- Tipografías: **EB Garamond** (títulos y marca) y **Hanken Grotesk** (textos) vía `next/font`

Todos los modelos y runtimes de visión están en `public/vision` (≈78 MB), así que la app no depende de servicios externos en tiempo de ejecución.

---

## Cómo ejecutarlo

Requisitos: **Node.js 20.9 o superior** y npm.

```bash
npm install
npm run dev          # http://127.0.0.1:3000
```

| Comando | Para qué sirve |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run start` | Sirve la compilación de producción |
| `npm run typecheck` | Revisión de tipos de TypeScript |
| `npm run setup:vision` | Vuelve a descargar los modelos de visión y recalcula los textos de referencia. Solo hace falta si se cambian las descripciones del clasificador o se borra `public/vision`. |

> En Windows con PowerShell, si los scripts están bloqueados, usá `npm.cmd` en lugar de `npm`.

Para probar la cámara en local, abrí el sitio en `localhost` o `127.0.0.1`; desde otro dispositivo de la red, el navegador la bloquea por no ser https.

---

## Estructura

```
src/
  app/                    Páginas: inicio, /productos/[slug], /carrito, /checkout; layout, estilos globales e ícono
  config/
    site.ts               Marca, slogan, navegación y TODOS los textos de la landing y del checkout
    products.ts           Catálogo: nombres, precios, colores, forma del modelo 3D, variantes, comparación y FAQ
    glasses-embeddings.json  Textos de referencia del clasificador de lentes (generado)
  components/
    home/                 Hero (ProductShowcase), secciones de la landing y catálogo
    product/              Página de detalle con el visor 3D
    shop/                 Carrito (panel lateral y página)
    checkout/             Checkout, cámara (GlassesCamera) y sensor de huella en pantalla
    three/                Modelo de los anteojos, carrusel 3D y visor con zoom
    ui/                   Íconos y signo marcario (emblema + logotipo)
  lib/
    authEngine.ts         Lógica de la autorización (lentes → huella → resultado)
    glassesDetector.ts    Detección de rostro, lentes y gesto; ajustes de sensibilidad
    cart.tsx              Carrito de demostración (localStorage)
scripts/setup-vision.mjs  Preparación de modelos y runtimes de visión
public/vision/            Modelos y WebAssembly de MediaPipe, ONNX Runtime y MobileCLIP
Ejemplos/                 Fotos de referencia del prototipo
```

---

## Personalización

| Qué cambiar | Dónde |
|---|---|
| Textos, títulos, slogan, navegación, avisos y datos de ejemplo | `src/config/site.ts` |
| Productos, precios, variantes, características y FAQ | `src/config/products.ts` |
| Fotos reales de un producto | Agregarlas a `public/` y listarlas en `images` del producto; reemplazan las representaciones conceptuales. |
| Colores de la marca | Tokens al inicio de `src/app/globals.css` (`--bg`, `--panel`, `--mint`, `--green`, `--sage`…) |
| Tipografías | `src/app/layout.tsx`. Para usar **Amazing Grotesk** del manual, cargar sus archivos con `next/font/local` en lugar de Hanken Grotesk. |
| Proporciones del modelo 3D (aros, puente, profundidad, curvatura) | Constantes al inicio de `src/components/three/Glasses.tsx`; tamaño de lentes en `frame` de cada producto |
| Sensibilidad de la detección de lentes y del gesto | `glassesPolicy` y `touchPolicy` en `src/lib/glassesDetector.ts` |
| Tiempos del avance automático del checkout | `AUTO` en `src/components/checkout/Checkout.tsx` |

### Paleta de marca

| Uso | Color |
|---|---|
| Tonos predominantes (70–90 %) | `#2A1F2D` · `#3B2C35` |
| Acentos (10–30 %) | `#5B6C5D` · `#56E39F` · `#00CF9F` |

---

## Despliegue

El repositorio está conectado a **Vercel**: cada push a `main` compila y publica automáticamente la nueva versión en 1–2 minutos. No requiere variables de entorno.

---

## Estado del proyecto

Prototipo en desarrollo para la Hackatón Shippear. Pendiente para una versión real: integración NFC y credenciales criptográficas, lectura de huella en hardware, prueba de vida en la verificación por cámara, modelo 3D definitivo (`.glb`) y backend de pagos y pedidos.
