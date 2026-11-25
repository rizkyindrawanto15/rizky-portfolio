import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { CertificateItem } from '../data/portfolioData';

interface CertificateSpiral3DProps {
  certificates: CertificateItem[];
  focusedIndex: number;
  onFocusedIndexChange: React.Dispatch<React.SetStateAction<number>>;
  hoveredCert: CertificateItem | null;
  onHoverCert: (cert: CertificateItem | null) => void;
  bringingForwardId: string | null;
  onSelectCert: (cert: CertificateItem, index: number) => void;
  isVisible: boolean;
  reducedMotion: boolean;
}

interface IssuerTheme {
  accentHex: string;
  auraRgba: string;
  dotClass: string;
  badgeText: string;
  shortOrg: string;
}

function getIssuerTheme(org: string): IssuerTheme {
  if (org.includes('HackerRank')) {
    return {
      accentHex: '#34d399',
      auraRgba: 'rgba(16, 185, 129, 0.20)',
      dotClass: 'bg-emerald-400',
      badgeText: 'text-emerald-300',
      shortOrg: 'HACKERRANK',
    };
  }
  if (org.includes('IBM')) {
    return {
      accentHex: '#60a5fa',
      auraRgba: 'rgba(59, 130, 246, 0.22)',
      dotClass: 'bg-blue-400',
      badgeText: 'text-blue-300',
      shortOrg: 'IBM SKILLSBUILD',
    };
  }
  if (org.includes('Dicoding')) {
    return {
      accentHex: '#22d3ee',
      auraRgba: 'rgba(6, 182, 212, 0.20)',
      dotClass: 'bg-cyan-400',
      badgeText: 'text-cyan-300',
      shortOrg: 'DICODING INDONESIA',
    };
  }
  return {
    accentHex: '#a78bfa',
    auraRgba: 'rgba(139, 92, 246, 0.18)',
    dotClass: 'bg-violet-400',
    badgeText: 'text-violet-300',
    shortOrg: org.toUpperCase(),
  };
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

/**
 * Generates an Apple-Wallet / Raycast-inspired Anodized Dark Titanium Glass Plaque texture
 * encasing the full uncropped certificate with engraved issuer telemetry & luminous rim.
 */
function createTitaniumPlaqueTexture(
  cert: CertificateItem,
  displayIndex: number,
  totalCount: number,
  onReady?: () => void
): { texture: THREE.CanvasTexture; cancel: () => void } {
  const canvas = document.createElement('canvas');
  const W = 1400;
  const H = 980; // Clean 1.428:1 Titanium Plaque proportion
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  if (!ctx) return { texture, cancel: () => {} };

  const theme = getIssuerTheme(cert.issuingOrganization);
  const OUTER_R = 46;
  const PAD_X = 28;
  const HEADER_H = 74;
  const PAD_BOTTOM = 28;
  const INNER_X = PAD_X;
  const INNER_Y = HEADER_H;
  const INNER_W = W - PAD_X * 2;
  const INNER_H = H - HEADER_H - PAD_BOTTOM;
  const INNER_R = 26;

  const drawPlaqueShell = (certImg: HTMLImageElement | null) => {
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    roundedRectPath(ctx, 4, 4, W - 8, H - 8, OUTER_R);
    ctx.clip();

    // 1. Anodized Dark Titanium Body
    const bodyGrad = ctx.createLinearGradient(0, 0, W, H);
    bodyGrad.addColorStop(0, '#161b29');
    bodyGrad.addColorStop(0.5, '#0d1019');
    bodyGrad.addColorStop(1, '#080a11');
    ctx.fillStyle = bodyGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle top-left issuer ambient corner glow inside titanium frame
    const glow = ctx.createRadialGradient(180, 40, 10, 180, 40, 520);
    glow.addColorStop(0, `${theme.accentHex}2e`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, 220);

    // 2. Top Engraved Telemetry Header Bar
    const counterStr = `${String(displayIndex + 1).padStart(2, '0')} / ${String(
      totalCount
    ).padStart(2, '0')}`;

    // Glowing Issuer Status LED Dot
    ctx.save();
    ctx.shadowColor = theme.accentHex;
    ctx.shadowBlur = 14;
    ctx.fillStyle = theme.accentHex;
    ctx.beginPath();
    ctx.arc(PAD_X + 14, HEADER_H * 0.52, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = 'rgba(248, 250, 252, 0.92)';
    ctx.font = '600 21px "JetBrains Mono", monospace';
    ctx.fillText(
      `${counterStr}  ·  ${theme.shortOrg}`,
      PAD_X + 34,
      HEADER_H * 0.52 + 7
    );

    // Right Engraved Credential ID Pill
    const rightLabel = cert.credentialId
      ? `ID: ${cert.credentialId}`
      : cert.issueDate.toUpperCase();
    ctx.font = '500 19px "JetBrains Mono", monospace';
    const rw = ctx.measureText(rightLabel).width;
    const pillW = rw + 34;
    const pillH = 36;
    const pillX = W - PAD_X - pillW;
    const pillY = (HEADER_H - pillH) * 0.52;

    roundedRectPath(ctx, pillX, pillY, pillW, pillH, 18);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = theme.accentHex;
    ctx.fillText(rightLabel, pillX + 17, pillY + 24.5);

    // 3. Recessed Inner Certificate Viewport
    ctx.save();
    roundedRectPath(ctx, INNER_X, INNER_Y, INNER_W, INNER_H, INNER_R);
    ctx.clip();

    if (certImg) {
      const cardAspect = INNER_W / INNER_H;
      const imgAspect = certImg.width / Math.max(1, certImg.height);

      if (imgAspect > cardAspect * 1.04) {
        // Wide landscape certificate (IBM SkillsBuild 1984x1227):
        // Seamless #a8a8a8 banner extension so 100% of width & text is crystal clear
        ctx.fillStyle = '#a8a8a8';
        ctx.fillRect(INNER_X, INNER_Y, INNER_W, INNER_H);
        const scale = INNER_W / certImg.width;
        const dw = certImg.width * scale;
        const dh = certImg.height * scale;
        ctx.drawImage(
          certImg,
          INNER_X + (INNER_W - dw) / 2,
          INNER_Y + (INNER_H - dh) / 2,
          dw,
          dh
        );
      } else if (imgAspect < cardAspect * 0.96) {
        // Slightly taller 4:3 certificate (HackerRank 1600x1200):
        // Clean crisp white paper mat so zero border guilloche or signature gets clipped
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(INNER_X, INNER_Y, INNER_W, INNER_H);
        const scale = INNER_H / certImg.height;
        const dw = certImg.width * scale;
        const dh = certImg.height * scale;
        ctx.drawImage(
          certImg,
          INNER_X + (INNER_W - dw) / 2,
          INNER_Y + (INNER_H - dh) / 2,
          dw,
          dh
        );
      } else {
        // A4 landscape (Dicoding): exact full-bleed fit
        const scale = Math.max(
          INNER_W / certImg.width,
          INNER_H / certImg.height
        );
        const dw = certImg.width * scale;
        const dh = certImg.height * scale;
        ctx.drawImage(
          certImg,
          INNER_X + (INNER_W - dw) / 2,
          INNER_Y + (INNER_H - dh) / 2,
          dw,
          dh
        );
      }
    } else {
      const fallbackBg = ctx.createLinearGradient(
        INNER_X,
        INNER_Y,
        INNER_X + INNER_W,
        INNER_Y + INNER_H
      );
      fallbackBg.addColorStop(0, '#131826');
      fallbackBg.addColorStop(1, '#0b0e18');
      ctx.fillStyle = fallbackBg;
      ctx.fillRect(INNER_X, INNER_Y, INNER_W, INNER_H);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 42px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText(cert.title.slice(0, 42), INNER_X + 56, INNER_Y + 410);
    }

    // Silky museum-glass anti-glare diagonal sheen over the document
    const docSheen = ctx.createLinearGradient(
      INNER_X,
      INNER_Y,
      INNER_X + INNER_W,
      INNER_Y + INNER_H
    );
    docSheen.addColorStop(0, 'rgba(255, 255, 255, 0.07)');
    docSheen.addColorStop(0.45, 'rgba(255, 255, 255, 0.0)');
    docSheen.addColorStop(1, 'rgba(0, 0, 0, 0.06)');
    ctx.fillStyle = docSheen;
    ctx.fillRect(INNER_X, INNER_Y, INNER_W, INNER_H);
    ctx.restore();

    // Crisp hairline inner viewport rim
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 2;
    roundedRectPath(ctx, INNER_X, INNER_Y, INNER_W, INNER_H, INNER_R);
    ctx.stroke();

    // 4. Outer Anodized Specular Bezel Rim (tinted subtly with Issuer Accent)
    const rimGrad = ctx.createLinearGradient(0, 0, W, H);
    rimGrad.addColorStop(0, `${theme.accentHex}99`);
    rimGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.24)');
    rimGrad.addColorStop(0.75, 'rgba(255, 255, 255, 0.09)');
    rimGrad.addColorStop(1, `${theme.accentHex}55`);
    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = 3.5;
    roundedRectPath(ctx, 5.5, 5.5, W - 11, H - 11, OUTER_R - 1);
    ctx.stroke();

    ctx.restore();
    texture.needsUpdate = true;
    onReady?.();
  };

  drawPlaqueShell(null);

  let timerId: number | null = null;
  let cancelled = false;

  if (cert.previewImageUrl) {
    const isFrontPriority =
      displayIndex <= 2 || displayIndex >= totalCount - 2;
    const startLoad = () => {
      if (cancelled || !cert.previewImageUrl) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      if (isFrontPriority) {
        (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority =
          'high';
      }
      img.src = cert.previewImageUrl;
      img.onload = () => {
        if (!cancelled) drawPlaqueShell(img);
      };
    };

    if (isFrontPriority) {
      startLoad();
    } else {
      // Stagger off-stage plaques slightly so visible front plaques decode instantaneously
      timerId = window.setTimeout(startLoad, 260 + displayIndex * 35);
    }
  }

  return {
    texture,
    cancel: () => {
      cancelled = true;
      if (timerId !== null) window.clearTimeout(timerId);
    },
  };
}

/**
 * Gently curved spatial glass plaque geometry
 */
function createPlaqueGeometry(width: number, height: number): THREE.PlaneGeometry {
  const geo = new THREE.PlaneGeometry(width, height, 24, 14);
  const pos = geo.attributes.position;
  const halfW = width * 0.5;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const nx = x / halfW;
    // Gentle VisionOS spatial curvature
    pos.setZ(i, -0.09 * (nx * nx));
  }
  geo.computeVertexNormals();
  return geo;
}

interface VaultPlaqueProps {
  cert: CertificateItem;
  index: number;
  count: number;
  scrollPosRef: React.MutableRefObject<number>;
  cardWidth: number;
  cardHeight: number;
  isCompact: boolean;
  isHovered: boolean;
  isBringingForward: boolean;
  onHover: (cert: CertificateItem | null) => void;
  onFocusIndex: (index: number) => void;
  onSelectCert: (cert: CertificateItem, index: number) => void;
  isDraggingRef: React.MutableRefObject<boolean>;
  reducedMotion: boolean;
}

const VaultCredentialPlaque: React.FC<VaultPlaqueProps> = ({
  cert,
  index,
  count,
  scrollPosRef,
  cardWidth,
  cardHeight,
  isCompact,
  isHovered,
  isBringingForward,
  onHover,
  onFocusIndex,
  onSelectCert,
  isDraggingRef,
  reducedMotion,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const frontMeshRef = useRef<THREE.Mesh>(null);
  const backMeshRef = useRef<THREE.Mesh>(null);
  const frontMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const backMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const { invalidate } = useThree();
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const [plaqueGeo, setPlaqueGeo] = useState<THREE.PlaneGeometry | null>(null);

  useEffect(() => {
    const { texture: tex, cancel } = createTitaniumPlaqueTexture(
      cert,
      index,
      count,
      () => invalidate()
    );
    setTexture(tex);
    return () => {
      cancel();
      tex.dispose();
    };
  }, [cert, index, count, invalidate]);

  useEffect(() => {
    const geo = createPlaqueGeometry(cardWidth, cardHeight);
    setPlaqueGeo(geo);
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

    // Strictly cull deep rear cards so ZERO overlapping clutter ever appears behind the hero!
    const maxVisibleSlots = isCompact ? 2.25 : 3.25;
    const opacity = THREE.MathUtils.clamp(
      1 - Math.max(0, absD - (maxVisibleSlots - 0.75)) / 0.75,
      0,
      1
    );
    group.visible = opacity > 0.015;
    if (!group.visible) return;

    const focusFactor = Math.max(0, 1 - absD);
    const clampedAbs = Math.min(absD, 1);
    const extraAbs = Math.max(0, absD - 1);

    // Sculptural 3D Arched Orbital Fan coordinates:
    // Hero sits elevated front-and-center; side credentials fan outward in a sweeping parabolic arch
    const spreadPrimary = isCompact ? 2.05 : 2.95;
    const spreadSecondary = isCompact ? 1.05 : 1.48;

    const baseX = sign * (clampedAbs * spreadPrimary + extraAbs * spreadSecondary);
    const archDropY = -Math.pow(absD, 1.32) * (isCompact ? 0.16 : 0.24);
    const floatY =
      !reducedMotion && absD < 0.6
        ? Math.sin(t * 1.1 + index * 0.9) * 0.035
        : 0;
    const baseY = 0.14 + archDropY + floatY;

    const baseZ =
      1.45 -
      Math.pow(clampedAbs, 1.08) * 1.95 -
      extraAbs * 0.92 +
      (isBringingForward ? 0.65 : isHovered && absD < 0.35 ? 0.18 : 0);

    // Interactive 3D Gyroscope Tilt on Hero + Sculptural Fan Rotation on Wings
    const gyroY =
      !reducedMotion && absD < 0.4 ? state.pointer.x * 0.15 : 0;
    const gyroX =
      !reducedMotion && absD < 0.4 ? -state.pointer.y * 0.1 : 0;

    const fanRotY = -sign * Math.min(0.68, Math.pow(absD, 0.85) * 0.52);
    const fanRotZ = -d * (isCompact ? 0.045 : 0.058); // Signature luxury tarot/poker fan tilt!
    const fanRotX = Math.pow(absD, 1.15) * 0.04;

    const targetRotY = isBringingForward
      ? 0
      : absD < 0.35
      ? THREE.MathUtils.lerp(gyroY, fanRotY, absD / 0.35)
      : fanRotY;
    const targetRotX = isBringingForward
      ? 0
      : absD < 0.35
      ? THREE.MathUtils.lerp(gyroX, fanRotX, absD / 0.35)
      : fanRotX;
    const targetRotZ = isBringingForward ? 0 : fanRotZ * (1 - focusFactor * 0.85);

    const targetScale = isBringingForward
      ? 1.12
      : 0.72 +
        Math.pow(focusFactor, 1.25) * 0.34 +
        (isHovered && absD < 0.35 ? 0.03 : 0);

    group.position.x = THREE.MathUtils.lerp(group.position.x, baseX, dt * 10);
    group.position.y = THREE.MathUtils.lerp(group.position.y, baseY, dt * 10);
    group.position.z = THREE.MathUtils.lerp(group.position.z, baseZ, dt * 10);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotY, dt * 9);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotX, dt * 9);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetRotZ, dt * 9);
    group.scale.setScalar(
      THREE.MathUtils.lerp(group.scale.x, targetScale, dt * 9)
    );

    const order =
      Math.round(300 - absD * 40) + (isBringingForward ? 150 : 0);
    if (backMeshRef.current) backMeshRef.current.renderOrder = order;
    if (frontMeshRef.current) frontMeshRef.current.renderOrder = order + 1;

    if (frontMatRef.current) {
      const shade =
        isBringingForward || (isHovered && absD < 0.5)
          ? 1.0
          : 0.36 + focusFactor * 0.64;
      frontMatRef.current.color.setScalar(shade);
      frontMatRef.current.opacity = opacity;
      frontMatRef.current.depthWrite = opacity > 0.95;
      frontMatRef.current.emissiveIntensity =
        0.1 + focusFactor * 0.16 + (isHovered ? 0.05 : 0);
    }
    if (backMatRef.current) {
      backMatRef.current.opacity = opacity * 0.95;
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!isDraggingRef.current) {
      document.body.style.cursor = 'pointer';
      onHover(cert);
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
      const d = Math.abs(getCyclicDelta(index, scrollPosRef.current));
      if (d < 0.32) {
        onSelectCert(cert, index);
      } else {
        onFocusIndex(index);
      }
    }
  };

  if (!texture || !plaqueGeo) return null;

  return (
    <group ref={groupRef}>
      {/* Anodized Dark Titanium Rear Backing Plate */}
      <mesh ref={backMeshRef} position={[0, 0, -0.016]} geometry={plaqueGeo}>
        <meshStandardMaterial
          ref={backMatRef}
          color="#090c14"
          roughness={0.5}
          metalness={0.45}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* High-DPI Titanium Plaque Front Surface */}
      <mesh
        ref={frontMeshRef}
        geometry={plaqueGeo}
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
          emissiveIntensity={0.22}
          roughness={0.22}
          metalness={0.12}
          transparent
          alphaTest={0.02}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

/**
 * Color-morphing 3D Orbital Halo Rings & Subtle Spatial Motes beneath the floating plaques
 */
const OrbitalStageAtmosphere: React.FC<{
  accentHex: string;
  reducedMotion: boolean;
}> = ({ accentHex, reducedMotion }) => {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const innerMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const motesRef = useRef<THREE.Points>(null);

  const targetColor = useMemo(() => new THREE.Color(accentHex), [accentHex]);

  const motesGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 48;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Deterministic clean distribution across the stage
      const a = (i / count) * Math.PI * 2;
      const r = 2.2 + ((i * 7) % 11) * 0.42;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (((i * 13) % 17) / 17 - 0.5) * 2.6;
      pos[i * 3 + 2] = Math.sin(a) * (r * 0.45) - 1.2;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      motesGeo.dispose();
    };
  }, [motesGeo]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    if (outerMatRef.current) {
      outerMatRef.current.color.lerp(targetColor, dt * 4);
    }
    if (innerMatRef.current) {
      innerMatRef.current.color.lerp(targetColor, dt * 4);
    }
    if (!reducedMotion) {
      if (outerRingRef.current) {
        outerRingRef.current.rotation.z = t * 0.06;
      }
      if (innerRingRef.current) {
        innerRingRef.current.rotation.z = -t * 0.09;
      }
      if (motesRef.current) {
        motesRef.current.rotation.y = t * 0.035;
      }
    }
  });

  return (
    <group>
      {/* Sculptural Tilted Orbital Light Rings */}
      <mesh
        ref={outerRingRef}
        position={[0, -1.42, -0.6]}
        rotation={[Math.PI * 0.46, 0, 0]}
      >
        <ringGeometry args={[4.45, 4.49, 96]} />
        <meshBasicMaterial
          ref={outerMatRef}
          color={accentHex}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={innerRingRef}
        position={[0, -1.36, -0.3]}
        rotation={[Math.PI * 0.46, 0, 0]}
      >
        <ringGeometry args={[2.85, 2.88, 84]} />
        <meshBasicMaterial
          ref={innerMatRef}
          color={accentHex}
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Subtle Floating Spatial Dust Motes */}
      <points ref={motesRef} geometry={motesGeo}>
        <pointsMaterial
          color="#cbd5e1"
          size={0.028}
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

