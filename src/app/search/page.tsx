import { products } from '@/lib/data';
import Link from 'next/link';
import { GridTileImage } from '@/components/grid/tile';
import { ProductLink } from '@/components/product-link';
import { Sparkles, Database } from 'lucide-react';

interface BackendProduct {
  id: number;
  nombre: string;
  slug: string;
  categoria_nombre: string;
  precio_base_2plazas: string;
  imagen_principal: string | null;
  imagenes?: { url_efectiva?: string; ruta_publica?: string }[];
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = ((params.q as string) || '').toLowerCase();

  // Attempt to load products from PostgreSQL backend first, fallback to static catalog
  let dbProducts: {
    title: string;
    path: string;
    amount: string;
    currencyCode: string;
    category: string;
    image: string;
  }[] = [];
  let fromDatabase = false;

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const res = await fetch(`${apiBase}/api/catalog/productos/`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      const list: BackendProduct[] = Array.isArray(json) ? json : json.results || [];
      if (list.length > 0) {
        fromDatabase = true;
        dbProducts = list.map((p) => {
          const catLower = (p.categoria_nombre || '').toLowerCase();
          let catKey = 'colchones';
          if (catLower.includes('espaldar') || catLower.includes('cabecer')) catKey = 'espaldares';
          else if (catLower.includes('base') || catLower.includes('somier') || catLower.includes('catre'))
            catKey = 'bases';
          else if (catLower.includes('almohada') || catLower.includes('velador') || catLower.includes('accesorio'))
            catKey = 'accesorios';

          const firstImg =
            p.imagen_principal ||
            p.imagenes?.[0]?.url_efectiva ||
            p.imagenes?.[0]?.ruta_publica ||
            '/catalogo_dorwin/01_fichas_tecnicas_colchones/colchon_ficha_casata_pedic.jpg';

          return {
            title: p.nombre,
            path: `/personalizar`,
            amount: Number(p.precio_base_2plazas || 1800).toLocaleString('es-BO'),
            currencyCode: 'BOB',
            category: catKey,
            image: firstImg,
          };
        });
      }
    }
  } catch {
    // Fallback to local static data
  }

  const catalogList = fromDatabase ? dbProducts : products;

  const filteredProducts = catalogList.filter((item) => {
    if (!q) return true;
    return (
      item.category.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-screen-2xl px-4 pb-8 mt-4 min-h-[70vh]">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar de Categorías */}
        <div className="order-first w-full flex-none md:max-w-[200px]">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
            <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-neutral-800">
              Categorías DORWIN®
            </h3>
            <ul className="text-sm font-medium text-neutral-600 space-y-2">
              <li>
                <Link
                  href="/search"
                  className={`block rounded-lg px-3 py-1.5 transition ${
                    !q ? 'bg-brand text-white font-bold' : 'hover:bg-neutral-100'
                  }`}
                >
                  Todo el Catálogo ({catalogList.length})
                </Link>
              </li>
              <li>
                <Link
                  href="/search?q=colchones"
                  className={`block rounded-lg px-3 py-1.5 transition ${
                    q === 'colchones' ? 'bg-brand text-white font-bold' : 'hover:bg-neutral-100'
                  }`}
                >
                  Colchones Ortopédicos
                </Link>
              </li>
              <li>
                <Link
                  href="/search?q=espaldares"
                  className={`block rounded-lg px-3 py-1.5 transition ${
                    q === 'espaldares' ? 'bg-brand text-white font-bold' : 'hover:bg-neutral-100'
                  }`}
                >
                  Espaldares & Cabeceras
                </Link>
              </li>
              <li>
                <Link
                  href="/search?q=bases"
                  className={`block rounded-lg px-3 py-1.5 transition ${
                    q === 'bases' ? 'bg-brand text-white font-bold' : 'hover:bg-neutral-100'
                  }`}
                >
                  Bases & Catres Baúl
                </Link>
              </li>
            </ul>

            <div className="mt-5 border-t border-neutral-200 pt-4">
              <Link
                href="/personalizar"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-brand px-3 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-medium"
              >
                <Sparkles className="size-3.5 text-gold-light" />
                <span>Abrir Estudio 3D</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="order-last min-h-screen w-full md:order-none">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-neutral-600">
              {q
                ? `Mostrando ${filteredProducts.length} productos en "${q}"`
                : `Mostrando los ${filteredProducts.length} productos oficiales DORWIN®`}
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
              <Database className="size-3.5" />
              {fromDatabase
                ? 'Datos e Imágenes servidos desde PostgreSQL (LEM_backend)'
                : 'Catálogo Oficial DORWIN'}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="py-10 text-center text-lg">No se encontraron productos.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, i) => (
                <div key={i} className="aspect-square">
                  <ProductLink
                    href={product.path}
                    className="relative inline-block h-full w-full cursor-pointer"
                  >
                    <GridTileImage
                      src={product.image}
                      alt={product.title}
                      label={{
                        title: product.title,
                        amount: product.amount,
                        currencyCode: product.currencyCode,
                      }}
                    />
                  </ProductLink>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
