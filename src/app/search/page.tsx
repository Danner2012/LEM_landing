import { products } from '@/lib/data';
import Link from 'next/link';
import { GridTileImage } from '@/components/grid/tile';
import { ProductLink } from '@/components/product-link';

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const q = params.q as string || '';

  return (
    <div className="mx-auto max-w-screen-2xl px-4 pb-4 mt-4 min-h-[70vh]">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Simple sidebar for layout completeness */}
        <div className="order-first w-full flex-none md:max-w-[125px]">
          <h3 className="mb-2 text-sm font-semibold">Categorías</h3>
          <ul className="text-sm text-neutral-500 space-y-2">
            <li><Link href="/search" className="hover:text-black">Todo</Link></li>
            <li><Link href="/search?q=colchones" className="hover:text-black">Colchones</Link></li>
            <li><Link href="/search?q=bases" className="hover:text-black">Bases de Cama</Link></li>
          </ul>
        </div>
        
        <div className="order-last min-h-screen w-full md:order-none">
          <p className="mb-4 text-sm text-neutral-500">
            {q ? `Mostrando resultados para "${q}"` : 'Mostrando todos los productos'}
          </p>
          {products.length === 0 ? (
            <p className="py-10 text-center text-lg">No se encontraron productos.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, i) => (
                <div key={i} className="aspect-square">
                  <ProductLink href={product.path} className="relative inline-block h-full w-full cursor-pointer">
                    <GridTileImage
                      label={{
                        title: product.title,
                        amount: product.amount,
                        currencyCode: product.currencyCode
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
