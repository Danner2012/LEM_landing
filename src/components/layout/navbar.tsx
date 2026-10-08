import Link from 'next/link';
import { LogIn, Search } from 'lucide-react';
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
    <nav className="relative flex items-center justify-between p-4 lg:px-6 border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      
      {/* 1. Mobile Logo */}
      <div className="block flex-none md:hidden">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold" prefetch={false}>
          <img src="/logo.png" alt="DORWIN Logo" className="w-32 max-h-8 object-contain" />
        </Link>
      </div>
      
      <div className="flex w-full items-center justify-between gap-4">
        
        {/* 2. Logo (Desktop) - Izquierda */}
        <div className="hidden md:flex md:w-1/4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-brand" prefetch={false}>
            <img src="/logo.png" alt="DORWIN Logo" className="w-48 max-h-12 object-contain" />
          </Link>
        </div>
        
        {/* 3. Center Links (Pestañas) - Centro absoluto */}
        <div className="hidden md:flex md:flex-1 md:justify-center">
          <ul className="flex items-center gap-8 text-sm font-medium">
            <li><Link href="/" className="text-neutral-500 underline-offset-4 hover:text-brand hover:underline transition-colors" prefetch={false}>Inicio</Link></li>
            <li><Link href="/search?q=colchones" className="text-neutral-500 underline-offset-4 hover:text-brand hover:underline transition-colors" prefetch={false}>Colchones</Link></li>
            <li><Link href="/search?q=bases" className="text-neutral-500 underline-offset-4 hover:text-brand hover:underline transition-colors" prefetch={false}>Bases</Link></li>
            <li><Link href="/search?q=accesorios" className="text-neutral-500 underline-offset-4 hover:text-brand hover:underline transition-colors" prefetch={false}>Accesorios</Link></li>
            <li><Link href="/about" className="text-neutral-500 underline-offset-4 hover:text-brand hover:underline transition-colors" prefetch={false}>Sobre Nosotros</Link></li>
          </ul>
        </div>
        
        {/* 4. Right Side (Search + Admin) - Derecha */}
        <div className="flex justify-end gap-3 w-full md:w-1/3 lg:w-1/4 items-center">
          <form action={searchAction} className="relative hidden lg:block lg:w-56 xl:w-64">
            <input
              type="text"
              name="search"
              placeholder="Buscar..."
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
