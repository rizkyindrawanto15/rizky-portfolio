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

function getIssuerAccent(issuer: string): {
  dot: string;
  shortName: string;
} {
  if (issuer.includes('HackerRank')) {
    return { dot: 'bg-emerald-400', shortName: 'HackerRank' };
  }
  if (issuer.includes('IBM')) {
    return { dot: 'bg-blue-400', shortName: 'IBM SkillsBuild' };
  }
  if (issuer.includes('Dicoding')) {
    return { dot: 'bg-cyan-400', shortName: 'Dicoding' };
  }
  return { dot: 'bg-violet-400', shortName: issuer };
}

export const CertificatesSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'vault' | 'grid' | 'list'>('vault');
  const [selectedIssuer, setSelectedIssuer] = useState<string>('All');
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

  const issuerOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of sourceItems) {
      counts.set(c.issuingOrganization, (counts.get(c.issuingOrganization) ?? 0) + 1);
    }
    return [
      { id: 'All', label: 'All Issuers', count: sourceItems.length },
      ...Array.from(counts.entries()).map(([org, count]) => ({
        id: org,
        label: getIssuerAccent(org).shortName,
        count,
      })),
    ];
  }, [sourceItems]);

  const issuerFilteredItems = useMemo(() => {
    if (selectedIssuer === 'All') return sourceItems;
    return sourceItems.filter((c) => c.issuingOrganization === selectedIssuer);
  }, [sourceItems, selectedIssuer]);

  const availableCategories = useMemo(() => {
    const present = new Set(issuerFilteredItems.map((c) => c.category));
    return CERTIFICATE_CATEGORIES.filter(
      (cat) => cat === 'All' || present.has(cat)
    );
  }, [issuerFilteredItems]);

  const effectiveCategory = availableCategories.includes(selectedCategory)
    ? selectedCategory
    : 'All';

  const filteredCertificates = useMemo(() => {
    return issuerFilteredItems.filter(
      (item) =>
        effectiveCategory === 'All' || item.category === effectiveCategory
    );
  }, [issuerFilteredItems, effectiveCategory]);

  useEffect(() => {
    setFocusedIndex(0);
    setHoveredCert(null);
  }, [selectedIssuer, effectiveCategory]);

  // Allow Command Palette (⌘K) to open any specific certificate modal directly
  useEffect(() => {
    const onOpenCert = (e: Event) => {
      const certId = (e as CustomEvent<string>).detail;
      const found = sourceItems.find((c) => c.id === certId);
      if (found) {
        setSelectedIssuer('All');
        setSelectedCategory('All');
        const idx = sourceItems.findIndex((c) => c.id === certId);
        setFocusedIndex(Math.max(0, idx));
        setActiveCertificate(found);
      }
    };
    window.addEventListener('portfolio:open-certificate', onOpenCert);
    return () =>
      window.removeEventListener('portfolio:open-certificate', onOpenCert);
  }, [sourceItems]);

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
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 text-center space-y-5">
        <div className="space-y-2.5">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-blue-400/90">
            Certificates · {sourceItems.length} Verified
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] text-white leading-[1.05]">
            Verified Credentials.
          </h2>
        </div>

        {/* Row 1: View Mode Segmented Pill (3d vault | bento grid | list) + Issuer Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 relative z-20">
          <div className="inline-flex items-center p-1 rounded-full bg-[#0e1017]/85 backdrop-blur-xl border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
            {(
              [
                { id: 'vault', label: '3d vault' },
                { id: 'grid', label: 'bento grid' },
                { id: 'list', label: 'list' },
              ] as const
            ).map((mode) => {
              const isActive = viewMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setViewMode(mode.id)}
                  style={{ color: isActive ? '#05060a' : undefined }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors duration-200 ${
                    isActive
                      ? 'bg-white text-[#05060a] shadow-sm'
                      : 'bg-transparent text-white/70 hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>

          {issuerOptions.length > 2 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {issuerOptions.map((opt) => {
                const isSelected = selectedIssuer === opt.id;
                const accent =
                  opt.id === 'All' ? null : getIssuerAccent(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedIssuer(opt.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-white/15 text-white border border-white/25'
                        : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-transparent'
                    }`}
                  >
                    {accent && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${accent.dot}`}
                      />
                    )}
                    <span>{opt.label}</span>
                    <span className="font-mono text-[10px] text-white/45">
                      {opt.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Row 2: Domain Category Filter Pills */}
        {availableCategories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 pb-1 relative z-20">
            {availableCategories.map((category) => {
              const isSelected = effectiveCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-500/20 text-blue-200 border border-blue-400/30'
                      : 'bg-white/[0.03] text-white/50 hover:text-white/85 hover:bg-white/[0.07] border border-transparent'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3D Vault View vs Bento Grid View vs Clean Minimalist List View */}
      {viewMode === 'vault' ? (
        <div className="w-full">
          <CertificateSpiral3D
            certificates={filteredCertificates}
            focusedIndex={focusedIndex}
            onFocusedIndexChange={setFocusedIndex}
            hoveredCert={hoveredCert}
            onHoverCert={setHoveredCert}
            bringingForwardId={bringingForwardId}
            onSelectCert={handleSelectCertificateFromSpiral}
            isVisible={
              isVisible && !activeCertificate && viewMode === 'vault'
            }
            reducedMotion={reducedMotion}
          />
        </div>
      ) : viewMode === 'grid' ? (
        <motion.div
          key="grid-view"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="max-w-[1200px] mx-auto px-5 sm:px-8 pt-8 pb-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredCertificates.map((cert, idx) => {
              const accent = getIssuerAccent(cert.issuingOrganization);
              return (
                <button
                  key={cert.id}
                  type="button"
                  onClick={() => {
                    setFocusedIndex(idx);
                    setActiveCertificate(cert);
                  }}
                  className="group rounded-3xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.18] p-3.5 text-left flex flex-col justify-between gap-3.5 transition-all duration-300 shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
                >
                  <div className="space-y-3.5 w-full">
                    <div className="relative w-full aspect-[1.52/1] rounded-2xl overflow-hidden bg-[#0b0e17] border border-white/[0.06] flex items-center justify-center">
                      {cert.previewImageUrl ? (
                        <img
                          src={cert.previewImageUrl}
                          alt={cert.title}
                          decoding="async"
                          className="w-full h-full object-contain bg-[#f5f6f8] group-hover:scale-[1.025] transition-transform duration-500"
                        />
                      ) : (
                        <span className="font-serif italic text-lg text-white/60 px-4 text-center">
                          {cert.title}
                        </span>
                      )}
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/10">
                        {cert.index}
                      </span>
                    </div>

                    <div className="px-1 space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-white/50">
                        <span className="inline-flex items-center gap-1.5 truncate">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${accent.dot}`}
                          />
                          <span className="truncate">{accent.shortName}</span>
                        </span>
                        <span className="shrink-0 text-white/40">
                          {cert.category}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-medium text-white/95 group-hover:text-white tracking-tight line-clamp-2 leading-snug">
                        {cert.title}
                      </h3>
                    </div>
                  </div>

                  <div className="px-1 pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2 text-[11px] font-mono text-white/45 w-full">
                    <span className="truncate">
                      {cert.credentialId
                        ? `ID: ${cert.credentialId}`
                        : cert.issueDate}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-white/35 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="list-view"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="max-w-[1100px] mx-auto px-5 sm:px-8 lg:px-12 pt-8 pb-6"
        >
          <div className="divide-y divide-white/[0.07]">
            {filteredCertificates.map((cert, idx) => {
              const accent = getIssuerAccent(cert.issuingOrganization);
              return (
                <button
                  key={cert.id}
                  type="button"
                  onClick={() => {
                    setFocusedIndex(idx);
                    setActiveCertificate(cert);
                  }}
                  className="group w-full py-4 sm:py-5 flex items-center justify-between gap-4 sm:gap-6 text-left hover:bg-white/[0.025] px-3 -mx-3 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    {cert.previewImageUrl && (
                      <img
                        src={cert.previewImageUrl}
                        alt={cert.title}
                        decoding="async"
                        className="w-20 sm:w-28 aspect-[1.52/1] object-contain bg-[#f5f6f8] rounded-lg shrink-0 opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-300"
                      />
                    )}
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-white/50">
                        <span className="text-blue-400">{cert.index}</span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${accent.dot}`}
                          />
                          <span>{cert.issuingOrganization}</span>
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-normal text-white/90 group-hover:text-white truncate">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-white/45 font-mono truncate">
                        {cert.issueDate}
                        {cert.credentialId ? ` · ${cert.credentialId}` : ''}
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

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
                      {activeCertificate.fileUrl.toLowerCase().endsWith('.pdf')
                        ? 'PDF'
                        : 'PNG'}
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
