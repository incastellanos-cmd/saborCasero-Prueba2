import { Link, useParams } from 'react-router-dom';

const fotosTradicion = [
  'pastel-de-choclo', 'churrasco-italiano', 'cazuela-de-vacuno',
  'completo-italiano', 'ensalada-chilena', 'jugo-de-frutilla',
];

const Collage = () => (
  <div className="d-grid mx-auto" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, width: '100%', maxWidth: 400 }}>
    {fotosTradicion.map(f => (
      <img key={f} src={`/imagenes/${f}.jpg`} alt={f} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
    ))}
  </div>
);

const Delivery = () => (
  <img
    src="https://static.vecteezy.com/system/resources/thumbnails/033/526/159/small/delivery-man-on-motorcycle-with-package-vector.jpg"
    alt="Repartidor en moto con paquete"
    className="d-block mx-auto bg-white"
    style={{ width: '100%', maxWidth: 400, aspectRatio: '1', objectFit: 'contain' }}
  />
);

const articulos = [
  {
    slug: 'tradicion-comida-chilena',
    titulo: 'La tradición de la comida chilena',
    resumen: 'Conoce algunos de los platos tradicionales que forman parte de la gastronomía chilena.',
    Imagen: Collage,
    parrafos: [
      'La gastronomía chilena cuenta con una gran variedad de platos tradicionales que forman parte de nuestra cultura.',
      'Entre algunos de los platos más conocidos se encuentran el pastel de choclo, la cazuela, las empanadas y los completos.',
      'En SaborCasero buscamos mantener estas tradiciones ofreciendo comida casera y platos típicos chilenos a nuestros clientes.',
    ],
  },
  {
    slug: 'servicio-delivery',
    titulo: 'Nuestro servicio de delivery',
    resumen: 'Descubre cómo SaborCasero busca mejorar la experiencia de sus clientes mediante sus pedidos a domicilio.',
    Imagen: Delivery,
    parrafos: [
      'En los últimos años el servicio de delivery se ha convertido en una parte importante de SaborCasero.',
      'Nuestro objetivo es facilitar los pedidos y mejorar los tiempos de entrega para nuestros clientes.',
      'Con nuestro sistema web, los clientes pueden revisar los productos, realizar pedidos y utilizar el carrito de compras de forma sencilla.',
    ],
  },
];

export const Blog = () => (
  <div className="container py-5 text-center">
    <h2 className="fw-bold mb-5">Noticias SaborCasero</h2>
    <div className="row justify-content-center g-4">
      {articulos.map(({ slug, titulo, resumen, Imagen }) => (
        <div key={slug} className="col-12 col-md-5 col-lg-4">
          <div className="card h-100 p-3 shadow-sm">
            <Imagen />
            <h5 className="fw-bold mt-3">{titulo}</h5>
            <p>{resumen}</p>
            <Link to={`/blog/${slug}`} className="mt-auto">Leer más</Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const BlogArticulo = () => {
  const { slug } = useParams();
  const art = articulos.find(a => a.slug === slug);

  if (!art) {
    return (
      <div className="container py-5 text-center">
        <p>Artículo no encontrado.</p>
        <Link to="/blog">Volver al blog</Link>
      </div>
    );
  }

  const { titulo, Imagen, parrafos } = art;
  return (
    <div className="container py-5 text-center">
      <h2 className="fw-bold mb-4">{titulo}</h2>
      <Imagen />
      <div className="mt-4">
        {parrafos.map(p => <p key={p}>{p}</p>)}
      </div>
      <Link to="/blog">Volver al blog</Link>
    </div>
  );
};
