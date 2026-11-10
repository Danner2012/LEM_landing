import { ThreeItemGrid } from '@/components/grid/three-items';
import { Carousel } from '@/components/carousel';
import { DorwinInteractiveCustomizer } from '@/components/customizer/DorwinInteractiveCustomizer';

export const metadata = {
  title: 'DORWIN® Colchões | Colchones Ortopédicos y Juegos de Cama 3D',
  description: 'Venta de colchones ortopédicos certificados ISO 9001, espaldares imperiales, bases somier y accesorios para la salud del descanso.',
  openGraph: {
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />

      {/* Sección Interactiva 3D Modular (Diego Quispe - Parte 2) */}
      <div id="personalizador-3d" className="border-y border-neutral-200 bg-neutral-50/70 py-4">
        <DorwinInteractiveCustomizer />
      </div>

      <Carousel />

      <footer className="w-full bg-brand-dark border-t border-brand py-12 text-center text-sm text-white/90 mt-12">
        <p>&copy; {new Date().getFullYear()} DORWIN® Colchões • Importadora Hogarelax. Todos los derechos reservados.</p>
        <p className="mt-2 text-gold-light/80">
          El Alto • Potosí • Oruro • Santa Cruz | WhatsApp: +591 69866371
        </p>
      </footer>
    </>
  );
}
