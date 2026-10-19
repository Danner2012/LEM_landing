import { Package } from 'lucide-react';

export function GridTileImage({
  src,
  alt,
  isInteractive = true,
  active,
  label,
}: {
  src?: string;
  alt?: string;
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
      className={`group flex h-full w-full items-center justify-center overflow-hidden rounded-xl border bg-white hover:border-brand relative border-neutral-200 transition-all shadow-xs ${
        active ? 'border-2 border-brand' : ''
      }`}
    >
      {src ? (
        <img
          src={src}
          alt={alt || label?.title || 'Producto DORWIN'}
          className={`h-full w-full object-cover transition duration-500 ease-in-out ${
            isInteractive ? 'group-hover:scale-105' : ''
          }`}
        />
      ) : (
        <div
          className={`flex flex-col items-center justify-center text-gold transition duration-300 ease-in-out ${
            isInteractive ? 'group-hover:scale-105' : ''
          }`}
        >
          <Package className="size-12 mb-2 drop-shadow-sm" />
          <span className="text-sm font-medium text-brand-dark">Producto DORWIN</span>
        </div>
      )}

      {label ? (
        <div className="absolute bottom-0 left-0 flex w-full px-4 pb-4">
          <div className="flex items-center rounded-full border border-neutral-200/80 bg-white/95 p-1.5 text-xs font-semibold text-brand-dark backdrop-blur-md shadow-md w-full">
            <h3 className="mr-3 line-clamp-1 flex-grow pl-3 leading-none tracking-tight font-bold">
              {label.title}
            </h3>
            <span className="flex-none rounded-full bg-brand text-gold-light px-3 py-1.5 font-extrabold">
              Bs. {label.amount}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
