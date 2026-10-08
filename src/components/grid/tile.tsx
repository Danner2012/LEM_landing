import { Package } from 'lucide-react';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
}) {
  return (
    <div
      className={`group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-neutral-100 hover:border-brand relative border-neutral-200 transition-all ${
        active ? 'border-2 border-brand' : ''
      }`}
    >
      <div className={`flex flex-col items-center justify-center text-gold transition duration-300 ease-in-out ${isInteractive ? 'group-hover:scale-105' : ''}`}>
        <Package className="size-12 mb-2 drop-shadow-sm" />
        <span className="text-sm font-medium text-brand-dark">Producto</span>
      </div>
      
      {label ? (
        <div className={`absolute bottom-0 left-0 flex w-full px-4 pb-4`}>
          <div className="flex items-center rounded-full border bg-white/95 p-1 text-xs font-semibold text-brand-dark backdrop-blur-md shadow-sm w-full">
            <h3 className="mr-4 line-clamp-1 flex-grow pl-2 leading-none tracking-tight">{label.title}</h3>
            <span className="flex-none rounded-full bg-brand text-gold-light px-3 py-2">
              ${label.amount} {label.currencyCode}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
