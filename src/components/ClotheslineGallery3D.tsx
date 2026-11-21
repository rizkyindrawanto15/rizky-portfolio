import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { ProjectItem } from '../data/portfolioData';

interface ClotheslineGallery3DProps {
  projects: ProjectItem[];
  hoveredProject: ProjectItem | null;
  onHoverProject: (project: ProjectItem | null) => void;
  onSelectProject: (project: ProjectItem) => void;
  isVisible: boolean;
  reducedMotion: boolean;
}

/**
 * Helper: Draws a rounded rectangle path safely across all browsers.
 */
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

/**
 * Creates a clean, full-bleed, borderless photographic art print CanvasTexture
 * with soft rounded corners — zero heavy polaroid borders or noisy telemetry text.
 */
function createCleanPrintTexture(project: ProjectItem): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const W = 1280;
  const H = 840;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  if (!ctx) return texture;

  const RADIUS = 26;

  const applySubtleFinish = () => {
    // Ultra-delicate top-left studio light gradient sheen across the fine-art print
    const sheen = ctx.createLinearGradient(0, 0, W, H);
    sheen.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    sheen.addColorStop(0.35, 'rgba(255, 255, 255, 0.0)');
    sheen.addColorStop(1, 'rgba(0, 0, 0, 0.14)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, W, H);
  };

  const drawEditorialArtwork = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    roundedRectPath(ctx, 2, 2, W - 4, H - 4, RADIUS);
    ctx.clip();

    const type = project.screenshots[0]?.schematicType;

    if (type === 'kasir-oop' || type === 'kasir-receipt') {
      // Rich cobalt-midnight studio gradient backdrop
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#0f172a');
      bg.addColorStop(0.55, '#111827');
      bg.addColorStop(1, '#090d16');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Ambient studio glow orb
      const orb = ctx.createRadialGradient(340, 260, 20, 340, 260, 520);
      orb.addColorStop(0, 'rgba(59, 130, 246, 0.32)');
      orb.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = orb;
      ctx.fillRect(0, 0, W, H);

      // Left sleek IDE window: TransaksiKasir.java
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = 45;
      ctx.shadowOffsetY = 22;
      roundedRectPath(ctx, 72, 110, 620, 620, 22);
      ctx.fillStyle = '#0b101d';
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 2;
      roundedRectPath(ctx, 72, 110, 620, 620, 22);
      ctx.stroke();

      // macOS dots
      ['#f87171', '#fbbf24', '#34d399'].forEach((c, idx) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(112 + idx * 24, 148, 7, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = 'rgba(148, 163, 184, 0.78)';
      ctx.font = '500 20px "JetBrains Mono", monospace';
      ctx.fillText('TransaksiKasir.java', 200, 155);

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
      ctx.font = '400 22px "JetBrains Mono", monospace';
      javaCode.forEach((line, i) => {
        ctx.fillStyle = line.color;
        ctx.fillText(line.text, 108, 226 + i * 36);
      });

      // Right floating glass cashier receipt card
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 42;
      ctx.shadowOffsetY = 20;
      roundedRectPath(ctx, 742, 164, 466, 512, 22);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#0f172a';
      ctx.font = '700 26px "Space Grotesk", sans-serif';
      ctx.fillText('STRUK TRANSAKSI', 784, 232);
      ctx.fillStyle = '#64748b';
      ctx.font = '500 18px "JetBrains Mono", monospace';
      ctx.fillText('JAVA OOP · KASIR', 784, 266);

      ctx.strokeStyle = 'rgba(15, 23, 42, 0.14)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(784, 294);
      ctx.lineTo(1166, 294);
      ctx.stroke();

      const items = [
        ['Barang A ×2', 'Subtotal'],
        ['Barang B ×1', 'Subtotal'],
        ['Barang C ×3', 'Subtotal'],
      ];
      ctx.font = '500 21px "Space Grotesk", sans-serif';
      items.forEach(([l, r], idx) => {
        const py = 352 + idx * 54;
        ctx.fillStyle = '#334155';
        ctx.fillText(l, 784, py);
        ctx.fillStyle = '#0f172a';
        const rw = ctx.measureText(r).width;
        ctx.fillText(r, 1166 - rw, py);
      });

      ctx.strokeStyle = 'rgba(15, 23, 42, 0.14)';
      ctx.beginPath();
      ctx.moveTo(784, 514);
      ctx.lineTo(1166, 514);
      ctx.stroke();

      ctx.fillStyle = '#2563eb';
      ctx.font = '700 24px "Space Grotesk", sans-serif';
      ctx.fillText('Total & Kembalian', 784, 574);
      ctx.fillStyle = '#64748b';
      ctx.font = '500 18px "JetBrains Mono", monospace';
      ctx.fillText('Status: Verified OOP Output', 784, 616);
    } else if (type === 'python-flowchart' || type === 'python-terminal') {
      // Rich indigo-violet studio gradient backdrop
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#131029');
      bg.addColorStop(0.5, '#0c1021');
      bg.addColorStop(1, '#090b15');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const orb = ctx.createRadialGradient(920, 260, 20, 920, 260, 520);
      orb.addColorStop(0, 'rgba(139, 92, 246, 0.34)');
      orb.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = orb;
      ctx.fillRect(0, 0, W, H);

      // Left visual flowchart graph
      const cx = 330;
      const nodes = [
        { label: 'START / INPUT', y: 120, fill: '#1e1b4b', stroke: '#818cf8' },
        { label: 'IF CONDITION', y: 274, fill: '#172554', stroke: '#60a5fa' },
        { label: 'LOOP PROCESS', y: 428, fill: '#2e1065', stroke: '#c084fc' },
        { label: 'OUTPUT RESULT', y: 582, fill: '#064e3b', stroke: '#34d399' },
      ];

      ctx.lineWidth = 3;
      for (let i = 0; i < nodes.length - 1; i++) {
        ctx.strokeStyle = 'rgba(255,255,255,0.28)';
        ctx.beginPath();
        ctx.moveTo(cx, nodes[i].y + 84);
        ctx.lineTo(cx, nodes[i + 1].y);
        ctx.stroke();
      }

      ctx.font = '600 22px "JetBrains Mono", monospace';
      nodes.forEach((n) => {
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.45)';
        ctx.shadowBlur = 24;
        roundedRectPath(ctx, cx - 210, n.y, 420, 84, 18);
        ctx.fillStyle = n.fill;
        ctx.fill();
        ctx.restore();

        ctx.strokeStyle = n.stroke;
        ctx.lineWidth = 2.5;
        roundedRectPath(ctx, cx - 210, n.y, 420, 84, 18);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        const tw = ctx.measureText(n.label).width;
        ctx.fillText(n.label, cx - tw / 2, n.y + 50);
      });

      // Right Python code window
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = 44;
      ctx.shadowOffsetY = 20;
      roundedRectPath(ctx, 624, 134, 580, 572, 22);
      ctx.fillStyle = '#0a0e1b';
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = 'rgba(167, 139, 250, 0.28)';
      ctx.lineWidth = 2;
      roundedRectPath(ctx, 624, 134, 580, 572, 22);
      ctx.stroke();

      ['#f87171', '#fbbf24', '#34d399'].forEach((c, idx) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(664 + idx * 24, 172, 7, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = 'rgba(196, 181, 253, 0.8)';
      ctx.font = '500 20px "JetBrains Mono", monospace';
      ctx.fillText('algoritma.py', 754, 179);

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
      ctx.font = '400 22px "JetBrains Mono", monospace';
      pyCode.forEach((line, idx) => {
        ctx.fillStyle = line.color;
        ctx.fillText(line.text, 662, 254 + idx * 41);
      });
    } else {
      // Excel Penjualan Toko Elektronik — clean bright modern analytical spreadsheet UI
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#071a17');
      bg.addColorStop(0.55, '#0b1622');
      bg.addColorStop(1, '#080e18');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const orb = ctx.createRadialGradient(280, 180, 20, 280, 180, 560);
      orb.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
      orb.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = orb;
      ctx.fillRect(0, 0, W, H);

      // Floating sleek spreadsheet sheet
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = 45;
      ctx.shadowOffsetY = 22;
      roundedRectPath(ctx, 76, 86, W - 152, H - 172, 22);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();
      ctx.restore();

      // Emerald top bar
      ctx.save();
      roundedRectPath(ctx, 76, 86, W - 152, 86, 22);
      ctx.fillStyle = '#059669';
      ctx.fill();
      ctx.fillRect(76, 144, W - 152, 28);
      ctx.restore();

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 26px "Space Grotesk", sans-serif';
      ctx.fillText('Penjualan Toko Elektronik.xlsx', 120, 138);

      // Formula bar
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(76, 172, W - 152, 62);
      ctx.fillStyle = '#059669';
      ctx.font = '700 23px "JetBrains Mono", monospace';
      ctx.fillText('fx', 120, 211);
      ctx.fillStyle = '#1e293b';
      ctx.font = '500 22px "JetBrains Mono", monospace';
      ctx.fillText('=SUM(E4:E18)   |   =IF(C4>=3, D4*0.05, 0)', 174, 211);

      // Table headers
      const cols = ['KODE', 'PRODUK ELEKTRONIK', 'UNIT', 'FORMULA'];
      const colX = [120, 290, 740, 890];
      ctx.fillStyle = '#64748b';
      ctx.font = '700 19px "JetBrains Mono", monospace';
      cols.forEach((c, idx) => ctx.fillText(c, colX[idx], 292));

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(110, 314);
      ctx.lineTo(W - 110, 314);
      ctx.stroke();

      const rows = [
        ['EL-01', 'Monitor LED 24"', '4', '=C4*Harga'],
        ['EL-02', 'SSD NVMe 512GB', '6', '=C5*Harga'],
        ['EL-03', 'Keyboard Mechanical', '3', '=C6*Harga'],
        ['EL-04', 'Router Dual Band', '5', '=C7*Harga'],
        ['TOTAL', 'Rekap Penjualan', '18', '=SUM(E4:E7)'],
      ];

      ctx.font = '500 23px "Space Grotesk", sans-serif';
      rows.forEach((r, rIdx) => {
        const ry = 374 + rIdx * 68;
        if (rIdx === rows.length - 1) {
          roundedRectPath(ctx, 102, ry - 40, W - 204, 58, 12);
          ctx.fillStyle = '#ecfdf5';
          ctx.fill();
        } else if (rIdx % 2 === 1) {
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(102, ry - 38, W - 204, 54);
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
              ? '600 21px "JetBrains Mono", monospace'
              : rIdx === rows.length - 1
              ? '700 23px "Space Grotesk", sans-serif'
              : '500 23px "Space Grotesk", sans-serif';
          ctx.fillText(cell, colX[cIdx], ry);
        });
      });
    }

    applySubtleFinish();
    ctx.restore();
    texture.needsUpdate = true;
  };

  const primaryImageUrl = project.screenshots[0]?.imageUrl;

  if (primaryImageUrl) {
    // Soft loading slate while image decodes
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    roundedRectPath(ctx, 2, 2, W - 4, H - 4, RADIUS);
    ctx.clip();
    ctx.fillStyle = '#0e111a';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    texture.needsUpdate = true;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = primaryImageUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      roundedRectPath(ctx, 2, 2, W - 4, H - 4, RADIUS);
      ctx.clip();

      const imgAspect = img.width / img.height;
      const canvasAspect = W / H;

      if (imgAspect < 0.95) {
        // Portrait mobile app screenshot (e.g., bmi.png) — sleek studio showcase backdrop
        const bgGrad = ctx.createLinearGradient(0, 0, W, H);
        bgGrad.addColorStop(0, '#171210');
        bgGrad.addColorStop(0.5, '#0e0f14');
        bgGrad.addColorStop(1, '#121016');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // Warm subtle ember glow echoing the app's own orange CTA
        const glow = ctx.createRadialGradient(
          W * 0.5,
          H * 0.48,
          30,
          W * 0.5,
          H * 0.48,
          480
        );
        glow.addColorStop(0, 'rgba(249, 115, 22, 0.24)');
        glow.addColorStop(0.6, 'rgba(249, 115, 22, 0.06)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);

        // Crisp centered mobile device screen with realistic drop shadow
        const padY = 44;
        const dh = H - padY * 2;
        const dw = dh * imgAspect;
        const dx = (W - dw) / 2;
        const dy = padY;

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.72)';
        ctx.shadowBlur = 46;
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

        // Subtle glass bezel highlight around the mobile viewport
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.lineWidth = 2.5;
        roundedRectPath(ctx, dx, dy, dw, dh, 28);
        ctx.stroke();
      } else if (primaryImageUrl.includes('basisdata')) {
        // Architectural ERD diagram — clean contain on crisp paper so outer table borders never clip
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);
        const pad = 14;
        const scale = Math.min((W - pad * 2) / img.width, (H - pad * 2) / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      } else {
        // Full-bleed edge-to-edge web app screenshot (dark or light themes, zero artificial white border)
        const scale = Math.max(W / img.width, H / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = (W - dw) / 2;
        const dy = Math.min(0, (H - dh) * 0.25);
        ctx.drawImage(img, dx, dy, dw, dh);
      }

      applySubtleFinish();
      ctx.restore();
      texture.needsUpdate = true;
    };
  } else {
    drawEditorialArtwork();
  }

  return texture;
}

/**
 * Tactile natural birch-wood clothespin gripping the thin taut clothesline wire & print top edge.
 */
const WoodenClothespin: React.FC<{ xOffset: number; highlighted: boolean }> = ({
  xOffset,
  highlighted,
}) => {
  return (
    <group position={[xOffset, 0.03, 0]}>
      {/* Front wooden jaw */}
      <mesh position={[0, -0.025, 0.02]}>
        <boxGeometry args={[0.078, 0.26, 0.022]} />
        <meshStandardMaterial
          color={highlighted ? '#edd4b2' : '#d6b992'}
          roughness={0.68}
          metalness={0.04}
        />
      </mesh>
      {/* Rear wooden jaw */}
      <mesh position={[0, -0.025, -0.02]}>
        <boxGeometry args={[0.078, 0.26, 0.022]} />
        <meshStandardMaterial
          color={highlighted ? '#cfa97e' : '#b7966e'}
          roughness={0.72}
          metalness={0.04}
        />
      </mesh>
      {/* Brushed steel spring coil */}
      <mesh position={[0, 0.022, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.019, 0.019, 0.095, 10]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.88}
          roughness={0.24}
        />
      </mesh>
    </group>
  );
};

/**
 * Two razor-thin parallel diagonal steel clothesline wires passing precisely
 * through the left & right wooden clothespins of every hanging print.
 */
const DiagonalClotheslineWires: React.FC<{
  origin: [number, number, number];
  step: [number, number, number];
  clipOffset: number;
  baseRotY: number;
  minD: number;
  maxD: number;
}> = ({ origin, step, clipOffset, baseRotY, minD, maxD }) => {
  const { leftGeo, rightGeo } = useMemo(() => {
    const lx = -clipOffset * Math.cos(baseRotY);
    const lz = clipOffset * Math.sin(baseRotY);
    const rx = clipOffset * Math.cos(baseRotY);
    const rz = -clipOffset * Math.sin(baseRotY);

    const buildWire = (ox: number, oz: number) => {
      const pStart = new THREE.Vector3(
        origin[0] + ox + step[0] * minD,
        origin[1] + 0.055 + step[1] * minD,
        origin[2] + oz + step[2] * minD
      );
      const pEnd = new THREE.Vector3(
        origin[0] + ox + step[0] * maxD,
        origin[1] + 0.055 + step[1] * maxD,
        origin[2] + oz + step[2] * maxD
      );
      const curve = new THREE.LineCurve3(pStart, pEnd);
      return new THREE.TubeGeometry(curve, 24, 0.0075, 6, false);
    };

    return {
      leftGeo: buildWire(lx, lz),
      rightGeo: buildWire(rx, rz),
    };
  }, [origin, step, clipOffset, baseRotY, minD, maxD]);

  useEffect(() => {
    return () => {
      leftGeo.dispose();
      rightGeo.dispose();
    };
  }, [leftGeo, rightGeo]);

  return (
    <group>
      <mesh geometry={leftGeo}>
        <meshStandardMaterial
          color="#e2e8f0"
          emissive="#94a3b8"
          emissiveIntensity={0.35}
          metalness={0.7}
          roughness={0.28}
          transparent
          opacity={0.62}
        />
      </mesh>
      <mesh geometry={rightGeo}>
        <meshStandardMaterial
          color="#cbd5e1"
          emissive="#64748b"
          emissiveIntensity={0.25}
          metalness={0.7}
          roughness={0.32}
          transparent
          opacity={0.44}
        />
      </mesh>
    </group>
  );
};

interface DiagonalHangingCardProps {
  project: ProjectItem;
  index: number;
  count: number;
  scrollPosRef: React.MutableRefObject<number>;
  scrollVelRef: React.MutableRefObject<number>;
  hoveredIndex: number;
  origin: [number, number, number];
  step: [number, number, number];
  cardWidth: number;
  cardHeight: number;
  baseRotY: number;
  isHovered: boolean;
  onHover: (project: ProjectItem | null) => void;
  onSelect: (project: ProjectItem) => void;
  mouseVelRef: React.MutableRefObject<{ vx: number; vy: number }>;
  isDraggingRef: React.MutableRefObject<boolean>;
  reducedMotion: boolean;
}

const DiagonalHangingCard: React.FC<DiagonalHangingCardProps> = ({
  project,
  index,
  count,
  scrollPosRef,
  scrollVelRef,
  hoveredIndex,
  origin,
  step,
  cardWidth,
  cardHeight,
  baseRotY,
  isHovered,
  onHover,
  onSelect,
  mouseVelRef,
  isDraggingRef,
  reducedMotion,
}) => {
  const anchorGroupRef = useRef<THREE.Group>(null);
  const swingGroupRef = useRef<THREE.Group>(null);
  const frontMeshRef = useRef<THREE.Mesh>(null);
  const backMeshRef = useRef<THREE.Mesh>(null);
  const frontMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const backMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const physics = useRef({
    rotX: 0,
    velX: 0,
    rotZ: 0,
    velZ: 0,
    rotYOffset: 0,
    partShift: 0,
    scale: 1,
  });

  const texture = useMemo(() => createCleanPrintTexture(project), [project]);

  // Subtle fine-art paper plane with gentle organic curl at bottom corners
  const printGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(cardWidth, cardHeight, 14, 10);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const nx = x / (cardWidth * 0.5);
      const ny = (cardHeight * 0.5 - y) / cardHeight; // 0 at top wire, 1 at bottom edge
      const subtleDrape = Math.sin(ny * Math.PI) * 0.018 + ny * ny * nx * nx * 0.016;
      pos.setZ(i, subtleDrape);
    }
    geo.computeVertexNormals();
    return geo;
  }, [cardWidth, cardHeight]);

  useEffect(() => {
    return () => {
      texture.dispose();
      printGeo.dispose();
    };
  }, [texture, printGeo]);

  // Compute cyclic relative slot d along the receding diagonal clothesline
  const getRelativeD = (idx: number, scrollVal: number) => {
    if (count <= 3) {
      return idx - scrollVal;
    }
    const raw = (((idx - scrollVal) % count) + count) % count;
    // Allow cards to glide smoothly into negative foreground before cycling cleanly to the back
    return raw > count - 1.15 ? raw - count : raw;
  };

  useFrame((state, delta) => {
    const anchor = anchorGroupRef.current;
    const swing = swingGroupRef.current;
    if (!anchor || !swing) return;

    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const p = physics.current;

    const d = getRelativeD(index, scrollPosRef.current);

    // If a card BEHIND this one is hovered, smoothly glide front cards forward-down along the wire so the hovered card opens cleanly into view
    let desiredPart = 0;
    if (hoveredIndex >= 0 && hoveredIndex !== index) {
      const hoveredD = getRelativeD(hoveredIndex, scrollPosRef.current);
      if (d < hoveredD && hoveredD - d < 2.6) {
        desiredPart = -0.38;
      }
    }
    p.partShift = THREE.MathUtils.lerp(p.partShift, desiredPart, dt * 6);

    const effD = d + p.partShift;
    const ax = origin[0] + step[0] * effD;
    const ay = origin[1] + step[1] * effD;
    const az = origin[2] + step[2] * effD;

    anchor.position.set(ax, ay, az);
    anchor.rotation.y = baseRotY;

    // Fade smoothly as card exits front foreground (d < -0.22) or recedes deep into the upper-right mist
    let opacity = 1;
    if (count > 3) {
      const fadeBackStart = Math.min(count - 1.85, 4.15);
      if (d < -0.22) {
        opacity = THREE.MathUtils.clamp(1 - (-0.22 - d) / 0.72, 0, 1);
      } else if (d > fadeBackStart) {
        opacity = THREE.MathUtils.clamp(1 - (d - fadeBackStart) / 0.95, 0, 1);
      }
    }
    anchor.visible = opacity > 0.015;

    // Strict back-to-front painter order so transparent rounded corners & fade transitions never artifact
    const baseOrder = Math.round(120 - effD * 14);
    if (backMeshRef.current) backMeshRef.current.renderOrder = baseOrder;
    if (frontMeshRef.current) frontMeshRef.current.renderOrder = baseOrder + 1;

    // Depth atmospheric brightness (front print = 100%, receding prints gently soften into depth)
    const depthFactor = THREE.MathUtils.clamp(1 - Math.max(0, d) * 0.145, 0.36, 1);

    if (reducedMotion) {
      p.scale = THREE.MathUtils.lerp(p.scale, isHovered ? 1.035 : 1, dt * 8);
      swing.position.set(0, 0, 0);
      swing.rotation.set(isHovered ? -0.06 : 0, isHovered ? -0.08 : 0, 0);
      swing.scale.setScalar(p.scale);
    } else {
      // Gentle studio breeze pendulum oscillation pivoted strictly on the top clothespin wire
      const breezeX =
        Math.sin(t * 0.85 + index * 1.45) * 0.036 +
        Math.cos(t * 0.52 + index * 2.1) * 0.018;
      const breezeZ = Math.sin(t * 0.68 + index * 1.7) * 0.016;

      // Air wake from mouse sweeping across the gallery
      const { vx, vy } = mouseVelRef.current;
      const proximity = Math.max(0, 1 - Math.abs(d) * 0.25);
      p.velX += THREE.MathUtils.clamp(-vy * proximity * 0.16, -0.7, 0.7) * dt * 10;
      p.velZ += THREE.MathUtils.clamp(vx * proximity * 0.12, -0.5, 0.5) * dt * 10;

      // Inertial swing kick whenever the user slides the clothesline
      p.velX += THREE.MathUtils.clamp(scrollVelRef.current * 0.38, -1.2, 1.2) * dt * 8;
      p.velZ += THREE.MathUtils.clamp(-scrollVelRef.current * 0.18, -0.6, 0.6) * dt * 8;

      const targetX = isHovered ? -0.09 : breezeX;
      const targetZ = isHovered ? 0 : breezeZ;

      const stiffness = isHovered ? 15 : 8;
      const damping = isHovered ? 5.2 : 2.5;

      p.velX += ((targetX - p.rotX) * stiffness - p.velX * damping) * dt;
      p.velZ += ((targetZ - p.rotZ) * stiffness - p.velZ * damping) * dt;

      p.rotX = THREE.MathUtils.clamp(p.rotX + p.velX * dt, -0.26, 0.26);
      p.rotZ = THREE.MathUtils.clamp(p.rotZ + p.velZ * dt, -0.14, 0.14);

      // On hover, print swings gently open toward viewer while clothespins stay locked on the wire
      p.rotYOffset = THREE.MathUtils.lerp(
        p.rotYOffset,
        isHovered ? -0.1 : 0,
        dt * 7
      );
      p.scale = THREE.MathUtils.lerp(p.scale, isHovered ? 1.038 : 1.0, dt * 7);

      swing.rotation.set(p.rotX, p.rotYOffset, p.rotZ);
      swing.position.set(0, 0, 0);
      swing.scale.setScalar(p.scale);
    }

    if (frontMatRef.current) {
      const shade = isHovered ? 1.0 : depthFactor;
      frontMatRef.current.color.setScalar(shade);
      frontMatRef.current.opacity = opacity;
      frontMatRef.current.depthWrite = opacity > 0.94;
      frontMatRef.current.emissiveIntensity = isHovered
        ? 0.24
        : 0.12 + depthFactor * 0.1;
    }
    if (backMatRef.current) {
      backMatRef.current.opacity = opacity * 0.92;
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!isDraggingRef.current) {
      document.body.style.cursor = 'pointer';
      onHover(project);
      physics.current.velX += 0.18;
    }
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = '';
    onHover(null);
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
      onSelect(project);
    }
  };

  const clipOffset = cardWidth * 0.3;
  const cardCenterY = -(cardHeight / 2 + 0.045);

  return (
    <group ref={anchorGroupRef}>
      <group ref={swingGroupRef}>
        {/* Two natural birch-wood clothespins gripping the taut diagonal wires */}
        <WoodenClothespin xOffset={-clipOffset} highlighted={isHovered} />
        <WoodenClothespin xOffset={clipOffset} highlighted={isHovered} />

        {/* Hanging full-bleed photographic art print */}
        <group position={[0, cardCenterY, 0]}>
          {/* Subtle paper backing thickness (no bulky frame border) */}
          <mesh ref={backMeshRef} position={[0, 0, -0.008]} geometry={printGeo}>
            <meshStandardMaterial
              ref={backMatRef}
              color="#0c0f18"
              roughness={0.75}
              metalness={0.05}
              transparent
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Crisp front photographic print surface */}
          <mesh
            ref={frontMeshRef}
            geometry={printGeo}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <meshStandardMaterial
              ref={frontMatRef}
              map={texture}
              emissiveMap={texture}
              emissive="#ffffff"
              emissiveIntensity={0.2}
              roughness={0.34}
              metalness={0.02}
              transparent
              alphaTest={0.04}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};