interface VaultSceneProps {
  certificates: CertificateItem[];
  focusedIndex: number;
  onFocusedIndexChange: React.Dispatch<React.SetStateAction<number>>;
  hoveredCert: CertificateItem | null;
  onHoverCert: (cert: CertificateItem | null) => void;
  bringingForwardId: string | null;
  onSelectCert: (cert: CertificateItem, index: number) => void;
  targetScrollRef: React.MutableRefObject<number | null>;
  dragDeltaRef: React.MutableRefObject<number>;
  scrollVelRef: React.MutableRefObject<number>;
  isDraggingRef: React.MutableRefObject<boolean>;
  accentHex: string;
  reducedMotion: boolean;
}

const VaultScene: React.FC<VaultSceneProps> = ({
  certificates,
  focusedIndex,
  onFocusedIndexChange,
  hoveredCert,
  onHoverCert,
  bringingForwardId,
  onSelectCert,
  targetScrollRef,
  dragDeltaRef,
  scrollVelRef,
  isDraggingRef,
  accentHex,
  reducedMotion,
}) => {
  const { size, camera } = useThree();
  const isCompact = size.width < 720;

  const scrollPosRef = useRef<number>(0);
  const lastReportedIdx = useRef<number>(0);
  const count = certificates.length;

  const cardWidth = isCompact ? 2.72 : 3.76;
  const cardHeight = cardWidth / (1400 / 980);
  const baseCamZ = isCompact ? 7.55 : 6.85;

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
    let diff = focusedIndex - currMod;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    targetScrollRef.current = curr + diff;
    lastReportedIdx.current = focusedIndex;
  }, [focusedIndex, count, targetScrollRef]);

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
        scrollPosRef.current += diff * Math.min(1, dt * 8.5);
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
            dt * 7
          );
        }
      }

      const idx = ((Math.round(scrollPosRef.current) % count) + count) % count;
      if (idx !== lastReportedIdx.current && targetScrollRef.current === null) {
        lastReportedIdx.current = idx;
        onFocusedIndexChange(idx);
      }
    }

    const targetCamX = reducedMotion
      ? 0
      : state.pointer.x * (isCompact ? 0.12 : 0.24);
    const targetCamY = reducedMotion
      ? 0.06
      : 0.06 + state.pointer.y * (isCompact ? 0.08 : 0.16);

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      targetCamX,
      dt * 3.5
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      targetCamY,
      dt * 3.5
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      baseCamZ,
      dt * 3.5
    );
    camera.lookAt(0, 0.02, 0);
  });

  return (
    <>
      <ambientLight intensity={1.15} color="#f8fafc" />
      <directionalLight position={[2, 6, 9]} intensity={1.25} color="#ffffff" />
      <pointLight
        position={[-4, 2, 5]}
        intensity={0.85}
        color={accentHex}
        distance={18}
      />

      <OrbitalStageAtmosphere
        accentHex={accentHex}
        reducedMotion={reducedMotion}
      />

      {certificates.map((cert, idx) => (
        <VaultCredentialPlaque
          key={cert.id}
          cert={cert}
          index={idx}
          count={count}
          scrollPosRef={scrollPosRef}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          isCompact={isCompact}
          isHovered={hoveredCert?.id === cert.id}
          isBringingForward={bringingForwardId === cert.id}
          onHover={onHoverCert}
          onFocusIndex={onFocusedIndexChange}
          onSelectCert={onSelectCert}
          isDraggingRef={isDraggingRef}
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  );
};

export const CertificateSpiral3D: React.FC<CertificateSpiral3DProps> = ({
  certificates,
  focusedIndex,
  onFocusedIndexChange,
  hoveredCert,
  onHoverCert,
  bringingForwardId,
  onSelectCert,
  isVisible,
  reducedMotion,
}) => {
  const [webglReady, setWebglReady] = useState(true);

  const targetScrollRef = useRef<number | null>(null);
  const dragDeltaRef = useRef<number>(0);
  const scrollVelRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const lastDragX = useRef<number>(0);
  const lastDragTime = useRef<number>(0);
  const wheelCooldownRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  const safeIndex =
    certificates.length > 0
      ? Math.min(Math.max(0, focusedIndex), certificates.length - 1)
      : 0;
  const activeCert = certificates[safeIndex] || certificates[0] || null;
  const activeTheme = getIssuerTheme(
    activeCert?.issuingOrganization || 'IBM SkillsBuild'
  );

  // Keyboard Left/Right navigation when visible and no modal is open
  useEffect(() => {
    if (!isVisible || certificates.length <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') {
        onFocusedIndexChange((prev) => (prev + 1) % certificates.length);
      } else if (e.key === 'ArrowLeft') {
        onFocusedIndexChange(
          (prev) => (prev - 1 + certificates.length) % certificates.length
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isVisible, certificates.length, onFocusedIndexChange]);

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

    const delta = -dx * 0.0046;
    dragDeltaRef.current += delta;
    scrollVelRef.current = THREE.MathUtils.clamp(delta / dt, -7, 7);
    if (Math.abs(e.clientX - dragStartX.current) > 8) {
      targetScrollRef.current = null;
    }
  };

  const handlePointerUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Support horizontal trackpad swipe on the 3D stage without hijacking vertical page scroll
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (certificates.length <= 1) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 14) {
      e.preventDefault();
      const now = performance.now();
      if (now - wheelCooldownRef.current > 180) {
        wheelCooldownRef.current = now;
        const dir = e.deltaX > 0 ? 1 : -1;
        onFocusedIndexChange(
          (prev) => (prev + dir + certificates.length) % certificates.length
        );
      }
    }
  };

  const stepVault = (dir: -1 | 1) => {
    if (certificates.length <= 1) return;
    onFocusedIndexChange(
      (prev) => (prev + dir + certificates.length) % certificates.length
    );
  };

  if (!webglReady) {
    return (
      <div className="py-12 text-center text-sm text-white/60">
        WebGL tidak tersedia pada perangkat ini. Gunakan mode Grid atau List di atas.
      </div>
    );
  }

  return (
    <div className="relative w-full select-none">
      {/* Open Borderless 3D Credential Vault Stage */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrLeave}
        onPointerLeave={handlePointerUpOrLeave}
        onWheel={handleWheel}
        className="relative w-full h-[380px] sm:h-[470px] lg:h-[545px] overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"
      >
        {/* Dynamic Issuer-Tinted Studio Spotlight (Emerald / IBM Blue / Dicoding Cyan) */}
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse 54% 50% at 50% 44%, ${activeTheme.auraRgba} 0%, rgba(5, 6, 10, 0) 75%)`,
          }}
          aria-hidden="true"
        />

        <Canvas
          frameloop={isVisible ? 'always' : 'demand'}
          dpr={[1, 1.85]}
          camera={{ position: [0, 0.06, 6.85], fov: 38, near: 0.1, far: 50 }}
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
          <VaultScene
            certificates={certificates}
            focusedIndex={safeIndex}
            onFocusedIndexChange={onFocusedIndexChange}
            hoveredCert={hoveredCert}
            onHoverCert={onHoverCert}
            bringingForwardId={bringingForwardId}
            onSelectCert={onSelectCert}
            targetScrollRef={targetScrollRef}
            dragDeltaRef={dragDeltaRef}
            scrollVelRef={scrollVelRef}
            isDraggingRef={isDraggingRef}
            accentHex={activeTheme.accentHex}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      </div>

      {/* Precision Telemetry HUD + Interactive macOS-Style Thumbnail Scrubber Dock */}
      {activeCert && (
        <div className="max-w-3xl mx-auto px-5 -mt-3 sm:-mt-5 relative z-10 flex flex-col items-center text-center gap-4">
          <div className="min-h-[82px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCert.id}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -5 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-1.5"
              >
                <div className="inline-flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono">
                  <span className="inline-flex items-center gap-1.5 text-white/90 font-medium">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${activeTheme.dotClass}`}
                    />
                    <span>{activeCert.issuingOrganization}</span>
                  </span>
                  <span className="text-white/25">·</span>
                  <span className={activeTheme.badgeText}>
                    {activeCert.category}
                  </span>
                  <span className="text-white/25">·</span>
                  <span className="text-white/50">{activeCert.issueDate}</span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-[28px] font-medium tracking-tight text-white max-w-2xl leading-snug">
                  {activeCert.title}
                </h3>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Primary Controls: Prev | Inspect Zoom | Download PDF/PNG | Official Verify | Next */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {certificates.length > 1 && (
              <button
                type="button"
                onClick={() => stepVault(-1)}
                className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.1] flex items-center justify-center text-white/80 hover:text-white transition-all"
                aria-label="Previous certificate"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onSelectCert(activeCert, safeIndex)}
              style={{ color: '#05060a' }}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-white/90 text-xs sm:text-sm font-medium tracking-tight shadow-[0_8px_28px_rgba(255,255,255,0.16)] transition-all"
            >
              <span>Perbesar Sertifikat</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            {activeCert.fileUrl && (
              <a
                href={activeCert.fileUrl}
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.13] border border-white/[0.1] text-white/85 hover:text-white text-xs font-medium transition-all"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  {activeCert.fileUrl.toLowerCase().endsWith('.pdf')
                    ? 'PDF'
                    : 'PNG'}
                </span>
              </a>
            )}

            {activeCert.verificationUrl && (
              <a
                href={activeCert.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-500/[0.12] hover:bg-emerald-500/[0.22] border border-emerald-400/30 text-emerald-200 hover:text-white text-xs font-medium transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verify</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            )}

            {certificates.length > 1 && (
              <button
                type="button"
                onClick={() => stepVault(1)}
                className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.1] flex items-center justify-center text-white/80 hover:text-white transition-all"
                aria-label="Next certificate"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Interactive macOS-Style Credential Thumbnail Scrubber Dock */}
          {certificates.length > 1 && (
            <div className="max-w-full overflow-x-auto py-1.5 px-2 no-scrollbar">
              <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0b0e17]/90 backdrop-blur-xl border border-white/[0.09] shadow-[0_12px_36px_rgba(0,0,0,0.55)]">
                {certificates.map((c, idx) => {
                  const isCurrent = idx === safeIndex;
                  const cTheme = getIssuerTheme(c.issuingOrganization);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onFocusedIndexChange(idx)}
                      title={`${c.index} · ${c.title}`}
                      aria-label={`Focus ${c.title}`}
                      className={`relative rounded-lg overflow-hidden transition-all duration-300 shrink-0 ${
                        isCurrent
                          ? 'w-12 sm:w-14 h-8 sm:h-9 ring-2 ring-white scale-105 opacity-100 shadow-lg'
                          : 'w-7 sm:w-8 h-5 sm:h-6 opacity-45 hover:opacity-85 hover:scale-105'
                      }`}
                    >
                      {c.previewImageUrl ? (
                        <img
                          src={c.previewImageUrl}
                          alt=""
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="w-full h-full block bg-white/10" />
                      )}
                      {isCurrent && (
                        <span
                          className={`absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${cTheme.dotClass}`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
