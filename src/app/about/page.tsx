import { MapPin, Phone, Clock, Award, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';
import { DORWIN_COMPANY_INFO } from '@/lib/dorwin-customizer-data';
import Link from 'next/link';

export const metadata = {
  title: 'Sucursales y Garantía | DORWIN® Colchões (LEM)',
  description:
    'Conoce las 4 sucursales oficiales de DORWIN Colchões en Bolivia (El Alto, Potosí, Oruro y Santa Cruz), nuestra certificación ISO 9001 y garantía real de hasta 7 años.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 pb-12 mt-4 min-h-[70vh]">
      <div className="flex flex-col gap-8">
        {/* Cabecera / Intro */}
        <div className="rounded-2xl border border-neutral-200 bg-gradient-to-r from-brand-dark via-brand to-brand-medium p-8 md:p-14 text-center text-white shadow-lg">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-bold uppercase tracking-wider text-gold-light">
            <ShieldCheck className="size-4" /> Certificación Internacional ISO 9001 • 23 Años de Experiencia
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight">
            DORWIN® Colchões — Salud Postural y Descanso de Lujo
          </h1>
          <p className="mt-3 text-base md:text-lg text-white/85 max-w-3xl mx-auto leading-relaxed">
            Fabricamos y personalizamos colchones ortopédicos, espaldares imperiales con iluminación LED, bases somier baúl y juegos de dormitorio completos a la medida de tu salud y espacio.
          </p>
        </div>

        {/* 4 Sucursales Oficiales en Bolivia */}
        <div>
          <h2 className="mb-4 text-2xl font-extrabold text-neutral-900 flex items-center gap-2">
            <MapPin className="size-6 text-brand" />
            <span>Nuestras 4 Sucursales Oficiales en Bolivia</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DORWIN_COMPANY_INFO.sucursales.map((suc) => (
              <div
                key={suc.ciudad}
                className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs hover:border-brand transition"
              >
                <div>
                  <span className="inline-block rounded-lg bg-brand/10 px-3 py-1 text-xs font-extrabold text-brand-dark uppercase">
                    {suc.ciudad}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-neutral-900">Showroom {suc.ciudad}</h3>
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{suc.direccion}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Atención Directa</span>
                  <a
                    href={`https://wa.me/${DORWIN_COMPANY_INFO.whatsappPrincipal}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="size-3.5" /> WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ficha Oficial de Sucursales + Contacto y Garantía */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs flex flex-col items-center justify-center gap-3">
            <img
              src="/catalogo_dorwin/00_marca_y_showroom/000_logo_oficial_dorwin_colchoes.jpg"
              alt="Logo Oficial DORWIN Colchões"
              className="max-h-[160px] w-auto rounded-xl object-contain"
            />
            <img
              src="/catalogo_dorwin/01_fichas_tecnicas_colchones/002_ficha_casata_pedic_160kg_d40_extrafirme_34cm.jpeg"
              alt="Ficha Oficial DORWIN Colchões Sucursales"
              className="max-h-[280px] w-auto rounded-xl object-contain border border-neutral-200"
            />
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-8 shadow-xs space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <Award className="size-6 text-brand" />
                  <h3 className="text-lg font-bold text-neutral-900">Ergonomía Certificada</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Nuestras líneas Casata Pedic, Memory Foam, Visco Gel y Línea Dorada brindan soporte desde 90 kg hasta 160 kg por persona con espumas prensadas D40–D60 y resortes Pocket o Bonell de acero templado.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <ShieldCheck className="size-6 text-emerald-600" />
                  <h3 className="text-lg font-bold text-neutral-900">Garantía Real 4 a 7 Años</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Todos nuestros colchones y estructuras de madera tratada cuentan con póliza de garantía directa de fábrica y telas con tratamiento hipoalergénico, antiácaros y antibacteriano.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="size-5 text-brand" />
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500">Central de Pedidos y Cotizaciones</p>
                    <p className="text-base font-extrabold text-neutral-900">
                      +591 69866371 • +591 62450885
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="size-5 text-brand" />
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500">Horarios Showroom</p>
                    <p className="text-sm font-bold text-neutral-800">Lunes a Sábado: 09:00 – 20:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/personalizar"
                className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-brand-medium"
              >
                <Sparkles className="size-4 text-gold-light" />
                <span>Ir al Personalizador 3D Interactivo</span>
              </Link>
              <a
                href={`https://wa.me/${DORWIN_COMPANY_INFO.whatsappPrincipal}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-500"
              >
                <MessageCircle className="size-4" />
                <span>Hablar con Asesor por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
