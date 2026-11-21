import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ParticleFaceCanvas } from './ParticleFaceCanvas';
import { MagneticButton } from './MagneticButton';
import { PERSONAL_INFO } from '../data/portfolioData';

interface HeroSectionProps {
  onEnterPortfolio: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onEnterPortfolio }) => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [processedSignatureUrl, setProcessedSignatureUrl] = useState<
    string | null
  >(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Automatically convert any uploaded signature image (black ink on white/transparent)
  // into luminous silver-white ink on a 100% transparent background
  useEffect(() => {
    if (!PERSONAL_INFO.signatureImageUrl) {
      setProcessedSignatureUrl(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = PERSONAL_INFO.signatureImageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 400;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setProcessedSignatureUrl(PERSONAL_INFO.signatureImageUrl);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 15) {
          data[i + 3] = 0;
          continue;
        }

        // Brightness in [0..255]; dark ink has low brightness, white background has high brightness
        const brightness = (r + g + b) / 3;
        const inkStrength = Math.max(0, Math.min(1, (235 - brightness) / 185));

        if (inkStrength < 0.08) {
          // Transparent background
          data[i + 3] = 0;
        } else {
          // Luminous silver-white signature ink
          data[i] = 226;
          data[i + 1] = 232;
          data[i + 2] = 242;
          data[i + 3] = Math.round(
            Math.pow(inkStrength, 0.85) * (a / 255) * 235
          );
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedSignatureUrl(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      setProcessedSignatureUrl(PERSONAL_INFO.signatureImageUrl);
    };
  }, []);

  /**
   * Vector signature redrawn from the owner's handwritten signature (public/TTDD.png):
   * tall slanted stem + looping bowl, small "a" and double hump, then a long "y"
   * descender that loops and sweeps upward to the top-right — composed across the
   * portrait like the reference, with a sequential handwriting reveal.
   */
  const SIGNATURE_STEM =
    'M 330 132 C 340 128, 350 140, 352 156 C 364 300, 398 450, 432 560';
  const SIGNATURE_MAIN =
    'M 385 162 C 385 104, 422 64, 459 73 ' +
    'C 523 80, 588 135, 597 216 ' +
    'C 606 274, 597 318, 569 332 ' +
    'C 542 318, 486 318, 477 352 ' +
    'C 468 380, 542 386, 588 345 ' +
    'C 597 332, 606 352, 615 379 ' +
    'C 634 332, 661 291, 689 305 ' +
    'C 707 318, 698 359, 707 379 ' +
    'C 726 332, 753 284, 781 298 ' +
    'C 799 311, 790 359, 808 373 ' +
    'C 836 373, 854 298, 854 243 ' +
    'C 854 325, 836 495, 790 631 ' +
    'C 772 685, 726 685, 744 638 ' +
    'C 790 495, 974 325, 1121 175 ' +
    'C 1190 108, 1268 70, 1336 78 ' +
    'C 1372 82, 1394 66, 1412 44';
  const SIGNATURE_FLOURISH =
    'M 96 612 C 52 590, 58 540, 132 516 C 340 452, 640 430, 930 418';

  const renderDefaultSignatureSvg = (isForegroundTrace: boolean) => {
    const baseColor = isForegroundTrace
      ? 'rgba(236, 240, 246, 0.62)'
      : 'rgba(214, 219, 230, 0.6)';
    const strokes = [
      { d: SIGNATURE_STEM, delay: 0.15, duration: 0.7, width: 1.9 },
      { d: SIGNATURE_MAIN, delay: 0.75, duration: 2.6, width: 1.9 },
      { d: SIGNATURE_FLOURISH, delay: 3.1, duration: 1.0, width: 1.3 },
    ];

    return (
      <svg
        viewBox="0 0 1440 860"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[86%] max-w-[1060px] h-auto -translate-y-6 md:translate-y-2"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {strokes.map((s, i) => (
          <g key={i}>
            {/* Soft ink body for a calligraphic, slightly heavier stroke */}
            {!isForegroundTrace && (
              <motion.path
                d={s.d}
                stroke="rgba(203, 213, 225, 0.16)"
                strokeWidth={s.width * 2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: reducedMotion ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: reducedMotion ? 0.1 : s.duration,
                  delay: reducedMotion ? 0 : s.delay,
                  ease: [0.45, 0.05, 0.25, 1],
                }}
              />
            )}
            {/* Crisp silver ink line */}
            <motion.path
              d={s.d}
              stroke={i === 2 ? 'rgba(214, 219, 230, 0.38)' : baseColor}
              strokeWidth={isForegroundTrace ? s.width * 0.7 : s.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: reducedMotion ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: reducedMotion ? 0.1 : s.duration,
                delay: reducedMotion ? 0 : s.delay,
                ease: [0.45, 0.05, 0.25, 1],
              }}
            />
          </g>
        ))}
      </svg>
    );
  };

  return (
    <section
      id="home"
      className="relative w-full h-[100dvh] min-h-[600px] max-h-[1200px] bg-[#020204] overflow-hidden flex flex-col justify-end select-none"
    >
      {/* Subtle ambient radial studio glow behind the 3D portrait */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 46% 52% at 50% 44%, rgba(96, 165, 250, 0.085) 0%, rgba(15, 23, 42, 0.04) 48%, rgba(2, 2, 4, 0) 78%)',
        }}
        aria-hidden="true"
      />

      {/* LAYER 1: Sweeping Handwritten Signature Behind the Portrait */}
      <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center overflow-hidden">
        {processedSignatureUrl ? (
          <motion.img
            src={processedSignatureUrl}
            alt="Rizky Indra Wanto Signature"
            initial={
              reducedMotion
                ? { opacity: 0.72 }
                : { clipPath: 'inset(0 100% 0 0)', opacity: 0.2 }
            }
            animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 0.72 }}
            transition={{
              duration: reducedMotion ? 0.1 : 2.2,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2,
            }}
            className="w-[88%] sm:w-[75%] md:w-[68%] max-w-[920px] h-auto object-contain -translate-y-10 md:-translate-y-4 select-none"
          />
        ) : (
          renderDefaultSignatureSvg(false)
        )}
      </div>

      {/* LAYER 2: 3D Point-Cloud Human Portrait Canvas */}
      <div className="absolute inset-0 z-[3]">
        <ParticleFaceCanvas reducedMotion={reducedMotion} />
      </div>

      {/* LAYER 3: Subtle Foreground Signature Trace Across Dark Portrait Zones */}
      <div className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center overflow-hidden mix-blend-screen opacity-38">
        {processedSignatureUrl ? (
          <motion.img
            src={processedSignatureUrl}
            alt=""
            aria-hidden="true"
            initial={
              reducedMotion
                ? { opacity: 0.55 }
                : { clipPath: 'inset(0 100% 0 0)', opacity: 0.1 }
            }
            animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 0.55 }}
            transition={{
              duration: reducedMotion ? 0.1 : 2.2,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2,
            }}
            className="w-[88%] sm:w-[75%] md:w-[68%] max-w-[920px] h-auto object-contain -translate-y-10 md:-translate-y-4 select-none"
          />
        ) : (
          renderDefaultSignatureSvg(true)
        )}
      </div>

      {/* LAYER 4: Bottom Editorial Bio, Role Metadata, Enter Portfolio Button & Edge-to-Edge Oversized Name */}
      <div className="relative z-[5] w-full pt-10 pb-1 sm:pb-0 bg-gradient-to-t from-[#020204] via-[#020204]/85 to-transparent md:bg-none">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-3 sm:mb-4">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="max-w-[400px] space-y-2.5"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.07] backdrop-blur-md border border-white/[0.1]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span className="text-[11px] font-medium tracking-tight text-white/85">
                  {PERSONAL_INFO.school} · {PERSONAL_INFO.gradeLevel} {PERSONAL_INFO.majorShort}
                </span>
              </div>

              <p className="text-sm sm:text-[15px] leading-relaxed text-white/65 font-normal">
                Software Engineering student crafting modern web, mobile, and database applications.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="self-start md:self-end"
            >
              <MagneticButton
                onClick={onEnterPortfolio}
                cursorLabel="EXPLORE"
                ariaLabel="Explore Portfolio"
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white text-[#05060a] hover:bg-white/90 shadow-[0_8px_30px_rgba(255,255,255,0.14)] transition-all duration-300"
              >
                <span className="text-xs sm:text-sm font-medium tracking-tight">
                  Explore
                </span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </MagneticButton>
            </motion.div>
          </div>
        </div>

        {/* Full-Width Edge-to-Edge Oversized Bottom Editorial Display Signature */}
        <div className="w-full overflow-hidden px-3 sm:px-6 lg:px-8 -mb-1 sm:-mb-3">
          <svg
            viewBox="0 0 1400 182"
            className="w-full h-auto block select-none"
            role="heading"
            aria-level={1}
            aria-label={PERSONAL_INFO.bottomSignatureText}
          >
            <motion.text
              x="700"
              y="148"
              textAnchor="middle"
              textLength="1350"
              lengthAdjust="spacingAndGlyphs"
              fill="transparent"
              stroke="rgba(212, 212, 216, 0.75)"
              strokeWidth="1.2"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: '176px',
              }}
              initial={{
                strokeDasharray: 2600,
                strokeDashoffset: reducedMotion ? 0 : 2600,
              }}
              animate={{
                strokeDashoffset: 0,
              }}
              transition={{
                duration: reducedMotion ? 0.1 : 2.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {PERSONAL_INFO.bottomSignatureText}
            </motion.text>

            <motion.text
              x="700"
              y="148"
              textAnchor="middle"
              textLength="1350"
              lengthAdjust="spacingAndGlyphs"
              fill="rgba(182, 185, 194, 0.56)"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: '176px',
              }}
              initial={{ opacity: reducedMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reducedMotion ? 0.1 : 1.2,
                delay: reducedMotion ? 0 : 0.65,
                ease: 'easeOut',
              }}
            >
              {PERSONAL_INFO.bottomSignatureText}
            </motion.text>
          </svg>
        </div>
      </div>
    </section>
  );
};
