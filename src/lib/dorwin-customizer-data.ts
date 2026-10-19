export type HeadboardArchetypeId =
  | 'ESP-01' // Imperial Escalonado en V con Listones Dorados/Espejo
  | 'ESP-02' // Sol Naciente / Abanico Radial
  | 'ESP-03' // Chevron / Espiga y Cortes en V
  | 'ESP-04' // Bastones / Paneles Verticales
  | 'ESP-05' // Ladrillo / Trenzado Entrelazado y Ajedrez
  | 'ESP-06' // Capitoné Clásico de Rombos con Botones
  | 'ESP-07' // Cuadrícula Simétrica de Bloques
  | 'ESP-08' // Imperial Chevron V Central + Franjas Espejo
  | 'ESP-09' // Imperial con Marco de Madera Alistonada (WPC)
  | 'ESP-10' // Imperial Gran Rombo Central Concéntrico
  | 'ESP-11' // Panal Hexagonal Geométrico
  | 'ESP-12'; // Reloj de Arena / Sobre en X con Espejo

export type BaseTypeId =
  | 'BASE-01' // Somier Dividido Estándar
  | 'BASE-02' // Somier Baúl / Boulera con Cajones
  | 'BASE-03' // Cama Nube / Tarima Acolchada Bouclé
  | 'BASE-04' // Base / Catre de Madera Clásica / Wengué
  | 'BASE-05'; // Catre / Somier Metálico Reforzado

export type MattressModelId =
  | 'casata_pedic'
  | 'smart_viscogel'
  | 'zero_stress'
  | 'pocket_cool'
  | 'naturfresh'
  | 'bamboo_confort_real'
  | 'relax'
  | 'classic'
  | 'celta_angelus';

export type NightstandTypeId = 'VEL-NONE' | 'VEL-2CAJ' | 'VEL-3CAJ' | 'VEL-MELAMINA';
export type FootboardTypeId = 'PIEC-NONE' | 'PIEC-ACOLCHADA' | 'PIEC-BAUL' | 'PIEC-DIVAN';
export type PillowTypeId = 'ALM-NONE' | 'ALM-DORWIN' | 'ALM-VISCO' | 'ALM-PARE' | 'ALM-RODILLO';
export type FabricTypeId = 'velvet' | 'suede' | 'linen' | 'ecoleather';
export type MetalAccentId = 'gold' | 'silver' | 'bronze' | 'none';

export interface BedSizeOption {
  id: string;
  nombre: string;
  etiqueta: string;
  plazas: number;
  anchoCm: number;
  largoCm: number;
  factorPrecioMueble: number;
  divididoSomier: boolean;
}

export interface MattressLayer {
  nombre: string;
  material: string;
  beneficioSalud: string;
  colorHex: string;
  grosorRelativo: number; // Suma ~1.0
}

export interface MattressModelSpec {
  id: MattressModelId;
  nombre: string;
  subtitulo: string;
  origen: 'NACIONAL' | 'CHILENO';
  garantiaAnios: number;
  soporteKgPersona: number;
  alturaCm: number;
  firmeza: 'Suave Adaptable' | 'Anatómica' | 'Semi Firme' | 'Firme Ortopédica' | 'Extra Firme Ortopédica';
  nivelFirmeza1a5: number;
  tienePillowTop: boolean;
  resorteTipo: string;
  espumaDensidad: string;
  fichaImagen: string;
  etiquetaSalud: string[];
  recomendadoPara: ('dolor_lumbar' | 'dormir_lado' | 'calor_nocturno' | 'alto_peso' | 'economico')[];
  coloresFabrica: {
    tapaHex: string;
    lateralHex: string;
    vivoHex: string;
    estampado: 'ondas' | 'rombos' | 'hexagonal' | 'bambu' | 'liso';
  };
  preciosPorMedida: Record<string, number>;
  capasInternas: MattressLayer[];
}

export interface HeadboardArchetypeSpec {
  id: HeadboardArchetypeId;
  nombre: string;
  familiaCarpeta: string;
  descripcion: string;
  esImperialAncho: boolean;
  incluyePanelesLed: boolean;
  soportaBicolor: boolean;
  soportaBotonesCristal: boolean;
  precioBase2Plazas: number;
  fotosReales: string[];
}

export interface BaseTypeSpec {
  id: BaseTypeId;
  nombre: string;
  descripcion: string;
  precioBase2Plazas: number;
  alturaCm: number;
  tieneCajones: boolean;
  esBordeNube: boolean;
}

export interface FabricOption {
  id: FabricTypeId;
  nombre: string;
  descripcion: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
}

export interface ColorSwatch {
  id: string;
  nombre: string;
  hex: string;
  categoria: 'neutro' | 'calido' | 'frio' | 'acento';
}

export const DORWIN_COMPANY_INFO = {
  marca: 'DORWIN® Colchões',
  importadora: 'Importadora Hogarelax / Relax Muebles y Colchones',
  whatsappPrincipal: '59169866371',
  whatsappSecundario: '59162810698',
  telefonosTienda: ['69866371', '62810698', '62099933', '65648595'],
  certificaciones: ['ISO 9001 Qualidade Certificada', 'ISPA Internacional', 'Active Protection Antiácaros', 'Technology Germany Telas Frías'],
  sucursales: [
    { ciudad: 'El Alto', direccion: 'Calle Nistaus #100, casi esq. Pancho, Zona 16 de Julio' },
    { ciudad: 'Potosí', direccion: 'Mercado Uyuni, Zona San Roque, C/ San Alberto entre Boquerón y Junín #210' },
    { ciudad: 'Oruro', direccion: 'Calle Sucre entre Velasco y Pagador #260' },
    { ciudad: 'Santa Cruz', direccion: '4to. Anillo entre Doble Vía La Guardia y Nuevo Mercado Abasto' },
  ],
};

export const BED_SIZES: BedSizeOption[] = [
  { id: '1P', nombre: '1 Plaza', etiqueta: 'Sencillo (1 P)', plazas: 1.0, anchoCm: 90, largoCm: 190, factorPrecioMueble: 0.72, divididoSomier: false },
  { id: '1.5P', nombre: '1 ½ Plazas', etiqueta: 'Plaza y Media (1 ½ P)', plazas: 1.5, anchoCm: 105, largoCm: 190, factorPrecioMueble: 0.84, divididoSomier: false },
  { id: '2P', nombre: '2 Plazas', etiqueta: 'Matrimonial (2 P)', plazas: 2.0, anchoCm: 140, largoCm: 190, factorPrecioMueble: 1.0, divididoSomier: false },
  { id: '2.5P', nombre: '2 ½ Plazas', etiqueta: 'Queen Size (2 ½ P)', plazas: 2.5, anchoCm: 160, largoCm: 200, factorPrecioMueble: 1.18, divididoSomier: true },
  { id: '3P', nombre: '3 Plazas', etiqueta: 'King Size (3 P)', plazas: 3.0, anchoCm: 200, largoCm: 200, factorPrecioMueble: 1.38, divididoSomier: true },
  { id: '3.5P', nombre: '3 ½ Plazas', etiqueta: 'Super King Imperial (3 ½ P)', plazas: 3.5, anchoCm: 220, largoCm: 200, factorPrecioMueble: 1.55, divididoSomier: true },
];

