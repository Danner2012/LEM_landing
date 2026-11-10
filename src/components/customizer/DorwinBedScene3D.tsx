'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {
  HeadboardArchetypeId,
  BaseTypeId,
  NightstandTypeId,
  FootboardTypeId,
  PillowTypeId,
  FabricOption,
  MetalAccentId,
  MattressModelSpec,
  BedSizeOption,
} from '@/lib/dorwin-customizer-data';

export type ViewMode3D = 'assembled' | 'exploded_pieces' | 'xray_mattress';
export type RoomAmbiance = 'day_clouds' | 'sunset_clouds' | 'night_clouds';

export interface BedCustomizerConfig {
  size: BedSizeOption;
  headboardId: HeadboardArchetypeId;
  baseId: BaseTypeId;
  mattress: MattressModelSpec;
  nightstandId: NightstandTypeId;
  footboardId: FootboardTypeId;
  pillowId: PillowTypeId;
  fabric: FabricOption;
  primaryColorHex: string;
  secondaryColorHex: string;
  useBicolor: boolean;
  metalAccent: MetalAccentId;
  crystalButtons: boolean;
  ledOn: boolean;
  woodLegs: boolean;
  showFootRunner: boolean;
  includeHeadboard: boolean;
  includeBase: boolean;
  includeMattress: boolean;
  includeNightstands: boolean;
  includeFootboard: boolean;
  includePillows: boolean;
  viewMode: ViewMode3D;
  roomAmbiance?: RoomAmbiance;
}

export interface DorwinBedScene3DHandle {
  captureScreenshot: () => string | null;
  setCameraPreset: (preset: 'perspective' | 'front' | 'side' | 'top' | 'window') => void;
}

/**
 * Generates a high-resolution panoramic sky + sea of clouds texture (0 GPU cost per frame).
 */
