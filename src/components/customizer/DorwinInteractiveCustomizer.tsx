'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  BED_SIZES,
  MATTRESS_MODELS,
  HEADBOARD_ARCHETYPES,
  BASE_TYPES,
  NIGHTSTAND_OPTIONS,
  FOOTBOARD_OPTIONS,
  PILLOW_OPTIONS,
  FABRIC_OPTIONS,
  COLOR_PALETTE,
  DORWIN_COMPANY_INFO,
  HeadboardArchetypeId,
  BaseTypeId,
  MattressModelId,
  NightstandTypeId,
  FootboardTypeId,
  PillowTypeId,
  FabricTypeId,
  MetalAccentId,
} from '@/lib/dorwin-customizer-data';
import {
  DorwinBedScene3D,
  DorwinBedScene3DHandle,
  BedCustomizerConfig,
  ViewMode3D,
  RoomAmbiance,
} from './DorwinBedScene3D';
import {
  Sparkles,
  Layers,
  Box,
  Palette,
  HeartPulse,
  Camera,
  Lightbulb,
  Check,
  ShieldCheck,
  Weight,
  Ruler,
  Eye,
  MessageCircle,
  Sliders,
  Maximize2,
  X,
  CheckCircle2,
  Info,
  Sun,
  Sunset,
  Moon,
  Database,
  User,
  Phone,
  MapPin,
} from 'lucide-react';

