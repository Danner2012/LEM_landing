import { products } from '@/lib/data';
import { Carousel } from '@/components/carousel';
import { Package } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function ProductPage({
  params
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params;
  const product = products.find(p => p.path === `/product/${handle}`);
  
  if (!product) {
    return notFound();
  }

  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4 pb-4 mt-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8">
          
          {/* Gallery placeholder (Blanco/Claro) */}
          <div className="h-full w-full basis-full lg:basis-4/6">
            <div className="relative flex aspect-square h-full w-full items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
              <div className="flex flex-col items-center opacity-40">
                <Package className="size-32 text-neutral-400 mb-4" />
                <span className="text-neutral-500 font-medium">Imagen del Producto</span>
              </div>
            </div>
          </div>

          {/* Product details */}
          <div className="basis-full lg:basis-2/6">
            <div className="mb-6 flex flex-col border-b border-neutral-200 pb-6 mt-6 lg:mt-0">
              <h1 className="mb-2 text-5xl font-medium text-black">{product.title}</h1>
              <div className="mr-auto w-auto rounded-full bg-brand text-gold-light p-2 px-4 font-bold text-sm">
                ${product.amount} {product.currencyCode}
              </div>
            </div>
            
            {/* Options placeholder */}
            <dl className="mb-8">
              <dt className="mb-4 text-sm uppercase tracking-wide text-neutral-600">Tamaño</dt>
              <dd className="flex flex-wrap gap-3">
                <button className="flex min-w-[48px] items-center justify-center rounded-full border border-brand bg-brand/5 px-3 py-1 text-sm text-brand-dark font-medium ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-brand">Sencillo</button>
                <button className="flex min-w-[48px] items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-black ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-brand hover:border-brand">Doble</button>
              </dd>
            </dl>

            <p className="mb-6 text-sm leading-relaxed text-neutral-500">
              Disfruta del máximo confort con este producto premium de LEM Colchones. Este es un bloque de descripción de ejemplo, estructurado exactamente como la plantilla oficial para mantener la elegancia de la información.
            </p>

            <button className="relative flex w-full items-center justify-center rounded-full bg-brand p-4 tracking-wide text-white font-semibold hover:bg-brand-medium transition-colors shadow-lg hover:shadow-brand-light/30 border border-brand-light">
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
      
      {/* Related Products Carousel */}
      <div className="py-8">
        <h2 className="mb-4 px-4 text-2xl font-bold">Productos Relacionados</h2>
        <Carousel />
      </div>
    </>
  );
}
