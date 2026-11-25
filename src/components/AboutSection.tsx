import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Smartphone,
  Database,
  Sparkles,
  MapPin,
  GraduationCap,
} from 'lucide-react';
import {
  PERSONAL_INFO,
  PROJECTS_DATA,
  CERTIFICATES_DATA,
  SKILL_GROUPS,
} from '../data/portfolioData';

const FOCUS_TILES = [
  {
    icon: Code2,
    title: 'Web & 3D UI',
    subtitle: 'Next.js · TypeScript · Three.js',
  },
  {
    icon: Database,
    title: 'Backend & DB',
    subtitle: 'Laravel · Node.js · Supabase',
  },
  {
    icon: Sparkles,
    title: 'AI & Prompting',
    subtitle: 'GenAI · Prompt Engineering',
  },
  {
    icon: Smartphone,
    title: 'Mobile Dev',
    subtitle: 'React Native · Expo',
  },
];

export const AboutSection: React.FC = () => {
  const totalSkills = SKILL_GROUPS.reduce((sum, g) => sum + g.skills.length, 0);

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 bg-[#030305] border-t border-white/[0.06]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Clean Minimal Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 pb-14">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-blue-400/90">
            About
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-semibold tracking-[-0.03em] text-white leading-[1.06]">
            Clarity in logic. Purpose in design.
          </h2>
        </div>

        {/* Apple-Style Dark Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Portrait Bento Tile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative rounded-3xl overflow-hidden bg-[#0a0c12] border border-white/[0.08] aspect-[4/5] lg:aspect-auto lg:min-h-[460px] group"
          >
            {PERSONAL_INFO.profilePhotoUrl && (
              <img
                src={PERSONAL_INFO.profilePhotoUrl}
                alt={PERSONAL_INFO.fullName}
                className="w-full h-full object-cover grayscale contrast-115 group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
                loading="lazy"
              />
            )}
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                  {PERSONAL_INFO.fullName}
                </h3>
                <p className="text-xs text-white/65 mt-0.5">
                  {PERSONAL_INFO.major}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-medium text-white/90 shrink-0">
                {PERSONAL_INFO.gradeLevel}
              </span>
            </div>
          </motion.div>

          {/* Right Bento Stack */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5">
            {/* Concise Statement Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between gap-6"
            >
              <p className="text-lg sm:text-2xl font-normal tracking-tight text-white/90 leading-[1.45]">
                {PERSONAL_INFO.aboutIntroId}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/55">
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                  {PERSONAL_INFO.school}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  Sidoarjo, Indonesia
                </span>
              </div>
            </motion.div>

            {/* 3 Live Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.14 }}
              className="grid grid-cols-3 gap-3 sm:gap-4"
            >
              {[
                {
                  value: String(PROJECTS_DATA.length).padStart(2, '0'),
                  label: 'Projects',
                },
                {
                  value: String(CERTIFICATES_DATA.length).padStart(2, '0'),
                  label: 'Certificates',
                },
                {
                  value: String(totalSkills),
                  label: 'Tech Stack',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl bg-gradient-to-b from-white/[0.045] to-white/[0.015] border border-white/[0.08] p-5 text-center hover:border-white/[0.15] transition-colors"
                >
                  <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/45 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* 4 Minimal Focus Tiles (Pure Info, Zero Paragraph Walls) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-3 sm:gap-4 flex-1"
            >
              {FOCUS_TILES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.015] hover:from-white/[0.07] border border-white/[0.08] hover:border-white/[0.16] p-5 flex flex-col justify-between gap-3 transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-2xl bg-blue-500/12 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-medium text-white tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs text-white/45 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
