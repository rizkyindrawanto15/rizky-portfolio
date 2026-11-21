import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS_DATA, ProjectItem } from '../data/portfolioData';
import { ProjectShowcase3D } from './ProjectShowcase3D';
import { ProjectDetailModal } from './ProjectDetailModal';

export const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const categories = [
    'ALL',
    ...Array.from(new Set(PROJECTS_DATA.map((p) => p.category))),
  ];

  const filteredProjects =
    activeCategory === 'ALL'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === activeCategory);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-24 sm:py-32 bg-[#030305] border-t border-white/[0.06] overflow-hidden"
    >
      {/* Apple-Minimal Centered Editorial Header */}
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 text-center space-y-6 pb-4">
        <div className="space-y-2.5">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-blue-400/90">
            Projects
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] text-white leading-[1.05]">
            Selected Works.
          </h2>
        </div>

        {/* Clean Scrollable Apple Pill Filter */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-white text-[#05060a]'
                    : 'bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.1]'
                }`}
              >
                {cat === 'ALL' ? 'All' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Edge-to-Edge Open 3D Spatial CoverFlow Stage */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65 }}
        className="w-full"
      >
        <ProjectShowcase3D
          projects={filteredProjects}
          onSelectProject={setSelectedProject}
          isVisible={isVisible && !selectedProject}
          reducedMotion={reducedMotion}
        />
      </motion.div>

      {/* Clean Concise Apple Project Detail Sheet */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(proj) => setSelectedProject(proj)}
        allProjects={PROJECTS_DATA}
      />
    </section>
  );
};
