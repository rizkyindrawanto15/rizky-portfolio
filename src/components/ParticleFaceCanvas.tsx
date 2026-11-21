import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleFaceCanvasProps {
  reducedMotion?: boolean;
}

const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uAssembleTime;
  uniform float uBurst;
  uniform vec2 uMouse;
  uniform float uHoverStrength;
  uniform float uReducedMotion;
  uniform float uPixelRatio;
  uniform float uViewportScale;

  attribute vec3 aInitialPos;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aPhase;
  attribute float aAlpha;
  attribute float aDelay;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vFlight;

  void main() {
    // Per-particle staggered shatter-to-form convergence (Pecahan -> Utuh)
    float duration = 1.95;
    float rawProgress = clamp((uAssembleTime - aDelay) / duration, 0.0, 1.0);
    // Silky quintic ease-out so shattered shards rush in and snap crisply into place
    float easeT = uReducedMotion > 0.5 ? 1.0 : 1.0 - pow(1.0 - rawProgress, 4.0);
    float flight = 1.0 - easeT;

    // Optional interactive click shatter-ripple that smoothly snaps back together
    float burstFactor = uReducedMotion > 0.5 ? 0.0 : uBurst;
    float totalScatter = clamp(flight + burstFactor * 0.42, 0.0, 1.0);

    vec3 pos = mix(position, aInitialPos, totalScatter);

    // Subtle 3D orbital swirl while shattered fragments converge into the portrait
    if (totalScatter > 0.001) {
      float swirlAngle = totalScatter * (1.25 + aPhase * 0.14);
      float cs = cos(swirlAngle);
      float sn = sin(swirlAngle);
      vec2 rotated = mat2(cs, -sn, sn, cs) * pos.xy;
      pos.xy = mix(pos.xy, rotated, totalScatter * 0.55);
    }

    if (uReducedMotion < 0.5) {
      // Gentle living micro-drift once assembled (preserves razor-sharp facial clarity)
      float settled = easeT;
      float waveX = sin(uTime * 0.65 + position.y * 2.8 + aPhase) * 0.0018 * settled;
      float waveY = cos(uTime * 0.55 + position.x * 2.8 + aPhase) * 0.0018 * settled;
      float waveZ = sin(uTime * 0.85 + position.x * 2.4 + position.y * 2.4 + aPhase) * 0.006 * settled;
      pos += vec3(waveX, waveY, waveZ);

      // Interactive cursor repulsion & subtle ripple
      vec2 mouseWorld = uMouse * vec2(1.42, 1.32);
      vec2 delta = pos.xy - mouseWorld;
      float dist = length(delta);
      float radius = 0.36;
      if (dist < radius && dist > 0.0001) {
        float force = pow(1.0 - dist / radius, 2.0) * uHoverStrength * settled;
        vec2 dir = normalize(delta);
        vec2 swirl = vec2(-dir.y, dir.x) * 0.25;
        pos.xy += (dir * 0.058 + swirl * 0.025) * force;
        pos.z += 0.085 * force;
      }
    }

    vColor = aColor;
    // Fade in shattered fragments smoothly from deep space, locking to exact portrait alpha
    float appearFade = smoothstep(0.0, 0.18, rawProgress);
    vAlpha = aAlpha * (uReducedMotion > 0.5 ? 1.0 : appearFade);
    vFlight = totalScatter;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Shards start subtly larger & luminous mid-flight, tightening to crisp micro-points on lock-in
    float flightScale = 1.0 + totalScatter * 0.55;
    float scaledSize = aSize * flightScale * uViewportScale * uPixelRatio;
    gl_PointSize = clamp(scaledSize, 1.05 * uPixelRatio, 4.4 * uPixelRatio);
  }
`;

const FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vFlight;

  void main() {
    // Crisp glowing circular micro-particle (eliminates harsh blocky squares)
    vec2 centered = gl_PointCoord - vec2(0.5);
    float d = length(centered);
    if (d > 0.5) discard;

    // Silky anti-aliased core with delicate luminous halo
    float disc = smoothstep(0.5, 0.14, d);
    // Slight crystalline sparkle boost while fragments fly inward
    vec3 finalColor = mix(vColor, vec3(0.88, 0.94, 1.0), vFlight * 0.25);

    gl_FragColor = vec4(finalColor, vAlpha * disc);
  }
`;

