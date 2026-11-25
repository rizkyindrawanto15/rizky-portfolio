import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

function normalizeAngle(angle: number): number {
  let a = angle % (Math.PI * 2);
  if (a > Math.PI) a -= Math.PI * 2;
  if (a < -Math.PI) a += Math.PI * 2;
  return a;
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
 * Generates a sleek, borderless, rounded-corner full-bleed texture from the actual
 * Dicoding certificate PNG — zero thick frames or borders, clean floating card look.
 */
function createFloatingCertTexture(cert: CertificateItem): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const W = 1200;
  const H = 848; // A4 landscape 1.414:1
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  if (!ctx) return texture;

  const RADIUS = 44;

  const drawFallback = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    roundedRectPath(ctx, 4, 4, W - 8, H - 8, RADIUS);
    ctx.clip();

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#161b2e');
    grad.addColorStop(1, '#0c0f1a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '500 40px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText(cert.title, 64, 410);

    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '400 24px "JetBrains Mono", monospace';
    ctx.fillText(cert.issuingOrganization, 64, 468);
    ctx.restore();
  };

  drawFallback();
  texture.needsUpdate = true;

  if (cert.previewImageUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = cert.previewImageUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      roundedRectPath(ctx, 4, 4, W - 8, H - 8, RADIUS);
      ctx.clip();

      const innerW = W - 8;
      const innerH = H - 8;
      const cardAspect = innerW / innerH;
      const imgAspect = img.width / Math.max(1, img.height);

      if (imgAspect > cardAspect * 1.05) {
        // Wide landscape credentials (e.g. IBM SkillsBuild 1984x1227):
        // Extend the top/bottom neutral banner bars seamlessly so zero left/right text is cropped
        ctx.fillStyle = '#a8a8a8';
        ctx.fillRect(4, 4, innerW, innerH);
        const scale = innerW / img.width;
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      } else {
        // Standard A4 / 4:3 credentials (Dicoding, HackerRank): edge-to-edge cover fit
        const scale = Math.max(innerW / img.width, innerH / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      }

      // Subtle silky diagonal glass-paper light gradient
      const sheen = ctx.createLinearGradient(0, 0, W, H);
      sheen.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      sheen.addColorStop(0.45, 'rgba(255, 255, 255, 0.0)');
      sheen.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, W, H);

      // Delicate Apple glass specular rim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 2.5;
      roundedRectPath(ctx, 5, 5, W - 10, H - 10, RADIUS - 1);
      ctx.stroke();

      ctx.restore();
      texture.needsUpdate = true;
    };
  }

  return texture;
}

/**
 * Builds a gracefully curved 3D floating card geometry matching the Framer Studio Gallery
 * aesthetic where floating cards subtly bend along the spatial spiral arc.
 */
function createCurvedCardGeometry(
  width: number,
  height: number,
  curveDepth: number
): THREE.PlaneGeometry {
  const geo = new THREE.PlaneGeometry(width, height, 24, 14);
  const pos = geo.attributes.position;
  const halfW = width * 0.5;
  const halfH = height * 0.5;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const nx = x / halfW;
    const ny = y / halfH;
    // Gentle organic cylindrical curvature along X + subtle vertical softness
    const z = -curveDepth * (nx * nx) - curveDepth * 0.14 * (ny * ny);
    pos.setZ(i, z);
  }
  geo.computeVertexNormals();
  return geo;
}

interface SpiralCardProps {
  cert: CertificateItem;
  index: number;
  count: number;
  radiusX: number;
  radiusY: number;
  radiusZ: number;
  cardWidth: number;
  cardHeight: number;
  currentAngleRef: React.MutableRefObject<number>;
  isHovered: boolean;
  isBringingForward: boolean;
  onHover: (cert: CertificateItem | null) => void;
  onClick: (cert: CertificateItem, index: number) => void;
  isDraggingRef: React.MutableRefObject<boolean>;
  reducedMotion: boolean;
}

