import { ThreeItemGrid } from '@/components/grid/three-items';
import { Carousel } from '@/components/carousel';

export const metadata = {
  description: 'Venta de colchones ortopédicos, bases de cama y accesorios de lujo.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Carousel />
      
      <footer className="w-full bg-brand-dark border-t border-brand py-12 text-center text-sm text-white/90 mt-12">
        <p>&copy; {new Date().getFullYear()} DORWIN. Todos los derechos reservados.</p>
        <p className="mt-2 text-gold-light/80">Diseñado para el descanso perfecto.</p>
      </footer>
    </>
  );
}