export function DorwinInteractiveCustomizer({ compact = false }: { compact?: boolean }) {
  const sceneRef = useRef<DorwinBedScene3DHandle>(null);

  // State for modular configuration
  const [sizeId, setSizeId] = useState<string>('2.5P');
  const [headboardId, setHeadboardId] = useState<HeadboardArchetypeId>('ESP-01');
  const [baseId, setBaseId] = useState<BaseTypeId>('BASE-01');
  const [mattressId, setMattressId] = useState<MattressModelId>('casata_pedic');
  const [nightstandId, setNightstandId] = useState<NightstandTypeId>('VEL-2CAJ');
  const [footboardId, setFootboardId] = useState<FootboardTypeId>('PIEC-NONE');
  const [pillowId, setPillowId] = useState<PillowTypeId>('ALM-DORWIN');

  // Fabric & Colors
  const [fabricId, setFabricId] = useState<FabricTypeId>('velvet');
  const [primaryColorHex, setPrimaryColorHex] = useState<string>('#144256'); // Azul Petróleo Imperial
  const [secondaryColorHex, setSecondaryColorHex] = useState<string>('#F4F1EA'); // Blanco Marfil
  const [useBicolor, setUseBicolor] = useState<boolean>(false);
  const [metalAccent, setMetalAccent] = useState<MetalAccentId>('gold');
  const [crystalButtons, setCrystalButtons] = useState<boolean>(false);
  const [ledOn, setLedOn] = useState<boolean>(true);
  const [woodLegs, setWoodLegs] = useState<boolean>(true);
  const [showFootRunner, setShowFootRunner] = useState<boolean>(true);

  // Penthouse Room Ambiance (Ventanales con paisaje sobre las nubes)
  const [roomAmbiance, setRoomAmbiance] = useState<RoomAmbiance>('day_clouds');

  // Piece inclusion toggles (Modularidad / Piezas sueltas o juego completo)
  const [includeHeadboard, setIncludeHeadboard] = useState<boolean>(true);
  const [includeBase, setIncludeBase] = useState<boolean>(true);
  const [includeMattress, setIncludeMattress] = useState<boolean>(true);
  const [includeNightstands, setIncludeNightstands] = useState<boolean>(true);
  const [includeFootboard, setIncludeFootboard] = useState<boolean>(false);
  const [includePillows, setIncludePillows] = useState<boolean>(true);

  // 3D View Mode & UI Tabs
  const [viewMode, setViewMode] = useState<ViewMode3D>('assembled');
  const [activeTab, setActiveTab] = useState<'espaldar' | 'colores' | 'salud_colchon' | 'base_acc' | 'resumen'>('espaldar');
  const [healthFilter, setHealthFilter] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Customer quote fields & PostgreSQL live sync status
  const [clienteNombre, setClienteNombre] = useState<string>('');
  const [clienteTelefono, setClienteTelefono] = useState<string>('');
  const [sucursalPreferida, setSucursalPreferida] = useState<string>('El Alto / La Paz');
  const [savedQuoteCode, setSavedQuoteCode] = useState<string | null>(null);
  const [savingQuote, setSavingQuote] = useState<boolean>(false);
  const [dbSyncInfo, setDbSyncInfo] = useState<{ connected: boolean; totalProductos: number; totalImagenes: number }>({
    connected: false,
    totalProductos: 0,
    totalImagenes: 0,
  });
  const [dbPriceOverrides, setDbPriceOverrides] = useState<Record<string, number>>({});
  const [dbPhotosByArchetype, setDbPhotosByArchetype] = useState<Record<string, string[]>>({});

  // Sync catalog products, images, and prices from PostgreSQL backend (/api/catalog/configurador-datos/)
  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    fetch(`${apiBase}/api/catalog/configurador-datos/`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || !Array.isArray(data.productos)) return;
        const priceMap: Record<string, number> = {};
        const photosMap: Record<string, string[]> = {};
        let imgCount = 0;

        for (const prod of data.productos) {
          const code = prod.codigo_arquetipo_3d;
          if (code && prod.precio_base_2plazas) {
            priceMap[code] = Number(prod.precio_base_2plazas);
          }
          if (Array.isArray(prod.imagenes) && prod.imagenes.length > 0) {
            imgCount += prod.imagenes.length;
            if (code) {
              photosMap[code] = prod.imagenes
                .map((im: { url_efectiva?: string; ruta_publica?: string }) => im.url_efectiva || im.ruta_publica || '')
                .filter(Boolean);
            }
          }
        }
        setDbPriceOverrides(priceMap);
        setDbPhotosByArchetype(photosMap);
        setDbSyncInfo({
          connected: true,
          totalProductos: data.productos.length,
          totalImagenes: imgCount,
        });
      })
      .catch(() => {
        // Fallback to local static data seamlessly if backend is offline
      });
  }, []);

  // Resolved specs (enriched with PostgreSQL DB overrides when connected)
  const selectedSize = useMemo(() => BED_SIZES.find((s) => s.id === sizeId) ?? BED_SIZES[3], [sizeId]);
  const selectedHeadboard = useMemo(() => {
    const baseHb = HEADBOARD_ARCHETYPES.find((h) => h.id === headboardId) ?? HEADBOARD_ARCHETYPES[0];
    const dbPhotos = dbPhotosByArchetype[baseHb.id];
    const dbPrice = dbPriceOverrides[baseHb.id];
    return {
      ...baseHb,
      precioBase2Plazas: dbPrice ?? baseHb.precioBase2Plazas,
      fotosReales: dbPhotos && dbPhotos.length > 0 ? dbPhotos : baseHb.fotosReales,
    };
  }, [headboardId, dbPhotosByArchetype, dbPriceOverrides]);
  const selectedBase = useMemo(() => {
    const b = BASE_TYPES.find((item) => item.id === baseId) ?? BASE_TYPES[0];
    const dbPrice = dbPriceOverrides[b.id];
    return {
      ...b,
      precioBase2Plazas: dbPrice ?? b.precioBase2Plazas,
    };
  }, [baseId, dbPriceOverrides]);
  const selectedMattress = useMemo(() => MATTRESS_MODELS.find((m) => m.id === mattressId) ?? MATTRESS_MODELS[0], [mattressId]);
  const selectedFabric = useMemo(() => FABRIC_OPTIONS.find((f) => f.id === fabricId) ?? FABRIC_OPTIONS[0], [fabricId]);
  const selectedNightstand = useMemo(() => NIGHTSTAND_OPTIONS.find((n) => n.id === nightstandId) ?? NIGHTSTAND_OPTIONS[0], [nightstandId]);
  const selectedFootboard = useMemo(() => FOOTBOARD_OPTIONS.find((f) => f.id === footboardId) ?? FOOTBOARD_OPTIONS[0], [footboardId]);
  const selectedPillow = useMemo(() => PILLOW_OPTIONS.find((p) => p.id === pillowId) ?? PILLOW_OPTIONS[0], [pillowId]);

  const primaryColorObj = useMemo(() => COLOR_PALETTE.find((c) => c.hex === primaryColorHex) ?? { nombre: 'Personalizado', hex: primaryColorHex }, [primaryColorHex]);
  const secondaryColorObj = useMemo(() => COLOR_PALETTE.find((c) => c.hex === secondaryColorHex) ?? { nombre: 'Personalizado', hex: secondaryColorHex }, [secondaryColorHex]);

  // Dynamic price breakdown in Bolivianos (Bs.)
  const pricing = useMemo(() => {
    const f = selectedSize.factorPrecioMueble;
    const headboardPrice = includeHeadboard ? Math.round(selectedHeadboard.precioBase2Plazas * f) : 0;
    const basePrice = includeBase ? Math.round(selectedBase.precioBase2Plazas * f) : 0;
    const mattressPrice = includeMattress ? (selectedMattress.preciosPorMedida[selectedSize.id] ?? 2400) : 0;
    const nightstandPrice = includeNightstands && nightstandId !== 'VEL-NONE' ? selectedNightstand.precioPar : 0;
    const footboardPrice = includeFootboard && footboardId !== 'PIEC-NONE' ? Math.round(selectedFootboard.precio * f) : 0;
    const pillowPrice = includePillows && pillowId !== 'ALM-NONE' ? selectedPillow.precioPar : 0;

    const total = headboardPrice + basePrice + mattressPrice + nightstandPrice + footboardPrice + pillowPrice;
    return {
      headboardPrice,
      basePrice,
      mattressPrice,
      nightstandPrice,
      footboardPrice,
      pillowPrice,
      total,
    };
  }, [
    selectedSize,
    selectedHeadboard,
    selectedBase,
    selectedMattress,
    selectedNightstand,
    selectedFootboard,
    selectedPillow,
    includeHeadboard,
    includeBase,
    includeMattress,
    includeNightstands,
    includeFootboard,
    includePillows,
    nightstandId,
    footboardId,
    pillowId,
  ]);

  const sceneConfig: BedCustomizerConfig = useMemo(
    () => ({
      size: selectedSize,
      headboardId,
      baseId,
      mattress: selectedMattress,
      nightstandId,
      footboardId,
      pillowId,
      fabric: selectedFabric,
      primaryColorHex,
      secondaryColorHex,
      useBicolor,
      metalAccent,
      crystalButtons,
      ledOn,
      woodLegs,
      showFootRunner,
      includeHeadboard,
      includeBase,
      includeMattress,
      includeNightstands,
      includeFootboard,
      includePillows,
      viewMode,
      roomAmbiance,
    }),
    [
      selectedSize,
      headboardId,
      baseId,
      selectedMattress,
      nightstandId,
      footboardId,
      pillowId,
      selectedFabric,
      primaryColorHex,
      secondaryColorHex,
      useBicolor,
      metalAccent,
      crystalButtons,
      ledOn,
      woodLegs,
      showFootRunner,
      includeHeadboard,
      includeBase,
      includeMattress,
      includeNightstands,
      includeFootboard,
      includePillows,
      viewMode,
      roomAmbiance,
    ]
  );

  const filteredMattresses = useMemo(() => {
    if (!healthFilter) return MATTRESS_MODELS;
    return MATTRESS_MODELS.filter((m) =>
      m.recomendadoPara.includes(healthFilter as 'dolor_lumbar' | 'dormir_lado' | 'calor_nocturno' | 'alto_peso' | 'economico')
    );
  }, [healthFilter]);

  const handleDownloadScreenshot = () => {
    const dataUrl = sceneRef.current?.captureScreenshot();
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `DORWIN-3D-${headboardId}-${mattressId}-${sizeId}.png`;
    link.href = dataUrl;
    link.click();
  };

  const buildWhatsAppMessage = (quoteCode?: string | null) => {
    const lines = [
      `Hola *DORWIN Colchões* 👋, armé mi diseño personalizado en el *Estudio 3D Interactivo* y deseo cotizarlo:`,
      quoteCode ? `🔖 *Código de Cotización DB:* ${quoteCode}` : '',
      clienteNombre.trim() ? `👤 *Cliente:* ${clienteNombre.trim()}` : '',
      clienteTelefono.trim() ? `📱 *Teléfono:* ${clienteTelefono.trim()}` : '',
      `📍 *Sucursal:* ${sucursalPreferida}`,
      `📐 *Medida:* ${selectedSize.etiqueta} (${selectedSize.anchoCm}x${selectedSize.largoCm} cm)`,
      includeHeadboard ? `👑 *Espaldar:* ${selectedHeadboard.nombre} (${selectedHeadboard.id}) - Bs. ${pricing.headboardPrice}` : '',
      includeBase ? `🛏️ *Base/Catre:* ${selectedBase.nombre} - Bs. ${pricing.basePrice}` : '',
      includeMattress
        ? `🩺 *Colchón Ergonómico:* ${selectedMattress.nombre} (${selectedMattress.firmeza}, Soporte ${selectedMattress.soporteKgPersona}kg, ${selectedMattress.garantiaAnios} años garantía) - Bs. ${pricing.mattressPrice}`
        : '',
      includeNightstands && nightstandId !== 'VEL-NONE'
        ? `🗄️ *Veladores:* ${selectedNightstand.nombre} - Bs. ${pricing.nightstandPrice}`
        : '',
      includeFootboard && footboardId !== 'PIEC-NONE'
        ? `🛋️ *Pie de Cama:* ${selectedFootboard.nombre} - Bs. ${pricing.footboardPrice}`
        : '',
      includePillows && pillowId !== 'ALM-NONE'
        ? `☁️ *Almohadas:* ${selectedPillow.nombre} - Bs. ${pricing.pillowPrice}`
        : '',
      `🎨 *Tapizado y Color:* ${selectedFabric.nombre} | Color Principal: ${primaryColorObj.nombre} (${primaryColorHex})${
        useBicolor ? ` + Secundario: ${secondaryColorObj.nombre} (${secondaryColorHex})` : ''
      }`,
      `✨ *Acabados:* Moldura ${metalAccent.toUpperCase()} | LED: ${ledOn ? 'Sí' : 'No'}`,
      `💰 *TOTAL ESTIMADO:* *Bs. ${pricing.total.toLocaleString('es-BO')}*`,
    ].filter(Boolean);
    return encodeURIComponent(lines.join('\n'));
  };

  const handleSaveAndSendWhatsApp = async () => {
    setSavingQuote(true);
    let code = savedQuoteCode;
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiBase}/api/catalog/cotizaciones-personalizadas/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_nombre: clienteNombre.trim(),
          cliente_telefono: clienteTelefono.trim(),
          medida: selectedSize.nombre,
          espaldar_codigo: includeHeadboard ? selectedHeadboard.id : null,
          base_codigo: includeBase ? selectedBase.id : null,
          colchon_modelo: includeMattress ? selectedMattress.nombre : null,
          tela: selectedFabric.nombre,
          color_primario: `${primaryColorObj.nombre} (${primaryColorHex})`,
          color_secundario: useBicolor ? `${secondaryColorObj.nombre} (${secondaryColorHex})` : '',
          acabado_metalico: metalAccent,
          incluye_veladores: includeNightstands && nightstandId !== 'VEL-NONE',
          incluye_piecera: includeFootboard && footboardId !== 'PIEC-NONE',
          incluye_almohadas: includePillows && pillowId !== 'ALM-NONE',
          precio_estimado_bs: pricing.total,
          configuracion_json: {
            ...sceneConfig,
            sucursalPreferida,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        code = data.codigo || `DW-${Math.floor(1000 + Math.random() * 9000)}`;
        setSavedQuoteCode(code);
      } else {
        code = `DW-3D-${Math.floor(1000 + Math.random() * 9000)}`;
        setSavedQuoteCode(code);
      }
    } catch {
      code = `DW-3D-${Math.floor(1000 + Math.random() * 9000)}`;
      setSavedQuoteCode(code);
    } finally {
      setSavingQuote(false);
      const url = `https://wa.me/${DORWIN_COMPANY_INFO.whatsappPrincipal}?text=${buildWhatsAppMessage(code)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-6">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-dark via-brand to-brand-medium p-6 text-white shadow-xl lg:flex-row lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wider text-gold-light uppercase backdrop-blur-sm">
              <Sparkles className="size-3.5" /> Suite Penthouse 3D & Salud Postural DORWIN®
            </div>
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold backdrop-blur-sm ${
                dbSyncInfo.connected
                  ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/30'
                  : 'bg-white/10 text-white/80'
              }`}
              title="Conectado a la base de datos PostgreSQL de LEM_backend"
            >
              <Database className="size-3" />
              <span>
                {dbSyncInfo.connected
                  ? `PostgreSQL Activo (${dbSyncInfo.totalProductos} prod • ${dbSyncInfo.totalImagenes} fotos en DB)`
                  : 'Catálogo Oficial DORWIN Sincronizado'}
              </span>
            </div>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Personaliza tu Cama, Espaldar y Colchón Ortopédico por Piezas
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-white/85">
            Visualiza tu dormitorio en una habitación Penthouse de lujo con ventanales sobre las nubes. Combina los 12 diseños reales de espaldar, 9 colchones certificados ISO 9001, bases baúl, veladores e iluminación realista.
          </p>
        </div>

        {/* Live Total & Quick WhatsApp */}
        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-black/25 p-4 backdrop-blur-md border border-white/15">
          <div>
            <span className="block text-xs text-gold-light uppercase font-medium">Inversión Total Estimada</span>
            <span className="text-3xl font-extrabold tracking-tight text-white">
              Bs. {pricing.total.toLocaleString('es-BO')}
            </span>
            <span className="block text-[11px] text-white/75">
              Medida: {selectedSize.etiqueta} ({selectedSize.anchoCm}×{selectedSize.largoCm} cm)
            </span>
          </div>
          <button
            onClick={handleSaveAndSendWhatsApp}
            disabled={savingQuote}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-400 active:scale-95 cursor-pointer"
          >
            <MessageCircle className="size-4" />
            {savingQuote ? 'Generando...' : 'Cotizar mi Diseño 3D'}
          </button>
        </div>
      </div>

      {/* Modular Piece Inclusion Toggles Bar (Compra por Piezas o Juego Completo) */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-neutral-700 uppercase">
          <Box className="size-4 text-brand" />
          <span>Piezas Activas en el 3D (Arma tu Juego o Pieza Suelta):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Espaldar', active: includeHeadboard, toggle: () => setIncludeHeadboard(!includeHeadboard), price: pricing.headboardPrice },
            { label: 'Base / Catre', active: includeBase, toggle: () => setIncludeBase(!includeBase), price: pricing.basePrice },
            { label: 'Colchón Ortopédico', active: includeMattress, toggle: () => setIncludeMattress(!includeMattress), price: pricing.mattressPrice },
            {
              label: 'Veladores',
              active: includeNightstands && nightstandId !== 'VEL-NONE',
              toggle: () => {
                if (nightstandId === 'VEL-NONE') {
                  setNightstandId('VEL-2CAJ');
                  setIncludeNightstands(true);
                } else {
                  setIncludeNightstands(!includeNightstands);
                }
              },
              price: pricing.nightstandPrice,
            },
            {
              label: 'Piecera / Baúl',
              active: includeFootboard && footboardId !== 'PIEC-NONE',
              toggle: () => {
                if (footboardId === 'PIEC-NONE') {
                  setFootboardId('PIEC-ACOLCHADA');
                  setIncludeFootboard(true);
                } else {
                  setIncludeFootboard(!includeFootboard);
                }
              },
              price: pricing.footboardPrice,
            },
            {
              label: 'Almohadas',
              active: includePillows && pillowId !== 'ALM-NONE',
              toggle: () => {
                if (pillowId === 'ALM-NONE') {
                  setPillowId('ALM-DORWIN');
                  setIncludePillows(true);
                } else {
                  setIncludePillows(!includePillows);
                }
              },
              price: pricing.pillowPrice,
            },
          ].map((piece) => (
            <button
              key={piece.label}
              onClick={piece.toggle}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                piece.active
                  ? 'border-brand bg-brand/10 text-brand-dark shadow-xs'
                  : 'border-neutral-200 bg-neutral-50 text-neutral-400 hover:bg-neutral-100'
              }`}
            >
              <span
                className={`flex size-4 items-center justify-center rounded-sm ${
                  piece.active ? 'bg-brand text-white' : 'border border-neutral-300 bg-white'
                }`}
              >
                {piece.active && <Check className="size-3" />}
              </span>
              <span>{piece.label}</span>
              {piece.active && piece.price > 0 && (
                <span className="ml-1 rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-bold text-neutral-700">
                  Bs.{piece.price}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left 3D Viewport (7 cols) + Right Control Studio (5 cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: 3D VIEWPORT + REAL FACTORY PHOTOS */}
        <div className="flex flex-col gap-5 lg:col-span-7">
          <div className="relative h-[520px] sm:h-[600px] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-[#0F172A] shadow-inner">
            {/* Top Mode Switcher Overlay: Armado vs Desacoplado por Piezas vs Rayos X Salud */}
            <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="flex flex-wrap gap-1.5 rounded-xl bg-white/90 p-1.5 shadow-md backdrop-blur-md pointer-events-auto border border-neutral-200/80">
                <button
                  onClick={() => setViewMode('assembled')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    viewMode === 'assembled'
                      ? 'bg-brand text-white shadow-xs'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Box className="size-3.5" />
                  <span>Conjunto Armado</span>
                </button>
                <button
                  onClick={() => setViewMode('exploded_pieces')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    viewMode === 'exploded_pieces'
                      ? 'bg-brand text-white shadow-xs'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Sliders className="size-3.5" />
                  <span>🧩 Desacoplar Piezas</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode('xray_mattress');
                    setIncludeMattress(true);
                  }}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    viewMode === 'xray_mattress'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  <Layers className="size-3.5" />
                  <span>🔬 Rayos X: Capas Salud</span>
                </button>
              </div>

              {/* Penthouse Sky Ambiance + LED Light Toggle & Screenshot */}
              <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
                <div className="flex items-center gap-1 rounded-xl border border-neutral-200/80 bg-white/90 p-1 shadow-md backdrop-blur-md">
                  {[
                    { id: 'day_clouds', label: 'Día Nubes', icon: Sun },
                    { id: 'sunset_clouds', label: 'Atardecer', icon: Sunset },
                    { id: 'night_clouds', label: 'Noche', icon: Moon },
                  ].map((amb) => {
                    const AmbIcon = amb.icon;
                    const active = roomAmbiance === amb.id;
                    return (
                      <button
                        key={amb.id}
                        onClick={() => setRoomAmbiance(amb.id as RoomAmbiance)}
                        className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition cursor-pointer ${
                          active
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                        title={`Cambiar iluminación del Penthouse: ${amb.label}`}
                      >
                        <AmbIcon className="size-3" />
                        <span className="hidden xl:inline">{amb.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setLedOn(!ledOn)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold shadow-md backdrop-blur-md transition cursor-pointer ${
                    ledOn
                      ? 'border-amber-400 bg-amber-400/95 text-neutral-950'
                      : 'border-neutral-200 bg-white/90 text-neutral-600'
                  }`}
                  title="Encender/Apagar Luces LED del Espaldar y Cielo Falso"
                >
                  <Lightbulb className="size-3.5" />
                  <span>{ledOn ? 'LED ON' : 'LED OFF'}</span>
                </button>
                <button
                  onClick={handleDownloadScreenshot}
                  className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white/90 px-3 py-2 text-xs font-bold text-neutral-800 shadow-md backdrop-blur-md hover:bg-white cursor-pointer"
                  title="Descargar captura PNG de tu diseño 3D"
                >
                  <Camera className="size-3.5 text-brand" />
                  <span className="hidden sm:inline">Foto 3D</span>
                </button>
              </div>
            </div>

            {/* 3D WebGL Canvas */}
            <DorwinBedScene3D ref={sceneRef} config={sceneConfig} />

            {/* X-Ray Floating Layer Legend when in xray_mattress mode */}
            {viewMode === 'xray_mattress' && includeMattress && (
              <div className="absolute top-16 left-3 z-10 max-w-xs rounded-xl border border-emerald-500/30 bg-neutral-900/90 p-3.5 text-white shadow-xl backdrop-blur-md">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    🔬 Ingeniería Interna: {selectedMattress.nombre}
                  </span>
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    {selectedMattress.alturaCm} cm
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedMattress.capasInternas.map((capa, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span
                        className="mt-1 size-3 shrink-0 rounded-full border border-white/40"
                        style={{ backgroundColor: capa.colorHex }}
                      />
                      <div>
                        <p className="font-semibold text-white leading-tight">{capa.nombre}</p>
                        <p className="text-[11px] text-neutral-300 leading-snug">{capa.beneficioSalud}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exploded Pieces Floating Legend when in exploded_pieces mode */}
            {viewMode === 'exploded_pieces' && (
              <div className="absolute top-16 left-3 z-10 max-w-xs rounded-xl border border-brand/30 bg-neutral-900/85 p-3 text-white shadow-xl backdrop-blur-md">
                <p className="text-xs font-bold text-gold-light uppercase">🧩 Vista Desacoplada por Piezas</p>
                <p className="mt-1 text-[11px] text-neutral-200 leading-relaxed">
                  Observa cada componente independiente: Espaldar ({selectedHeadboard.id}), Colchón ({selectedMattress.nombre}), Base ({selectedBase.nombre}) con parrilla/cajones, Veladores y Almohadas.
                </p>
              </div>
            )}

            {/* Bottom Camera Angles & Specs Bar */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="flex flex-wrap items-center gap-1 rounded-xl border border-neutral-200/80 bg-white/90 p-1 shadow-md backdrop-blur-md pointer-events-auto">
                {[
                  { id: 'perspective', label: 'Suite 3/4' },
                  { id: 'window', label: '🪟 Ventanal Nubes' },
                  { id: 'front', label: 'Frontal' },
                  { id: 'side', label: 'Perfil' },
                  { id: 'top', label: 'Planta' },
                ].map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => sceneRef.current?.setCameraPreset(cam.id as 'perspective' | 'front' | 'side' | 'top' | 'window')}
                    className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-neutral-700 hover:bg-brand/10 hover:text-brand cursor-pointer"
                  >
                    {cam.label}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-neutral-700 shadow-md backdrop-blur-md">
                🖱️ Rota 360° en el Penthouse • Rueda para Zoom
              </div>
            </div>
          </div>

          {/* REAL FACTORY PHOTOS GALLERY FOR SELECTED ARCHETYPE & MATTRESS */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Eye className="size-4 text-brand" />
                  <span>Fotos Reales de Fábrica — Familia {selectedHeadboard.id}: {selectedHeadboard.nombre}</span>
                </h3>
                <p className="text-xs text-neutral-500">
                  Carpeta etiquetada: <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] text-brand-dark">public/catalogo_dorwin/{selectedHeadboard.familiaCarpeta}</code> ({selectedHeadboard.fotosReales.length} fotos reales agrupadas)
                </p>
              </div>
              {includeMattress && (
                <button
                  onClick={() =>
                    setLightboxImage({
                      url: selectedMattress.fichaImagen,
                      title: `Ficha Técnica Oficial: Colchón ${selectedMattress.nombre}`,
                    })
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs font-bold text-brand hover:bg-brand/10 cursor-pointer"
                >
                  <Info className="size-3.5" />
                  <span>Ver Ficha Técnica {selectedMattress.nombre}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
              {selectedHeadboard.fotosReales.slice(0, 10).map((fotoUrl, i) => (
                <button
                  key={fotoUrl}
                  onClick={() =>
                    setLightboxImage({
                      url: fotoUrl,
                      title: `${selectedHeadboard.nombre} — Referencia Real #${i + 1}`,
                    })
                  }
                  className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 cursor-pointer"
                >
                  <img
                    src={fotoUrl}
                    alt={`${selectedHeadboard.nombre} ref ${i + 1}`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-white">
                      <Maximize2 className="size-3" /> Foto #{i + 1}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 5-STEP CUSTOMIZER STUDIO PANEL */}
        <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm lg:col-span-5">
          {/* Studio Navigation Tabs */}
          <div className="grid grid-cols-5 border-b border-neutral-200 bg-neutral-50/70 p-1.5 rounded-t-2xl gap-1">
            {[
              { id: 'espaldar', label: '1. Espaldar', icon: Box },
              { id: 'colores', label: '2. Colores', icon: Palette },
              { id: 'salud_colchon', label: '3. Colchón', icon: HeartPulse },
              { id: 'base_acc', label: '4. Catre/Acc', icon: Layers },
              { id: 'resumen', label: '5. Cotizar', icon: CheckCircle2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2.5 px-1 text-[11px] font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-900'
                  }`}
                >
                  <Icon className="size-4" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-5 max-h-[680px] space-y-5">
            {/* ============================================================
                TAB 1: 12 DISEÑOS DE ESPALDAR + MEDIDA DE LA CAMA
               ============================================================ */}
            {activeTab === 'espaldar' && (
              <div className="space-y-5">
                {/* Bed Size Selector */}
                <div>
                  <label className="mb-2 flex items-center justify-between text-xs font-bold tracking-wider text-neutral-700 uppercase">
                    <span className="flex items-center gap-1.5">
                      <Ruler className="size-4 text-brand" /> Tamaño / Plazas de la Cama
                    </span>
                    <span className="text-brand font-extrabold">
                      {selectedSize.anchoCm} × {selectedSize.largoCm} cm
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {BED_SIZES.map((sz) => (
                      <button
                        key={sz.id}
                        onClick={() => setSizeId(sz.id)}
                        className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition cursor-pointer ${
                          sizeId === sz.id
                            ? 'border-brand bg-brand/10 text-brand-dark ring-1 ring-brand'
                            : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <span className="text-xs font-extrabold">{sz.nombre}</span>
                        <span className="text-[10px] text-neutral-500">
                          {sz.anchoCm}×{sz.largoCm}cm
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 12 Standardized Headboard Archetypes */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-bold tracking-wider text-neutral-700 uppercase">
                      Elige el Diseño de Espaldar (12 Modelos Estandarizados)
                    </label>
                    <span className="text-xs font-bold text-brand">Bs. {pricing.headboardPrice}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {HEADBOARD_ARCHETYPES.map((hb) => {
                      const selected = headboardId === hb.id;
                      return (
                        <button
                          key={hb.id}
                          onClick={() => {
                            setHeadboardId(hb.id);
                            setIncludeHeadboard(true);
                          }}
                          className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition cursor-pointer ${
                            selected
                              ? 'border-brand bg-brand/5 ring-1 ring-brand'
                              : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                          }`}
                        >
                          <img
                            src={hb.fotosReales[0]}
                            alt={hb.nombre}
                            className="size-14 shrink-0 rounded-lg object-cover border border-neutral-200"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[10px] font-bold text-gold-light">
                                {hb.id}
                              </span>
                              <span className="text-[10px] font-semibold text-neutral-500">
                                {hb.fotosReales.length} fotos
                              </span>
                            </div>
                            <p className="mt-1 truncate text-xs font-bold text-neutral-900">
                              {hb.nombre}
                            </p>
                            <p className="line-clamp-2 text-[10px] text-neutral-500 leading-tight mt-0.5">
                              {hb.descripcion}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                TAB 2: COLORES, TELAS PBR Y ACABADOS METÁLICOS
               ============================================================ */}
            {activeTab === 'colores' && (
              <div className="space-y-5">
                {/* Fabric Type Selector */}
                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wider text-neutral-700 uppercase">
                    1. Tipo de Tela / Tapiz (Textura PBR)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {FABRIC_OPTIONS.map((fab) => (
                      <button
                        key={fab.id}
                        onClick={() => setFabricId(fab.id)}
                        className={`rounded-xl border p-2.5 text-left transition cursor-pointer ${
                          fabricId === fab.id
                            ? 'border-brand bg-brand/10 ring-1 ring-brand'
                            : 'border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <p className="text-xs font-bold text-neutral-900">{fab.nombre}</p>
                        <p className="mt-0.5 text-[10px] text-neutral-500 leading-tight">
                          {fab.descripcion}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Color Palette */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-bold tracking-wider text-neutral-700 uppercase">
                      2. Color Principal: <span className="text-brand">{primaryColorObj.nombre}</span>
                    </label>
                    <input
                      type="color"
                      value={primaryColorHex}
                      onChange={(e) => setPrimaryColorHex(e.target.value)}
                      className="h-6 w-10 cursor-pointer rounded border border-neutral-300"
                      title="Elegir cualquier color libre"
                    />
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {COLOR_PALETTE.map((swatch) => (
                      <button
                        key={swatch.id}
                        onClick={() => setPrimaryColorHex(swatch.hex)}
                        className={`group flex flex-col items-center gap-1 rounded-xl border p-1.5 transition cursor-pointer ${
                          primaryColorHex === swatch.hex
                            ? 'border-brand bg-brand/5 ring-1 ring-brand'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <span
                          className="size-7 rounded-full border border-black/15 shadow-inner"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="w-full truncate text-center text-[10px] font-medium text-neutral-700">
                          {swatch.nombre.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bicolor Toggle & Secondary Color */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Combinación Bicolor (2 Tonos)</p>
                      <p className="text-[11px] text-neutral-500">
                        Combina paneles centrales y frentes de cajones en un segundo tono
                      </p>
                    </div>
                    <button
                      onClick={() => setUseBicolor(!useBicolor)}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                        useBicolor ? 'bg-brand text-white' : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {useBicolor ? 'Activado' : 'Unicolor'}
                    </button>
                  </div>

                  {useBicolor && (
                    <div className="mt-3 pt-3 border-t border-neutral-200">
                      <span className="mb-2 block text-[11px] font-bold text-neutral-700">
                        Color Secundario: {secondaryColorObj.nombre}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {COLOR_PALETTE.map((swatch) => (
                          <button
                            key={swatch.id}
                            onClick={() => setSecondaryColorHex(swatch.hex)}
                            className={`size-7 rounded-full border transition cursor-pointer ${
                              secondaryColorHex === swatch.hex
                                ? 'scale-110 ring-2 ring-brand border-white'
                                : 'border-black/20 opacity-80 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: swatch.hex }}
                            title={swatch.nombre}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Metallic Accents, Buttons & Details */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase">
                    3. Listones Espejo, Botones y Detalles
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'gold', label: 'Dorado Espejo', color: '#E5B84B' },
                      { id: 'silver', label: 'Plata Espejo', color: '#E2E8F0' },
                      { id: 'bronze', label: 'Bronce Cobre', color: '#B87333' },
                      { id: 'none', label: 'Sin Moldura', color: '#52525B' },
                    ].map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => setMetalAccent(acc.id as MetalAccentId)}
                        className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-[11px] font-bold transition cursor-pointer ${
                          metalAccent === acc.id
                            ? 'border-brand bg-brand/10 text-brand-dark'
                            : 'border-neutral-200 text-neutral-600'
                        }`}
                      >
                        <span
                          className="size-4 rounded-full border border-black/20"
                          style={{ backgroundColor: acc.color }}
                        />
                        <span>{acc.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setCrystalButtons(!crystalButtons)}
                      className={`rounded-xl border p-2.5 text-xs font-semibold transition cursor-pointer ${
                        crystalButtons
                          ? 'border-brand bg-brand/10 text-brand-dark'
                          : 'border-neutral-200 text-neutral-700'
                      }`}
                    >
                      💎 Botones: {crystalButtons ? 'Cristal Strass' : 'Tapizados al Tono'}
                    </button>
                    <button
                      onClick={() => setShowFootRunner(!showFootRunner)}
                      className={`rounded-xl border p-2.5 text-xs font-semibold transition cursor-pointer ${
                        showFootRunner
                          ? 'border-brand bg-brand/10 text-brand-dark'
                          : 'border-neutral-200 text-neutral-700'
                      }`}
                    >
                      🧣 Pie de Cama: {showFootRunner ? 'Visible' : 'Oculto'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                TAB 3: COLCHÓN ERGONÓMICO Y SALUD POSTURAL (8 FICHAS OFICIALES)
               ============================================================ */}
            {activeTab === 'salud_colchon' && (
              <div className="space-y-4">
                {/* Quick Ergonomic & Health Filter */}
                <div className="rounded-xl bg-emerald-50/90 border border-emerald-200 p-3">
                  <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <HeartPulse className="size-4 text-emerald-600" />
                    <span>Recomendador Médico / Postural DORWIN:</span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {[
                      { id: null, label: 'Todos (9)' },
                      { id: 'dolor_lumbar', label: '🦴 Dolor Lumbar / Espalda' },
                      { id: 'dormir_lado', label: '🛌 Duermo de Lado' },
                      { id: 'calor_nocturno', label: '❄️ Sufro de Calor' },
                      { id: 'alto_peso', label: '💪 Alto Soporte (130-160kg)' },
                      { id: 'economico', label: '💰 Económico' },
                    ].map((f) => (
                      <button
                        key={String(f.id)}
                        onClick={() => setHealthFilter(f.id)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                          healthFilter === f.id
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mattress List */}
                <div className="space-y-2.5">
                  {filteredMattresses.map((mat) => {
                    const isSelected = mattressId === mat.id;
                    const priceForSize = mat.preciosPorMedida[selectedSize.id] ?? 2200;
                    return (
                      <div
                        key={mat.id}
                        onClick={() => {
                          setMattressId(mat.id);
                          setIncludeMattress(true);
                        }}
                        className={`rounded-xl border p-3 transition cursor-pointer ${
                          isSelected
                            ? 'border-brand bg-brand/5 ring-1 ring-brand'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={mat.fichaImagen}
                            alt={mat.nombre}
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxImage({
                                url: mat.fichaImagen,
                                title: `Ficha Técnica Oficial: ${mat.nombre}`,
                              });
                            }}
                            className="size-16 shrink-0 rounded-lg object-cover border border-neutral-200 hover:opacity-90"
                            title="Clic para ampliar ficha técnica oficial"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-extrabold text-neutral-900">
                                {mat.nombre}
                              </h4>
                              <span className="text-sm font-extrabold text-brand">
                                Bs. {priceForSize.toLocaleString('es-BO')}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-600">{mat.subtitulo}</p>
                            <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-bold">
                              <span className="inline-flex items-center gap-1 rounded bg-neutral-900 px-2 py-0.5 text-white">
                                <Weight className="size-3 text-gold-light" /> {mat.soporteKgPersona} kg/pers
                              </span>
                              <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-emerald-900">
                                <ShieldCheck className="size-3" /> {mat.garantiaAnios} años gar.
                              </span>
                              <span className="rounded bg-neutral-100 px-2 py-0.5 text-neutral-700">
                                {mat.firmeza} • {mat.alturaCm} cm
                              </span>
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="mt-3 flex items-center justify-between border-t border-brand/15 pt-2.5">
                            <span className="text-[11px] font-semibold text-neutral-600">
                              {mat.resorteTipo} + {mat.espumaDensidad}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewMode(viewMode === 'xray_mattress' ? 'assembled' : 'xray_mattress');
                              }}
                              className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500 cursor-pointer"
                            >
                              {viewMode === 'xray_mattress' ? 'Cerrar Rayos X' : '🔬 Ver Capas en 3D'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ============================================================
                TAB 4: BASE SOMIER / CATRE, VELADORES, PIECERA Y ALMOHADAS
               ============================================================ */}
            {activeTab === 'base_acc' && (
              <div className="space-y-5">
                {/* Base / Catre Selector */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-bold tracking-wider text-neutral-700 uppercase">
                      1. Tipo de Base Somier / Catre
                    </label>
                    <span className="text-xs font-bold text-brand">Bs. {pricing.basePrice}</span>
                  </div>
                  <div className="space-y-2">
                    {BASE_TYPES.map((bs) => (
                      <button
                        key={bs.id}
                        onClick={() => {
                          setBaseId(bs.id);
                          setIncludeBase(true);
                        }}
                        className={`w-full rounded-xl border p-2.5 text-left transition cursor-pointer ${
                          baseId === bs.id && includeBase
                            ? 'border-brand bg-brand/10 ring-1 ring-brand'
                            : 'border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900">{bs.nombre}</span>
                          <span className="text-xs font-bold text-brand">
                            Bs. {Math.round(bs.precioBase2Plazas * selectedSize.factorPrecioMueble)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-neutral-500">{bs.descripcion}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nightstands Selector */}
                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wider text-neutral-700 uppercase">
                    2. Veladores / Mesas de Noche
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {NIGHTSTAND_OPTIONS.map((ns) => (
                      <button
                        key={ns.id}
                        onClick={() => {
                          setNightstandId(ns.id);
                          setIncludeNightstands(ns.id !== 'VEL-NONE');
                        }}
                        className={`rounded-xl border p-2.5 text-left transition cursor-pointer ${
                          nightstandId === ns.id
                            ? 'border-brand bg-brand/10 ring-1 ring-brand'
                            : 'border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <p className="text-xs font-bold text-neutral-900">{ns.nombre}</p>
                        <p className="mt-1 text-[11px] font-bold text-brand">
                          {ns.precioPar > 0 ? `+ Bs. ${ns.precioPar}` : 'Bs. 0'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footboard / Baúl Pie de Cama Selector */}
                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wider text-neutral-700 uppercase">
                    3. Piecera / Banqueta Baúl / Diván al Pie
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {FOOTBOARD_OPTIONS.map((fb) => (
                      <button
                        key={fb.id}
                        onClick={() => {
                          setFootboardId(fb.id);
                          setIncludeFootboard(fb.id !== 'PIEC-NONE');
                        }}
                        className={`rounded-xl border p-2.5 text-left transition cursor-pointer ${
                          footboardId === fb.id
                            ? 'border-brand bg-brand/10 ring-1 ring-brand'
                            : 'border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <p className="text-xs font-bold text-neutral-900">{fb.nombre}</p>
                        <p className="mt-1 text-[11px] font-bold text-brand">
                          {fb.precio > 0
                            ? `+ Bs. ${Math.round(fb.precio * selectedSize.factorPrecioMueble)}`
                            : 'Bs. 0'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pillows Selector */}
                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wider text-neutral-700 uppercase">
                    4. Almohadas Ergonómicas Certificadas
                  </label>
                  <div className="space-y-2">
                    {PILLOW_OPTIONS.map((pil) => (
                      <button
                        key={pil.id}
                        onClick={() => {
                          setPillowId(pil.id);
                          setIncludePillows(pil.id !== 'ALM-NONE');
                        }}
                        className={`flex w-full items-center justify-between rounded-xl border p-2.5 text-left transition cursor-pointer ${
                          pillowId === pil.id
                            ? 'border-brand bg-brand/10 ring-1 ring-brand'
                            : 'border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="text-xs font-bold text-neutral-900">{pil.nombre}</span>
                        <span className="text-xs font-bold text-brand">
                          {pil.precioPar > 0 ? `+ Bs. ${pil.precioPar}` : 'Bs. 0'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                TAB 5: RESUMEN DESGLOSADO, ESCALABILIDAD GLB Y ENVÍO WHATSAPP/N8N
               ============================================================ */}
            {activeTab === 'resumen' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <h4 className="text-xs font-extrabold tracking-wider text-neutral-900 uppercase">
                    Desglose Modular de tu Configuración
                  </h4>
                  <dl className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                      <dt className="text-neutral-600">Medida Seleccionada:</dt>
                      <dd className="font-bold text-neutral-900">
                        {selectedSize.etiqueta} ({selectedSize.anchoCm}×{selectedSize.largoCm} cm)
                      </dd>
                    </div>
                    {includeHeadboard && (
                      <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                        <dt className="text-neutral-600">Espaldar ({selectedHeadboard.id}):</dt>
                        <dd className="font-bold text-neutral-900">
                          {selectedHeadboard.nombre} — Bs. {pricing.headboardPrice}
                        </dd>
                      </div>
                    )}
                    {includeBase && (
                      <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                        <dt className="text-neutral-600">Base / Catre:</dt>
                        <dd className="font-bold text-neutral-900">
                          {selectedBase.nombre} — Bs. {pricing.basePrice}
                        </dd>
                      </div>
                    )}
                    {includeMattress && (
                      <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                        <dt className="text-neutral-600">Colchón Ergonómico:</dt>
                        <dd className="font-bold text-emerald-700">
                          {selectedMattress.nombre} ({selectedMattress.soporteKgPersona}kg) — Bs. {pricing.mattressPrice}
                        </dd>
                      </div>
                    )}
                    {includeNightstands && nightstandId !== 'VEL-NONE' && (
                      <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                        <dt className="text-neutral-600">Veladores:</dt>
                        <dd className="font-bold text-neutral-900">
                          {selectedNightstand.nombre} — Bs. {pricing.nightstandPrice}
                        </dd>
                      </div>
                    )}
                    {includeFootboard && footboardId !== 'PIEC-NONE' && (
                      <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                        <dt className="text-neutral-600">Pie de Cama:</dt>
                        <dd className="font-bold text-neutral-900">
                          {selectedFootboard.nombre} — Bs. {pricing.footboardPrice}
                        </dd>
                      </div>
                    )}
                    {includePillows && pillowId !== 'ALM-NONE' && (
                      <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                        <dt className="text-neutral-600">Almohadas:</dt>
                        <dd className="font-bold text-neutral-900">
                          {selectedPillow.nombre} — Bs. {pricing.pillowPrice}
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                      <dt className="text-neutral-600">Tapiz y Colores:</dt>
                      <dd className="font-bold text-neutral-900">
                        {selectedFabric.nombre} • {primaryColorObj.nombre}
                        {useBicolor ? ` + ${secondaryColorObj.nombre}` : ''}
                      </dd>
                    </div>
                    <div className="flex justify-between pt-1 text-base font-extrabold text-brand-dark">
                      <dt>Total Estimado:</dt>
                      <dd>Bs. {pricing.total.toLocaleString('es-BO')}</dd>
                    </div>
                  </dl>
                </div>

                {/* Datos del Cliente para Registrar Cotización en PostgreSQL & WhatsApp */}
                <div className="rounded-xl border border-neutral-200 bg-white p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                      <User className="size-3.5 text-brand" />
                      <span>Datos para tu Cotización (Opcional)</span>
                    </span>
                    {savedQuoteCode && (
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                        Código DB: {savedQuoteCode}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="relative">
                      <User className="pointer-events-none absolute top-2.5 left-2.5 size-3.5 text-neutral-400" />
                      <input
                        type="text"
                        value={clienteNombre}
                        onChange={(e) => setClienteNombre(e.target.value)}
                        placeholder="Tu nombre completo"
                        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pr-3 pl-8 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-brand focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute top-2.5 left-2.5 size-3.5 text-neutral-400" />
                      <input
                        type="tel"
                        value={clienteTelefono}
                        onChange={(e) => setClienteTelefono(e.target.value)}
                        placeholder="Tu celular / WhatsApp"
                        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pr-3 pl-8 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-brand focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute top-2.5 left-2.5 size-3.5 text-neutral-400" />
                    <select
                      value={sucursalPreferida}
                      onChange={(e) => setSucursalPreferida(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pr-3 pl-8 text-xs font-medium text-neutral-800 focus:border-brand focus:bg-white focus:outline-none"
                    >
                      {DORWIN_COMPANY_INFO.sucursales.map((suc) => (
                        <option key={suc.ciudad} value={suc.ciudad}>
                          Sucursal {suc.ciudad} — {suc.direccion}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={handleSaveAndSendWhatsApp}
                    disabled={savingQuote}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-500 cursor-pointer"
                  >
                    <MessageCircle className="size-5" />
                    <span>Enviar Pedido Personalizado al Bot WhatsApp (+591 69866371)</span>
                  </button>
                  <button
                    onClick={handleDownloadScreenshot}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand bg-brand/5 py-3 px-4 text-xs font-bold text-brand-dark hover:bg-brand/10 cursor-pointer"
                  >
                    <Camera className="size-4" />
                    <span>Descargar Captura PNG de mi Diseño 3D</span>
                  </button>
                </div>

                {/* Store Locations from Flyer */}
                <div className="rounded-xl bg-neutral-100 p-3 text-[11px] text-neutral-600 space-y-1">
                  <p className="font-bold text-neutral-900">📍 Sucursales Oficiales DORWIN Colchões:</p>
                  {DORWIN_COMPANY_INFO.sucursales.map((suc) => (
                    <p key={suc.ciudad}>
                      <strong>{suc.ciudad}:</strong> {suc.direccion}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Real Factory Photos & Technical Spec Sheets */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-white p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between px-2">
              <h4 className="text-sm font-bold text-neutral-900">{lightboxImage.title}</h4>
              <button
                onClick={() => setLightboxImage(null)}
                className="rounded-lg bg-neutral-100 p-1.5 text-neutral-700 hover:bg-neutral-200 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.title}
              className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </section>
  );
}