function createCloudSkyPanorama(ambiance: RoomAmbiance): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Sky atmosphere gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  if (ambiance === 'day_clouds') {
    skyGrad.addColorStop(0.0, '#1E5799');
    skyGrad.addColorStop(0.32, '#4A90E2');
    skyGrad.addColorStop(0.54, '#A8D0F8');
    skyGrad.addColorStop(0.64, '#FFF3DF');
    skyGrad.addColorStop(0.75, '#E2E8F0');
    skyGrad.addColorStop(1.0, '#CBD5E1');
  } else if (ambiance === 'sunset_clouds') {
    skyGrad.addColorStop(0.0, '#1E1B4B');
    skyGrad.addColorStop(0.28, '#581C87');
    skyGrad.addColorStop(0.48, '#BE185D');
    skyGrad.addColorStop(0.6, '#F97316');
    skyGrad.addColorStop(0.68, '#FDE047');
    skyGrad.addColorStop(0.8, '#FED7AA');
    skyGrad.addColorStop(1.0, '#94A3B8');
  } else {
    // night_clouds
    skyGrad.addColorStop(0.0, '#030712');
    skyGrad.addColorStop(0.35, '#0F172A');
    skyGrad.addColorStop(0.58, '#1E293B');
    skyGrad.addColorStop(0.72, '#334155');
    skyGrad.addColorStop(1.0, '#1E293B');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // 2. Stars at night or glowing Sun in day/sunset
  if (ambiance === 'night_clouds') {
    ctx.fillStyle = '#FFFFFF';
    for (let s = 0; s < 350; s++) {
      const sx = (Math.sin(s * 78.233) * 0.5 + 0.5) * 2048;
      const sy = (Math.cos(s * 45.164) * 0.5 + 0.5) * 480;
      const r = (s % 3) * 0.8 + 0.6;
      ctx.globalAlpha = 0.4 + (s % 5) * 0.12;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Full Moon glow
    const moonGrad = ctx.createRadialGradient(520, 260, 10, 520, 260, 140);
    moonGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
    moonGrad.addColorStop(0.3, 'rgba(226, 232, 240, 0.45)');
    moonGrad.addColorStop(1, 'rgba(226, 232, 240, 0)');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(520, 260, 140, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const sunX = 560;
    const sunY = ambiance === 'sunset_clouds' ? 540 : 380;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 320);
    sunGrad.addColorStop(0, 'rgba(255, 255, 245, 1)');
    sunGrad.addColorStop(0.25, ambiance === 'sunset_clouds' ? 'rgba(253, 186, 116, 0.75)' : 'rgba(254, 243, 199, 0.65)');
    sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 320, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Distant mountain peaks rising through the clouds
  ctx.fillStyle =
    ambiance === 'day_clouds'
      ? 'rgba(100, 130, 165, 0.45)'
      : ambiance === 'sunset_clouds'
      ? 'rgba(76, 29, 149, 0.55)'
      : 'rgba(15, 23, 42, 0.75)';
  ctx.beginPath();
  ctx.moveTo(0, 660);
  const peaks = [
    [180, 540],
    [350, 610],
    [540, 495],
    [760, 590],
    [980, 510],
    [1220, 600],
    [1480, 505],
    [1720, 580],
    [1920, 530],
    [2048, 620],
  ];
  peaks.forEach(([px, py]) => ctx.lineTo(px, py));
  ctx.lineTo(2048, 1024);
  ctx.lineTo(0, 1024);
  ctx.closePath();
  ctx.fill();

  // 4. Multi-layered Sea of Fluffy Clouds (Arriba de las nubes)
  const cloudLayers = [
    {
      yBase: 615,
      radiusScale: 1.0,
      colorTop:
        ambiance === 'day_clouds'
          ? 'rgba(255, 255, 255, 0.92)'
          : ambiance === 'sunset_clouds'
          ? 'rgba(254, 215, 170, 0.88)'
          : 'rgba(71, 85, 105, 0.75)',
    },
    {
      yBase: 665,
      radiusScale: 1.25,
      colorTop:
        ambiance === 'day_clouds'
          ? 'rgba(248, 250, 252, 0.96)'
          : ambiance === 'sunset_clouds'
          ? 'rgba(253, 186, 116, 0.85)'
          : 'rgba(51, 65, 85, 0.88)',
    },
    {
      yBase: 725,
      radiusScale: 1.45,
      colorTop:
        ambiance === 'day_clouds'
          ? 'rgba(255, 255, 255, 0.99)'
          : ambiance === 'sunset_clouds'
          ? 'rgba(251, 146, 60, 0.75)'
          : 'rgba(30, 41, 59, 0.95)',
    },
  ];

  cloudLayers.forEach((layer, lIdx) => {
    ctx.fillStyle = layer.colorTop;
    for (let i = 0; i < 42; i++) {
      const cx = (i / 40) * 2048 + Math.sin(i * 12.5 + lIdx) * 30;
      const cy = layer.yBase + Math.cos(i * 4.7 + lIdx * 2) * 24;
      const rx = (65 + (i % 5) * 22) * layer.radiusScale;
      const ry = (38 + (i % 4) * 14) * layer.radiusScale;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillRect(0, layer.yBase + 10, 2048, 1024 - layer.yBase);
  });

  // High altitude wispy clouds in upper sky
  ctx.fillStyle =
    ambiance === 'day_clouds'
      ? 'rgba(255, 255, 255, 0.32)'
      : ambiance === 'sunset_clouds'
      ? 'rgba(254, 202, 202, 0.28)'
      : 'rgba(148, 163, 184, 0.12)';
  for (let w = 0; w < 18; w++) {
    const wx = ((w * 173) % 2048);
    const wy = 240 + (w % 5) * 48;
    ctx.beginPath();
    ctx.ellipse(wx, wy, 140 + (w % 3) * 50, 14 + (w % 2) * 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates a realistic warm oak/walnut hardwood parquet floor texture once.
 */
function createParquetFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#C8AF93';
  ctx.fillRect(0, 0, 1024, 1024);

  const plankRows = 8;
  const plankCols = 32;
  const pw = 1024 / plankRows;
  const ph = 1024 / plankCols;

  for (let r = 0; r < plankRows; r++) {
    for (let c = 0; c < plankCols; c++) {
      const shade = ((r * 7 + c * 13) % 18) - 9;
      const baseR = 194 + shade;
      const baseG = 166 + shade;
      const baseB = 136 + shade;
      ctx.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`;
      const x = r * pw;
      const y = c * ph + (r % 2 === 1 ? ph / 2 : 0);
      ctx.fillRect(x, y % 1024, pw - 2, ph - 1.5);

      ctx.strokeStyle = 'rgba(90, 65, 42, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y % 1024, pw - 2, ph - 1.5);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

/**
 * Generates a subtle warm travertine marble texture for the penthouse feature wall.
 */
function createWallMarbleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 1024, 512);
  grad.addColorStop(0, '#F5F2EB');
  grad.addColorStop(0.5, '#EDE8DF');
  grad.addColorStop(1, '#E5DEC9');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Subtle architectural panel lines & travertine veins
  ctx.strokeStyle = 'rgba(160, 145, 125, 0.16)';
  ctx.lineWidth = 2;
  for (let v = 0; v < 14; v++) {
    ctx.beginPath();
    const startY = (v / 14) * 512;
    ctx.moveTo(0, startY);
    for (let x = 0; x <= 1024; x += 64) {
      ctx.lineTo(x, startY + Math.sin(x * 0.01 + v) * 14);
    }
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

function createQuiltTexture(
  pattern: 'ondas' | 'rombos' | 'hexagonal' | 'bambu' | 'liso',
  baseHex: string,
  accentHex: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = 'rgba(120, 125, 135, 0.22)';
  ctx.lineWidth = 3;

  if (pattern === 'rombos') {
    const step = 64;
    for (let i = -512; i < 1024; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 512, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i + 512, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
    }
  } else if (pattern === 'ondas') {
    for (let y = 24; y < 512; y += 42) {
      ctx.beginPath();
      for (let x = 0; x <= 512; x += 16) {
        const wy = y + Math.sin((x / 512) * Math.PI * 4) * 10;
        if (x === 0) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }
  } else if (pattern === 'hexagonal') {
    const r = 32;
    const dx = r * 1.5;
    const dy = r * Math.sqrt(3);
    for (let row = 0; row < 12; row++) {
      for (let col = 0; col < 12; col++) {
        const cx = col * dx;
        const cy = row * dy + (col % 2 === 1 ? dy / 2 : 0);
        ctx.beginPath();
        for (let s = 0; s < 6; s++) {
          const ang = (Math.PI / 3) * s;
          const px = cx + r * Math.cos(ang);
          const py = cy + r * Math.sin(ang);
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  } else if (pattern === 'bambu') {
    ctx.strokeStyle = 'rgba(34, 139, 84, 0.22)';
    for (let y = 32; y < 512; y += 64) {
      for (let x = 32; x < 512; x += 96) {
        ctx.beginPath();
        ctx.ellipse(x, y, 22, 8, Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(x + 26, y - 10, 18, 6, -Math.PI / 5, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 6;
  ctx.strokeRect(12, 12, 488, 488);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

function createMattressLabelTexture(modelName: string, sideHex: string, accentHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = sideHex;
  ctx.fillRect(0, 0, 1024, 256);

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 2;
  for (let x = 0; x < 1024; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }

  const bx = 560;
  const by = 58;
  const bw = 390;
  const bh = 140;

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 14);
  ctx.fill();

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = '#8B1A1A';
  ctx.beginPath();
  ctx.arc(bx + 54, by + 70, 34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText('CD', bx + 30, by + 82);

  ctx.fillStyle = '#111827';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText('DORWIN®', bx + 102, by + 64);

  ctx.fillStyle = '#8B1A1A';
  ctx.font = 'italic 22px serif';
  ctx.fillText('colchões • ISO 9001', bx + 104, by + 90);

  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(modelName.toUpperCase(), bx + 102, by + 122);

  return new THREE.CanvasTexture(canvas);
}

export const DorwinBedScene3D = forwardRef<DorwinBedScene3DHandle, { config: BedCustomizerConfig }>(
  ({ config }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);

    const skyDomeMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
    const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
    const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

    const groupsRef = useRef<{
      headboard: THREE.Group;
      base: THREE.Group;
      mattress: THREE.Group;
      nightstandLeft: THREE.Group;
      nightstandRight: THREE.Group;
      footboard: THREE.Group;
      pillows: THREE.Group;
      mattressLayers: THREE.Group[];
    } | null>(null);

    const targetPositionsRef = useRef<{
      headboard: THREE.Vector3;
      base: THREE.Vector3;
      mattress: THREE.Vector3;
      nightstandLeft: THREE.Vector3;
      nightstandRight: THREE.Vector3;
      footboard: THREE.Vector3;
      pillows: THREE.Vector3;
      layerOffsets: number[];
    }>({
      headboard: new THREE.Vector3(),
      base: new THREE.Vector3(),
      mattress: new THREE.Vector3(),
      nightstandLeft: new THREE.Vector3(),
      nightstandRight: new THREE.Vector3(),
      footboard: new THREE.Vector3(),
      pillows: new THREE.Vector3(),
      layerOffsets: [0, 0, 0, 0],
    });

    useImperativeHandle(ref, () => ({
      captureScreenshot: () => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return null;
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        return rendererRef.current.domElement.toDataURL('image/png');
      },
      setCameraPreset: (preset) => {
        if (!cameraRef.current || !controlsRef.current) return;
        const cam = cameraRef.current;
        const ctrl = controlsRef.current;
        if (preset === 'perspective') {
          cam.position.set(2.55, 1.85, 2.95);
          ctrl.target.set(0, 0.65, -0.1);
        } else if (preset === 'window') {
          // Angle showing the bed + the giant floor-to-ceiling windows & clouds outside
          cam.position.set(3.2, 1.55, 2.15);
          ctrl.target.set(-0.85, 0.95, -0.45);
        } else if (preset === 'front') {
          cam.position.set(0, 1.3, 3.45);
          ctrl.target.set(0, 0.7, 0);
        } else if (preset === 'side') {
          cam.position.set(3.35, 1.15, 0.15);
          ctrl.target.set(0, 0.55, 0);
        } else if (preset === 'top') {
          cam.position.set(0, 3.7, 0.85);
          ctrl.target.set(0, 0.4, 0);
        }
        ctrl.update();
      },
    }));

    // Initialize WebGL Scene + Penthouse Architecture Above the Clouds (Runs Once)
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#D8E6F5');
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        40,
        container.clientWidth / Math.max(container.clientHeight, 1),
        0.1,
        80
      );
      camera.position.set(2.65, 1.75, 2.9);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.maxPolarAngle = Math.PI / 2 - 0.02;
      controls.minDistance = 1.4;
      controls.maxDistance = 6.2;
      controls.target.set(-0.15, 0.68, -0.1);
      controls.update();
      controlsRef.current = controls;

      // ======================================================================
      // PENTHOUSE LIGHTING (Realistic Sunbeams through the Floor-to-Ceiling Windows)
      // ======================================================================
      const ambientLight = new THREE.AmbientLight('#FFF9F0', 0.82);
      scene.add(ambientLight);
      ambientLightRef.current = ambientLight;

      const hemiLight = new THREE.HemisphereLight('#E0F2FE', '#D6CFC2', 0.65);
      hemiLight.position.set(0, 7, 0);
      scene.add(hemiLight);

      // Main Sunlight coming from outside the left panoramic window (-X, +Y, +Z)
      const sunLight = new THREE.DirectionalLight('#FFF5E0', 1.85);
      sunLight.position.set(-5.2, 4.4, 2.8);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      sunLight.shadow.camera.near = 0.5;
      sunLight.shadow.camera.far = 18;
      const d = 3.8;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0005;
      scene.add(sunLight);
      sunLightRef.current = sunLight;

      // Warm interior recessed ceiling fill light
      const interiorFill = new THREE.DirectionalLight('#FFF7ED', 0.65);
      interiorFill.position.set(3.5, 3.8, 2.5);
      scene.add(interiorFill);

      // ======================================================================
      // SKY DOME ABOVE THE CLOUDS (360° Exterior Panorama)
      // ======================================================================
      const skyGeo = new THREE.SphereGeometry(32, 40, 28);
      const skyMat = new THREE.MeshBasicMaterial({
        map: createCloudSkyPanorama('day_clouds'),
        side: THREE.BackSide,
      });
      const skyDome = new THREE.Mesh(skyGeo, skyMat);
      skyDome.rotation.y = Math.PI * 0.68; // Position sun & mountain peaks right outside the left & rear windows
      scene.add(skyDome);
      skyDomeMatRef.current = skyMat;

      // ======================================================================
      // SPACIOUS PENTHOUSE SUITE ARCHITECTURE (Zero-lag static meshes)
      // ======================================================================
      const roomGroup = new THREE.Group();
      scene.add(roomGroup);

      // 1. Interior Hardwood Parquet Floor (9m x 8m)
      const parquetTex = createParquetFloorTexture();
      const floorMat = new THREE.MeshStandardMaterial({
        map: parquetTex,
        roughness: 0.36,
        metalness: 0.06,
      });
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 8.5), floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(0.5, 0, 0.8);
      floor.receiveShadow = true;
      roomGroup.add(floor);

      // Exterior Balcony Terrace Floor (Outside the left & back panoramic windows)
      const terraceFloorMat = new THREE.MeshStandardMaterial({
        color: '#CBD5E1',
        roughness: 0.55,
        metalness: 0.1,
      });
      const terraceLeft = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 8.5), terraceFloorMat);
      terraceLeft.rotation.x = -Math.PI / 2;
      terraceLeft.position.set(-5.8, -0.01, 0.8);
      roomGroup.add(terraceLeft);

      // Glass Balcony Railing outside the window (so you feel high above the clouds!)
      const glassRailMat = new THREE.MeshPhysicalMaterial({
        color: '#E0F2FE',
        transparent: true,
        opacity: 0.28,
        roughness: 0.08,
        metalness: 0.1,
      });
      const railGlass = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.05, 8.4), glassRailMat);
      railGlass.position.set(-6.8, 0.52, 0.8);
      roomGroup.add(railGlass);

      const darkMetalMat = new THREE.MeshStandardMaterial({
        color: '#18181B',
        roughness: 0.3,
        metalness: 0.8,
      });
      const topHandrail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 8.4), darkMetalMat);
      topHandrail.position.set(-6.8, 1.06, 0.8);
      roomGroup.add(topHandrail);

      // 2. Luxury Area Rug under the Bed
      const rugOuter = new THREE.Mesh(
        new RoundedBoxGeometry(3.85, 0.016, 3.45, 2, 0.008),
        new THREE.MeshStandardMaterial({ color: '#E6E0D5', roughness: 0.92 })
      );
      rugOuter.position.set(0, 0.008, 0.22);
      rugOuter.receiveShadow = true;
      roomGroup.add(rugOuter);

      const rugInnerBorder = new THREE.Mesh(
        new RoundedBoxGeometry(3.55, 0.018, 3.15, 2, 0.008),
        new THREE.MeshStandardMaterial({ color: '#F5F2EB', roughness: 0.95 })
      );
      rugInnerBorder.position.set(0, 0.01, 0.22);
      rugInnerBorder.receiveShadow = true;
      roomGroup.add(rugInnerBorder);

      // 3. Back Feature Wall behind the Bed (Center Marble + Fluted Wood Side Columns + Picture Window on Left)
      const wallH = 3.9;
      const backZ = -1.32;
      const marbleTex = createWallMarbleTexture();
      const backWallMat = new THREE.MeshStandardMaterial({
        map: marbleTex,
        roughness: 0.5,
      });

      // Center solid feature wall behind headboard (width 4.8m, leaving left side open to panoramic corner window!)
      const centerBackWall = new THREE.Mesh(new THREE.BoxGeometry(5.2, wallH, 0.16), backWallMat);
      centerBackWall.position.set(0.9, wallH / 2, backZ);
      centerBackWall.receiveShadow = true;
      roomGroup.add(centerBackWall);

      // Warm Gold/Bronze Vertical Architectural Trim Strips on Back Wall
      const goldTrimMat = new THREE.MeshStandardMaterial({
        color: '#D4A93F',
        roughness: 0.2,
        metalness: 0.88,
      });
      [-1.35, 1.35, 2.65].forEach((tx) => {
        const strip = new THREE.Mesh(new THREE.BoxGeometry(0.025, wallH, 0.18), goldTrimMat);
        strip.position.set(tx, wallH / 2, backZ);
        roomGroup.add(strip);
      });

      // Baseboard (Zócalo con luz indirecta cálida)
      const baseboard = new THREE.Mesh(new THREE.BoxGeometry(5.22, 0.1, 0.19), darkMetalMat);
      baseboard.position.set(0.9, 0.05, backZ);
      roomGroup.add(baseboard);

      // 4. FLOOR-TO-CEILING PANORAMIC WINDOWS (Left Wall x = -3.85 & Rear-Left Corner)
      const winX = -3.85;
      const winTotalZ = 7.6;

      // Top & Bottom Window Frames
      const frameTop = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, winTotalZ), darkMetalMat);
      frameTop.position.set(winX, wallH - 0.07, 1.4);
      roomGroup.add(frameTop);

      const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, winTotalZ), darkMetalMat);
      frameBottom.position.set(winX, 0.05, 1.4);
      roomGroup.add(frameBottom);

      // Vertical Mullions (Columnas del ventanal panorámico que proyectan sombras elegantes)
      const mullionPositionsZ = [-2.4, -0.8, 0.8, 2.4, 4.0];
      mullionPositionsZ.forEach((mz) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, wallH, 0.09), darkMetalMat);
        post.position.set(winX, wallH / 2, mz);
        post.castShadow = true;
        roomGroup.add(post);
      });

      // Horizontal Transom Bar at 2.75m height
      const transom = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, winTotalZ), darkMetalMat);
      transom.position.set(winX, 2.75, 1.4);
      transom.castShadow = true;
      roomGroup.add(transom);

      // Rear-left corner panoramic window (connecting x = -3.85 to x = -1.7 at z = backZ)
      const cornerWinW = 2.15;
      const cornerFrameTop = new THREE.Mesh(new THREE.BoxGeometry(cornerWinW, 0.14, 0.14), darkMetalMat);
      cornerFrameTop.position.set(-2.77, wallH - 0.07, backZ);
      roomGroup.add(cornerFrameTop);

      const cornerFrameBot = new THREE.Mesh(new THREE.BoxGeometry(cornerWinW, 0.1, 0.14), darkMetalMat);
      cornerFrameBot.position.set(-2.77, 0.05, backZ);
      roomGroup.add(cornerFrameBot);

      const cornerMullion = new THREE.Mesh(new THREE.BoxGeometry(0.09, wallH, 0.12), darkMetalMat);
      cornerMullion.position.set(-2.77, wallH / 2, backZ);
      roomGroup.add(cornerMullion);

      // Subtle Window Glass Panes
      const windowGlassMat = new THREE.MeshPhysicalMaterial({
        color: '#FFFFFF',
        transparent: true,
        opacity: 0.11,
        roughness: 0.05,
        metalness: 0.1,
      });
      const leftGlass = new THREE.Mesh(new THREE.PlaneGeometry(winTotalZ, wallH - 0.2), windowGlassMat);
      leftGlass.rotation.y = Math.PI / 2;
      leftGlass.position.set(winX, wallH / 2, 1.4);
      roomGroup.add(leftGlass);

      // 5. Penthouse Ceiling Overhang with Warm Cove LED Strip
      const ceilingSlab = new THREE.Mesh(
        new THREE.BoxGeometry(9.5, 0.18, 8.5),
        new THREE.MeshStandardMaterial({ color: '#FAF8F5', roughness: 0.8 })
      );
      ceilingSlab.position.set(0.5, wallH + 0.09, 0.8);
      roomGroup.add(ceilingSlab);

      const coveLed = new THREE.Mesh(
        new THREE.BoxGeometry(5.1, 0.03, 0.04),
        new THREE.MeshBasicMaterial({ color: '#FDE68A' })
      );
      coveLed.position.set(0.9, wallH - 0.04, backZ + 0.1);
      roomGroup.add(coveLed);

      // 6. Minimalist Indoor Plant Pot near the Panoramic Window (adds life & scale to the room)
      const potMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.17, 0.42, 20),
        new THREE.MeshStandardMaterial({ color: '#27272A', roughness: 0.4 })
      );
      potMesh.position.set(-2.85, 0.21, -0.75);
      potMesh.castShadow = true;
      roomGroup.add(potMesh);

      const foliageMat = new THREE.MeshStandardMaterial({ color: '#2E5A36', roughness: 0.65 });
      [
        [0, 0.58, 0, 0.22],
        [-0.12, 0.72, 0.08, 0.18],
        [0.14, 0.68, -0.06, 0.19],
        [0, 0.86, 0.02, 0.16],
      ].forEach(([fx, fy, fz, fr]) => {
        const leafCluster = new THREE.Mesh(new THREE.SphereGeometry(fr, 14, 14), foliageMat);
        leafCluster.scale.set(1.2, 0.85, 1.2);
        leafCluster.position.set(-2.85 + fx, fy, -0.75 + fz);
        leafCluster.castShadow = true;
        roomGroup.add(leafCluster);
      });

      // Create the 7 modular containers for the bed pieces
      const headboard = new THREE.Group();
      const base = new THREE.Group();
      const mattress = new THREE.Group();
      const nightstandLeft = new THREE.Group();
      const nightstandRight = new THREE.Group();
      const footboard = new THREE.Group();
      const pillows = new THREE.Group();

      scene.add(headboard, base, mattress, nightstandLeft, nightstandRight, footboard, pillows);

      groupsRef.current = {
        headboard,
        base,
        mattress,
        nightstandLeft,
        nightstandRight,
        footboard,
        pillows,
        mattressLayers: [],
      };

      let animId = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        controls.update();

        const g = groupsRef.current;
        const t = targetPositionsRef.current;
        if (g) {
          const lerpSpeed = 0.09;
          g.headboard.position.lerp(t.headboard, lerpSpeed);
          g.base.position.lerp(t.base, lerpSpeed);
          g.mattress.position.lerp(t.mattress, lerpSpeed);
          g.nightstandLeft.position.lerp(t.nightstandLeft, lerpSpeed);
          g.nightstandRight.position.lerp(t.nightstandRight, lerpSpeed);
          g.footboard.position.lerp(t.footboard, lerpSpeed);
          g.pillows.position.lerp(t.pillows, lerpSpeed);

          g.mattressLayers.forEach((layerGrp, idx) => {
            const targetY = t.layerOffsets[idx] ?? 0;
            layerGrp.position.y += (targetY - layerGrp.position.y) * lerpSpeed;
          });
        }

        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / Math.max(container.clientHeight, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    }, []);

    // Update Sky Ambiance & Sunlight when roomAmbiance changes (fast texture swap)
    useEffect(() => {
      const ambiance = config.roomAmbiance ?? 'day_clouds';
      if (skyDomeMatRef.current) {
        skyDomeMatRef.current.map = createCloudSkyPanorama(ambiance);
        skyDomeMatRef.current.needsUpdate = true;
      }
      if (sunLightRef.current && ambientLightRef.current) {
        if (ambiance === 'day_clouds') {
          sunLightRef.current.color.set('#FFF5E0');
          sunLightRef.current.intensity = 1.85;
          ambientLightRef.current.intensity = 0.85;
        } else if (ambiance === 'sunset_clouds') {
          sunLightRef.current.color.set('#FDBA74');
          sunLightRef.current.intensity = 1.65;
          ambientLightRef.current.intensity = 0.72;
        } else {
          sunLightRef.current.color.set('#93C5FD');
          sunLightRef.current.intensity = 0.55;
          ambientLightRef.current.intensity = 0.42;
        }
      }
    }, [config.roomAmbiance]);

    // Rebuild / update modular bed meshes whenever config changes
    useEffect(() => {
      const g = groupsRef.current;
      if (!g) return;

      const clearGroup = (grp: THREE.Group) => {
        while (grp.children.length > 0) {
          const child = grp.children[0];
          grp.remove(child);
        }
      };

      clearGroup(g.headboard);
      clearGroup(g.base);
      clearGroup(g.mattress);
      clearGroup(g.nightstandLeft);
      clearGroup(g.nightstandRight);
      clearGroup(g.footboard);
      clearGroup(g.pillows);
      g.mattressLayers = [];

      const bedW = config.size.anchoCm / 100;
      const bedL = config.size.largoCm / 100;
      const baseH = config.includeBase ? 0.28 : 0.0;
      const legH = config.includeBase ? 0.08 : 0.0;
      const totalBaseTop = legH + baseH;
      const matH = config.mattress.alturaCm / 100;

      const primaryMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(config.primaryColorHex),
        roughness: config.fabric.roughness,
        metalness: config.fabric.metalness,
        clearcoat: config.fabric.clearcoat,
      });

      const secondaryMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(config.useBicolor ? config.secondaryColorHex : config.primaryColorHex),
        roughness: config.fabric.roughness,
        metalness: config.fabric.metalness,
        clearcoat: config.fabric.clearcoat,
      });

      const darkFrameMat = new THREE.MeshStandardMaterial({
        color: '#141417',
        roughness: 0.6,
        metalness: 0.1,
      });

      const woodMat = new THREE.MeshStandardMaterial({
        color: '#5C3A21',
        roughness: 0.55,
        metalness: 0.05,
      });

      const chromeMat = new THREE.MeshStandardMaterial({
        color: '#E2E8F0',
        roughness: 0.12,
        metalness: 0.92,
      });

      const accentColorMap: Record<MetalAccentId, string> = {
        gold: '#E5B84B',
        silver: '#E2E8F0',
        bronze: '#B87333',
        none: config.primaryColorHex,
      };

      const metalAccentMat = new THREE.MeshStandardMaterial({
        color: accentColorMap[config.metalAccent],
        roughness: config.metalAccent === 'none' ? config.fabric.roughness : 0.12,
        metalness: config.metalAccent === 'none' ? 0.05 : 0.95,
      });

      const buttonMat = config.crystalButtons
        ? new THREE.MeshPhysicalMaterial({
            color: '#FFFFFF',
            roughness: 0.05,
            metalness: 0.2,
            transmission: 0.6,
            clearcoat: 1.0,
          })
        : secondaryMat;

      // ========================================================================
      // 1. PIEZA: BASE SOMIER / CATRE (g.base)
      // ========================================================================
      if (config.includeBase) {
        const isDivided = config.size.divididoSomier && (config.baseId === 'BASE-01' || config.baseId === 'BASE-02');
        const numBoxes = isDivided ? 2 : 1;
        const boxW = isDivided ? bedW / 2 - 0.01 : bedW;

        if (config.baseId === 'BASE-03') {
          const railThick = 0.14;
          const totalW = bedW + railThick * 2;
          const segments = 5;
          const segLen = bedL / segments;
          for (let i = 0; i < segments; i++) {
            const zPos = -bedL / 2 + segLen * (i + 0.5);
            const leftPuff = new THREE.Mesh(
              new RoundedBoxGeometry(railThick, baseH, segLen - 0.01, 4, 0.045),
              primaryMat
            );
            leftPuff.position.set(-bedW / 2 - railThick / 2, legH + baseH / 2, zPos);
            leftPuff.castShadow = true;
            leftPuff.receiveShadow = true;
            g.base.add(leftPuff);

            const rightPuff = leftPuff.clone();
            rightPuff.position.x = bedW / 2 + railThick / 2;
            g.base.add(rightPuff);
          }

          const frontSegs = 4;
          const fSegW = totalW / frontSegs;
          for (let i = 0; i < frontSegs; i++) {
            const xPos = -totalW / 2 + fSegW * (i + 0.5);
            const frontPuff = new THREE.Mesh(
              new RoundedBoxGeometry(fSegW - 0.01, baseH, railThick, 4, 0.045),
              primaryMat
            );
            frontPuff.position.set(xPos, legH + baseH / 2, bedL / 2 + railThick / 2 - 0.02);
            frontPuff.castShadow = true;
            g.base.add(frontPuff);
          }

          const slatCount = 10;
          for (let s = 0; s < slatCount; s++) {
            const sz = -bedL / 2 + 0.12 + (s / (slatCount - 1)) * (bedL - 0.24);
            const slat = new THREE.Mesh(new THREE.BoxGeometry(bedW - 0.04, 0.02, 0.08), woodMat);
            slat.position.set(0, legH + baseH - 0.06, sz);
            g.base.add(slat);
          }
        } else {
          const boxMat =
            config.baseId === 'BASE-04'
              ? woodMat
              : config.baseId === 'BASE-05'
              ? chromeMat
              : primaryMat;

          for (let b = 0; b < numBoxes; b++) {
            const xCenter = isDivided ? (b === 0 ? -boxW / 2 - 0.005 : boxW / 2 + 0.005) : 0;
            const somierMesh = new THREE.Mesh(
              new RoundedBoxGeometry(boxW, baseH, bedL, 4, 0.025),
              boxMat
            );
            somierMesh.position.set(xCenter, legH + baseH / 2, 0);
            somierMesh.castShadow = true;
            somierMesh.receiveShadow = true;
            g.base.add(somierMesh);

            const topCloth = new THREE.Mesh(
              new THREE.PlaneGeometry(boxW - 0.04, bedL - 0.04),
              darkFrameMat
            );
            topCloth.rotation.x = -Math.PI / 2;
            topCloth.position.set(xCenter, legH + baseH + 0.002, 0);
            g.base.add(topCloth);

            if (config.baseId === 'BASE-02') {
              const drawerFront = new THREE.Mesh(
                new RoundedBoxGeometry(boxW * 0.78, baseH * 0.65, 0.025, 3, 0.01),
                secondaryMat
              );
              drawerFront.position.set(xCenter, legH + baseH * 0.5, bedL / 2 + 0.01);
              g.base.add(drawerFront);

              const handle = new THREE.Mesh(
                new THREE.BoxGeometry(0.16, 0.018, 0.025),
                metalAccentMat
              );
              handle.position.set(xCenter, legH + baseH * 0.55, bedL / 2 + 0.026);
              g.base.add(handle);
            }

            const legMat = config.woodLegs ? woodMat : chromeMat;
            const lx = boxW / 2 - 0.08;
            const lz = bedL / 2 - 0.08;
            [
              [-lx, -lz],
              [lx, -lz],
              [-lx, lz],
              [lx, lz],
            ].forEach(([dx, dz]) => {
              const leg = new THREE.Mesh(
                new THREE.CylinderGeometry(0.028, 0.02, legH, 16),
                legMat
              );
              leg.position.set(xCenter + dx, legH / 2, dz);
              leg.castShadow = true;
              g.base.add(leg);
            });
          }
        }
      }

      // ========================================================================
      // 2. PIEZA: COLCHÓN ERGONÓMICO + CAPAS RAYOS X (g.mattress)
      // ========================================================================
      if (config.includeMattress) {
        const layers = config.mattress.capasInternas;
        const quiltTex = createQuiltTexture(
          config.mattress.coloresFabrica.estampado,
          config.mattress.coloresFabrica.tapaHex,
          config.mattress.coloresFabrica.vivoHex
        );
        const sideLabelTex = createMattressLabelTexture(
          config.mattress.nombre,
          config.mattress.coloresFabrica.lateralHex,
          config.mattress.coloresFabrica.vivoHex
        );

        let currentBottomY = 0;
        const layerGroups: THREE.Group[] = [];

        layers.forEach((layerSpec, idx) => {
          const lGrp = new THREE.Group();
          const lHeight = matH * layerSpec.grosorRelativo;
          const yCenter = currentBottomY + lHeight / 2;

          if (idx === layers.length - 1) {
            const sideMat = new THREE.MeshStandardMaterial({
              map: sideLabelTex,
              roughness: 0.7,
            });
            const topBottomCoreMat = new THREE.MeshStandardMaterial({
              color: layerSpec.colorHex,
              roughness: 0.8,
            });

            const mainBox = new THREE.Mesh(
              new RoundedBoxGeometry(bedW, lHeight, bedL, 4, 0.02),
              [sideMat, sideMat, topBottomCoreMat, topBottomCoreMat, sideMat, sideMat]
            );
            mainBox.position.set(0, yCenter, 0);
            mainBox.castShadow = true;
            mainBox.receiveShadow = true;
            lGrp.add(mainBox);

            if (config.viewMode === 'xray_mattress') {
              const springMat = new THREE.MeshStandardMaterial({
                color: '#CBD5E1',
                metalness: 0.85,
                roughness: 0.2,
              });
              const cols = 6;
              const rows = 6;
              for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                  const sx = -bedW * 0.36 + (c / (cols - 1)) * (bedW * 0.72);
                  const sz = -bedL * 0.36 + (r / (rows - 1)) * (bedL * 0.72);
                  const coil = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.055, 0.055, 0.09, 16, 1, false),
                    springMat
                  );
                  coil.position.set(sx, yCenter + lHeight / 2 + 0.045, sz);
                  lGrp.add(coil);
                }
              }
            }
          } else if (idx === 0) {
            const topMat = new THREE.MeshStandardMaterial({
              map: quiltTex,
              roughness: 0.75,
            });
            const topMesh = new THREE.Mesh(
              new RoundedBoxGeometry(bedW, lHeight, bedL, 4, 0.025),
              topMat
            );
            topMesh.position.set(0, yCenter, 0);
            topMesh.castShadow = true;
            topMesh.receiveShadow = true;
            lGrp.add(topMesh);

            if (config.showFootRunner && config.viewMode !== 'xray_mattress') {
              const runnerMat = new THREE.MeshStandardMaterial({
                color: '#881337',
                roughness: 0.85,
              });
              const runner = new THREE.Mesh(
                new RoundedBoxGeometry(bedW + 0.03, lHeight + 0.02, bedL * 0.24, 3, 0.01),
                runnerMat
              );
              runner.position.set(0, yCenter + 0.005, bedL * 0.34);
              lGrp.add(runner);
            }
          } else {
            const foamMat = new THREE.MeshStandardMaterial({
              color:
                config.viewMode === 'xray_mattress'
                  ? layerSpec.colorHex
                  : config.mattress.coloresFabrica.lateralHex,
              roughness: 0.85,
            });
            const foamMesh = new THREE.Mesh(
              new RoundedBoxGeometry(
                config.viewMode === 'xray_mattress' ? bedW * 0.96 : bedW,
                lHeight,
                config.viewMode === 'xray_mattress' ? bedL * 0.96 : bedL,
                3,
                0.015
              ),
              foamMat
            );
            foamMesh.position.set(0, yCenter, 0);
            foamMesh.castShadow = true;
            lGrp.add(foamMesh);
          }

          currentBottomY += lHeight;
          layerGroups.push(lGrp);
          g.mattress.add(lGrp);
        });

        let stackY = 0;
        for (let i = layers.length - 1; i >= 0; i--) {
          const lHeight = matH * layers[i].grosorRelativo;
          const meshChild = layerGroups[i].children[0] as THREE.Mesh;
          const oldY = meshChild.position.y;
          const newY = stackY + lHeight / 2;
          const deltaY = newY - oldY;
          layerGroups[i].children.forEach((ch) => {
            ch.position.y += deltaY;
          });
          stackY += lHeight;
        }

        g.mattressLayers = layerGroups;
      }

      // ========================================================================
      // 3. PIEZA: ESPALDAR / CABECERA (12 Arquetipos Reales ESP-01 a ESP-12)
      // ========================================================================
      if (config.includeHeadboard) {
        const isImperial =
          config.headboardId === 'ESP-01' ||
          config.headboardId === 'ESP-08' ||
          config.headboardId === 'ESP-09' ||
          config.headboardId === 'ESP-10' ||
          config.nightstandId !== 'VEL-NONE';

        const wingW = isImperial ? 0.52 : 0;
        const hbHeight = 1.42;
        const hbDepth = 0.11;
        const hbZ = -bedL / 2 - hbDepth / 2;

        const backWidth = bedW + wingW * 2;
        const backBoard = new THREE.Mesh(
          new RoundedBoxGeometry(backWidth, hbHeight, hbDepth * 0.55, 3, 0.02),
          primaryMat
        );
        backBoard.position.set(0, hbHeight / 2, hbZ - 0.02);
        backBoard.castShadow = true;
        backBoard.receiveShadow = true;
        g.headboard.add(backBoard);

        const arch = config.headboardId;

        if (arch === 'ESP-01') {
          const cols = 7;
          const colW = (bedW - 0.08) / cols;
          for (let c = 0; c < cols; c++) {
            const x = -bedW / 2 + 0.04 + colW * (c + 0.5);
            const distFromCenter = Math.abs(c - (cols - 1) / 2);
            const isCenterGroup = distFromCenter <= 1.5;
            const panelMat = config.useBicolor && isCenterGroup ? secondaryMat : primaryMat;

            const colMesh = new THREE.Mesh(
              new RoundedBoxGeometry(colW - 0.015, hbHeight - 0.08, 0.065, 3, 0.018),
              panelMat
            );
            colMesh.position.set(x, hbHeight / 2, hbZ + 0.02);
            colMesh.castShadow = true;
            g.headboard.add(colMesh);

            if (config.metalAccent !== 'none') {
              const vStepY1 = 0.72 + distFromCenter * 0.12;
              const vStepY2 = 0.98 + distFromCenter * 0.1;
              [vStepY1, vStepY2].forEach((barY) => {
                const bar = new THREE.Mesh(
                  new THREE.BoxGeometry(colW - 0.012, 0.022, 0.072),
                  metalAccentMat
                );
                bar.position.set(x, barY, hbZ + 0.022);
                g.headboard.add(bar);
              });
            }
          }
        } else if (arch === 'ESP-02') {
          const sunRadius = Math.min(bedW * 0.28, 0.42);
          const centerSun = new THREE.Mesh(
            new THREE.CylinderGeometry(sunRadius, sunRadius, 0.07, 32, 1, false, 0, Math.PI),
            secondaryMat
          );
          centerSun.rotation.x = Math.PI / 2;
          centerSun.rotation.z = -Math.PI / 2;
          centerSun.position.set(0, totalBaseTop + 0.15, hbZ + 0.025);
          g.headboard.add(centerSun);

          const numRays = 7;
          for (let r = 0; r < numRays; r++) {
            const angle = -Math.PI * 0.42 + (r / (numRays - 1)) * (Math.PI * 0.84);
            const rayLen = 0.65;
            const ray = new THREE.Mesh(
              new RoundedBoxGeometry(0.16, rayLen, 0.06, 3, 0.02),
              r % 2 === 0 ? primaryMat : secondaryMat
            );
            ray.position.set(
              Math.sin(angle) * 0.46,
              totalBaseTop + 0.28 + Math.cos(angle) * 0.36,
              hbZ + 0.02
            );
            ray.rotation.z = -angle;
            ray.castShadow = true;
            g.headboard.add(ray);

            if (config.metalAccent !== 'none' && r < numRays - 1) {
              const stripAngle = angle + (Math.PI * 0.84) / (numRays - 1) / 2;
              const strip = new THREE.Mesh(
                new THREE.BoxGeometry(0.015, rayLen * 0.95, 0.068),
                metalAccentMat
              );
              strip.position.set(
                Math.sin(stripAngle) * 0.46,
                totalBaseTop + 0.28 + Math.cos(stripAngle) * 0.36,
                hbZ + 0.024
              );
              strip.rotation.z = -stripAngle;
              g.headboard.add(strip);
            }
          }
        } else if (arch === 'ESP-03' || arch === 'ESP-08') {
          const rows = 4;
          const halfW = (bedW - 0.1) / 2;
          for (let r = 0; r < rows; r++) {
            const yPos = 0.52 + r * 0.21;
            const matToUse = config.useBicolor && r % 2 === 1 ? secondaryMat : primaryMat;

            const leftChev = new THREE.Mesh(
              new RoundedBoxGeometry(halfW, 0.16, 0.065, 3, 0.015),
              matToUse
            );
            leftChev.position.set(-halfW / 2 + 0.02, yPos, hbZ + 0.02);
            leftChev.rotation.z = -0.22;
            leftChev.castShadow = true;
            g.headboard.add(leftChev);

            const rightChev = new THREE.Mesh(
              new RoundedBoxGeometry(halfW, 0.16, 0.065, 3, 0.015),
              matToUse
            );
            rightChev.position.set(halfW / 2 - 0.02, yPos, hbZ + 0.02);
            rightChev.rotation.z = 0.22;
            rightChev.castShadow = true;
            g.headboard.add(rightChev);

            if (config.metalAccent !== 'none') {
              const accentL = new THREE.Mesh(
                new THREE.BoxGeometry(halfW * 0.9, 0.016, 0.072),
                metalAccentMat
              );
              accentL.position.set(-halfW / 2 + 0.02, yPos - 0.08, hbZ + 0.024);
              accentL.rotation.z = -0.22;
              g.headboard.add(accentL);

              const accentR = accentL.clone();
              accentR.position.x = halfW / 2 - 0.02;
              accentR.rotation.z = 0.22;
              g.headboard.add(accentR);
            }
          }
        } else if (arch === 'ESP-04') {
          const cols = 8;
          const colW = (bedW - 0.08) / cols;
          for (let c = 0; c < cols; c++) {
            const x = -bedW / 2 + 0.04 + colW * (c + 0.5);
            const slat = new THREE.Mesh(
              new RoundedBoxGeometry(colW - 0.012, hbHeight - 0.06, 0.07, 4, 0.028),
              primaryMat
            );
            slat.position.set(x, hbHeight / 2, hbZ + 0.02);
            slat.castShadow = true;
            g.headboard.add(slat);
          }
        } else if (arch === 'ESP-05') {
          const cols = 6;
          const rows = 4;
          const cellW = (bedW - 0.08) / cols;
          const cellH = (hbHeight - 0.25) / rows;
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const isAlt = (r + c) % 2 === 1;
              const x = -bedW / 2 + 0.04 + cellW * (c + 0.5);
              const y = 0.28 + cellH * (r + 0.5);
              const brick = new THREE.Mesh(
                new RoundedBoxGeometry(cellW - 0.018, cellH - 0.018, 0.068, 3, 0.018),
                isAlt ? secondaryMat : primaryMat
              );
              brick.position.set(x, y, hbZ + 0.022);
              brick.castShadow = true;
              g.headboard.add(brick);
            }
          }
        } else if (arch === 'ESP-06') {
          const cols = 5;
          const rows = 3;
          const spacingX = (bedW - 0.22) / cols;
          const spacingY = (hbHeight - 0.45) / rows;
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const cx = -bedW / 2 + 0.11 + spacingX * (c + 0.5);
              const cy = 0.42 + spacingY * (r + 0.5);

              const diamond = new THREE.Mesh(
                new RoundedBoxGeometry(spacingX * 0.72, spacingY * 0.72, 0.068, 3, 0.02),
                primaryMat
              );
              diamond.position.set(cx, cy, hbZ + 0.02);
              diamond.rotation.z = Math.PI / 4;
              diamond.castShadow = true;
              g.headboard.add(diamond);

              const btn = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 12), buttonMat);
              btn.position.set(cx, cy, hbZ + 0.056);
              g.headboard.add(btn);
            }
          }
        } else if (arch === 'ESP-07') {
          const cols = 4;
          const rows = 2;
          const cw = (bedW - 0.12) / cols;
          const ch = (hbHeight - 0.38) / rows;
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const x = -bedW / 2 + 0.06 + cw * (c + 0.5);
              const y = 0.36 + ch * (r + 0.5);
              const sq = new THREE.Mesh(
                new RoundedBoxGeometry(cw - 0.02, ch - 0.02, 0.065, 3, 0.02),
                primaryMat
              );
              sq.position.set(x, y, hbZ + 0.02);
              sq.castShadow = true;
              g.headboard.add(sq);
            }
          }
        } else {
          const centerDiamond = new THREE.Mesh(
            new RoundedBoxGeometry(0.48, 0.48, 0.072, 4, 0.02),
            secondaryMat
          );
          centerDiamond.position.set(0, 0.86, hbZ + 0.025);
          centerDiamond.rotation.z = Math.PI / 4;
          centerDiamond.castShadow = true;
          g.headboard.add(centerDiamond);

          if (config.metalAccent !== 'none') {
            const goldRing = new THREE.Mesh(
              new RoundedBoxGeometry(0.54, 0.54, 0.066, 2, 0.01),
              metalAccentMat
            );
            goldRing.position.set(0, 0.86, hbZ + 0.018);
            goldRing.rotation.z = Math.PI / 4;
            g.headboard.add(goldRing);
          }

          [-1, 1].forEach((dir) => {
            const sideP = new THREE.Mesh(
              new RoundedBoxGeometry(bedW * 0.26, 0.72, 0.062, 3, 0.02),
              primaryMat
            );
            sideP.position.set(dir * (bedW * 0.32), 0.86, hbZ + 0.02);
            sideP.castShadow = true;
            g.headboard.add(sideP);
          });
        }

        if (isImperial) {
          [-1, 1].forEach((sideDir) => {
            const wx = sideDir * (bedW / 2 + wingW / 2);
            const wingMat = arch === 'ESP-09' ? woodMat : primaryMat;
            const wingPanel = new THREE.Mesh(
              new RoundedBoxGeometry(wingW - 0.02, hbHeight - 0.04, 0.06, 3, 0.018),
              wingMat
            );
            wingPanel.position.set(wx, hbHeight / 2, hbZ + 0.015);
            wingPanel.castShadow = true;
            g.headboard.add(wingPanel);

            if (arch === 'ESP-09') {
              for (let s = -3; s <= 3; s++) {
                const slat = new THREE.Mesh(
                  new THREE.BoxGeometry(0.035, hbHeight - 0.08, 0.02),
                  woodMat
                );
                slat.position.set(wx + s * 0.06, hbHeight / 2, hbZ + 0.05);
                g.headboard.add(slat);
              }
            }

            const lampStem = new THREE.Mesh(
              new THREE.CylinderGeometry(0.015, 0.015, 0.06, 12),
              metalAccentMat
            );
            lampStem.rotation.x = Math.PI / 2;
            lampStem.position.set(wx, 1.08, hbZ + 0.06);
            g.headboard.add(lampStem);

            const bulbMat = new THREE.MeshStandardMaterial({
              color: '#FFFBEB',
              emissive: config.ledOn ? new THREE.Color('#F59E0B') : new THREE.Color('#000000'),
              emissiveIntensity: config.ledOn ? 2.4 : 0,
              roughness: 0.15,
            });
            const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.052, 20, 20), bulbMat);
            bulb.position.set(wx, 1.08, hbZ + 0.1);
            g.headboard.add(bulb);

            if (config.ledOn) {
              const pLight = new THREE.PointLight('#FBBF24', 0.95, 2.2);
              pLight.position.set(wx, 1.08, hbZ + 0.18);
              g.headboard.add(pLight);
            }

            const outletPlate = new THREE.Mesh(
              new THREE.BoxGeometry(0.11, 0.065, 0.015),
              chromeMat
            );
            outletPlate.position.set(wx, 0.72, hbZ + 0.05);
            g.headboard.add(outletPlate);
          });
        }

        if (config.ledOn) {
          const ledStripMat = new THREE.MeshBasicMaterial({ color: '#FDE68A' });
          const ledStrip = new THREE.Mesh(
            new THREE.BoxGeometry(backWidth - 0.1, 0.018, 0.02),
            ledStripMat
          );
          ledStrip.position.set(0, hbHeight - 0.02, hbZ + 0.045);
          g.headboard.add(ledStrip);

          const centerGlow = new THREE.PointLight('#FDE047', 0.75, 2.5);
          centerGlow.position.set(0, hbHeight - 0.1, hbZ + 0.25);
          g.headboard.add(centerGlow);
        }
      }

      // ========================================================================
      // 4. PIEZA: VELADORES / MESAS DE NOCHE
      // ========================================================================
      if (config.includeNightstands && config.nightstandId !== 'VEL-NONE') {
        const nsW = 0.46;
        const nsD = 0.4;
        const drawers = config.nightstandId === 'VEL-3CAJ' ? 3 : 2;
        const nsH = drawers === 3 ? 0.56 : 0.44;
        const bodyMat = config.nightstandId === 'VEL-MELAMINA' ? woodMat : primaryMat;

        const buildNightstand = (targetGroup: THREE.Group) => {
          const cabinet = new THREE.Mesh(
            new RoundedBoxGeometry(nsW, nsH, nsD, 3, 0.02),
            bodyMat
          );
          cabinet.position.set(0, nsH / 2 + 0.04, 0);
          cabinet.castShadow = true;
          cabinet.receiveShadow = true;
          targetGroup.add(cabinet);

          const dHeight = (nsH - 0.08) / drawers;
          for (let d = 0; d < drawers; d++) {
            const dy = 0.08 + dHeight * (d + 0.5);
            const front = new THREE.Mesh(
              new RoundedBoxGeometry(nsW - 0.05, dHeight - 0.02, 0.025, 2, 0.01),
              secondaryMat
            );
            front.position.set(0, dy, nsD / 2 + 0.01);
            targetGroup.add(front);

            const handle = new THREE.Mesh(
              new THREE.BoxGeometry(0.12, 0.015, 0.025),
              metalAccentMat
            );
            handle.position.set(0, dy, nsD / 2 + 0.025);
            targetGroup.add(handle);
          }
        };

        buildNightstand(g.nightstandLeft);
        buildNightstand(g.nightstandRight);
      }

      // ========================================================================
      // 5. PIEZA: PIECERA / BAÚL PIE DE CAMA
      // ========================================================================
      if (config.includeFootboard && config.footboardId !== 'PIEC-NONE') {
        const fbW = config.footboardId === 'PIEC-ACOLCHADA' ? bedW : bedW * 0.78;
        const fbH = config.footboardId === 'PIEC-DIVAN' ? 0.52 : 0.42;
        const fbD = config.footboardId === 'PIEC-ACOLCHADA' ? 0.12 : 0.38;

        const fbMesh = new THREE.Mesh(
          new RoundedBoxGeometry(fbW, fbH, fbD, 4, 0.03),
          primaryMat
        );
        fbMesh.position.set(0, fbH / 2, 0);
        fbMesh.castShadow = true;
        fbMesh.receiveShadow = true;
        g.footboard.add(fbMesh);

        if (config.metalAccent !== 'none') {
          const trim = new THREE.Mesh(
            new THREE.BoxGeometry(fbW - 0.04, 0.02, fbD + 0.01),
            metalAccentMat
          );
          trim.position.set(0, fbH * 0.65, 0);
          g.footboard.add(trim);
        }

        if (config.footboardId === 'PIEC-DIVAN') {
          [-1, 1].forEach((dir) => {
            const arm = new THREE.Mesh(
              new RoundedBoxGeometry(0.12, fbH + 0.14, fbD, 3, 0.025),
              secondaryMat
            );
            arm.position.set(dir * (fbW / 2 - 0.04), (fbH + 0.14) / 2, 0);
            arm.castShadow = true;
            g.footboard.add(arm);
          });
        }
      }

      // ========================================================================
      // 6. PIEZA: ALMOHADAS Y COJINES ERGONÓMICOS
      // ========================================================================
      if (config.includePillows && config.pillowId !== 'ALM-NONE') {
        const pillowMat = new THREE.MeshStandardMaterial({
          color: config.pillowId === 'ALM-VISCO' ? '#F0F9FF' : '#FFFFFF',
          roughness: 0.75,
        });

        const pCount = config.size.plazas >= 2 ? 2 : 1;
        const pWidth = Math.min((bedW - 0.18) / pCount, 0.62);

        for (let p = 0; p < pCount; p++) {
          const px = pCount === 1 ? 0 : (p === 0 ? -1 : 1) * (bedW * 0.24);
          const pillow = new THREE.Mesh(
            new RoundedBoxGeometry(pWidth, 0.12, 0.36, 5, 0.05),
            pillowMat
          );
          pillow.position.set(px, 0.06, 0);
          pillow.rotation.x = 0.18;
          pillow.castShadow = true;
          g.pillows.add(pillow);

          if (config.pillowId === 'ALM-RODILLO') {
            const bolster = new THREE.Mesh(
              new THREE.CylinderGeometry(0.065, 0.065, pWidth * 0.78, 20),
              secondaryMat
            );
            bolster.rotation.z = Math.PI / 2;
            bolster.position.set(px, 0.065, 0.24);
            bolster.castShadow = true;
            g.pillows.add(bolster);
          }
        }
      }

      // Calculate target positions for View Modes (Armado vs Desacoplado vs Rayos X)
      const isExploded = config.viewMode === 'exploded_pieces';
      const isXray = config.viewMode === 'xray_mattress';

      const nsOffsetX = bedW / 2 + 0.28 + (isExploded ? 0.48 : 0);
      const nsOffsetZ = -bedL / 2 + 0.22 + (isExploded ? -0.15 : 0);
      const fbOffsetZ = bedL / 2 + 0.22 + (isExploded ? 0.6 : 0);

      targetPositionsRef.current = {
        headboard: new THREE.Vector3(0, 0, isExploded ? -0.22 : isXray ? -0.15 : 0),
        base: new THREE.Vector3(0, 0, isExploded ? 0.25 : 0),
        mattress: new THREE.Vector3(
          0,
          totalBaseTop + (isExploded ? 0.42 : isXray ? 0.12 : 0),
          isExploded ? 0.25 : 0
        ),
        nightstandLeft: new THREE.Vector3(-nsOffsetX, 0, nsOffsetZ),
        nightstandRight: new THREE.Vector3(nsOffsetX, 0, nsOffsetZ),
        footboard: new THREE.Vector3(0, 0, fbOffsetZ),
        pillows: new THREE.Vector3(
          0,
          totalBaseTop + matH + (isExploded ? 0.82 : isXray ? 0.95 : 0),
          -bedL / 2 + 0.28 + (isExploded ? 0.25 : 0)
        ),
        layerOffsets: isXray ? [0.54, 0.36, 0.18, 0.0] : [0, 0, 0, 0],
      };
    }, [config]);

    return (
      <div className="relative h-full w-full select-none overflow-hidden rounded-2xl">
        <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" />
      </div>
    );
  }
);

DorwinBedScene3D.displayName = 'DorwinBedScene3D';
