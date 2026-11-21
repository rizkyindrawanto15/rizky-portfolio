import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  X,
  CheckCircle2,
  Calendar,
  Building2,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import {
  CERTIFICATES_DATA,
  CERTIFICATE_CATEGORIES,
  CERTIFICATE_TEMPLATE_SPECIMENS,
  CertificateCategory,
  CertificateItem,
} from '../data/portfolioData';
import { CertificateSpiral3D } from './CertificateSpiral3D';

export const CertificatesSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'spiral' | 'list'>('spiral');
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | CertificateCategory
  >('All');
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [hoveredCert, setHoveredCert] = useState<CertificateItem | null>(null);
  const [bringingForwardId, setBringingForwardId] = useState<string | null>(
    null
  );
  const [activeCertificate, setActiveCertificate] =
    useState<CertificateItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const bringTimerRef = useRef<number | null>(null);

  const sourceItems = useMemo(() => {
    return CERTIFICATES_DATA.length > 0
      ? CERTIFICATES_DATA
      : CERTIFICATE_TEMPLATE_SPECIMENS;
  }, []);

  const availableCategories = useMemo(() => {
    const present = new Set(sourceItems.map((c) => c.category));
    return CERTIFICATE_CATEGORIES.filter(
      (cat) => cat === 'All' || present.has(cat)
    );
  }, [sourceItems]);

  const filteredCertificates = useMemo(() => {
    return sourceItems.filter(
      (item) => selectedCategory === 'All' || item.category === selectedCategory
    );
  }, [sourceItems, selectedCategory]);

  useEffect(() => {
    setFocusedIndex(0);
    setHoveredCert(null);
  }, [selectedCategory]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0]?.isIntersecting ?? true);
      },
      { rootMargin: '250px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (bringTimerRef.current) window.clearTimeout(bringTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setZoomLevel(1);
  }, [activeCertificate?.id]);

  const handleSelectCertificateFromSpiral = (
    cert: CertificateItem,
    idx: number
  ) => {
    setFocusedIndex(idx);
    setBringingForwardId(cert.id);

    if (bringTimerRef.current) window.clearTimeout(bringTimerRef.current);
    bringTimerRef.current = window.setTimeout(
      () => {
        setActiveCertificate(cert);
        setBringingForwardId(null);
      },
      reducedMotion ? 40 : 280
    );
  };

  const handlePrevCertificate = () => {
    if (!activeCertificate || filteredCertificates.length === 0) return;
    const idx = filteredCertificates.findIndex(
      (c) => c.id === activeCertificate.id
    );
    const prevIdx =
      (idx - 1 + filteredCertificates.length) % filteredCertificates.length;
    setFocusedIndex(prevIdx);
    setActiveCertificate(filteredCertificates[prevIdx]);
  };

  const handleNextCertificate = () => {
    if (!activeCertificate || filteredCertificates.length === 0) return;
    const idx = filteredCertificates.findIndex(
      (c) => c.id === activeCertificate.id
    );
    const nextIdx = (idx + 1) % filteredCertificates.length;
    setFocusedIndex(nextIdx);
    setActiveCertificate(filteredCertificates[nextIdx]);
  };

  useEffect(() => {
    if (!activeCertificate) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCertificate(null);
      } else if (e.key === 'ArrowRight') {
        handleNextCertificate();
      } else if (e.key === 'ArrowLeft') {
        handlePrevCertificate();
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel((z) => Math.min(2.5, +(z + 0.25).toFixed(2)));
      } else if (e.key === '-') {
        setZoomLevel((z) => Math.max(0.5, +(z - 0.25).toFixed(2)));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  });

  return (
    <section
      ref={sectionRef}
      id="certificates"
      className="relative py-20 sm:py-28 lg:py-32 bg-[#05060a] border-t border-white/[0.06] overflow-hidden"
    >
      {/* Apple-Minimal Centered Editorial Header */}
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 text-center space-y-6">
        <div className="space-y-2.5">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-blue-400/90">
            Certificates
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] text-white leading-[1.05]">
            Verified Credentials.
          </h2>
        </div>

        {/* Framer / Apple Centered Floating Mode Pill + Optional Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3 pb-2 relative z-20">
          <div className="inline-flex items-center p-1 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
            <button
              type="button"
              onClick={() => setViewMode('spiral')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                viewMode === 'spiral'
                  ? 'bg-white text-[#05060a] shadow-sm'
                  : 'text-white/65 hover:text-white'
              }`}
            >
              spiral
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white text-[#05060a] shadow-sm'
                  : 'text-white/65 hover:text-white'
              }`}
            >
              list
            </button>
          </div>

          {availableCategories.length > 2 && (
            <div className="flex items-center gap-1.5">
              {availableCategories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'bg-white/[0.04] text-white/55 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Spiral View (Edge-to-Edge Open Borderless) vs Clean Minimalist List View */}
      <AnimatePresence mode="wait">
        {viewMode === 'spiral' ? (
          <motion.div
            key="spiral-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full"
          >
            <CertificateSpiral3D
              certificates={filteredCertificates}
              focusedIndex={focusedIndex}
              onFocusedIndexChange={setFocusedIndex}
              hoveredCert={hoveredCert}
              onHoverCert={setHoveredCert}
              bringingForwardId={bringingForwardId}
              onSelectCert={handleSelectCertificateFromSpiral}
              isVisible={isVisible && !activeCertificate && viewMode === 'spiral'}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="max-w-[1100px] mx-auto px-5 sm:px-8 lg:px-12 pt-8 pb-6"
          >
            <div className="divide-y divide-white/[0.07]">
              {filteredCertificates.map((cert, idx) => (
                <button
                  key={cert.id}
                  type="button"
                  onClick={() => {
                    setFocusedIndex(idx);
                    setActiveCertificate(cert);
                  }}
                  className="group w-full py-5 flex items-center justify-between gap-4 sm:gap-6 text-left hover:bg-white/[0.025] px-3 -mx-3 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    {cert.previewImageUrl && (
                      <img
                        src={cert.previewImageUrl}
                        alt={cert.title}
                        className="w-20 sm:w-28 aspect-[1.414/1] object-cover rounded-lg shrink-0 opacity-85 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-300"
                      />
                    )}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2.5 font-mono text-[11px] text-white/45">
                        <span className="text-blue-400">{cert.index}</span>
                        <span>·</span>
                        <span>{cert.issuingOrganization}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-normal text-white/90 group-hover:text-white truncate">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-white/45 font-mono">
                        {cert.issueDate}
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Certificate Detail & Zoom Modal */}
      <AnimatePresence>
        {activeCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-black/92 backdrop-blur-md flex flex-col justify-between"
            role="dialog"
            aria-modal="true"
            aria-label={activeCertificate.title}
          >
            {/* Top Modal Bar */}
            <div className="border-b border-white/10 bg-[#05060b]/95 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs text-blue-400 shrink-0">
                  {activeCertificate.index}
                </span>
                <span className="text-white/25">/</span>
                <span className="text-sm text-white font-medium truncate max-w-[180px] sm:max-w-md">
                  {activeCertificate.title}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setZoomLevel((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))
                  }
                  className="p-2 rounded-full bg-white/[0.06] text-white/75 hover:text-white hover:bg-white/[0.12] transition-colors"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs text-white/80 min-w-[46px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setZoomLevel((z) => Math.min(2.5, +(z + 0.25).toFixed(2)))
                  }
                  className="p-2 rounded-full bg-white/[0.06] text-white/75 hover:text-white hover:bg-white/[0.12] transition-colors"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="p-2 rounded-full bg-white/[0.06] text-white/75 hover:text-white hover:bg-white/[0.12] transition-colors"
                  aria-label="Reset zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {activeCertificate.fileUrl && (
                  <a
                    href={activeCertificate.fileUrl}
                    download
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-blue-500 text-white font-mono text-xs uppercase tracking-wider hover:bg-blue-600 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {activeCertificate.fileUrl.toLowerCase().endsWith('.pdf') ? 'PDF' : 'PNG'}
                    </span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setActiveCertificate(null)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white font-mono text-xs uppercase transition-colors"
                  aria-label="Tutup"
                >
                  <span className="hidden sm:inline">Close</span>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center Zoomable Certificate Stage + Prev/Next */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-10 relative">
              {filteredCertificates.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevCertificate}
                  className="fixed left-3 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/[0.08] backdrop-blur-md text-white hover:bg-white/[0.18] transition-colors"
                  aria-label="Sertifikat sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <motion.div
                key={activeCertificate.id}
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-4xl flex items-center justify-center"
              >
                <div
                  onClick={() => setZoomLevel((z) => (z === 1 ? 1.5 : 1))}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                  }}
                  title="Klik untuk zoom in / reset"
                  className="transition-transform duration-200 w-full cursor-zoom-in"
                >
                  {activeCertificate.previewImageUrl ? (
                    <img
                      src={activeCertificate.previewImageUrl}
                      alt={activeCertificate.title}
                      className="w-full max-h-[62vh] object-contain rounded-xl shadow-[0_24px_80px_rgba(0,0,0,0.75)] mx-auto"
                    />
                  ) : (
                    <div className="aspect-[1.414/1] w-full bg-[#080a12] rounded-xl p-8 sm:p-14 flex flex-col justify-between">
                      <p className="font-serif italic text-2xl text-white">
                        {activeCertificate.title}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {filteredCertificates.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextCertificate}
                  className="fixed right-3 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/[0.08] backdrop-blur-md text-white hover:bg-white/[0.18] transition-colors"
                  aria-label="Sertifikat selanjutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Bottom Detail Metadata Bar */}
            <div className="border-t border-white/10 bg-[#05060b]/95 px-4 sm:px-8 py-4 space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-mono">
                    <span className="inline-flex items-center gap-1.5 text-white/90">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      {activeCertificate.issuingOrganization}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-white/80">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      {activeCertificate.issueDate}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-white/70">
                      <Award className="w-3.5 h-3.5 text-violet-400" />
                      {activeCertificate.category}
                    </span>
                    {activeCertificate.credentialId && (
                      <span className="inline-flex items-center gap-1.5 text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ID: {activeCertificate.credentialId}
                      </span>
                    )}
                  </div>
                  {activeCertificate.description && (
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-4xl">
                      {activeCertificate.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {activeCertificate.verificationUrl && (
                    <a
                      href={activeCertificate.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] font-mono text-xs uppercase tracking-wider text-white transition-colors"
                    >
                      <span>Verifikasi Resmi</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