interface ClotheslineSceneProps {
  projects: ProjectItem[];
  hoveredProject: ProjectItem | null;
  onHoverProject: (project: ProjectItem | null) => void;
  onSelectProject: (project: ProjectItem) => void;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  targetScrollRef: React.MutableRefObject<number | null>;
  dragDeltaRef: React.MutableRefObject<number>;
  scrollVelRef: React.MutableRefObject<number>;
  isDraggingRef: React.MutableRefObject<boolean>;
  reducedMotion: boolean;
}

const ClotheslineScene: React.FC<ClotheslineSceneProps> = ({
  projects,
  hoveredProject,
  onHoverProject,
  onSelectProject,
  activeIndex,
  onActiveIndexChange,
  targetScrollRef,
  dragDeltaRef,
  scrollVelRef,
  isDraggingRef,
  reducedMotion,
}) => {
  const { size, camera } = useThree();
  const isCompact = size.width < 700;

  const scrollPosRef = useRef<number>(0);
  const lastReportedIdx = useRef<number>(0);
  const prevPointer = useRef({ x: 0, y: 0 });
  const mouseVelRef = useRef({ vx: 0, vy: 0 });

  const count = projects.length;

  // Responsive diagonal 3D perspective geometry
  const layout = useMemo(() => {
    if (isCompact) {
      return {
        origin: [count === 1 ? 0 : -0.68, 0.72, 1.45] as [number, number, number],
        step: [0.68, 0.34, -1.25] as [number, number, number],
        cardWidth: 2.55,
        cardHeight: 1.68,
        baseRotY: count === 1 ? 0.04 : 0.22,
        camPos: [0, 0.1, 8.2] as [number, number, number],
      };
    }

    if (count === 1) {
      return {
        origin: [0, 0.95, 1.35] as [number, number, number],
        step: [1.18, 0.28, -1.18] as [number, number, number],
        cardWidth: 3.45,
        cardHeight: 2.26,
        baseRotY: 0.08,
        camPos: [0, 0.15, 7.1] as [number, number, number],
      };
    }

    return {
      origin: [-1.72, 0.88, 1.62] as [number, number, number],
      step: [1.18, 0.29, -1.16] as [number, number, number],
      cardWidth: 3.22,
      cardHeight: 2.12,
      baseRotY: 0.27,
      camPos: [0.15, 0.18, 7.45] as [number, number, number],
    };
  }, [isCompact, count]);

  // Reset scroll position cleanly when project list changes (category filter)
  useEffect(() => {
    scrollPosRef.current = 0;
    targetScrollRef.current = 0;
    lastReportedIdx.current = 0;
  }, [count, targetScrollRef]);

  // Sync external activeIndex changes (from pill arrows / dots) smoothly
  useEffect(() => {
    if (count <= 1) {
      targetScrollRef.current = 0;
      return;
    }
    const curr = scrollPosRef.current;
    if (count <= 3) {
      targetScrollRef.current = activeIndex;
    } else {
      const currMod = ((curr % count) + count) % count;
      let diff = activeIndex - currMod;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;
      targetScrollRef.current = curr + diff;
    }
    lastReportedIdx.current = activeIndex;
  }, [activeIndex, count, targetScrollRef]);

  const hoveredIndex = useMemo(() => {
    if (!hoveredProject) return -1;
    return projects.findIndex((p) => p.id === hoveredProject.id);
  }, [hoveredProject, projects]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    // Track pointer velocity for realistic air-wake pendulum sway
    const px = state.pointer.x;
    const py = state.pointer.y;
    const rawVx = (px - prevPointer.current.x) / Math.max(dt, 0.008);
    const rawVy = (py - prevPointer.current.y) / Math.max(dt, 0.008);
    prevPointer.current = { x: px, y: py };

    mouseVelRef.current.vx = THREE.MathUtils.lerp(
      mouseVelRef.current.vx,
      THREE.MathUtils.clamp(rawVx, -8, 8),
      0.24
    );
    mouseVelRef.current.vy = THREE.MathUtils.lerp(
      mouseVelRef.current.vy,
      THREE.MathUtils.clamp(rawVy, -8, 8),
      0.24
    );

    // Update smooth clothesline sliding position
    if (count > 1) {
      if (isDraggingRef.current) {
        targetScrollRef.current = null;
        if (dragDeltaRef.current !== 0) {
          scrollPosRef.current += dragDeltaRef.current;
          if (count <= 3) {
            scrollPosRef.current = THREE.MathUtils.clamp(
              scrollPosRef.current,
              -0.15,
              count - 0.85
            );
          }
          dragDeltaRef.current = 0;
        }
      } else if (targetScrollRef.current !== null) {
        const diff = targetScrollRef.current - scrollPosRef.current;
        const stepDelta = diff * Math.min(1, dt * 7.5);
        scrollVelRef.current = stepDelta / Math.max(dt, 0.016);
        scrollPosRef.current += stepDelta;
        if (Math.abs(diff) < 0.002) {
          scrollPosRef.current = targetScrollRef.current;
          targetScrollRef.current = null;
          scrollVelRef.current = 0;
        }
      } else {
        // Momentum decay + gentle snap to nearest hanging print
        if (Math.abs(scrollVelRef.current) > 0.04) {
          scrollPosRef.current += scrollVelRef.current * dt;
          scrollVelRef.current *= Math.pow(0.06, dt);
          if (count <= 3) {
            scrollPosRef.current = THREE.MathUtils.clamp(
              scrollPosRef.current,
              0,
              count - 1
            );
          }
        } else {
          scrollVelRef.current = 0;
          const nearest = Math.round(scrollPosRef.current);
          const clampedNearest =
            count <= 3
              ? THREE.MathUtils.clamp(nearest, 0, count - 1)
              : nearest;
          scrollPosRef.current = THREE.MathUtils.lerp(
            scrollPosRef.current,
            clampedNearest,
            dt * 5.5
          );
        }
      }

      // Report currently front-focused index cleanly
      const idx =
        count <= 3
          ? THREE.MathUtils.clamp(Math.round(scrollPosRef.current), 0, count - 1)
          : ((Math.round(scrollPosRef.current) % count) + count) % count;
      if (idx !== lastReportedIdx.current && targetScrollRef.current === null) {
        lastReportedIdx.current = idx;
        onActiveIndexChange(idx);
      }
    }

    // Subtle organic 3D camera parallax
    const targetCamX =
      layout.camPos[0] + (reducedMotion ? 0 : px * (isCompact ? 0.22 : 0.48));
    const targetCamY =
      layout.camPos[1] + (reducedMotion ? 0 : py * (isCompact ? 0.16 : 0.28));

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, dt * 3);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, dt * 3);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, layout.camPos[2], dt * 3);
    camera.lookAt(0.15, 0.05, -0.35);
  });

  return (
    <>
      <ambientLight intensity={1.15} color="#f1f5f9" />
      <directionalLight position={[-3, 7, 8]} intensity={1.2} color="#ffffff" />
      <pointLight position={[5, 4, 4]} intensity={1.0} color="#dbeafe" distance={22} />

      {/* Parallel taut diagonal steel wires extending seamlessly past viewport edges */}
      <DiagonalClotheslineWires
        origin={layout.origin}
        step={layout.step}
        clipOffset={layout.cardWidth * 0.3}
        baseRotY={layout.baseRotY}
        minD={-3.5}
        maxD={Math.max(7, count + 2)}
      />

      {projects.map((project, idx) => (
        <DiagonalHangingCard
          key={project.id}
          project={project}
          index={idx}
          count={count}
          scrollPosRef={scrollPosRef}
          scrollVelRef={scrollVelRef}
          hoveredIndex={hoveredIndex}
          origin={layout.origin}
          step={layout.step}
          cardWidth={layout.cardWidth}
          cardHeight={layout.cardHeight}
          baseRotY={layout.baseRotY}
          isHovered={hoveredProject?.id === project.id}
          onHover={onHoverProject}
          onSelect={onSelectProject}
          mouseVelRef={mouseVelRef}
          isDraggingRef={isDraggingRef}
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  );
};

export const ClotheslineGallery3D: React.FC<ClotheslineGallery3DProps> = ({
  projects,
  hoveredProject,
  onHoverProject,
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

    // Dragging left brings the next receding print forward along the diagonal wire
    const delta = -dx * 0.0046;
    dragDeltaRef.current += delta;
    scrollVelRef.current = THREE.MathUtils.clamp(delta / dt, -6, 6);
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

  const displayProject =
    hoveredProject || projects[activeIndex] || projects[0] || null;

  if (!webglReady) {
    return (
      <div className="py-12 text-center text-sm text-white/60">
        WebGL unavailable on this device.
      </div>
    );
  }

  return (
    <div className="relative w-full select-none">
      {/* Open, Completely Borderless 3D Clothesline Stage */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrLeave}
        onPointerLeave={handlePointerUpOrLeave}
        className="relative w-full h-[460px] sm:h-[540px] lg:h-[620px] overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"
      >
        {/* Soft atmospheric studio radial wash — seamless fade to #030305, zero border box */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 68% 58% at 52% 46%, rgba(196, 210, 232, 0.13) 0%, rgba(96, 130, 195, 0.045) 45%, rgba(3, 3, 5, 0) 78%)',
          }}
          aria-hidden="true"
        />

        <Canvas
          frameloop={isVisible ? 'always' : 'demand'}
          dpr={[1, 1.75]}
          camera={{ position: [0.15, 0.18, 7.45], fov: 38, near: 0.1, far: 60 }}
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
          <ClotheslineScene
            projects={projects}
            hoveredProject={hoveredProject}
            onHoverProject={onHoverProject}
            onSelectProject={onSelectProject}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            targetScrollRef={targetScrollRef}
            dragDeltaRef={dragDeltaRef}
            scrollVelRef={scrollVelRef}
            isDraggingRef={isDraggingRef}
            reducedMotion={reducedMotion}
          />
        </Canvas>

        {/* Minimal Floating Frosted Bottom Pill (Framer-style, zero clutter) */}
        {displayProject && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2.5 max-w-[92vw]">
            <div
              onPointerDown={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-[#0e1018]/80 backdrop-blur-md border border-white/[0.1] shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            >
              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => stepProject(-1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => onSelectProject(displayProject)}
                className="group inline-flex items-center gap-2.5 px-2.5 py-0.5 text-left min-w-0"
              >
                <span className="font-mono text-[11px] text-blue-400/90 shrink-0">
                  {displayProject.number}
                </span>
                <span className="text-xs sm:text-sm font-medium text-white tracking-tight truncate max-w-[180px] sm:max-w-[280px]">
                  {displayProject.title}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/45 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </button>

              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => stepProject(1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Next project"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Minimal dot pagination for instant direct jump */}
            {projects.length > 1 && (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5"
              >
                {projects.map((p, idx) => {
                  const isCurrent = p.id === displayProject.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={p.title}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        isCurrent
                          ? 'w-5 bg-white'
                          : 'w-1.5 bg-white/25 hover:bg-white/55'
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