export const FABRIC_OPTIONS: FabricOption[] = [
  { id: 'velvet', nombre: 'Terciopelo Velvet Imperial', descripcion: 'Tacto ultra suave con brillo elegante, el favorito en camas imperiales', roughness: 0.72, metalness: 0.08, clearcoat: 0.05 },
  { id: 'suede', nombre: 'Gamuza Grabada Texturizada', descripcion: 'Acabado gamuzado de alta resistencia y fácil limpieza', roughness: 0.82, metalness: 0.04, clearcoat: 0.0 },
  { id: 'linen', nombre: 'Lino / Chenille Orgánico', descripcion: 'Tejido fresco y respirable de trama natural', roughness: 0.92, metalness: 0.02, clearcoat: 0.0 },
  { id: 'ecoleather', nombre: 'Ecocuero / Cuerina Premium', descripcion: 'Impermeable, higiénico y de limpieza instantánea', roughness: 0.35, metalness: 0.1, clearcoat: 0.35 },
];

export const COLOR_PALETTE: ColorSwatch[] = [
  { id: 'negro_carbon', nombre: 'Negro Carbón', hex: '#18181B', categoria: 'neutro' },
  { id: 'gris_plomo', nombre: 'Gris Plomo Grafito', hex: '#3F444C', categoria: 'neutro' },
  { id: 'gris_ceniza', nombre: 'Gris Acero / Ceniza', hex: '#717882', categoria: 'neutro' },
  { id: 'gris_perla', nombre: 'Gris Perla Plata', hex: '#CBD0D8', categoria: 'neutro' },
  { id: 'blanco_marfil', nombre: 'Blanco Marfil / Hueso', hex: '#F4F1EA', categoria: 'neutro' },
  { id: 'beige_champan', nombre: 'Beige Champán / Arena', hex: '#D8C7B0', categoria: 'calido' },
  { id: 'marron_vison', nombre: 'Marrón Topo / Visón', hex: '#8A7362', categoria: 'calido' },
  { id: 'marron_chocolate', nombre: 'Marrón Chocolate', hex: '#3D261C', categoria: 'calido' },
  { id: 'azul_petroleo', nombre: 'Azul Petróleo Imperial', hex: '#144256', categoria: 'frio' },
  { id: 'azul_marino', nombre: 'Azul Marino Noche', hex: '#172542', categoria: 'frio' },
  { id: 'verde_oliva', nombre: 'Verde Oliva / Salvia', hex: '#4B5B47', categoria: 'frio' },
  { id: 'rosa_viejo', nombre: 'Palo de Rosa / Rosa Viejo', hex: '#B97A86', categoria: 'acento' },
  { id: 'rosa_pastel', nombre: 'Rosa Pastel Bebé', hex: '#E8BFC7', categoria: 'acento' },
  { id: 'vino_dorwin', nombre: 'Vino Guindo DORWIN', hex: '#7B183C', categoria: 'acento' },
  { id: 'naranja_terracota', nombre: 'Terracota Vibrante', hex: '#C6532B', categoria: 'acento' },
];

