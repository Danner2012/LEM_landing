import { DorwinInteractiveCustomizer } from '@/components/customizer/DorwinInteractiveCustomizer';
import { MATTRESS_MODELS, HEADBOARD_ARCHETYPES, DORWIN_COMPANY_INFO } from '@/lib/dorwin-customizer-data';
import { ShieldCheck, Sparkles, Layers, Video, MapPin, Phone } from 'lucide-react';

export const metadata = {
  title: 'Estudio 3D & Salud Postural | DORWIN Colchões',
  description:
    'Personaliza en 3D tu juego de dormitorio, espaldar, base somier y colchón ergonómico certificado ISO 9001.',
};

export default function PersonalizarPage() {
  return (
    <main className="min-h-screen bg-neutral-50 pb-16">
      {/* Main 3D Interactive Configurator Studio */}
      <DorwinInteractiveCustomizer />

      {/* Section 2: Official Technical Sheets & Foam Densities Documentation */}
      <section className="mx-auto max-w-screen-2xl px-4 pt-10">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand uppercase">
                <ShieldCheck className="size-3.5" /> Fichas Técnicas Oficiales & Ergonomía
              </span>
              <h2 className="mt-2 text-2xl font-bold text-neutral-900">
                Catálogo Técnico de Colchones Ortopédicos DORWIN®
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                Especificaciones reales extraídas de nuestras fichas técnicas certificadas ISO 9001 e ISPA.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MATTRESS_MODELS.slice(0, 8).map((mat) => (
              <div
                key={mat.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 transition hover:shadow-md"
              >
                <div className="aspect-square w-full overflow-hidden bg-white">
                  <img
                    src={mat.fichaImagen}
                    alt={mat.nombre}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-neutral-900">{mat.nombre}</h3>
                    <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-gold-light">
                      {mat.garantiaAnios} Años Gar.
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-600">{mat.subtitulo}</p>
                  <ul className="mt-3 space-y-1 text-xs text-neutral-700 flex-1">
                    <li>• <strong>Soporte:</strong> {mat.soporteKgPersona} kg por persona</li>
                    <li>• <strong>Núcleo:</strong> {mat.resorteTipo}</li>
                    <li>• <strong>Espuma:</strong> {mat.espumaDensidad}</li>
                    <li>• <strong>Altura / Sensación:</strong> {mat.alturaCm} cm • {mat.firmeza}</li>
                  </ul>
                  <div className="mt-4 border-t border-neutral-200 pt-3 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 font-medium">Precio 2 Plazas:</span>
                    <span className="text-sm font-extrabold text-brand-dark">
                      Bs. {mat.preciosPorMedida['2P'].toLocaleString('es-BO')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Foam Density Samples (D12, D19, D40, SOFT), Pillows & Showroom Video */}
      <section className="mx-auto max-w-screen-2xl px-4 pt-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Foam Densities & Pillows */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase">
              <Layers className="size-4" /> Laboratorio de Espumas y Almohadas
            </div>
            <h3 className="mt-1 text-xl font-bold text-neutral-900">
              Muestrario Real de Densidades (D12, D19, D40, SOFT) y Almohadas
            </h3>
            <p className="mt-1 text-xs text-neutral-600">
              En nuestras tiendas puedes comprobar físicamente la densidad de cada bloque de poliuretano y nuestras almohadas viscoelásticas y de fibra siliconada brasilera.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  img: '/catalogo_dorwin/02_info_espumas_y_almohadas/100_muestras_espuma_D12_D19_D40_SOFT_y_almohadas_dorwin_pare.jpeg',
                  label: 'Bloques D12, D19, D40 y SOFT',
                },
                {
                  img: '/catalogo_dorwin/02_info_espumas_y_almohadas/101_almohadas_celta_viscoelastica_y_pare_fibra_siliconada_50x70.jpeg',
                  label: 'Almohada Viscoelástica & PARE',
                },
                {
                  img: '/catalogo_dorwin/02_info_espumas_y_almohadas/105_almohadas_dorwin_matelasse_50x70_con_espaldar_sol_naciente.jpeg',
                  label: 'Almohada DORWIN Matelassê 50×70',
                },
                {
                  img: '/catalogo_dorwin/02_info_espumas_y_almohadas/108_almohada_dorwin_empaque_con_espaldar_capitone.jpeg',
                  label: 'Soporte Firme Mayor Vida Útil',
                },
              ].map((item) => (
                <div key={item.img} className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                  <img src={item.img} alt={item.label} className="aspect-square w-full object-cover" />
                  <p className="p-2 text-center text-[11px] font-bold text-neutral-800">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Showroom Video FEIPOBOL */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase">
                <Video className="size-4" /> Showroom en Vivo — Feria FEIPOBOL
              </div>
              <h3 className="mt-1 text-xl font-bold text-neutral-900">
                Mira nuestros Juegos de Cama, Colchones y Puffs en Exhibición
              </h3>
              <p className="mt-1 text-xs text-neutral-600">
                Recorrido real por nuestro stand mostrando juegos imperiales con luces LED, espaldares infantiles y sillones puff deportivos.
              </p>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200 bg-black">
              <video
                src="/catalogo_dorwin/00_marca_y_showroom/165_video_showroom_feipobol_tarjetas_modelos_puffs.mp4"
                controls
                className="max-h-[280px] w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
