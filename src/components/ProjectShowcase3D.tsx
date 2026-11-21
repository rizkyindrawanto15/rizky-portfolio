import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { ProjectItem } from '../data/portfolioData';

interface ProjectShowcase3DProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  isVisible: boolean;
  reducedMotion: boolean;
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function getProjectAura(project: ProjectItem | null): string {
  if (!project) return 'rgba(96, 165, 250, 0.14)';
  switch (project.id) {
    case 'antreku':
      return 'rgba(20, 184, 166, 0.19)';
    case 'tracelab':
      return 'rgba(129, 140, 248, 0.18)';
    case 'onchain-intelligence':
      return 'rgba(59, 130, 246, 0.18)';
    case 'sid-kedungsugo':
      return 'rgba(16, 185, 129, 0.18)';
    case 'lokasidasur':
      return 'rgba(217, 79, 43, 0.17)';
    case 'prestasihub':
      return 'rgba(59, 130, 246, 0.17)';
    case 'bmi-step-tracker':
      return 'rgba(249, 115, 22, 0.16)';
    case 'inventrack':
      return 'rgba(234, 179, 8, 0.13)';
    default:
      return project.accentColor === 'violet'
        ? 'rgba(139, 92, 246, 0.15)'
        : 'rgba(96, 165, 250, 0.15)';
  }
}

/**
 * Generates an Apple-grade, razor-sharp full-bleed rounded display texture
 * (plus a soft faded reflection copy for the obsidian stage floor).
 */