export const MATTRESS_MODELS: MattressModelSpec[] = [
  {
    id: 'casata_pedic',
    nombre: 'Casata Pedic',
    subtitulo: 'Máximo Soporte Ortopédico Lumbar • Línea Médica',
    origen: 'NACIONAL',
    garantiaAnios: 8,
    soporteKgPersona: 160,
    alturaCm: 34,
    firmeza: 'Extra Firme Ortopédica',
    nivelFirmeza1a5: 5,
    tienePillowTop: true,
    resorteTipo: 'Resorte PHP Pocket Encapsulado',
    espumaDensidad: 'Espuma D40 + Láminas y Marco Cazata',
    fichaImagen: '/catalogo_dorwin/01_fichas_tecnicas_colchones/002_ficha_casata_pedic_160kg_d40_extrafirme_34cm.jpeg',
    etiquetaSalud: ['Alineación de Columna', 'Soporte 160 kg/persona', 'Núcleo Cazata Prensada', 'Cero Transferencia de Movimiento'],
    recomendadoPara: ['dolor_lumbar', 'alto_peso'],
    coloresFabrica: { tapaHex: '#F9FAFB', lateralHex: '#18181B', vivoHex: '#FFFFFF', estampado: 'rombos' },
    preciosPorMedida: { '1P': 2650, '1.5P': 3150, '2P': 3880, '2.5P': 4350, '3P': 4890, '3.5P': 5350 },
    capasInternas: [
      { nombre: '1. Tapa Superior Matelassê 100% Algodón', material: 'Tejido de punto hipoalergénico acolchado', beneficioSalud: 'Evita alergias y mantiene la piel fresca durante el sueño.', colorHex: '#F8FAFC', grosorRelativo: 0.14 },
      { nombre: '2. Capa Confort Espuma D40 Alta Densidad', material: 'Poliuretano Densidad 40 kg/m³', beneficioSalud: 'Distribuye el peso corporal sin hundimientos.', colorHex: '#DBEAFE', grosorRelativo: 0.20 },
      { nombre: '3. Placa Ortopédica de Espuma Cazata', material: 'Espuma aglomerada de alta compresión Cazata', beneficioSalud: 'Corrige la postura lumbar y protege las vértebras.', colorHex: '#A7F3D0', grosorRelativo: 0.22 },
      { nombre: '4. Núcleo de Resortes PHP Pocket + Marco Cazata', material: 'Resortes individuales embolsados + Caja perimetral D40', beneficioSalud: 'Independencia de lechos hasta 160 kg por persona.', colorHex: '#94A3B8', grosorRelativo: 0.44 },
    ],
  },
  {
    id: 'smart_viscogel',
    nombre: 'Smart Viscogel',
    subtitulo: 'Tecnología Memory Foam con Partículas de Gel Termorregulador',
    origen: 'NACIONAL',
    garantiaAnios: 6,
    soporteKgPersona: 120,
    alturaCm: 32,
    firmeza: 'Suave Adaptable',
    nivelFirmeza1a5: 2,
    tienePillowTop: true,
    resorteTipo: 'Resorte PHP Pocket Individual',
    espumaDensidad: 'Espuma Viscogel + Marco Cazata',
    fichaImagen: '/catalogo_dorwin/01_fichas_tecnicas_colchones/003_ficha_smart_viscogel_120kg_pocket_suave.jpeg',
    etiquetaSalud: ['Alivio de Puntos de Presión', 'Efecto Frío Viscogel', 'Ideal Dormir de Lado', 'Mayor Transpirabilidad'],
    recomendadoPara: ['dormir_lado', 'calor_nocturno'],
    coloresFabrica: { tapaHex: '#FFFFFF', lateralHex: '#27272A', vivoHex: '#38BDF8', estampado: 'hexagonal' },
    preciosPorMedida: { '1P': 2800, '1.5P': 3300, '2P': 3750, '2.5P': 4200, '3P': 4750, '3.5P': 5200 },
    capasInternas: [
      { nombre: '1. Tejido Fresco Algodón Transpirable', material: 'Tela 100% Algodón con micro-ventilación', beneficioSalud: 'Disipa el calor corporal toda la noche.', colorHex: '#F0F9FF', grosorRelativo: 0.14 },
      { nombre: '2. Capa Viscoelástica con Perlas de Gel (Viscogel)', material: 'Memory Foam + Gel Termorregulador', beneficioSalud: 'Se amolda a hombros y caderas eliminando el entumecimiento.', colorHex: '#38BDF8', grosorRelativo: 0.24 },
      { nombre: '3. Lámina Estabilizadora Ergofirm', material: 'Espuma de transición de alta resiliencia', beneficioSalud: 'Sostiene la curvatura natural de la espalda.', colorHex: '#E2E8F0', grosorRelativo: 0.18 },
      { nombre: '4. Resortes PHP Pocket + Marco Cazata', material: 'Resortes ensacados independientes', beneficioSalud: 'Absorbe movimientos de tu pareja al dormir.', colorHex: '#94A3B8', grosorRelativo: 0.44 },
    ],
  },
  {
    id: 'naturfresh',
    nombre: 'Naturfresh',
    subtitulo: 'Tecnología Alemana de Telas Frías y Soporte D40',
    origen: 'NACIONAL',
    garantiaAnios: 6,
    soporteKgPersona: 140,
    alturaCm: 31,
    firmeza: 'Firme Ortopédica',
    nivelFirmeza1a5: 4,
    tienePillowTop: true,
    resorteTipo: 'Resorte PHP Reforzado',
    espumaDensidad: 'Espuma D40 + Marco Sellado HR',
    fichaImagen: '/catalogo_dorwin/01_fichas_tecnicas_colchones/006_ficha_naturfresh_140kg_d40_telas_alemanas.jpeg',
    etiquetaSalud: ['Technology Germany Telas Frías', 'Soporte 140 kg/persona', 'Espuma D40', 'Marco Sellado HR'],
    recomendadoPara: ['calor_nocturno', 'dolor_lumbar', 'alto_peso'],
    coloresFabrica: { tapaHex: '#FFFFFF', lateralHex: '#F1F5F9', vivoHex: '#CBD5E1', estampado: 'ondas' },
    preciosPorMedida: { '1P': 1750, '1.5P': 2080, '2P': 2680, '2.5P': 3080, '3P': 3550, '3.5P': 3950 },
    capasInternas: [
      { nombre: '1. Cubierta Alemana Naturfresh Telas Frías', material: '100% Algodón con tratamiento térmico alemán', beneficioSalud: 'Reduce la temperatura superficial hasta 3°C.', colorHex: '#ECFEFF', grosorRelativo: 0.15 },
      { nombre: '2. Pillow Top Espuma Densidad 40', material: 'Poliuretano D40 de soporte superior', beneficioSalud: 'Firmeza ortopédica con acogida suave inicial.', colorHex: '#BAE6FD', grosorRelativo: 0.25 },
      { nombre: '3. Marco Sellado con Espuma HR', material: 'High Resilience Foam perimetral', beneficioSalud: 'Evita que los bordes se deformen al sentarse.', colorHex: '#E2E8F0', grosorRelativo: 0.16 },
      { nombre: '4. Sistema de Resortes PHP Reforzado', material: 'Acero templado al carbono de alto soporte', beneficioSalud: 'Resistencia garantizada para hasta 140 kg por persona.', colorHex: '#94A3B8', grosorRelativo: 0.44 },
    ],
  },
  {
    id: 'zero_stress',
    nombre: 'Zero Stress',
    subtitulo: 'Descarga Electro-Estática y Firmeza Ortopédica Cazata',
    origen: 'NACIONAL',
    garantiaAnios: 5,
    soporteKgPersona: 130,
    alturaCm: 29,
    firmeza: 'Firme Ortopédica',
    nivelFirmeza1a5: 4,
    tienePillowTop: false,
    resorteTipo: 'Resorte PHP Reforzado',
    espumaDensidad: 'Espuma D35 + Láminas y Marco Cazata',
    fichaImagen: '/catalogo_dorwin/01_fichas_tecnicas_colchones/001_ficha_zero_stress_130kg_d35_firme_29cm.jpeg',
    etiquetaSalud: ['Anti-Estrés Muscular', 'Soporte 130 kg/persona', 'Láminas Cazata + D35', 'Altura 29 cm'],
    recomendadoPara: ['dolor_lumbar', 'alto_peso'],
    coloresFabrica: { tapaHex: '#9CA3AF', lateralHex: '#18181B', vivoHex: '#E5E7EB', estampado: 'ondas' },
    preciosPorMedida: { '1P': 1650, '1.5P': 1950, '2P': 2300, '2.5P': 2550, '3P': 2980, '3.5P': 3350 },
    capasInternas: [
      { nombre: '1. Tela 100% Algodón Anti-Stress', material: 'Tejido orgánico libre de estática', beneficioSalud: 'Favorece la relajación del sistema nervioso al dormir.', colorHex: '#D1D5DB', grosorRelativo: 0.14 },
      { nombre: '2. Capa Ortopédica Espuma D35', material: 'Espuma de poliuretano Densidad 35', beneficioSalud: 'Soporte firme para espalda y zona dorsal.', colorHex: '#FDE68A', grosorRelativo: 0.22 },
      { nombre: '3. Doble Lámina de Espuma Cazata', material: 'Cazata prensada de alta densidad', beneficioSalud: 'Mantiene la columna recta toda la noche.', colorHex: '#A7F3D0', grosorRelativo: 0.20 },
      { nombre: '4. Resorte PHP Reforzado + Caja Cazata', material: 'Estructura metálica reforzada', beneficioSalud: 'Estabilidad total hasta 130 kg por persona.', colorHex: '#94A3B8', grosorRelativo: 0.44 },
    ],
  },
  {
    id: 'pocket_cool',
    nombre: 'Pocket Cool (Ed. Limitada)',
    subtitulo: 'Resortes Pocket Independientes con Sensación Ortopédica Fresca',
    origen: 'NACIONAL',
    garantiaAnios: 8,
    soporteKgPersona: 130,
    alturaCm: 32,
    firmeza: 'Firme Ortopédica',
    nivelFirmeza1a5: 4,
    tienePillowTop: true,
    resorteTipo: 'Resorte PHP Pocket',
    espumaDensidad: 'Espuma D40 + Marco Encajonado Cazata',
    fichaImagen: '/catalogo_dorwin/01_fichas_tecnicas_colchones/004_ficha_pocket_cool_edicion_limitada_130kg_d40.jpeg',
    etiquetaSalud: ['8 Años de Garantía', 'Resorte PHP Pocket', 'Espuma D40 + Cazata', 'Telas Frescas'],
    recomendadoPara: ['dolor_lumbar', 'calor_nocturno'],
    coloresFabrica: { tapaHex: '#FFFFFF', lateralHex: '#18181B', vivoHex: '#06B6D4', estampado: 'hexagonal' },
    preciosPorMedida: { '1P': 2200, '1.5P': 2600, '2P': 3100, '2.5P': 3500, '3P': 3950, '3.5P': 4400 },
    capasInternas: [
      { nombre: '1. Tela Cool Fresh 100% Algodón', material: 'Tejido frío al tacto con ribete turquesa', beneficioSalud: 'Regula la humedad y el calor nocturno.', colorHex: '#CFFAFE', grosorRelativo: 0.14 },
      { nombre: '2. Núcleo Superior Espuma D40', material: 'Poliuretano Densidad 40 kg/m³', beneficioSalud: 'Firmeza duradera sin deformaciones.', colorHex: '#BAE6FD', grosorRelativo: 0.24 },
      { nombre: '3. Marco Encajonado con Espuma Cazata', material: 'Refuerzo perimetral Cazata', beneficioSalud: 'Aprovecha el 100% de la superficie útil del colchón.', colorHex: '#A7F3D0', grosorRelativo: 0.18 },
      { nombre: '4. Resortes PHP Pocket Independientes', material: 'Resortes ensacados uno a uno', beneficioSalud: 'Adaptación punto por punto a la anatomía.', colorHex: '#94A3B8', grosorRelativo: 0.44 },
    ],
  },
  {
    id: 'bamboo_confort_real',
    nombre: 'Bamboo (Confort Real)',
    subtitulo: 'Fibras Naturales de Bambú Antiácaros y Soporte Ortopédico',
    origen: 'NACIONAL',
    garantiaAnios: 5,
    soporteKgPersona: 130,
    alturaCm: 29,
    firmeza: 'Firme Ortopédica',
    nivelFirmeza1a5: 4,
    tienePillowTop: true,
    resorteTipo: 'Resorte Reforzado',
    espumaDensidad: 'Espuma D35 + Espuma Cazata Interna',
    fichaImagen: '/catalogo_dorwin/01_fichas_tecnicas_colchones/008_ficha_bamboo_confort_real_130kg_d35_cazata.jpeg',
    etiquetaSalud: ['Fibra Natural Bambú', 'Antibacterial y Antiácaros', 'Espuma D35 + Cazata', 'Soporte 130 kg'],
    recomendadoPara: ['dolor_lumbar', 'alto_peso'],
    coloresFabrica: { tapaHex: '#F8FAFC', lateralHex: '#18181B', vivoHex: '#86EFAC', estampado: 'bambu' },
    preciosPorMedida: { '1P': 1320, '1.5P': 1580, '2P': 2150, '2.5P': 2460, '3P': 2890, '3.5P': 3250 },
    capasInternas: [
      { nombre: '1. Tela Orgánica con Extracto de Bambú', material: '100% Algodón y fibra de bambú natural', beneficioSalud: 'Propiedades hipoalergénicas y antibacterianas naturales.', colorHex: '#DCFCE7', grosorRelativo: 0.15 },
      { nombre: '2. Capa Confort Espuma D35', material: 'Espuma de poliuretano Densidad 35', beneficioSalud: 'Equilibrio ideal entre confort y firmeza.', colorHex: '#FEF08A', grosorRelativo: 0.23 },
      { nombre: '3. Placa Interna de Espuma Cazata', material: 'Espuma prensada ortopédica', beneficioSalud: 'Refuerzo lumbar contra dolores de espalda.', colorHex: '#A7F3D0', grosorRelativo: 0.20 },
      { nombre: '4. Resorte Reforzado de Acero', material: 'Parrilla de resortes de alta resistencia', beneficioSalud: 'Soporte firme hasta 130 kg por persona.', colorHex: '#94A3B8', grosorRelativo: 0.42 },
    ],
  },
  {
    id: 'relax',
    nombre: 'Relax',
    subtitulo: 'Confort Anatómico con Pillow Top y Marco HR',
    origen: 'NACIONAL',
    garantiaAnios: 5,
    soporteKgPersona: 120,
    alturaCm: 28,
    firmeza: 'Anatómica',
    nivelFirmeza1a5: 3,
    tienePillowTop: true,
    resorteTipo: 'Resorte PHP Reforzado',
    espumaDensidad: 'Espuma D30 + Marco Encajonado HR',
    fichaImagen: '/catalogo_dorwin/01_fichas_tecnicas_colchones/005_ficha_relax_120kg_d30_anatomico.jpeg',
    etiquetaSalud: ['Sensación Anatómica', 'Soporte 120 kg/persona', 'Espuma D30 + HR', '5 Años de Garantía'],
    recomendadoPara: ['dormir_lado', 'economico'],
    coloresFabrica: { tapaHex: '#FFFFFF', lateralHex: '#1F2937', vivoHex: '#F3F4F6', estampado: 'rombos' },
    preciosPorMedida: { '1P': 1250, '1.5P': 1470, '2P': 1890, '2.5P': 2280, '3P': 2650, '3.5P': 2990 },
    capasInternas: [
      { nombre: '1. Pillow Top 100% Algodón Acolchado', material: 'Tejido suave matelassê', beneficioSalud: 'Acogida suave que reduce la tensión muscular.', colorHex: '#F8FAFC', grosorRelativo: 0.16 },
      { nombre: '2. Capa Anatómica Espuma D30', material: 'Poliuretano Densidad 30 kg/m³', beneficioSalud: 'Se adapta a las curvas del cuerpo sin ser rígido.', colorHex: '#FDE68A', grosorRelativo: 0.24 },
      { nombre: '3. Marco Encajonado con Espuma HR', material: 'Espuma High Resilience perimetral', beneficioSalud: 'Mayor estabilidad en los bordes de la cama.', colorHex: '#E2E8F0', grosorRelativo: 0.18 },
      { nombre: '4. Resorte PHP Reforzado', material: 'Sistema de resortes templados', beneficioSalud: 'Soporte anatómico de 120 kg por persona.', colorHex: '#94A3B8', grosorRelativo: 0.42 },
    ],
  },
  {
    id: 'classic',
    nombre: 'Classic',
    subtitulo: 'Calidad Tradicional DORWIN con Resortes Bonell y Sensación Semi Firme',
    origen: 'NACIONAL',
    garantiaAnios: 3,
    soporteKgPersona: 90,
    alturaCm: 25,
    firmeza: 'Semi Firme',
    nivelFirmeza1a5: 3,
    tienePillowTop: false,
    resorteTipo: 'Resortes Bonell Bicónicos',
    espumaDensidad: 'Espuma Densidad 25',
    fichaImagen: '/catalogo_dorwin/01_fichas_tecnicas_colchones/007_ficha_classic_90kg_bonell_d25_semifirme.jpeg',
    etiquetaSalud: ['Sensación Semi Firme', 'Soporte 90 kg/persona', 'Tela 100% Algodón', 'Excelente Relación Precio/Calidad'],
    recomendadoPara: ['economico'],
    coloresFabrica: { tapaHex: '#FFFFFF', lateralHex: '#18181B', vivoHex: '#D1D5DB', estampado: 'rombos' },
    preciosPorMedida: { '1P': 1060, '1.5P': 1290, '2P': 1550, '2.5P': 1860, '3P': 1930, '3.5P': 2250 },
    capasInternas: [
      { nombre: '1. Tapa Acolchada 100% Algodón', material: 'Tela fresca de algodón natural', beneficioSalud: 'Ventilación continua e higiene.', colorHex: '#FFFFFF', grosorRelativo: 0.16 },
      { nombre: '2. Capa Confort Espuma D25', material: 'Poliuretano Densidad 25 kg/m³', beneficioSalud: 'Comodidad diaria ideal para jóvenes y adultos.', colorHex: '#FEF3C7', grosorRelativo: 0.28 },
      { nombre: '3. Aislante Termofusionado Protector', material: 'Fieltro textil de alta resistencia', beneficioSalud: 'Aísla la espuma del núcleo de resortes.', colorHex: '#CBD5E1', grosorRelativo: 0.12 },
      { nombre: '4. Núcleo de Resortes Bonell', material: 'Resortes bicónicos entrelazados', beneficioSalud: 'Soporte clásico uniforme de 90 kg por persona.', colorHex: '#94A3B8', grosorRelativo: 0.44 },
    ],
  },
  {
    id: 'celta_angelus',
    nombre: 'Celta Ángelus Pocket',
    subtitulo: 'Importado de Chile • Resortes Pocket de Confort Superior',
    origen: 'CHILENO',
    garantiaAnios: 5,
    soporteKgPersona: 115,
    alturaCm: 30,
    firmeza: 'Anatómica',
    nivelFirmeza1a5: 3,
    tienePillowTop: true,
    resorteTipo: 'Resortes Pocket Chilenos',
    espumaDensidad: 'Espuma Alta Densidad Multicapa',
    fichaImagen: '/catalogo_dorwin/03_camas_imperiales_veladores_led/E_otros_imperiales_especiales/109_juego_4_cuadros_luces_led_beige_colchon_celta_angelus.jpeg',
    etiquetaSalud: ['Hecho en Chile', 'Resortes Ángelus Pocket', 'Tejido Jacquard Carbón', 'Independencia de Movimiento'],
    recomendadoPara: ['dormir_lado', 'economico'],
    coloresFabrica: { tapaHex: '#374151', lateralHex: '#6B7280', vivoHex: '#111827', estampado: 'hexagonal' },
    preciosPorMedida: { '1P': 1150, '1.5P': 1380, '2P': 1600, '2.5P': 1850, '3P': 2100, '3.5P': 2450 },
    capasInternas: [
      { nombre: '1. Cubierta Jacquard Belga Antideslizante', material: 'Tejido acolchado con patrón hexagonal', beneficioSalud: 'Suavidad térmica y alta durabilidad.', colorHex: '#4B5563', grosorRelativo: 0.16 },
      { nombre: '2. Espuma Anatómica Soft Confort', material: 'Poliuretano flexible de alta adaptación', beneficioSalud: 'Alivia presión en hombros y cadera.', colorHex: '#E5E7EB', grosorRelativo: 0.26 },
      { nombre: '3. Marco Perimetral Estabilizador', material: 'Espuma de contención lateral', beneficioSalud: 'Mantiene la geometría del colchón.', colorHex: '#D1D5DB', grosorRelativo: 0.14 },
      { nombre: '4. Resortes Ángelus Pocket', material: 'Resortes ensacados de origen chileno', beneficioSalud: 'Silencioso y sin rebote entre parejas.', colorHex: '#94A3B8', grosorRelativo: 0.44 },
    ],
  },
];