export const ParticleFaceCanvas: React.FC<ParticleFaceCanvasProps> = ({
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;
    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      34,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      100
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(dpr);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const getViewportScale = (width: number) => {
      if (width < 480) return 0.72;
      if (width < 768) return 0.86;
      return 1.0;
    };

    const uniforms = {
      uTime: { value: 0 },
      uAssembleTime: { value: reducedMotion ? 10.0 : 0.0 },
      uBurst: { value: 0.0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uHoverStrength: { value: 0.0 },
      uReducedMotion: { value: reducedMotion ? 1.0 : 0.0 },
      uPixelRatio: { value: dpr },
      uViewportScale: { value: getViewportScale(container.clientWidth) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    let pointsMesh: THREE.Points | null = null;
    let activeGeometry: THREE.BufferGeometry | null = null;
    let assemblyStartTime: number | null = null;
    let burstEnergy = 0;

    const updateCameraFraming = () => {
      if (!container) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      const aspect = w / h;

      camera.aspect = aspect;
      if (aspect < 0.85) {
        camera.position.set(0, -0.06, Math.min(5.2, Math.max(3.85, 2.08 / aspect)));
      } else if (aspect < 1.2) {
        camera.position.set(0, -0.02, 3.72);
      } else {
        camera.position.set(0, 0.0, 3.34);
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      uniforms.uViewportScale.value = getViewportScale(w);

      if (pointsMesh) {
        pointsMesh.position.y = aspect < 0.85 ? 0.16 : 0.05;
      }
    };

    updateCameraFraming();

    // Refined Apple-luxury silver-platinum & subtle ice-sapphire palette
    const colPlatinum = new THREE.Color('#ffffff');
    const colPearl = new THREE.Color('#e4e7ee');
    const colSilver = new THREE.Color('#bcc4d4');
    const colIceBlue = new THREE.Color('#93c5fd');
    const colSapphire = new THREE.Color('#60a5fa');
    const colSlate = new THREE.Color('#64748b');
    const colDeepShadow = new THREE.Color('#334155');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = `/portrait-source.jpg?v=${Date.now()}`;

    img.onload = () => {
      if (isDisposed) return;

      // Dense high-clarity portrait lattice
      const cols = isMobile ? 150 : 184;
      const rows = isMobile ? 188 : 230;

      const offCanvas = document.createElement('canvas');
      offCanvas.width = cols;
      offCanvas.height = rows;
      const ctx = offCanvas.getContext('2d');
      if (!ctx) return;

      const imgW = img.naturalWidth || cols;
      const imgH = img.naturalHeight || rows;
      const imgAspect = imgW / imgH;
      const targetAspect = cols / rows;

      let sx = 0;
      let sy = 0;
      let sw = imgW;
      let sh = imgH;

      if (imgAspect > targetAspect) {
        sw = imgH * targetAspect;
        sx = (imgW - sw) * 0.5;
      } else {
        sh = imgW / targetAspect;
        sy = (imgH - sh) * 0.34;
      }

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, cols, rows);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);

      const imgData = ctx.getImageData(0, 0, cols, rows).data;

      const positions: number[] = [];
      const initialPositions: number[] = [];
      const colors: number[] = [];
      const sizes: number[] = [];
      const phases: number[] = [];
      const alphas: number[] = [];
      const delays: number[] = [];

      const worldWidth = 1.72;
      const worldHeight = worldWidth * (rows / cols);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = (r * cols + c) * 4;
          const red = imgData[idx] / 255;
          const green = imgData[idx + 1] / 255;
          const blue = imgData[idx + 2] / 255;

          const rawLum = 0.299 * red + 0.587 * green + 0.114 * blue;
          const lum = rawLum > 0.008 ? Math.pow(rawLum, 0.72) : 0;

          const nx = c / (cols - 1) - 0.5; // -0.5 .. +0.5
          const ny = 0.5 - r / (rows - 1); // +0.5 (top) .. -0.5 (bottom)

          // Smooth organic head + hair silhouette mask
          const headDist = Math.hypot(nx / 0.235, (ny - 0.075) / 0.27);
          const hairDist = Math.hypot(nx / 0.275, (ny - 0.09) / 0.305);
          const headMask = 1.0 - THREE.MathUtils.smoothstep(headDist, 0.86, 1.06);
          const hairMask =
            rawLum > 0.018
              ? 1.0 - THREE.MathUtils.smoothstep(hairDist, 0.82, 1.05)
              : 0;

          // Smooth tailored neck & arched shoulder bust (eliminates jagged U-collar cutoff!)
          const neckMask =
            (1.0 - THREE.MathUtils.smoothstep(Math.abs(nx), 0.11, 0.165)) *
            THREE.MathUtils.smoothstep(ny, -0.27, -0.15) *
            (1.0 - THREE.MathUtils.smoothstep(ny, 0.0, 0.08));

          // Natural domed shoulder silhouette curving softly downward and fading out smoothly
          const shoulderDrop = Math.max(0, -0.15 - ny);
          const shoulderArchWidth =
            0.145 + 0.285 * Math.pow(Math.min(1, shoulderDrop / 0.22), 0.62);
          const shoulderHorizFade =
            1.0 -
            THREE.MathUtils.smoothstep(
              Math.abs(nx),
              shoulderArchWidth * 0.58,
              shoulderArchWidth
            );
          const shoulderTopFade = THREE.MathUtils.smoothstep(ny, -0.14, -0.21);
          const shoulderBottomFade = THREE.MathUtils.smoothstep(ny, -0.44, -0.22);
          const shoulderMask =
            shoulderHorizFade * shoulderTopFade * shoulderBottomFade;

          const silhouetteMask = Math.max(
            headMask,
            hairMask,
            neckMask,
            shoulderMask
          );

          if (silhouetteMask < 0.03 || ny > 0.4 || ny < -0.45) {
            continue;
          }

          const wx = nx * worldWidth;
          const wy = ny * worldHeight - 0.01;

          const centerDepth = Math.max(
            0,
            1.0 - Math.hypot(nx * 2.1, (ny - 0.06) * 1.8)
          );
          const wz = lum * 0.21 + centerDepth * 0.14;

          const hash =
            Math.abs(Math.sin(c * 127.1 + r * 311.7) * 43758.5453) % 1;
          const hash2 =
            Math.abs(Math.cos(c * 269.5 + r * 183.3) * 23421.631) % 1;
          const hash3 =
            Math.abs(Math.sin(c * 419.2 + r * 97.3) * 19283.123) % 1;

          // Sculpted collar & shoulder tone softening:
          // Smoothly transitions the dark T-shirt & collarbone with gentle studio rim contour
          const isCrownHair = ny > 0.15 && ny < 0.39 && rawLum > 0.015;
          let effectiveLum = isCrownHair
            ? Math.max(lum, 0.24 + rawLum * 1.8)
            : lum;

          // Subtle studio rim light along the tailored shoulder curve so the black shirt looks clean & intentional
          const isShoulderArea = ny < -0.175 && shoulderMask > 0.05;
          if (isShoulderArea && effectiveLum < 0.18) {
            const shoulderRim =
              (1.0 - Math.abs(nx) / Math.max(0.01, shoulderArchWidth)) * 0.14;
            effectiveLum = Math.max(effectiveLum, 0.07 + shoulderRim);
          }

          // Soften the abrupt U-shaped neckline drop right around ny in [-0.24, -0.14]
          const collarZone =
            THREE.MathUtils.smoothstep(ny, -0.25, -0.17) *
            (1.0 - THREE.MathUtils.smoothstep(ny, -0.16, -0.10));
          const neckEdgeTaper =
            1.0 -
            collarZone *
              THREE.MathUtils.smoothstep(Math.abs(nx), 0.09, 0.16) *
              0.38;

          const pColor = new THREE.Color();
          let pointSize = 2.0;
          let alpha = 0.85;

          if (effectiveLum > 0.56) {
            // Crisp platinum-white skin highlights with subtle ice-blue glint
            if (hash < 0.62) {
              pColor.copy(colPlatinum);
            } else if (hash < 0.86) {
              pColor.copy(colPearl);
            } else {
              pColor.copy(colIceBlue);
            }
            pColor.multiplyScalar(0.86 + effectiveLum * 0.18);
            pointSize = 3.15 * (0.8 + hash2 * 0.32);
            alpha = 0.88 + effectiveLum * 0.12;
          } else if (effectiveLum > 0.22) {
            // Clean sterling silver facial midtones with restrained sapphire depth
            if (hash < 0.56) {
              pColor.copy(colSilver);
            } else if (hash < 0.80) {
              pColor.copy(colPearl).multiplyScalar(0.8);
            } else if (hash < 0.94) {
              pColor.copy(colSapphire);
            } else {
              pColor.copy(colIceBlue);
            }
            pColor.multiplyScalar(0.55 + effectiveLum * 0.72);
            pointSize = 2.55 * (0.76 + hash2 * 0.32);
            alpha = 0.58 + effectiveLum * 0.42;
          } else {
            // Hair shadows & finely feathered obsidian-silver shoulders
            pColor.copy(colDeepShadow).lerp(colSlate, 0.35 + hash * 0.45);
            if (hash > 0.82) {
              pColor.lerp(colSapphire, 0.35);
            }
            pointSize = isShoulderArea ? 1.85 : 2.05;
            alpha = (0.22 + effectiveLum * 1.45) * (isShoulderArea ? 0.72 : 0.9);
          }

          // Smooth global bottom feather so the bust melts cleanly above the oversized serif name
          const bottomFade = THREE.MathUtils.smoothstep(wy, -0.76, -0.28);
          alpha *= silhouetteMask * neckEdgeTaper * bottomFade;

          if (alpha < 0.02) continue;

          positions.push(wx, wy, wz);

          // Dramatic 3D shattered fragment burst origins (grouped slightly into shard clusters!)
          const shardAngle =
            Math.floor(hash * 18) * ((Math.PI * 2) / 18) + (hash2 - 0.5) * 0.45;
          const radialDist = 1.35 + hash2 * 2.15 + Math.hypot(nx, ny) * 1.1;
          const scatterZ = (hash3 - 0.45) * 3.4;

          initialPositions.push(
            wx + Math.cos(shardAngle) * radialDist,
            wy + Math.sin(shardAngle) * radialDist * 0.82,
            wz + scatterZ
          );

          // Staggered convergence delay: face core arrives crisply, outer shards cascade in cleanly
          const distFromFaceCenter = Math.hypot(nx * 1.6, (ny - 0.06) * 1.5);
          const delay =
            Math.min(0.45, distFromFaceCenter * 0.28 + hash3 * 0.22);

          colors.push(pColor.r, pColor.g, pColor.b);
          sizes.push(pointSize);
          phases.push(hash * Math.PI * 2);
          alphas.push(THREE.MathUtils.clamp(alpha, 0.0, 0.98));
          delays.push(delay);
        }
      }

      // Delicate ambient stardust motes floating in the dark void
      const starCount = isMobile ? 65 : 130;
      for (let i = 0; i < starCount; i++) {
        const sxPos = (Math.random() - 0.5) * 4.0;
        const syPos = (Math.random() - 0.5) * 2.5;
        const szPos = (Math.random() - 0.5) * 0.9 - 0.25;
        positions.push(sxPos, syPos, szPos);
        initialPositions.push(sxPos * 1.6, syPos * 1.6, szPos - 1.2);

        const starCol = i % 3 === 0 ? colIceBlue : colSilver;
        colors.push(starCol.r, starCol.g, starCol.b);
        sizes.push(1.0 + Math.random() * 0.95);
        phases.push(Math.random() * Math.PI * 2);
        alphas.push(0.14 + Math.random() * 0.28);
        delays.push(Math.random() * 0.45);
      }

      activeGeometry = new THREE.BufferGeometry();
      activeGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      );
      activeGeometry.setAttribute(
        'aInitialPos',
        new THREE.Float32BufferAttribute(initialPositions, 3)
      );
      activeGeometry.setAttribute(
        'aColor',
        new THREE.Float32BufferAttribute(colors, 3)
      );
      activeGeometry.setAttribute(
        'aSize',
        new THREE.Float32BufferAttribute(sizes, 1)
      );
      activeGeometry.setAttribute(
        'aPhase',
        new THREE.Float32BufferAttribute(phases, 1)
      );
      activeGeometry.setAttribute(
        'aAlpha',
        new THREE.Float32BufferAttribute(alphas, 1)
      );
      activeGeometry.setAttribute(
        'aDelay',
        new THREE.Float32BufferAttribute(delays, 1)
      );

      pointsMesh = new THREE.Points(activeGeometry, material);
      const currentAspect =
        container.clientWidth / Math.max(1, container.clientHeight);
      pointsMesh.position.y = currentAspect < 0.85 ? 0.16 : 0.05;
      scene.add(pointsMesh);

      // Start the Shatter-to-Form clock RIGHT NOW when the portrait actually enters the scene!
      assemblyStartTime = performance.now();
    };

    const targetMouse = new THREE.Vector2(0, 0);
    const currentMouse = new THREE.Vector2(0, 0);
    let targetHover = 0;
    let currentHover = 0;
    let touchDecayTimer: number | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetMouse.set(nx, ny);

      if (e.pointerType === 'touch') {
        targetHover = 0.45;
        if (touchDecayTimer) window.clearTimeout(touchDecayTimer);
        touchDecayTimer = window.setTimeout(() => {
          targetHover = 0.0;
          targetMouse.set(0, 0);
        }, 320);
      } else {
        targetHover = 1.0;
      }
    };

    const handlePointerLeave = () => {
      targetHover = 0.0;
      targetMouse.set(0, 0);
    };

    // Subtle kinetic shatter-ripple when user clicks directly on the portrait
    const handleClick = (e: MouseEvent) => {
      if (reducedMotion) return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest('button, a')) return;
      burstEnergy = 1.0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);
    container.addEventListener('click', handleClick);
    window.addEventListener('resize', updateCameraFraming);

    let animationFrameId: number;
    const bootTime = performance.now();
    let prevNow = bootTime;

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - prevNow) * 0.001);
      prevNow = now;
      const elapsed = (now - bootTime) * 0.001;

      uniforms.uTime.value = elapsed;

      if (assemblyStartTime !== null) {
        if (reducedMotion) {
          uniforms.uAssembleTime.value = 10.0;
        } else {
          uniforms.uAssembleTime.value = (now - assemblyStartTime) * 0.001;
        }
      }

      if (burstEnergy > 0.001) {
        burstEnergy *= Math.pow(0.045, dt);
        if (burstEnergy < 0.002) burstEnergy = 0;
      }
      uniforms.uBurst.value = burstEnergy;

      currentMouse.lerp(targetMouse, 0.08);
      currentHover += (targetHover - currentHover) * 0.08;

      uniforms.uMouse.value.copy(currentMouse);
      uniforms.uHoverStrength.value = currentHover;

      if (pointsMesh && !reducedMotion) {
        pointsMesh.rotation.y =
          currentMouse.x * 0.1 + Math.sin(elapsed * 0.42) * 0.018;
        pointsMesh.rotation.x =
          -currentMouse.y * 0.065 + Math.cos(elapsed * 0.34) * 0.014;
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      isDisposed = true;
      if (touchDecayTimer) window.clearTimeout(touchDecayTimer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', updateCameraFraming);
      if (activeGeometry) activeGeometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative select-none cursor-pointer"
      aria-label="Interactive 3D point-cloud portrait of Rizky Indra Wanto"
    />
  );
};
