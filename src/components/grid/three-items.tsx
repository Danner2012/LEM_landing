'use client';

import { useRouter } from 'next/navigation';
import { GridTileImage } from './tile';
import { products } from '@/lib/data';

function ThreeItemGridItem({ item, size }: { item: (typeof products)[number]; size: 'full' | 'half' }) {
  const router = useRouter();

  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <div
        onClick={() => router.push(item.path)}
        className="relative block h-full w-full cursor-pointer"
      >
        <GridTileImage
          src={item.image}
          alt={item.title}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.title,
            amount: item.amount,
            currencyCode: item.currencyCode,
          }}
        />
      </div>
    </div>
  );
}

export function ThreeItemGrid() {
  const homepageItems = products.slice(0, 3);
  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 min-h-[60vh] lg:min-h-[75vh]">
      <ThreeItemGridItem size="full" item={firstProduct} />
      <ThreeItemGridItem size="half" item={secondProduct} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
  );
}