export const HEADBOARD_ARCHETYPES: HeadboardArchetypeSpec[] = [
  {
    id: 'ESP-01',
    nombre: 'Imperial Escalonado en "V" con Listones',
    familiaCarpeta: '03_camas_imperiales_veladores_led/A_columnas_escalonadas_en_V_dorado_espejo',
    descripcion: 'El modelo insignia de DORWIN: columnas verticales acolchadas con listones dorados o espejo escalonados en "V", paneles de luz LED e interruptores.',
    esImperialAncho: true,
    incluyePanelesLed: true,
    soportaBicolor: true,
    soportaBotonesCristal: false,
    precioBase2Plazas: 1450,
    fotosReales: [
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/A_columnas_escalonadas_en_V_dorado_espejo/022_imperial_escalonado_V_azul_petroleo_dorado_colchon_naturfresh.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/A_columnas_escalonadas_en_V_dorado_espejo/059_imperial_columnas_escalonadas_negro_dorado_casata_pedic.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/A_columnas_escalonadas_en_V_dorado_espejo/027_imperial_escalonado_V_marron_chocolate_dorado_colchon_classic.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/A_columnas_escalonadas_en_V_dorado_espejo/031_imperial_columnas_escalonadas_gris_ceniza_colchon_casata_pedic.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/A_columnas_escalonadas_en_V_dorado_espejo/023_espaldar_escalonado_V_rosa_viejo_dorado_colchon_celta.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/A_columnas_escalonadas_en_V_dorado_espejo/127_imperial_escalonado_V_bicolor_gris_carbon_y_blanco.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/A_columnas_escalonadas_en_V_dorado_espejo/131_imperial_escalonado_V_beige_crema_dorado_lampara_esferica.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/A_columnas_escalonadas_en_V_dorado_espejo/151_imperial_escalonado_V_bicolor_negro_y_beige.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/A_columnas_escalonadas_en_V_dorado_espejo/013_juego_5_columnas_franjas_doradas_gris_plomo.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/A_columnas_escalonadas_en_V_dorado_espejo/061_juego_paneles_listones_dorados_blanco_marfil_naturfresh.jpeg',
    ],
  },
  {
    id: 'ESP-02',
    nombre: 'Sol Naciente / Abanico Radial',
    familiaCarpeta: '04_espaldares_sol_naciente_y_abanico',
    descripcion: 'Diseño radiante con núcleo semicircular inferior del que nacen pétalos/rayos acolchados hacia el marco superior. Disponible unicolor o bicolor.',
    esImperialAncho: false,
    incluyePanelesLed: false,
    soportaBicolor: true,
    soportaBotonesCristal: false,
    precioBase2Plazas: 980,
    fotosReales: [
      '/catalogo_dorwin/04_espaldares_sol_naciente_y_abanico/042_sol_naciente_bicolor_rosa_pastel_y_fucsia_dorado_relax.jpeg',
      '/catalogo_dorwin/04_espaldares_sol_naciente_y_abanico/148_sol_naciente_bicolor_marron_chocolate_y_beige.jpeg',
      '/catalogo_dorwin/04_espaldares_sol_naciente_y_abanico/154_conjunto_sol_naciente_con_divan_y_veladores_bicolor_rosa_fucsia.jpeg',
      '/catalogo_dorwin/04_espaldares_sol_naciente_y_abanico/073_sol_naciente_crema_marfil_base_negra_classic.jpeg',
      '/catalogo_dorwin/04_espaldares_sol_naciente_y_abanico/126_sol_naciente_geom_radial_blanco_humo.jpeg',
      '/catalogo_dorwin/04_espaldares_sol_naciente_y_abanico/158_sol_naciente_geom_radial_gris_plomo_pizarra.jpeg',
      '/catalogo_dorwin/04_espaldares_sol_naciente_y_abanico/090_abanico_rayos_diagonales_marron_cafe_marco.jpeg',
      '/catalogo_dorwin/04_espaldares_sol_naciente_y_abanico/134_concha_marina_festoneado_9_gajos_rosa_pastel.jpeg',
    ],
  },
  {
    id: 'ESP-03',
    nombre: 'Chevron / Espiga con Apliques en "V"',
    familiaCarpeta: '06_espaldares_chevron_espiga_y_cortes_en_V',
    descripcion: 'Paneles diagonales convergentes en espiga (Chevron) con marco perimetral y listones metálicos dorados o plateados.',
    esImperialAncho: false,
    incluyePanelesLed: false,
    soportaBicolor: true,
    soportaBotonesCristal: false,
    precioBase2Plazas: 950,
    fotosReales: [
      '/catalogo_dorwin/06_espaldares_chevron_espiga_y_cortes_en_V/029_juego_chevron_espiga_marron_chocolate_dorado_baul_classic.jpeg',
      '/catalogo_dorwin/06_espaldares_chevron_espiga_y_cortes_en_V/011_juego_chevron_trenzado_espiga_beige_colchon_bambu.jpeg',
      '/catalogo_dorwin/06_espaldares_chevron_espiga_y_cortes_en_V/019_juego_5_columnas_cortes_diagonales_dorados_crema_marfil.jpeg',
      '/catalogo_dorwin/06_espaldares_chevron_espiga_y_cortes_en_V/117_espaldar_chevron_en_V_naranja_terracota_marco.jpeg',
      '/catalogo_dorwin/06_espaldares_chevron_espiga_y_cortes_en_V/119_espaldar_chevron_invertido_verde_oliva_salvia_marco.jpeg',
      '/catalogo_dorwin/06_espaldares_chevron_espiga_y_cortes_en_V/133_espaldar_chevron_escalonado_bicolor_gris_plata_y_negro.jpeg',
      '/catalogo_dorwin/06_espaldares_chevron_espiga_y_cortes_en_V/144_espaldar_sobre_en_V_tricolor_cafe_blanco_beige_dorado.jpeg',
      '/catalogo_dorwin/06_espaldares_chevron_espiga_y_cortes_en_V/159_juego_chevron_espiga_marron_topo_dorado_classic.jpeg',
    ],
  },
  {
    id: 'ESP-04',
    nombre: 'Bastones Verticales y Cortes Curvos LED',
    familiaCarpeta: '07_espaldares_paneles_verticales_y_ondas',
    descripcion: 'Columnas verticales continuas o con cortes curvos orgánicos bañados en luz LED cálida y filetes dorados.',
    esImperialAncho: false,
    incluyePanelesLed: true,
    soportaBicolor: false,
    soportaBotonesCristal: false,
    precioBase2Plazas: 920,
    fotosReales: [
      '/catalogo_dorwin/07_espaldares_paneles_verticales_y_ondas/076_juego_paneles_verticales_cortes_curvos_dorados_led_beige_relax.jpeg',
      '/catalogo_dorwin/07_espaldares_paneles_verticales_y_ondas/024_juego_7_paneles_verticales_con_marco_negro_colchon_relax.jpeg',
      '/catalogo_dorwin/07_espaldares_paneles_verticales_y_ondas/070_juego_paneles_verticales_ondulados_led_base_nube_beige_casata.jpeg',
      '/catalogo_dorwin/07_espaldares_paneles_verticales_y_ondas/089_juego_king_10_paneles_verticales_gris_acero_naturfresh.jpeg',
      '/catalogo_dorwin/07_espaldares_paneles_verticales_y_ondas/112_espaldar_6_paneles_verticales_con_marco_verde_petroleo.jpeg',
      '/catalogo_dorwin/07_espaldares_paneles_verticales_y_ondas/128_espaldar_6_paneles_verticales_cortes_curvos_dorados_beige.jpeg',
      '/catalogo_dorwin/07_espaldares_paneles_verticales_y_ondas/150_cama_alta_6_paneles_verticales_cortes_curvos_dorados_verde_oliva.jpeg',
    ],
  },
  {
    id: 'ESP-05',
    nombre: 'Ladrillo Entrelazado / Trenzado y Ajedrez',
    familiaCarpeta: '08_espaldares_bloques_ladrillo_y_cuadricula/A_trenzado_ladrillo_entrelazado',
    descripcion: 'Bloques acolchados de alto relieve dispuestos en patrón trenzado o ajedrez bicolor con ranuras profundas.',
    esImperialAncho: false,
    incluyePanelesLed: false,
    soportaBicolor: true,
    soportaBotonesCristal: false,
    precioBase2Plazas: 940,
    fotosReales: [
      '/catalogo_dorwin/08_espaldares_bloques_ladrillo_y_cuadricula/A_trenzado_ladrillo_entrelazado/044_juego_ladrillo_vertical_negro_marco_blanco_colchon_relax.jpeg',
      '/catalogo_dorwin/08_espaldares_bloques_ladrillo_y_cuadricula/A_trenzado_ladrillo_entrelazado/032_espaldar_bloques_asimetricos_espejo_bronce_beige_champan.jpeg',
      '/catalogo_dorwin/08_espaldares_bloques_ladrillo_y_cuadricula/A_trenzado_ladrillo_entrelazado/035_juego_bloques_dorados_con_banqueta_baul_gris_carbon.jpeg',
      '/catalogo_dorwin/08_espaldares_bloques_ladrillo_y_cuadricula/A_trenzado_ladrillo_entrelazado/051_juego_bloques_entrelazados_espejo_negro_con_piecera_relax.jpeg',
      '/catalogo_dorwin/08_espaldares_bloques_ladrillo_y_cuadricula/A_trenzado_ladrillo_entrelazado/137_espaldar_7_columnas_ajedrez_bicolor_gris_y_negro.jpeg',
      '/catalogo_dorwin/08_espaldares_bloques_ladrillo_y_cuadricula/A_trenzado_ladrillo_entrelazado/138_espaldar_5_columnas_ajedrez_bicolor_blanco_y_rosa.jpeg',
      '/catalogo_dorwin/08_espaldares_bloques_ladrillo_y_cuadricula/A_trenzado_ladrillo_entrelazado/163_juego_ladrillo_vertical_3_filas_gris_perla.jpeg',
    ],
  },
  {
    id: 'ESP-06',
    nombre: 'Capitoné Clásico de Rombos con Botones',
    familiaCarpeta: '05_espaldares_capitone_rombos_botones',
    descripcion: 'Elegancia atemporal con acolchado profundo de rombos y opción de botones tapizados al tono o cristales tipo diamante.',
    esImperialAncho: false,
    incluyePanelesLed: false,
    soportaBicolor: false,
    soportaBotonesCristal: true,
    precioBase2Plazas: 960,
    fotosReales: [
      '/catalogo_dorwin/05_espaldares_capitone_rombos_botones/161_juego_tarima_piecera_veladores_capitone_cristal_azul_noche.jpeg',
      '/catalogo_dorwin/05_espaldares_capitone_rombos_botones/069_juego_capitone_rombos_bordes_redondeados_marron_cafe_classic.jpeg',
      '/catalogo_dorwin/05_espaldares_capitone_rombos_botones/072_juego_capitone_rombos_bordes_redondeados_beige_crema_classic.jpeg',
      '/catalogo_dorwin/05_espaldares_capitone_rombos_botones/122_espaldar_capitone_rombos_con_marco_gris_perla.jpeg',
      '/catalogo_dorwin/05_espaldares_capitone_rombos_botones/124_espaldar_capitone_rombos_botones_cristal_con_marco_rosa_palo.jpeg',
      '/catalogo_dorwin/05_espaldares_capitone_rombos_botones/036_juego_rombos_con_apliques_dorados_negro_sonho_bom.jpeg',
      '/catalogo_dorwin/05_espaldares_capitone_rombos_botones/018_collage_6_modelos_capitone_y_bastones_varios_colores.jpeg',
    ],
  },
  {
    id: 'ESP-07',
    nombre: 'Cuadrícula Simétrica Minimalista',
    familiaCarpeta: '08_espaldares_bloques_ladrillo_y_cuadricula/B_cuadricula_cuadros_y_baul',
    descripcion: 'Paneles cuadrados acolchados de corte arquitectónico limpio (2×3 o 2×4) con marco perimetral.',
    esImperialAncho: false,
    incluyePanelesLed: false,
    soportaBicolor: false,
    soportaBotonesCristal: true,
    precioBase2Plazas: 880,
    fotosReales: [
      '/catalogo_dorwin/08_espaldares_bloques_ladrillo_y_cuadricula/B_cuadricula_cuadros_y_baul/028_juego_cuadricula_2x3_con_marco_negro_confort_real.jpeg',
      '/catalogo_dorwin/08_espaldares_bloques_ladrillo_y_cuadricula/B_cuadricula_cuadros_y_baul/020_juego_cuadricula_2x3_con_baul_durazno_salmon.jpeg',
      '/catalogo_dorwin/08_espaldares_bloques_ladrillo_y_cuadricula/B_cuadricula_cuadros_y_baul/040_juego_minimalista_2_paneles_con_baul_blanco_marfil_casata.jpeg',
      '/catalogo_dorwin/08_espaldares_bloques_ladrillo_y_cuadricula/B_cuadricula_cuadros_y_baul/045_cama_1_5p_cuadros_botones_4x3_gris_plata_vista_frontal.jpeg',
      '/catalogo_dorwin/08_espaldares_bloques_ladrillo_y_cuadricula/B_cuadricula_cuadros_y_baul/115_espaldar_cuadricula_2x6_con_botones_verde_petroleo.jpeg',
      '/catalogo_dorwin/08_espaldares_bloques_ladrillo_y_cuadricula/B_cuadricula_cuadros_y_baul/120_espaldar_cuadricula_2x4_gris_perla.jpeg',
    ],
  },
  {
    id: 'ESP-08',
    nombre: 'Imperial Chevron "V" Central + Franjas Espejo',
    familiaCarpeta: '03_camas_imperiales_veladores_led/B_chevron_V_central_espejo',
    descripcion: 'Cabecera imperial extra ancha con "V" central profunda y alas laterales de paneles horizontales con listones de espejo y luces.',
    esImperialAncho: true,
    incluyePanelesLed: true,
    soportaBicolor: true,
    soportaBotonesCristal: false,
    precioBase2Plazas: 1490,
    fotosReales: [
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/B_chevron_V_central_espejo/054_imperial_chevron_V_beige_vison_espejo_colchon_relax.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/B_chevron_V_central_espejo/060_imperial_chevron_V_rosa_viejo_con_piecera_colchon_classic.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/B_chevron_V_central_espejo/164_imperial_chevron_V_verde_oliva_ceniza_espejo_colchon_relax.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/B_chevron_V_central_espejo/086_imperial_franjas_diagonales_beige_lino_colchon_relax.jpeg',
    ],
  },
  {
    id: 'ESP-09',
    nombre: 'Imperial con Marco de Madera Alistonada (WPC)',
    familiaCarpeta: '03_camas_imperiales_veladores_led/D_laterales_madera_alistonada_WPC',
    descripcion: 'Fusión contemporánea de paneles laterales en madera alistonada WPC con lámparas modernas y centro geométrico con perfiles dorados.',
    esImperialAncho: true,
    incluyePanelesLed: true,
    soportaBicolor: true,
    soportaBotonesCristal: false,
    precioBase2Plazas: 1550,
    fotosReales: [
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/D_laterales_madera_alistonada_WPC/077_imperial_madera_alistonada_picos_rombos_dorados_negro_classic.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/D_laterales_madera_alistonada_WPC/074_imperial_madera_alistonada_abanico_degrade_gris_beige_classic.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/D_laterales_madera_alistonada_WPC/075_imperial_madera_alistonada_paneles_verticales_negro_classic.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/D_laterales_madera_alistonada_WPC/078_imperial_madera_alistonada_estrella_hexagonal_negro_classic.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/D_laterales_madera_alistonada_WPC/083_imperial_madera_alistonada_picos_rombos_dorados_rosa_viejo_classic.jpeg',
    ],
  },
  {
    id: 'ESP-10',
    nombre: 'Imperial Gran Rombo Central Concéntrico',
    familiaCarpeta: '03_camas_imperiales_veladores_led/C_rombo_central_geometrico',
    descripcion: 'Imponente rombo central en relieve rodeado de triángulos simétricos y torres laterales con iluminación y tomacorrientes.',
    esImperialAncho: true,
    incluyePanelesLed: true,
    soportaBicolor: true,
    soportaBotonesCristal: false,
    precioBase2Plazas: 1480,
    fotosReales: [
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/C_rombo_central_geometrico/055_imperial_gran_rombo_central_gris_con_piecera_colchon_bamboo.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/C_rombo_central_geometrico/088_imperial_gran_rombo_central_gris_plomo_veladores_bamboo.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/C_rombo_central_geometrico/025_imperial_rombos_relieve_negro_colchon_naturfresh.jpeg',
      '/catalogo_dorwin/03_camas_imperiales_veladores_led/C_rombo_central_geometrico/085_espaldar_gran_rombo_central_gris_plomo_detalle.jpeg',
    ],
  },
  {
    id: 'ESP-11',
    nombre: 'Panal Hexagonal Geométrico 3D',
    familiaCarpeta: '09_espaldares_geometricos_hexagonales_y_especiales',
    descripcion: 'Módulos hexagonales tipo panal de abeja con marco perimetral en contraste para dormitorios modernos.',
    esImperialAncho: false,
    incluyePanelesLed: false,
    soportaBicolor: true,
    soportaBotonesCristal: false,
    precioBase2Plazas: 960,
    fotosReales: [
      '/catalogo_dorwin/09_espaldares_geometricos_hexagonales_y_especiales/009_espaldar_panal_hexagonal_alargado_gris_plata_marco_negro.jpeg',
      '/catalogo_dorwin/09_espaldares_geometricos_hexagonales_y_especiales/095_espaldar_panal_2_hexagonos_blanco_hueso.jpeg',
      '/catalogo_dorwin/09_espaldares_geometricos_hexagonales_y_especiales/099_espaldar_4_cuadros_y_red_hexagonal_beige_arena.jpeg',
      '/catalogo_dorwin/09_espaldares_geometricos_hexagonales_y_especiales/106_espaldar_flecha_hexagonal_convergente_negro_terciopelo.jpeg',
    ],
  },
  {
    id: 'ESP-12',
    nombre: 'Reloj de Arena / Sobre en "X" con Espejo',
    familiaCarpeta: '09_espaldares_geometricos_hexagonales_y_especiales',
    descripcion: 'Geometría en "X" o reloj de arena horizontal con incrustaciones de espejo y marco bicolor.',
    esImperialAncho: false,
    incluyePanelesLed: false,
    soportaBicolor: true,
    soportaBotonesCristal: false,
    precioBase2Plazas: 990,
    fotosReales: [
      '/catalogo_dorwin/09_espaldares_geometricos_hexagonales_y_especiales/156_juego_tarima_piecera_reloj_de_arena_espejo_gris_perla.jpeg',
      '/catalogo_dorwin/09_espaldares_geometricos_hexagonales_y_especiales/147_espaldar_reloj_de_arena_bicolor_blanco_marco_negro.jpeg',
      '/catalogo_dorwin/09_espaldares_geometricos_hexagonales_y_especiales/110_espaldar_corbatin_reloj_de_arena_azul_marino_denim.jpeg',
      '/catalogo_dorwin/09_espaldares_geometricos_hexagonales_y_especiales/114_espaldar_doble_sobre_en_X_beige_avena.jpeg',
      '/catalogo_dorwin/09_espaldares_geometricos_hexagonales_y_especiales/123_espaldar_rombo_central_en_X_marron_vison.jpeg',
    ],
  },
];

