'use client';

import { useRouter } from 'next/navigation';
import { GridTileImage } from './grid/tile';
import { products } from '@/lib/data';

export function Carousel() {
  const router = useRouter();
  if (!products?.length) return null;

  // Clone products to make the infinite loop smoother
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className="w-full overflow-hidden pb-6 pt-1">
      <div className="flex w-full animate-carousel gap-4 px-4">
        {carouselProducts.map((product, i) => (
          <div
            key={`${product.path}-${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <div
              onClick={() => router.push(product.path)}
              className="relative h-full w-full block cursor-pointer"
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
