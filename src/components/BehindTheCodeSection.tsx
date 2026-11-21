import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code2, Database, Sparkles } from 'lucide-react';
import { BEHIND_THE_CODE_ITEMS } from '../data/portfolioData';

export const BehindTheCodeSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-[#05060a] border-t border-white/[0.08]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12 border-b border-white/[0.08]">
          <div className="lg:col-span-3">
            <span className="font-mono text-xs tracking-[0.22em] text-blue-400 uppercase">
              06 // PROCESS &amp; WORKSPACE
            </span>
          </div>
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-[1.08]">
              BEHIND THE CODE —{' '}
              <span className="font-serif italic font-normal text-white/85">
                How ideas become working systems.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-3 flex lg:justify-end items-end">
            <span className="font-mono text-[11px] tracking-[0.18em] text-white/40 uppercase">
              LEARNING LOG // GRADE XII RPL
            </span>
          </div>
        </div>

        {/* 6 Core Learning Pillars Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-white/[0.08] border-x border-b border-white/[0.08]">
          {[
            'Exploring New Technologies',
            'Learning Programming Fundamentals',
            'Building Applications',
            'Working with Databases',
            'Exploring UI/UX',
            'Improving Development Skills',
          ].map((pillar, i) => (
            <div
              key={pillar}
              className="bg-[#040509] p-4 flex flex-col justify-between gap-3"
            >
              <span className="font-mono text-[10px] text-blue-400">
                0{i + 1}
              </span>
              <span className="text-xs text-white/80 font-normal leading-snug">
                {pillar}
              </span>
            </div>
          ))}
        </div>

        {/* Interactive Code & Process Chapters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-14 items-start">
          {/* Left Column: Editorial Process Chapters */}
          <div className="lg:col-span-6 space-y-4">
            {BEHIND_THE_CODE_ITEMS.map((item, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveIndex(idx);
                    }
                  }}
                  className={`p-6 sm:p-7 border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-blue-400/50 bg-[#090c17]'
                      : 'border-white/[0.08] bg-[#030408] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase mb-2.5">
                    <span className={isSelected ? 'text-blue-400' : 'text-white/40'}>
                      CHAPTER {item.index} // {item.category}
                    </span>
                    <span className="text-white/35">{item.codeFilename}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/65 leading-relaxed mt-3">
                    {item.narrative}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.07] space-y-1.5">
                    {item.technicalNotes.map((note, nIdx) => (
                      <div
                        key={nIdx}
                        className="flex items-start gap-2 font-mono text-[11px] text-white/60"
                      >
                        <span className="text-blue-400">—</span>
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Live Workspace Code & Visual Study Frame */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-6">
            {/* Code Editor Window */}
            <div className="border border-white/15 bg-[#030408] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 bg-[#070912] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-mono text-xs text-white/85">
                    {BEHIND_THE_CODE_ITEMS[activeIndex].codeFilename}
                  </span>
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-blue-400 px-2 py-0.5 border border-blue-400/30 bg-blue-500/10">
                  {BEHIND_THE_CODE_ITEMS[activeIndex].codeLanguage}
                </span>
              </div>

              <div className="p-5 sm:p-6 overflow-x-auto bg-[#020306]">
                <pre className="font-mono text-xs sm:text-[13px] text-white/85 leading-relaxed">
                  <code>{BEHIND_THE_CODE_ITEMS[activeIndex].codeSnippet}</code>
                </pre>
              </div>
            </div>

            {/* Workspace Study Frame / Visual Process Note */}
            <div className="border border-white/10 bg-[#040509] p-6 space-y-4">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-white/45">
                <span>WORKSPACE ENVIRONMENT // SMK KRIAN 1 RPL</span>
                <span className="text-violet-400">DAILY WORKFLOW</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 border border-white/[0.08] bg-black/50 space-y-1.5">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <div className="text-xs font-medium text-white">
                    Code &amp; Logic
                  </div>
                  <p className="text-[11px] text-white/55 leading-relaxed">
                    VS Code, Git, Flowgorithm, Python, dan Java untuk menyusun algoritma yang rapi.
                  </p>
                </div>

                <div className="p-3.5 border border-white/[0.08] bg-black/50 space-y-1.5">
                  <Database className="w-4 h-4 text-violet-400" />
                  <div className="text-xs font-medium text-white">
                    Data &amp; Schema
                  </div>
                  <p className="text-[11px] text-white/55 leading-relaxed">
                    Laragon, phpMyAdmin, MySQL, serta Supabase PostgreSQL untuk pengelolaan data.
                  </p>
                </div>

                <div className="p-3.5 border border-white/[0.08] bg-black/50 space-y-1.5">
                  <Sparkles className="w-4 h-4 text-blue-300" />
                  <div className="text-xs font-medium text-white">
                    Interface &amp; Build
                  </div>
                  <p className="text-[11px] text-white/55 leading-relaxed">
                    Figma, HTML/CSS/JS, React, dan React Native Expo untuk mewujudkan produk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