export const BASE_TYPES: BaseTypeSpec[] = [
  {
    id: 'BASE-01',
    nombre: 'Base Somier Tapizada Estándar',
    descripcion: 'Estructura reforzada tapizada a juego con esquineros de protección y patas torneadas de madera o cromadas (dividida en Queen/King).',
    precioBase2Plazas: 750,
    alturaCm: 28,
    tieneCajones: false,
    esBordeNube: false,
  },
  {
    id: 'BASE-02',
    nombre: 'Base Somier Baúl / Boulera con Cajones',
    descripcion: 'Aprovecha el espacio bajo tu colchón con compartimento baúl/cajones integrados y agarraderas metálicas.',
    precioBase2Plazas: 1050,
    alturaCm: 32,
    tieneCajones: true,
    esBordeNube: false,
  },
  {
    id: 'BASE-03',
    nombre: 'Cama Tarima Nube / Bouclé Acolchada',
    descripcion: 'Bordes perimetrales gruesos abullonados tipo nube con parrilla interna de listones de madera.',
    precioBase2Plazas: 1180,
    alturaCm: 30,
    tieneCajones: false,
    esBordeNube: true,
  },
  {
    id: 'BASE-04',
    nombre: 'Somier / Catre de Madera Clásica',
    descripcion: 'Estructura sólida en madera seleccionada acabado caoba/wengué de máxima durabilidad.',
    precioBase2Plazas: 890,
    alturaCm: 28,
    tieneCajones: false,
    esBordeNube: false,
  },
  {
    id: 'BASE-05',
    nombre: 'Somier / Catre Metálico Reforzado',
    descripcion: 'Bastidor de acero anticorrosivo de alta resistencia estructural.',
    precioBase2Plazas: 680,
    alturaCm: 26,
    tieneCajones: false,
    esBordeNube: false,
  },
];

