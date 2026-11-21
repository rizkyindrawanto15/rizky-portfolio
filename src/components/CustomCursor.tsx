import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [isDesktop, setIsDesktop] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 360, mass: 0.4 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches || reducedQuery.matches) {
      setIsDesktop(false);
      return;
    }
    setIsDesktop(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest(
        'button, a, input, [data-cursor-interactive="true"]'
      ) as HTMLElement | null;

      if (interactiveEl) {
        setIsHovered(true);
        const customText = interactiveEl.getAttribute('data-cursor-label') || '';
        setCursorLabel(customText);
      } else {
        setIsHovered(false);
        setCursorLabel('');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isDesktop) return null;

  return (
    <motion.div
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.16 }}
      className="fixed top-0 left-0 pointer-events-none z-[100] hidden md:flex items-center justify-center"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={{
          width: cursorLabel ? 78 : isHovered ? 36 : 10,
          height: cursorLabel ? 28 : isHovered ? 36 : 10,
          borderRadius: 999,
          backgroundColor: cursorLabel
            ? 'rgba(255, 255, 255, 0.94)'
            : isHovered
            ? 'rgba(96, 165, 250, 0.12)'
            : 'rgba(255, 255, 255, 0.22)',
          borderColor: cursorLabel
            ? 'rgba(255, 255, 255, 0.9)'
            : isHovered
            ? 'rgba(96, 165, 250, 0.65)'
            : 'rgba(255, 255, 255, 0.45)',
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="border backdrop-blur-[2px] flex items-center justify-center"
      >
        {cursorLabel && (
          <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#05060a] font-semibold px-2 whitespace-nowrap">
            {cursorLabel}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
};