const SpiralCertificateCard: React.FC<SpiralCardProps> = ({
  cert,
  index,
  count,
  radiusX,
  radiusY,
  radiusZ,
  cardWidth,
  cardHeight,
  currentAngleRef,
  isHovered,
  isBringingForward,
  onHover,
  onClick,
  isDraggingRef,
  reducedMotion,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const frontMeshRef = useRef<THREE.Mesh>(null);
  const backMeshRef = useRef<THREE.Mesh>(null);
  const frontMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const backMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const smoothState = useRef({
    scale: 1,
    forwardBoost: 0,
  });

  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const [curvedGeo, setCurvedGeo] = useState<THREE.PlaneGeometry | null>(null);

  useEffect(() => {
    const tex = createFloatingCertTexture(cert);
    setTexture(tex);
    return () => {
      tex.dispose();
    };
  }, [cert]);

  useEffect(() => {
    const geo = createCurvedCardGeometry(cardWidth, cardHeight, 0.2);
    setCurvedGeo(geo);
    return () => {
      geo.dispose();
    };
  }, [cardWidth, cardHeight]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const angleStep = count > 1 ? (Math.PI * 2) / count : 0;
    const phase =
      count > 1
        ? normalizeAngle(index * angleStep - currentAngleRef.current)
        : 0;

    // 1.0 when centered front hero, 0.0 at deepest rear point of the spiral
    const frontFactor = (Math.cos(phase) + 1) * 0.5;

    // Sculptural 3D spatial spiral-vortex coordinates (closed continuous loop, zero wrap jump)
    let baseX = 0;
    let baseY = 0;
    let baseZ = radiusZ;

    if (count > 1) {
      baseX = Math.sin(phase) * radiusX;
      const rearLift = count === 4 ? Math.pow(1 - frontFactor, 2) * 1.15 : 0;
      const harmonicLift = count >= 10 ? Math.sin(phase * 3) * 0.11 : 0;
      const frontCenterLift = frontFactor * 0.18;
      baseY =
        Math.sin(phase * 2) * radiusY +
        Math.sin(phase) * 0.14 +
        harmonicLift +
        frontCenterLift +
        rearLift;
      baseZ = Math.cos(phase) * radiusZ;
    }

    // Gentle weightless floating bob
    const floatY = reducedMotion
      ? 0
      : Math.sin(t * 0.85 + index * 1.55) * 0.085;
    const floatZ = reducedMotion
      ? 0
      : Math.cos(t * 0.62 + index * 1.15) * 0.05;

    const denseDeck = count >= 10;
    const targetBoost = isBringingForward ? 1.18 : isHovered ? 0.38 : 0;
    const targetScale = isBringingForward
      ? 1.2
      : isHovered
      ? 0.82 + frontFactor * 0.38
      : denseDeck
      ? 0.66 + Math.pow(frontFactor, 1.65) * 0.48
      : 0.72 + Math.pow(frontFactor, 1.35) * 0.42;

    smoothState.current.forwardBoost = THREE.MathUtils.lerp(
      smoothState.current.forwardBoost,
      targetBoost,
      dt * 8
    );
    smoothState.current.scale = THREE.MathUtils.lerp(
      smoothState.current.scale,
      targetScale,
      dt * 8
    );

    const boost = smoothState.current.forwardBoost;
    const targetX = isBringingForward
      ? THREE.MathUtils.lerp(baseX, 0, 0.78)
      : baseX;
    const targetY = isBringingForward
      ? THREE.MathUtils.lerp(baseY + floatY, 0, 0.78)
      : baseY + floatY;
    const targetZ = baseZ + floatZ + boost;

    group.position.x = THREE.MathUtils.lerp(group.position.x, targetX, dt * 9);
    group.position.y = THREE.MathUtils.lerp(group.position.y, targetY, dt * 9);
    group.position.z = THREE.MathUtils.lerp(group.position.z, targetZ, dt * 9);

    // Organic perspective tilt along the 3D spiral vortex — straightening flat when front hero
    const offCenter = 1 - Math.pow(frontFactor, 2.2);
    const targetRotY = isBringingForward
      ? 0
      : -Math.sin(phase) * 0.54 * offCenter;
    const targetRotX = isBringingForward
      ? 0
      : Math.sin(phase * 2) * 0.24 * offCenter +
        (reducedMotion ? 0 : Math.sin(t * 0.7 + index) * 0.02);
    const targetRotZ = isBringingForward
      ? 0
      : -Math.sin(phase) * 0.14 * offCenter +
        (reducedMotion ? 0 : Math.cos(t * 0.6 + index) * 0.015);

    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotY, dt * 8);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotX, dt * 8);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetRotZ, dt * 8);
    group.scale.setScalar(smoothState.current.scale);

    // Strict painter order so transparent rounded curved cards layer cleanly without WebGL depth artifacts
    const order =
      Math.round(frontFactor * 100) +
      (isBringingForward ? 200 : isHovered ? 120 : 0);
    if (backMeshRef.current) backMeshRef.current.renderOrder = order;
    if (frontMeshRef.current) frontMeshRef.current.renderOrder = order + 1;

    // Smooth atmospheric depth shading (front hero = crisp 100%, deep spiral cards softer)
    if (frontMatRef.current) {
      const depthFocus = denseDeck ? Math.pow(frontFactor, 1.25) : frontFactor;
      const shade =
        isBringingForward || isHovered ? 1.0 : 0.44 + depthFocus * 0.56;
      frontMatRef.current.color.setScalar(shade);
      frontMatRef.current.emissiveIntensity = isBringingForward
        ? 0.26
        : isHovered
        ? 0.22
        : 0.07 + depthFocus * 0.15;
      const cardOpacity =
        isBringingForward || isHovered
          ? 1.0
          : (denseDeck ? 0.58 : 0.72) + depthFocus * (denseDeck ? 0.42 : 0.28);
      frontMatRef.current.opacity = cardOpacity;
      frontMatRef.current.depthWrite = cardOpacity > 0.94;
    }
    if (backMatRef.current) {
      backMatRef.current.opacity = 0.65 + frontFactor * 0.35;
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
      onClick(cert, index);
    }
  };

  if (!texture || !curvedGeo) return null;

  return (
    <group ref={groupRef}>
      {/* Sleek curved dark satin back layer (no boxy edge frame) */}
      <mesh ref={backMeshRef} position={[0, 0, -0.012]} geometry={curvedGeo}>
        <meshStandardMaterial
          ref={backMatRef}
          color="#0e111b"
          roughness={0.65}
          metalness={0.25}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Borderless rounded-corner curved Dicoding certificate front surface */}
      <mesh
        ref={frontMeshRef}
        geometry={curvedGeo}
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
          roughness={0.28}
          metalness={0.04}
          transparent
          alphaTest={0.03}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

