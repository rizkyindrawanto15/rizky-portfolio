import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { EDUCATION_TIMELINE } from '../data/portfolioData';
import { SchoolLogo } from './SchoolLogos';

export const EducationTimelineSection: React.FC = () => {
  return (
    <section
      id="journey"
      className="relative py-24 sm:py-32 bg-[#040509] border-t border-white/[0.06]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Minimal Apple Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 pb-14">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-blue-400/90">
            Education
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-semibold tracking-[-0.03em] text-white leading-[1.06]">
            Academic Journey.
          </h2>
        </div>

        {/* Clean 3-Card Apple Glass Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {EDUCATION_TIMELINE.map((entry, idx) => {
            const isCurrent = entry.id === 'edu-smk';
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: idx * 0.08 }}
                className={`relative rounded-3xl p-6 sm:p-7 border transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between gap-7 ${
                  isCurrent
                    ? 'bg-gradient-to-b from-blue-500/[0.1] via-white/[0.03] to-white/[0.015] border-blue-400/30 hover:border-blue-400/50 shadow-[0_16px_50px_rgba(0,0,0,0.45)]'
                    : 'bg-gradient-to-b from-white/[0.04] to-white/[0.015] hover:from-white/[0.065] border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                {/* Top Row: Official School Logo + Status Period Pill */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/[0.1] p-2 flex items-center justify-center shrink-0">
                    <SchoolLogo
                      schoolId={entry.id}
                      customSrc={entry.logoUrl}
                      size="md"
                      className="w-full h-full"
                    />
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium ${
                      isCurrent
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/25'
                        : 'bg-white/[0.06] text-white/60'
                    }`}
                  >
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                    {entry.period}
                  </span>
                </div>

                {/* Institution & Major */}
                <div className="space-y-1.5">
                  <p className="text-xs text-white/45">{entry.level}</p>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-snug">
                    {entry.institution}
                  </h3>
                  <p className="text-sm text-blue-400/90 font-medium pt-0.5">
                    {entry.majorOrFocus}
                  </p>
                </div>

                {/* Location */}
                <div className="pt-4 border-t border-white/[0.07] flex items-center gap-1.5 text-xs text-white/45">
                  <MapPin className="w-3.5 h-3.5 text-white/35 shrink-0" />
                  <span className="truncate">{entry.location}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