export const NIGHTSTAND_OPTIONS = [
  { id: 'VEL-NONE' as NightstandTypeId, nombre: 'Sin Veladores', precioPar: 0, cajones: 0 },
  { id: 'VEL-2CAJ' as NightstandTypeId, nombre: 'Par de Veladores Tapizados (2 Cajones)', precioPar: 580, cajones: 2 },
  { id: 'VEL-3CAJ' as NightstandTypeId, nombre: 'Par de Veladores Imperiales (3 Cajones + Luz)', precioPar: 760, cajones: 3 },
  { id: 'VEL-MELAMINA' as NightstandTypeId, nombre: 'Par de Veladores Modernos Melamina Bicolor', precioPar: 540, cajones: 2 },
];

export const FOOTBOARD_OPTIONS = [
  { id: 'PIEC-NONE' as FootboardTypeId, nombre: 'Sin Piecera / Baúl Frontal', precio: 0 },
  { id: 'PIEC-ACOLCHADA' as FootboardTypeId, nombre: 'Piecera Acolchada a Juego con el Espaldar', precio: 360 },
  { id: 'PIEC-BAUL' as FootboardTypeId, nombre: 'Banqueta Baúl Pie de Cama con Patas Doradas', precio: 490 },
  { id: 'PIEC-DIVAN' as FootboardTypeId, nombre: 'Diván Pie de Cama con Apoyabrazos', precio: 650 },
];