interface SpiralSceneProps {
  certificates: CertificateItem[];
  focusedIndex: number;
  onFocusedIndexChange: (index: number) => void;
  hoveredCert: CertificateItem | null;
  onHoverCert: (cert: CertificateItem | null) => void;
  bringingForwardId: string | null;
  onSelectCert: (cert: CertificateItem, index: number) => void;
  targetAngleRef: React.MutableRefObject<number | null>;
  dragDeltaRef: React.MutableRefObject<number>;
  dragVelocityRef: React.MutableRefObject<number>;
  isDraggingRef: React.MutableRefObject<boolean>;
  reducedMotion: boolean;
}

const SpiralScene: React.FC<SpiralSceneProps> = ({
  certificates,
  focusedIndex,
  onFocusedIndexChange,
  hoveredCert,
  onHoverCert,
  bringingForwardId,
  onSelectCert,
  targetAngleRef,
  dragDeltaRef,
  dragVelocityRef,
  isDraggingRef,
  reducedMotion,
}) => {
  const { size, camera } = useThree();
  const isCompact = size.width < 700;

  const currentAngleRef = useRef<number>(0);
  const lastReportedIdx = useRef<number>(focusedIndex);

  const count = certificates.length;
  const crowdFactor = Math.min(1, Math.max(0, (count - 7) / 8));
  const radiusX = isCompact
    ? 2.15 + crowdFactor * 0.45
    : 3.32 + crowdFactor * 1.12;
  const radiusY = isCompact ? 0.84 : 1.02;
  const radiusZ = isCompact
    ? 1.7 + crowdFactor * 0.45
    : 2.25 + crowdFactor * 0.95;
  const cardWidth = isCompact ? 2.15 : 2.52;
  const cardHeight = cardWidth / 1.414;
  const baseCamZ = isCompact
    ? 8.35 + crowdFactor * 0.85
    : 7.75 + crowdFactor * 1.4;

  // Sync external focusedIndex changes (prev/next arrows) smoothly
  useEffect(() => {
    if (count <= 1) {
      targetAngleRef.current = 0;
      return;
    }
    const angleStep = (Math.PI * 2) / count;
    const desired = focusedIndex * angleStep;
    const diff = normalizeAngle(desired - currentAngleRef.current);
    targetAngleRef.current = currentAngleRef.current + diff;
    lastReportedIdx.current = focusedIndex;
  }, [focusedIndex, count, targetAngleRef]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    if (isDraggingRef.current) {
      targetAngleRef.current = null;
      if (dragDeltaRef.current !== 0) {
        currentAngleRef.current += dragDeltaRef.current;
        dragDeltaRef.current = 0;
      }
    } else if (targetAngleRef.current !== null) {
      const diff = targetAngleRef.current - currentAngleRef.current;
      currentAngleRef.current += diff * Math.min(1, dt * 6.5);
      if (Math.abs(diff) < 0.002) {
        currentAngleRef.current = targetAngleRef.current;
        targetAngleRef.current = null;
      }
    } else {
      if (Math.abs(dragVelocityRef.current) > 0.0008) {
        currentAngleRef.current += dragVelocityRef.current * dt;
        dragVelocityRef.current *= Math.pow(0.08, dt);
      } else {
        dragVelocityRef.current = 0;
        if (!hoveredCert && !bringingForwardId && !reducedMotion && count > 1) {
          // Gentle, hypnotic slow floating spiral rotation
          currentAngleRef.current += dt * 0.14;
        }
      }
    }

    // Track front-most certificate cleanly for the bottom pill
    if (count > 1 && targetAngleRef.current === null) {
      const angleStep = (Math.PI * 2) / count;
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < count; i++) {
        const d = Math.abs(
          normalizeAngle(i * angleStep - currentAngleRef.current)
        );
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      if (bestIdx !== lastReportedIdx.current) {
        lastReportedIdx.current = bestIdx;
        onFocusedIndexChange(bestIdx);
      }
    }

    // Subtle organic mouse parallax
    const targetCamX = reducedMotion
      ? 0
      : state.pointer.x * (isCompact ? 0.2 : 0.45);
    const targetCamY = reducedMotion
      ? 0.05
      : 0.05 + state.pointer.y * (isCompact ? 0.16 : 0.3);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, dt * 3);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, dt * 3);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, baseCamZ, dt * 3);
    camera.lookAt(0, 0.05, 0);
  });

  return (
    <>
      <ambientLight intensity={1.1} color="#f8fafc" />
      <directionalLight position={[3, 6, 9]} intensity={1.15} color="#ffffff" />
      <pointLight position={[-5, 2, 4]} intensity={0.9} color="#dbeafe" distance={20} />

      {certificates.map((cert, idx) => (
        <SpiralCertificateCard
          key={cert.id}
          cert={cert}
          index={idx}
          count={count}
          radiusX={radiusX}
          radiusY={radiusY}
          radiusZ={radiusZ}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          currentAngleRef={currentAngleRef}
          isHovered={hoveredCert?.id === cert.id}
          isBringingForward={bringingForwardId === cert.id}
          onHover={onHoverCert}
          onClick={(c, i) => {
            if (count > 1) {
              const angleStep = (Math.PI * 2) / count;
              const desired = i * angleStep;
              const diff = normalizeAngle(desired - currentAngleRef.current);
              targetAngleRef.current = currentAngleRef.current + diff;
            }
            onSelectCert(c, i);
          }}
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

  const targetAngleRef = useRef<number | null>(null);
  const dragDeltaRef = useRef<number>(0);
  const dragVelocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const lastDragX = useRef<number>(0);
  const lastDragTime = useRef<number>(0);

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
    dragVelocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dx = e.clientX - lastDragX.current;
    const dt = Math.max(8, now - lastDragTime.current) / 1000;
    lastDragX.current = e.clientX;
    lastDragTime.current = now;

    const angularDelta = -dx * 0.0064;
    dragDeltaRef.current += angularDelta;
    dragVelocityRef.current = THREE.MathUtils.clamp(angularDelta / dt, -5.5, 5.5);
    if (Math.abs(e.clientX - dragStartX.current) > 8) {
      targetAngleRef.current = null;
    }
  };

  const handlePointerUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const stepSpiral = (dir: -1 | 1) => {
    if (certificates.length <= 1) return;
    onFocusedIndexChange(
      (prev) => (prev + dir + certificates.length) % certificates.length
    );
  };

  const activeCertIndex = hoveredCert
    ? Math.max(
        0,
        certificates.findIndex((c) => c.id === hoveredCert.id)
      )
    : Math.min(focusedIndex, Math.max(0, certificates.length - 1));

  const activeCert =
    hoveredCert || certificates[focusedIndex] || certificates[0] || null;

  if (!webglReady) {
    return (
      <div className="py-12 text-center text-sm text-white/60">
        WebGL unavailable on this device. Switch to List view above to inspect certificates.
      </div>
    );
  }

  return (
    <div className="relative w-full select-none">
      {/* Completely Borderless Open 3D Floating Spiral Stage */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrLeave}
        onPointerLeave={handlePointerUpOrLeave}
        className="relative w-full h-[460px] sm:h-[540px] lg:h-[620px] overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"
      >
        {/* Dreamy radial studio atmosphere fading seamlessly into #05060a (zero edge box) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 56% 52% at 50% 48%, rgba(212, 218, 232, 0.16) 0%, rgba(120, 148, 205, 0.06) 44%, rgba(5, 6, 10, 0) 76%)',
          }}
          aria-hidden="true"
        />

        <Canvas
          frameloop={isVisible ? 'always' : 'demand'}
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.05, 7.6], fov: 40, near: 0.1, far: 50 }}
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
          <SpiralScene
            certificates={certificates}
            focusedIndex={focusedIndex}
            onFocusedIndexChange={onFocusedIndexChange}
            hoveredCert={hoveredCert}
            onHoverCert={onHoverCert}
            bringingForwardId={bringingForwardId}
            onSelectCert={onSelectCert}
            targetAngleRef={targetAngleRef}
            dragDeltaRef={dragDeltaRef}
            dragVelocityRef={dragVelocityRef}
            isDraggingRef={isDraggingRef}
            reducedMotion={reducedMotion}
          />
        </Canvas>

        {/* Framer-Reference Minimal Floating Bottom Pill: Mini Thumbnail + Title */}
        {activeCert && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 max-w-[92vw]">
            <div
              onPointerDown={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-[#0e1018]/82 backdrop-blur-md border border-white/[0.1] shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
            >
              {certificates.length > 1 && (
                <button
                  type="button"
                  onClick={() => stepSpiral(-1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                  aria-label="Previous certificate"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  const idx = certificates.findIndex(
                    (c) => c.id === activeCert.id
                  );
                  onSelectCert(activeCert, Math.max(0, idx));
                }}
                className="inline-flex items-center gap-2.5 px-2 py-0.5 text-left min-w-0 group"
              >
                {activeCert.previewImageUrl && (
                  <img
                    src={activeCert.previewImageUrl}
                    alt=""
                    className="w-8 h-[22px] object-cover rounded-[4px] shrink-0 opacity-95 group-hover:opacity-100 transition-opacity"
                  />
                )}
                <span className="font-mono text-[11px] text-blue-400/90 shrink-0">
                  {String(activeCertIndex + 1).padStart(2, '0')}/
                  {String(certificates.length).padStart(2, '0')}
                </span>
                <span className="text-xs sm:text-sm font-medium text-white/95 group-hover:text-white tracking-tight truncate max-w-[165px] sm:max-w-[290px]">
                  {activeCert.title}
                </span>
                <span className="hidden md:inline text-[11px] font-mono text-white/45 shrink-0">
                  · {activeCert.issuingOrganization.replace(' Indonesia', '')}
                </span>
              </button>

              {certificates.length > 1 && (
                <button
                  type="button"
                  onClick={() => stepSpiral(1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                  aria-label="Next certificate"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