function createSpatialDisplayTextures(project: ProjectItem): {
  main: THREE.CanvasTexture;
  reflection: THREE.CanvasTexture;
} {
  const W = 1280;
  const H = 800; // 16:10 Apple Display ratio
  const RADIUS = 36;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const reflCanvas = document.createElement('canvas');
  reflCanvas.width = 640;
  reflCanvas.height = 400;
  const reflCtx = reflCanvas.getContext('2d');

  const main = new THREE.CanvasTexture(canvas);
  main.colorSpace = THREE.SRGBColorSpace;
  main.anisotropy = 8;
  main.minFilter = THREE.LinearMipmapLinearFilter;
  main.magFilter = THREE.LinearFilter;

  const reflection = new THREE.CanvasTexture(reflCanvas);
  reflection.colorSpace = THREE.SRGBColorSpace;
  reflection.minFilter = THREE.LinearFilter;
  reflection.magFilter = THREE.LinearFilter;

  const updateReflection = () => {
    if (!reflCtx) return;
    const rw = reflCanvas.width;
    const rh = reflCanvas.height;
    reflCtx.clearRect(0, 0, rw, rh);
    reflCtx.save();
    // Flip vertically so bottom of display mirrors seamlessly at top of reflection
    reflCtx.translate(0, rh);
    reflCtx.scale(1, -1);
    reflCtx.drawImage(canvas, 0, 0, rw, rh);
    reflCtx.restore();

    // Soft exponential floor fade mask
    reflCtx.save();
    reflCtx.globalCompositeOperation = 'destination-in';
    const mask = reflCtx.createLinearGradient(0, 0, 0, rh);
    mask.addColorStop(0, 'rgba(255, 255, 255, 0.24)');
    mask.addColorStop(0.28, 'rgba(255, 255, 255, 0.08)');
    mask.addColorStop(0.62, 'rgba(255, 255, 255, 0)');
    mask.addColorStop(1, 'rgba(255, 255, 255, 0)');
    reflCtx.fillStyle = mask;
    reflCtx.fillRect(0, 0, rw, rh);
    reflCtx.restore();

    reflection.needsUpdate = true;
  };

  if (!ctx) return { main, reflection };

  const applyGlassEdge = () => {
    // Ultra-delicate Apple glass hairline specular rim
    const sheen = ctx.createLinearGradient(0, 0, W, H);
    sheen.addColorStop(0, 'rgba(255, 255, 255, 0.10)');
    sheen.addColorStop(0.35, 'rgba(255, 255, 255, 0)');
    sheen.addColorStop(1, 'rgba(0, 0, 0, 0.14)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 3;
    roundedRectPath(ctx, 2.5, 2.5, W - 5, H - 5, RADIUS);
    ctx.stroke();
  };

  const drawEditorialArtwork = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    roundedRectPath(ctx, 2, 2, W - 4, H - 4, RADIUS);
    ctx.clip();

    const type = project.screenshots[0]?.schematicType;

    if (type === 'kasir-oop' || type === 'kasir-receipt') {
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#0f172a');
      bg.addColorStop(0.55, '#111827');
      bg.addColorStop(1, '#090d16');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const orb = ctx.createRadialGradient(340, 240, 20, 340, 240, 500);
      orb.addColorStop(0, 'rgba(59, 130, 246, 0.34)');
      orb.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = orb;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = 45;
      ctx.shadowOffsetY = 20;
      roundedRectPath(ctx, 72, 95, 620, 610, 24);
      ctx.fillStyle = '#0b101d';
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 2;
      roundedRectPath(ctx, 72, 95, 620, 610, 24);
      ctx.stroke();

      ['#f87171', '#fbbf24', '#34d399'].forEach((c, idx) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(112 + idx * 24, 134, 7, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
      ctx.font = '500 20px "JetBrains Mono", monospace';
      ctx.fillText('TransaksiKasir.java', 200, 141);

      const javaCode = [
        { text: 'public class TransaksiKasir {', color: '#93c5fd' },
        { text: '  private List<Barang> items;', color: '#e2e8f0' },
        { text: '  private int totalBelanja;', color: '#e2e8f0' },
        { text: '', color: '#e2e8f0' },
        { text: '  public void tambahItem(Barang b) {', color: '#c4b5fd' },
        { text: '    items.add(b);', color: '#cbd5e1' },
        { text: '    totalBelanja += b.subtotal();', color: '#cbd5e1' },
        { text: '  }', color: '#c4b5fd' },
        { text: '', color: '#e2e8f0' },
        { text: '  public int kembalian(int bayar) {', color: '#6ee7b7' },
        { text: '    return bayar - totalBelanja;', color: '#f8fafc' },
        { text: '  }', color: '#6ee7b7' },
        { text: '}', color: '#93c5fd' },
      ];
      ctx.font = '400 21px "JetBrains Mono", monospace';
      javaCode.forEach((line, i) => {
        ctx.fillStyle = line.color;
        ctx.fillText(line.text, 108, 212 + i * 35);
      });

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 42;
      ctx.shadowOffsetY = 20;
      roundedRectPath(ctx, 742, 148, 466, 504, 24);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#0f172a';
      ctx.font = '700 26px "Space Grotesk", sans-serif';
      ctx.fillText('STRUK TRANSAKSI', 784, 214);
      ctx.fillStyle = '#64748b';
      ctx.font = '500 18px "JetBrains Mono", monospace';
      ctx.fillText('JAVA OOP · KASIR', 784, 248);

      ctx.strokeStyle = 'rgba(15, 23, 42, 0.14)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(784, 276);
      ctx.lineTo(1166, 276);
      ctx.stroke();

      const items = [
        ['Barang A ×2', 'Subtotal'],
        ['Barang B ×1', 'Subtotal'],
        ['Barang C ×3', 'Subtotal'],
      ];
      ctx.font = '500 21px "Space Grotesk", sans-serif';
      items.forEach(([l, r], idx) => {
        const py = 334 + idx * 52;
        ctx.fillStyle = '#334155';
        ctx.fillText(l, 784, py);
        ctx.fillStyle = '#0f172a';
        const rw = ctx.measureText(r).width;
        ctx.fillText(r, 1166 - rw, py);
      });

      ctx.strokeStyle = 'rgba(15, 23, 42, 0.14)';
      ctx.beginPath();
      ctx.moveTo(784, 494);
      ctx.lineTo(1166, 494);
      ctx.stroke();

      ctx.fillStyle = '#2563eb';
      ctx.font = '700 24px "Space Grotesk", sans-serif';
      ctx.fillText('Total & Kembalian', 784, 554);
      ctx.fillStyle = '#64748b';
      ctx.font = '500 18px "JetBrains Mono", monospace';
      ctx.fillText('Status: Verified OOP Output', 784, 594);
    } else if (type === 'python-flowchart' || type === 'python-terminal') {
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#131029');
      bg.addColorStop(0.5, '#0c1021');
      bg.addColorStop(1, '#090b15');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const orb = ctx.createRadialGradient(920, 240, 20, 920, 240, 520);
      orb.addColorStop(0, 'rgba(139, 92, 246, 0.34)');
      orb.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = orb;
      ctx.fillRect(0, 0, W, H);

      const cx = 330;
      const nodes = [
        { label: 'START / INPUT', y: 108, fill: '#1e1b4b', stroke: '#818cf8' },
        { label: 'IF CONDITION', y: 256, fill: '#172554', stroke: '#60a5fa' },
        { label: 'LOOP PROCESS', y: 404, fill: '#2e1065', stroke: '#c084fc' },
        { label: 'OUTPUT RESULT', y: 552, fill: '#064e3b', stroke: '#34d399' },
      ];

      ctx.lineWidth = 3;
      for (let i = 0; i < nodes.length - 1; i++) {
        ctx.strokeStyle = 'rgba(255,255,255,0.28)';
        ctx.beginPath();
        ctx.moveTo(cx, nodes[i].y + 82);
        ctx.lineTo(cx, nodes[i + 1].y);
        ctx.stroke();
      }

      ctx.font = '600 22px "JetBrains Mono", monospace';
      nodes.forEach((n) => {
        roundedRectPath(ctx, cx - 210, n.y, 420, 82, 18);
        ctx.fillStyle = n.fill;
        ctx.fill();
        ctx.strokeStyle = n.stroke;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        const tw = ctx.measureText(n.label).width;
        ctx.fillText(n.label, cx - tw / 2, n.y + 49);
      });

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = 44;
      ctx.shadowOffsetY = 20;
      roundedRectPath(ctx, 624, 118, 580, 560, 24);
      ctx.fillStyle = '#0a0e1b';
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = 'rgba(167, 139, 250, 0.28)';
      ctx.lineWidth = 2;
      roundedRectPath(ctx, 624, 118, 580, 560, 24);
      ctx.stroke();

      ['#f87171', '#fbbf24', '#34d399'].forEach((c, idx) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(664 + idx * 24, 156, 7, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = 'rgba(196, 181, 253, 0.85)';
      ctx.font = '500 20px "JetBrains Mono", monospace';
      ctx.fillText('algoritma.py', 754, 163);

      const pyCode = [
        { text: '# Flowgorithm -> Python', color: '#a78bfa' },
        { text: 'def evaluasi_nilai(skor):', color: '#60a5fa' },
        { text: '    if skor >= 75:', color: '#93c5fd' },
        { text: '        return "Tuntas"', color: '#6ee7b7' },
        { text: '    return "Evaluasi"', color: '#f8fafc' },
        { text: '', color: '#f8fafc' },
        { text: 'data = [65, 80, 92, 78]', color: '#e2e8f0' },
        { text: 'for nilai in data:', color: '#60a5fa' },
        { text: '    hasil = evaluasi_nilai(nilai)', color: '#e2e8f0' },
        { text: '    print(nilai, "->", hasil)', color: '#cbd5e1' },
      ];
      ctx.font = '400 21px "JetBrains Mono", monospace';
      pyCode.forEach((line, idx) => {
        ctx.fillStyle = line.color;
        ctx.fillText(line.text, 662, 236 + idx * 40);
      });
    } else {
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#071a17');
      bg.addColorStop(0.55, '#0b1622');
      bg.addColorStop(1, '#080e18');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = 45;
      ctx.shadowOffsetY = 22;
      roundedRectPath(ctx, 76, 74, W - 152, H - 148, 24);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();
      ctx.restore();

      ctx.save();
      roundedRectPath(ctx, 76, 74, W - 152, 82, 24);
      ctx.fillStyle = '#059669';
      ctx.fill();
      ctx.fillRect(76, 130, W - 152, 26);
      ctx.restore();

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 25px "Space Grotesk", sans-serif';
      ctx.fillText('Penjualan Toko Elektronik.xlsx', 120, 124);

      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(76, 156, W - 152, 58);
      ctx.fillStyle = '#059669';
      ctx.font = '700 22px "JetBrains Mono", monospace';
      ctx.fillText('fx', 120, 193);
      ctx.fillStyle = '#1e293b';
      ctx.font = '500 21px "JetBrains Mono", monospace';
      ctx.fillText('=SUM(E4:E18)   |   =IF(C4>=3, D4*0.05, 0)', 174, 193);

      const cols = ['KODE', 'PRODUK ELEKTRONIK', 'UNIT', 'FORMULA'];
      const colX = [120, 290, 740, 890];
      ctx.fillStyle = '#64748b';
      ctx.font = '700 18px "JetBrains Mono", monospace';
      cols.forEach((c, idx) => ctx.fillText(c, colX[idx], 272));

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(110, 294);
      ctx.lineTo(W - 110, 294);
      ctx.stroke();

      const rows = [
        ['EL-01', 'Monitor LED 24"', '4', '=C4*Harga'],
        ['EL-02', 'SSD NVMe 512GB', '6', '=C5*Harga'],
        ['EL-03', 'Keyboard Mechanical', '3', '=C6*Harga'],
        ['EL-04', 'Router Dual Band', '5', '=C7*Harga'],
        ['TOTAL', 'Rekap Penjualan', '18', '=SUM(E4:E7)'],
      ];

      rows.forEach((r, rIdx) => {
        const ry = 352 + rIdx * 65;
        if (rIdx === rows.length - 1) {
          roundedRectPath(ctx, 102, ry - 38, W - 204, 56, 12);
          ctx.fillStyle = '#ecfdf5';
          ctx.fill();
        }
        r.forEach((cell, cIdx) => {
          ctx.fillStyle =
            cIdx === 3
              ? '#059669'
              : rIdx === rows.length - 1
              ? '#0f172a'
              : '#334155';
          ctx.font =
            cIdx === 3 || cIdx === 0
              ? '600 20px "JetBrains Mono", monospace'
              : rIdx === rows.length - 1
              ? '700 22px "Space Grotesk", sans-serif'
              : '500 22px "Space Grotesk", sans-serif';
          ctx.fillText(cell, colX[cIdx], ry);
        });
      });
    }

    applyGlassEdge();
    ctx.restore();
    main.needsUpdate = true;
    updateReflection();
  };

  const primaryImageUrl = project.screenshots[0]?.imageUrl;

  if (primaryImageUrl) {
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    roundedRectPath(ctx, 2, 2, W - 4, H - 4, RADIUS);
    ctx.clip();
    ctx.fillStyle = '#0c0e16';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    main.needsUpdate = true;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = primaryImageUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      roundedRectPath(ctx, 2, 2, W - 4, H - 4, RADIUS);
      ctx.clip();

      const imgAspect = img.width / img.height;

      if (imgAspect < 0.95) {
        // Portrait mobile app showcase (bmi.png)
        const bgGrad = ctx.createLinearGradient(0, 0, W, H);
        bgGrad.addColorStop(0, '#18120e');
        bgGrad.addColorStop(0.5, '#0c0d12');
        bgGrad.addColorStop(1, '#121016');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        const glow = ctx.createRadialGradient(
          W * 0.5,
          H * 0.5,
          30,
          W * 0.5,
          H * 0.5,
          440
        );
        glow.addColorStop(0, 'rgba(249, 115, 22, 0.28)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);

        const padY = 40;
        const dh = H - padY * 2;
        const dw = dh * imgAspect;
        const dx = (W - dw) / 2;
        const dy = padY;

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.78)';
        ctx.shadowBlur = 48;
        ctx.shadowOffsetY = 20;
        roundedRectPath(ctx, dx, dy, dw, dh, 28);
        ctx.fillStyle = '#111111';
        ctx.fill();
        ctx.restore();

        ctx.save();
        roundedRectPath(ctx, dx, dy, dw, dh, 28);
        ctx.clip();
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 2.5;
        roundedRectPath(ctx, dx, dy, dw, dh, 28);
        ctx.stroke();
      } else if (primaryImageUrl.includes('basisdata')) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);
        const pad = 16;
        const scale = Math.min((W - pad * 2) / img.width, (H - pad * 2) / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      } else {
        // Full-bleed crisp 16:10 Apple Display fit
        const scale = Math.max(W / img.width, H / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = (W - dw) / 2;
        const dy = Math.min(0, (H - dh) * 0.2);
        ctx.drawImage(img, dx, dy, dw, dh);
      }

      applyGlassEdge();
      ctx.restore();
      main.needsUpdate = true;
      updateReflection();
    };
  } else {
    drawEditorialArtwork();
  }

  return { main, reflection };
}

/**
 * Gently curved VisionOS spatial glass panel geometry
 */
function createSpatialPanelGeo(width: number, height: number): THREE.PlaneGeometry {
  const geo = new THREE.PlaneGeometry(width, height, 22, 12);
  const pos = geo.attributes.position;
  const halfW = width * 0.5;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const nx = x / halfW;
    // Ultra-subtle panoramic concave wrap feel
    pos.setZ(i, 0.08 * (nx * nx));
  }
  geo.computeVertexNormals();
  return geo;
}

interface CoverFlowDisplayProps {
  project: ProjectItem;
  index: number;
  count: number;
  scrollPosRef: React.MutableRefObject<number>;
  cardWidth: number;
  cardHeight: number;
  isCompact: boolean;
  onFocusIndex: (index: number) => void;
  onOpenProject: (project: ProjectItem) => void;
  isDraggingRef: React.MutableRefObject<boolean>;
  reducedMotion: boolean;
}

const CoverFlowDisplay: React.FC<CoverFlowDisplayProps> = ({
  project,
  index,
  count,
  scrollPosRef,
  cardWidth,
  cardHeight,
  isCompact,
  onFocusIndex,
  onOpenProject,
  isDraggingRef,
  reducedMotion,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const mainMeshRef = useRef<THREE.Mesh>(null);
  const reflMeshRef = useRef<THREE.Mesh>(null);
  const mainMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const reflMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const isHoveredRef = useRef(false);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const [textures, setTextures] = useState<{
    main: THREE.CanvasTexture;
    reflection: THREE.CanvasTexture;
  } | null>(null);
  const [panelGeo, setPanelGeo] = useState<THREE.PlaneGeometry | null>(null);

  useEffect(() => {
    const created = createSpatialDisplayTextures(project);
    setTextures(created);
    return () => {
      created.main.dispose();
      created.reflection.dispose();
    };
  }, [project]);

  useEffect(() => {
    const geo = createSpatialPanelGeo(cardWidth, cardHeight);
    setPanelGeo(geo);
    return () => {
      geo.dispose();
    };
  }, [cardWidth, cardHeight]);

  const getCyclicDelta = (idx: number, scrollVal: number) => {
    if (count <= 1) return 0;
    let d = (((idx - scrollVal) % count) + count) % count;
    if (d > count / 2) d -= count;
    return d;
  };

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const d = getCyclicDelta(index, scrollPosRef.current);
    const absD = Math.abs(d);
    const sign = Math.sign(d);

    // Apple Spatial CoverFlow parametric curve:
    // Center card (d=0) stands bold & prominent; side cards fan symmetrically inward in 3D space
    const spreadBase = isCompact ? 1.85 : 2.75;
    const spreadWing = isCompact ? 1.05 : 1.38;
    const clampedAbs = Math.min(absD, 1);
    const extraAbs = Math.max(0, absD - 1);

    const targetX = sign * (clampedAbs * spreadBase + extraAbs * spreadWing);
    const targetZ =
      1.35 -
      Math.pow(clampedAbs, 1.15) * 1.85 -
      extraAbs * 0.78 +
      (isHoveredRef.current && absD < 0.35 ? 0.16 : 0);

    const hoverFloat =
      !reducedMotion && absD < 0.45
        ? Math.sin(t * 1.15 + index) * 0.035
        : 0;
    const targetY = 0.24 + hoverFloat;

    // Wing inward angle (smoothly 0 when centered, ~0.58 rad on wings)
    const centerTiltY =
      !reducedMotion && absD < 0.35 ? state.pointer.x * 0.08 : 0;
    const centerTiltX =
      !reducedMotion && absD < 0.35 ? -state.pointer.y * 0.055 : 0;

    const wingRotY = -sign * Math.min(0.62, Math.pow(absD, 0.85) * 0.56);
    const targetRotY = absD < 0.25 ? THREE.MathUtils.lerp(centerTiltY, wingRotY, absD * 4) : wingRotY;
    const targetRotX = absD < 0.25 ? centerTiltX * (1 - absD * 4) : 0;

    // Scale hierarchy: commanding hero display in center, clean stepped wings
    const focusBoost = Math.max(0, 1 - absD);
    const targetScale =
      0.76 +
      Math.pow(focusBoost, 1.3) * 0.28 +
      (isHoveredRef.current ? 0.028 : 0);

    group.position.x = THREE.MathUtils.lerp(group.position.x, targetX, dt * 10);
    group.position.y = THREE.MathUtils.lerp(group.position.y, targetY, dt * 10);
    group.position.z = THREE.MathUtils.lerp(group.position.z, targetZ, dt * 10);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotY, dt * 9);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotX, dt * 9);
    group.scale.setScalar(
      THREE.MathUtils.lerp(group.scale.x, targetScale, dt * 9)
    );

    // Fade smoothly beyond ±2.6 slots so wings dissolve cleanly into obsidian
    const maxVisibleD = isCompact ? 2.1 : 2.85;
    const opacity = THREE.MathUtils.clamp(
      1 - Math.max(0, absD - (maxVisibleD - 0.75)) / 0.75,
      0,
      1
    );
    group.visible = opacity > 0.02;

    // Back-to-front painter order based on distance from center
    const order = Math.round(200 - absD * 30);
    if (reflMeshRef.current) reflMeshRef.current.renderOrder = order;
    if (mainMeshRef.current) mainMeshRef.current.renderOrder = order + 1;

    if (mainMatRef.current) {
      const shade = isHoveredRef.current
        ? Math.min(1, 0.52 + focusBoost * 0.55)
        : 0.38 + focusBoost * 0.62;
      mainMatRef.current.color.setScalar(shade);
      mainMatRef.current.opacity = opacity;
      mainMatRef.current.depthWrite = opacity > 0.94;
      mainMatRef.current.emissiveIntensity =
        0.08 + focusBoost * 0.18 + (isHoveredRef.current ? 0.04 : 0);
    }
    if (reflMatRef.current) {
      reflMatRef.current.opacity = opacity * (0.28 + focusBoost * 0.45);
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!isDraggingRef.current) {
      isHoveredRef.current = true;
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isHoveredRef.current = false;
    document.body.style.cursor = '';
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!pointerDownPos.current) return;
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    pointerDownPos.current = null;

    if (Math.hypot(dx, dy) < 10) {
      e.stopPropagation();
      const d = Math.abs(getCyclicDelta(index, scrollPosRef.current));
      if (d < 0.35) {
        onOpenProject(project);
      } else {
        onFocusIndex(index);
      }
    }
  };

  if (!textures || !panelGeo) return null;
  const { main: mainTex, reflection: reflTex } = textures;

  return (
    <group ref={groupRef}>
      {/* Main Apple Spatial Display Panel */}
      <mesh
        ref={mainMeshRef}
        geometry={panelGeo}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <meshStandardMaterial
          ref={mainMatRef}
          map={mainTex}
          emissiveMap={mainTex}
          emissive="#ffffff"
          emissiveIntensity={0.22}
          roughness={0.22}
          metalness={0.08}
          transparent
          alphaTest={0.03}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Soft Obsidian Stage Floor Mirror Reflection */}
      <mesh
        ref={reflMeshRef}
        position={[0, -(cardHeight + 0.08), 0]}
        geometry={panelGeo}
      >
        <meshBasicMaterial
          ref={reflMatRef}
          map={reflTex}
          transparent
          opacity={0.55}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

interface SpatialStageSceneProps {
  projects: ProjectItem[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onOpenProject: (project: ProjectItem) => void;
  targetScrollRef: React.MutableRefObject<number | null>;
  dragDeltaRef: React.MutableRefObject<number>;
  scrollVelRef: React.MutableRefObject<number>;
  isDraggingRef: React.MutableRefObject<boolean>;
  reducedMotion: boolean;
}

const SpatialStageScene: React.FC<SpatialStageSceneProps> = ({
  projects,
  activeIndex,
  onActiveIndexChange,
  onOpenProject,
  targetScrollRef,
  dragDeltaRef,
  scrollVelRef,
  isDraggingRef,
  reducedMotion,
}) => {
  const { size, camera } = useThree();
  const isCompact = size.width < 720;

  const scrollPosRef = useRef<number>(0);
  const lastReportedIdx = useRef<number>(0);
  const count = projects.length;

  const cardWidth = isCompact ? 2.75 : 3.85;
  const cardHeight = cardWidth / 1.6;
  const baseCamZ = isCompact ? 7.6 : 6.75;

  useEffect(() => {
    scrollPosRef.current = 0;
    targetScrollRef.current = 0;
    lastReportedIdx.current = 0;
  }, [count, targetScrollRef]);

  useEffect(() => {
    if (count <= 1) {
      targetScrollRef.current = 0;
      return;
    }
    const curr = scrollPosRef.current;
    const currMod = ((curr % count) + count) % count;
    let diff = activeIndex - currMod;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    targetScrollRef.current = curr + diff;
    lastReportedIdx.current = activeIndex;
  }, [activeIndex, count, targetScrollRef]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    if (count > 1) {
      if (isDraggingRef.current) {
        targetScrollRef.current = null;
        if (dragDeltaRef.current !== 0) {
          scrollPosRef.current += dragDeltaRef.current;
          dragDeltaRef.current = 0;
        }
      } else if (targetScrollRef.current !== null) {
        const diff = targetScrollRef.current - scrollPosRef.current;
        scrollPosRef.current += diff * Math.min(1, dt * 8);
        if (Math.abs(diff) < 0.002) {
          scrollPosRef.current = targetScrollRef.current;
          targetScrollRef.current = null;
        }
      } else {
        if (Math.abs(scrollVelRef.current) > 0.04) {
          scrollPosRef.current += scrollVelRef.current * dt;
          scrollVelRef.current *= Math.pow(0.05, dt);
        } else {
          scrollVelRef.current = 0;
          const nearest = Math.round(scrollPosRef.current);
          scrollPosRef.current = THREE.MathUtils.lerp(
            scrollPosRef.current,
            nearest,
            dt * 6.5
          );
        }
      }

      const idx = ((Math.round(scrollPosRef.current) % count) + count) % count;
      if (idx !== lastReportedIdx.current && targetScrollRef.current === null) {
        lastReportedIdx.current = idx;
        onActiveIndexChange(idx);
      }
    }

    const targetCamX = reducedMotion
      ? 0
      : state.pointer.x * (isCompact ? 0.14 : 0.28);
    const targetCamY = reducedMotion
      ? 0.05
      : 0.05 + state.pointer.y * (isCompact ? 0.1 : 0.18);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, dt * 3.5);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, dt * 3.5);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, baseCamZ, dt * 3.5);
    camera.lookAt(0, 0.02, 0);
  });

  return (
    <>
      <ambientLight intensity={1.15} color="#f8fafc" />
      <directionalLight position={[0, 6, 9]} intensity={1.2} color="#ffffff" />

      {projects.map((project, idx) => (
        <CoverFlowDisplay
          key={project.id}
          project={project}
          index={idx}
          count={count}
          scrollPosRef={scrollPosRef}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          isCompact={isCompact}
          onFocusIndex={onActiveIndexChange}
          onOpenProject={onOpenProject}
          isDraggingRef={isDraggingRef}
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  );
};

export const ProjectShowcase3D: React.FC<ProjectShowcase3DProps> = ({
  projects,
  onSelectProject,
  isVisible,
  reducedMotion,
}) => {
  const [webglReady, setWebglReady] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const targetScrollRef = useRef<number | null>(null);
  const dragDeltaRef = useRef<number>(0);
  const scrollVelRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const lastDragX = useRef<number>(0);
  const lastDragTime = useRef<number>(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [projects.length]);

  useEffect(() => {
    if (!isVisible || projects.length <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      )
        return;
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % projects.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isVisible, projects.length]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragStartX.current = e.clientX;
    lastDragX.current = e.clientX;
    lastDragTime.current = performance.now();
    dragDeltaRef.current = 0;
    scrollVelRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dx = e.clientX - lastDragX.current;
    const dt = Math.max(8, now - lastDragTime.current) / 1000;
    lastDragX.current = e.clientX;
    lastDragTime.current = now;

    const delta = -dx * 0.0044;
    dragDeltaRef.current += delta;
    scrollVelRef.current = THREE.MathUtils.clamp(delta / dt, -6.5, 6.5);
    if (Math.abs(e.clientX - dragStartX.current) > 8) {
      targetScrollRef.current = null;
    }
  };

  const handlePointerUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const stepProject = (dir: -1 | 1) => {
    if (projects.length <= 1) return;
    setActiveIndex((prev) => (prev + dir + projects.length) % projects.length);
  };

  const activeProject = projects[activeIndex] || projects[0] || null;
  const auraColor = getProjectAura(activeProject);

  if (!webglReady) {
    return (
      <div className="py-16 text-center text-sm text-white/55">
        WebGL tidak tersedia pada perangkat ini.
      </div>
    );
  }

  return (
    <div className="relative w-full select-none">
      {/* Open Borderless Apple Spatial 3D CoverFlow Stage */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrLeave}
        onPointerLeave={handlePointerUpOrLeave}
        className="relative w-full h-[380px] sm:h-[470px] lg:h-[540px] overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"
      >
        {/* Dynamic Ambient Spotlight shifting subtly per project */}
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse 52% 48% at 50% 42%, ${auraColor} 0%, rgba(3, 3, 5, 0) 76%)`,
          }}
          aria-hidden="true"
        />

        <Canvas
          frameloop={isVisible ? 'always' : 'demand'}
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.05, 6.75], fov: 38, near: 0.1, far: 50 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              setWebglReady(false);
            });
          }}
        >
          <SpatialStageScene
            projects={projects}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            onOpenProject={onSelectProject}
            targetScrollRef={targetScrollRef}
            dragDeltaRef={dragDeltaRef}
            scrollVelRef={scrollVelRef}
            isDraggingRef={isDraggingRef}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      </div>

      {/* Apple-Clean Centered Focused Project Caption & Navigation Bar */}
      {activeProject && (
        <div className="max-w-2xl mx-auto px-5 -mt-4 sm:-mt-6 relative z-10 flex flex-col items-center text-center gap-4">
          <div className="min-h-[96px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-1.5"
              >
                <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-wide text-blue-400/90">
                  <span>{activeProject.category}</span>
                  <span className="text-white/25">·</span>
                  <span className="text-white/45">{activeProject.year}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                  {activeProject.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/55 max-w-lg mx-auto line-clamp-2 leading-relaxed">
                  {activeProject.shortDescription}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sleek Apple Action Row: Prev | Detail CTA | Next */}
          <div className="flex items-center gap-3">
            {projects.length > 1 && (
              <button
                type="button"
                onClick={() => stepProject(-1)}
                className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.09] flex items-center justify-center text-white/80 hover:text-white transition-all"
                aria-label="Previous project"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onSelectProject(activeProject)}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#05060a] hover:bg-white/90 text-xs sm:text-sm font-medium tracking-tight shadow-[0_8px_28px_rgba(255,255,255,0.16)] transition-all"
            >
              <span>Lihat Detail</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            {projects.length > 1 && (
              <button
                type="button"
                onClick={() => stepProject(1)}
                className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.09] flex items-center justify-center text-white/80 hover:text-white transition-all"
                aria-label="Next project"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Minimal Apple Pill Pagination */}
          {projects.length > 1 && (
            <div className="flex items-center gap-1.5 pt-1">
              {projects.map((p, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={p.title}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isCurrent
                        ? 'w-6 bg-white'
                        : 'w-1.5 bg-white/20 hover:bg-white/45'
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
