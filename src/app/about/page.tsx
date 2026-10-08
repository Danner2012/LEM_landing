import { MapPin, Phone, Mail, Clock, Award, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Sobre Nosotros | LEM Colchones',
  description: 'Conoce más sobre LEM Colchones, nuestra ubicación, contacto y compromiso con tu descanso.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 pb-12 mt-4 min-h-[70vh]">
      <div className="flex flex-col gap-8">
        
        {/* Cabecera / Intro */}
        <div className="rounded-lg border border-neutral-200 bg-white p-8 md:p-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Descanso Premium, Calidad Garantizada</h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            En LEM Colchones llevamos años dedicados a perfeccionar la ciencia del descanso. Fabricamos y comercializamos colchones ortopédicos, bases de cama y accesorios de lujo diseñados para transformar tus noches.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Misión y Visión */}
          <div className="flex flex-col justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-8 md:p-12">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Award className="size-6 text-gold" />
                <h2 className="text-2xl font-semibold text-brand-dark">Nuestra Misión</h2>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                Brindar la máxima ergonomía y confort a cada hogar mediante productos innovadores y de alta durabilidad, asegurando que cada cliente alcance un descanso verdaderamente reparador.
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="size-6 text-gold" />
                <h2 className="text-2xl font-semibold text-brand-dark">Garantía DORWIN</h2>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                Todos nuestros productos pasan por estrictos controles de calidad. Creemos en nuestro trabajo, por lo que ofrecemos garantías extendidas que respaldan la inversión de nuestros clientes.
              </p>
            </div>
          </div>

          {/* Ubicación y Contacto */}
          <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12">
            <h2 className="text-3xl font-semibold mb-6">Ubicación y Contacto</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-100 rounded-full">
                  <MapPin className="size-6 text-neutral-700" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Visítanos</h3>
                  <p className="text-neutral-500 mt-1 leading-relaxed">
                    Av. Principal #123, Zona Comercial<br />
                    Ciudad, País
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-100 rounded-full">
                  <Clock className="size-6 text-neutral-700" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Horario de Atención</h3>
                  <p className="text-neutral-500 mt-1 leading-relaxed">
                    Lunes a Viernes: 9:00 AM - 7:00 PM<br />
                    Sábados: 10:00 AM - 4:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-100 rounded-full">
                  <Phone className="size-6 text-neutral-700" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Llámanos</h3>
                  <p className="text-neutral-500 mt-1">
                    +1 234 567 8900
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-100 rounded-full">
                  <Mail className="size-6 text-neutral-700" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Correo Electrónico</h3>
                  <p className="text-neutral-500 mt-1">
                    contacto@lemcolchones.com
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
