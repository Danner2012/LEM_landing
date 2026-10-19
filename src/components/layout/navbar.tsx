import Link from 'next/link';
import { LogIn, Search, Sparkles } from 'lucide-react';
import { redirect } from 'next/navigation';

async function searchAction(formData: FormData) {
  'use server';
  const query = formData.get('search');
  if (query) {
    redirect(`/search?q=${query}`);
  } else {
    redirect(`/search`);
  }
}

export function Navbar() {
  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6 border-b border-neutral-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      {/* 1. Mobile Logo */}
      <div className="block flex-none md:hidden">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold" prefetch={false}>
          <img
            src="/catalogo_dorwin/00_marca_y_showroom/000_logo_oficial_dorwin_colchoes.jpg"
            alt="DORWIN Colchões Logo"
            className="w-32 max-h-10 object-contain"
          />
        </Link>
      </div>

      <div className="flex w-full items-center justify-between gap-4">
        {/* 2. Logo (Desktop) - Izquierda */}
        <div className="hidden md:flex md:w-1/4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-brand" prefetch={false}>
            <img
              src="/catalogo_dorwin/00_marca_y_showroom/000_logo_oficial_dorwin_colchoes.jpg"
              alt="DORWIN Colchões Logo"
              className="w-44 max-h-12 object-contain"
            />
          </Link>
        </div>

        {/* 3. Center Links (Pestañas) - Centro absoluto */}
        <div className="hidden md:flex md:flex-1 md:justify-center">
          <ul className="flex items-center gap-6 text-sm font-medium">
            <li>
              <Link href="/" className="text-neutral-600 underline-offset-4 hover:text-brand hover:underline transition-colors" prefetch={false}>
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/personalizar"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-brand-medium transition-all"
                prefetch={false}
              >
                <Sparkles className="size-3.5 text-gold-light" />
                <span>Personalizador 3D</span>
              </Link>
            </li>
            <li>
              <Link href="/search?q=colchones" className="text-neutral-600 underline-offset-4 hover:text-brand hover:underline transition-colors" prefetch={false}>
                Colchones
              </Link>
            </li>
            <li>
              <Link href="/search?q=bases" className="text-neutral-600 underline-offset-4 hover:text-brand hover:underline transition-colors" prefetch={false}>
                Espaldares y Bases
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-neutral-600 underline-offset-4 hover:text-brand hover:underline transition-colors" prefetch={false}>
                Sucursales
              </Link>
            </li>
          </ul>
        </div>

        {/* 4. Right Side (Search + Admin) - Derecha */}
        <div className="flex justify-end gap-2.5 w-full md:w-1/3 lg:w-1/4 items-center">
          <Link
            href="/personalizar"
            className="flex md:hidden items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-white"
            prefetch={false}
          >
            <Sparkles className="size-3.5 text-gold-light" />
            <span>3D</span>
          </Link>

          <form action={searchAction} className="relative hidden lg:block lg:w-52 xl:w-60">
            <input
              type="text"
              name="search"
              placeholder="Buscar modelo..."
              autoComplete="off"
              className="w-full rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 pr-10 text-sm text-black placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand transition-shadow"
            />
            <div className="absolute right-0 top-0 mr-3 flex h-full items-center pointer-events-none">
              <Search className="size-4 text-neutral-400" />
            </div>
          </form>

          <a
            href="http://localhost:5173/sign-in"
            className="flex flex-none items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-100 shadow-sm"
          >
            <LogIn className="size-4" />
            <span className="hidden sm:inline">Admin</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