export const PILLOW_OPTIONS = [
  { id: 'ALM-NONE' as PillowTypeId, nombre: 'Sin Almohadas adicionales', precioPar: 0, foto: '' },
  { id: 'ALM-DORWIN' as PillowTypeId, nombre: '2x Almohadas DORWIN Matelassê (50×70 cm)', precioPar: 180, foto: '/catalogo_dorwin/02_info_espumas_y_almohadas/105_almohadas_dorwin_matelasse_50x70_con_espaldar_sol_naciente.jpeg' },
  { id: 'ALM-VISCO' as PillowTypeId, nombre: '2x Almohadas Viscoelásticas Cervicales Memory Foam', precioPar: 260, foto: '/catalogo_dorwin/02_info_espumas_y_almohadas/101_almohadas_celta_viscoelastica_y_pare_fibra_siliconada_50x70.jpeg' },
  { id: 'ALM-PARE' as PillowTypeId, nombre: '2x Almohadas PARE Fibra Siliconada Brasilera (50×70 cm)', precioPar: 140, foto: '/catalogo_dorwin/02_info_espumas_y_almohadas/100_muestras_espuma_D12_D19_D40_SOFT_y_almohadas_dorwin_pare.jpeg' },
  { id: 'ALM-RODILLO' as PillowTypeId, nombre: '2x Almohadas DORWIN + 2x Cojines Cilíndricos Decorativos', precioPar: 240, foto: '/catalogo_dorwin/06_espaldares_chevron_espiga_y_cortes_en_V/039_juego_chevron_espiga_beige_arena_cojines_cilindricos_pocket.jpeg' },
];
