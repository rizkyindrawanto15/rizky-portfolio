import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SKILL_GROUPS, SkillItem } from '../data/portfolioData';
import { SkillIcon } from './SkillIcons';

export const SkillsSection: React.FC = () => {
  const [activeGroupId, setActiveGroupId] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  const visibleSkills = useMemo(() => {
    if (activeGroupId === 'all') {
      return SKILL_GROUPS.flatMap((g) => g.skills);
    }
    return SKILL_GROUPS.find((g) => g.id === activeGroupId)?.skills ?? [];
  }, [activeGroupId]);

  const currentSkill = selectedSkill || visibleSkills[0] || null;

  return (
    <section
      id="skills"
      className="relative py-24 sm:py-32 bg-[#030305] border-t border-white/[0.06]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 space-y-10">
        {/* Minimal Apple Header */}
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <div className="space-y-2.5">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-blue-400/90">
              Skills
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-semibold tracking-[-0.03em] text-white leading-[1.06]">
              Tools &amp; Stack.
            </h2>
          </div>

          {/* Clean Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveGroupId('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                activeGroupId === 'all'
                  ? 'bg-white text-[#05060a]'
                  : 'bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.1]'
              }`}
            >
              All
            </button>
            {SKILL_GROUPS.map((group) => {
              const isSelected = activeGroupId === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveGroupId(group.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 capitalize ${
                    isSelected
                      ? 'bg-white text-[#05060a]'
                      : 'bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.1]'
                  }`}
                >
                  {group.title.toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Apple App-Icon Tile Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
        >
          {visibleSkills.map((skill) => {
            const isSelected = currentSkill?.name === skill.name;
            return (
              <motion.button
                layout
                key={`${skill.category}-${skill.name}`}
                type="button"
                onMouseEnter={() => setSelectedSkill(skill)}
                onFocus={() => setSelectedSkill(skill)}
                onClick={() => setSelectedSkill(skill)}
                className={`group rounded-3xl p-5 flex flex-col items-center justify-center text-center gap-3 border transition-all duration-200 ${
                  isSelected
                    ? 'bg-white/[0.07] border-white/25 shadow-[0_12px_36px_rgba(0,0,0,0.45)]'
                    : 'bg-white/[0.025] border-white/[0.07] hover:bg-white/[0.055] hover:border-white/15'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.08] p-2.5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <SkillIcon
                    name={skill.iconSlug || skill.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-0.5 min-w-0 w-full">
                  <div className="text-sm font-medium text-white tracking-tight truncate">
                    {skill.name}
                  </div>
                  <div className="text-[11px] text-white/40 capitalize truncate">
                    {skill.category.toLowerCase()}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Minimal Single-Line Context Bar (Concise Info Only — Zero Essay Walls) */}
        {currentSkill && (
          <div className="max-w-2xl mx-auto rounded-full bg-white/[0.04] border border-white/[0.08] px-5 py-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs">
            <span className="font-medium text-white">{currentSkill.name}</span>
            <span className="text-white/25">·</span>
            <span className="text-white/60">
              {currentSkill.appliedIn.slice(0, 3).join(', ')}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
