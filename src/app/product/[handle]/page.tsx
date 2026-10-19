import { products } from '@/lib/data';
import { Carousel } from '@/components/carousel';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = products.find((p) => p.path === `/product/${handle}`);

  if (!product) {
    return notFound();
  }

  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4 pb-4 mt-4">
        <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 md:p-10 lg:flex-row lg:gap-10 shadow-xs">
          {/* Real Product Image */}
          <div className="h-full w-full basis-full lg:basis-4/6">
            <div className="relative flex aspect-square h-full w-full items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-contain bg-white"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="basis-full lg:basis-2/6 flex flex-col justify-center">
            <div className="mb-6 flex flex-col border-b border-neutral-200 pb-6 mt-6 lg:mt-0">
              <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                <ShieldCheck className="size-3.5" /> Calidad Certificada ISO 9001
              </span>
              <h1 className="mb-3 text-3xl sm:text-4xl font-bold text-neutral-900">
                {product.title}
              </h1>
              <div className="mr-auto w-auto rounded-full bg-brand text-gold-light p-2 px-4 font-extrabold text-base">
                Bs. {product.amount} {product.currencyCode}
              </div>
            </div>

            <dl className="mb-6">
              <dt className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-600">
                Medidas Disponibles
              </dt>
              <dd className="flex flex-wrap gap-2">
                {['1 ½ Plazas', '2 Plazas', '2 ½ Plazas (Queen)', '3 Plazas (King)'].map((med, i) => (
                  <span
                    key={med}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      i === 1
                        ? 'border-brand bg-brand/10 text-brand-dark'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    {med}
                  </span>
                ))}
              </dd>
            </dl>

            <p className="mb-6 text-sm leading-relaxed text-neutral-600">
              Diseñado ergonómicamente por DORWIN® Colchões para brindar alineación postural, alivio de presión y descanso reparador. Puedes personalizarlo junto con tu espaldar, base somier, colores y veladores en nuestro Estudio 3D.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/personalizar"
                className="relative flex w-full items-center justify-center gap-2 rounded-full bg-brand p-4 tracking-wide text-white font-bold hover:bg-brand-medium transition-colors shadow-lg"
              >
                <Sparkles className="size-4 text-gold-light" />
                <span>Personalizar y Desacoplar en 3D</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      <div className="py-8">
        <h2 className="mb-4 px-4 text-2xl font-bold">Más Modelos DORWIN®</h2>
        <Carousel />
      </div>
    </>
  );
}
