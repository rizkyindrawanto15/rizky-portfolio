import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Github, Terminal } from 'lucide-react';
import { PROJECTS_DATA, ProjectItem } from '../data/portfolioData';
import { ProjectShowcase3D } from './ProjectShowcase3D';
import { ProjectDetailModal } from './ProjectDetailModal';

function renderProjectGridPreview(project: ProjectItem) {
  const shot = project.screenshots[0];
  if (shot?.imageUrl) {
    const isPortrait = project.id === 'bmi-step-tracker';
    const isLightDiagram = shot.imageUrl.includes('basisdata');
    if (isPortrait) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#1a130e] via-[#0b0d14] to-[#121018] flex items-center justify-center p-3">
          <img
            src={shot.imageUrl}
            alt={project.title}
            decoding="async"
            className="h-full w-auto object-contain rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.65)] group-hover:scale-[1.04] transition-transform duration-500"
          />
        </div>
      );
    }
    if (isLightDiagram) {
      return (
        <div className="w-full h-full bg-white flex items-center justify-center p-2.5">
          <img
            src={shot.imageUrl}
            alt={project.title}
            decoding="async"
            className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500"
          />
        </div>
      );
    }
    return (
      <img
        src={shot.imageUrl}
        alt={project.title}
        decoding="async"
        className="w-full h-full object-cover object-top group-hover:scale-[1.035] transition-transform duration-500"
      />
    );
  }

  // Crisp editorial code/spreadsheet preview for schematic-only academic projects
  const isExcel =
    shot?.schematicType === 'excel-ledger' ||
    shot?.schematicType === 'excel-formulas';
  const isPython =
    shot?.schematicType === 'python-flowchart' ||
    shot?.schematicType === 'python-terminal';

  return (
    <div
      className={`w-full h-full p-5 flex flex-col justify-between ${
        isExcel
          ? 'bg-gradient-to-br from-[#071f1a] via-[#0b1520] to-[#080d16]'
          : isPython
          ? 'bg-gradient-to-br from-[#161230] via-[#0c1022] to-[#080a14]'
          : 'bg-gradient-to-br from-[#0e172c] via-[#0d1322] to-[#080b14]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400/80" />
          <span className="w-2 h-2 rounded-full bg-amber-400/80" />
          <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
        </div>
        <span className="font-mono text-[10px] text-white/45 uppercase">
          {project.technologies[0]}
        </span>
      </div>

      <div className="space-y-1.5 font-mono text-[11px] text-white/75">
        {isExcel ? (
          <>
            <div className="text-emerald-300">=SUM(E4:E18)</div>
            <div className="text-white/55">=IF(C4&gt;=3, D4*0.05, 0)</div>
          </>
        ) : isPython ? (
          <>
            <div className="text-violet-300">def evaluasi_nilai(skor):</div>
            <div className="text-emerald-300 pl-3">
              return &quot;Tuntas&quot; if skor &gt;= 75
            </div>
          </>
        ) : (
          <>
            <div className="text-blue-300">public class TransaksiKasir &#123;</div>
            <div className="text-emerald-300 pl-3">
              return bayar - totalBelanja;
            </div>
          </>
        )}
      </div>

      <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-white/45">
        <Terminal className="w-3 h-3 text-blue-400" />
        <span>{project.category}</span>
      </div>
    </div>
  );
}

export const ProjectsSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'stage' | 'grid'>('stage');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
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

  // Allow Command Palette (⌘K) to open any specific project modal directly
  useEffect(() => {
    const onOpenProject = (e: Event) => {
      const projId = (e as CustomEvent<string>).detail;
      const found = PROJECTS_DATA.find((p) => p.id === projId);
      if (found) {
        setSelectedProject(found);
      }
    };
    window.addEventListener('portfolio:open-project', onOpenProject);
    return () =>
      window.removeEventListener('portfolio:open-project', onOpenProject);
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
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 text-center space-y-5 pb-4">
        <div className="space-y-2.5">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-blue-400/90">
            Projects · {PROJECTS_DATA.length} Works
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] text-white leading-[1.05]">
            Selected Works.
          </h2>
        </div>

        {/* View Toggle (stage | grid) + Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 relative z-20">
          <div className="inline-flex items-center p-1 rounded-full bg-[#0e1017]/85 backdrop-blur-xl border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
            <button
              type="button"
              onClick={() => setViewMode('stage')}
              style={{ color: viewMode === 'stage' ? '#05060a' : undefined }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors duration-200 ${
                viewMode === 'stage'
                  ? 'bg-white text-[#05060a] shadow-sm'
                  : 'bg-transparent text-white/70 hover:text-white'
              }`}
            >
              3d stage
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              style={{ color: viewMode === 'grid' ? '#05060a' : undefined }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white text-[#05060a] shadow-sm'
                  : 'bg-transparent text-white/70 hover:text-white'
              }`}
            >
              bento grid
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-white/15 text-white border border-white/25'
                      : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.09] border border-transparent'
                  }`}
                >
                  {cat === 'ALL' ? 'All' : cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {viewMode === 'stage' ? (
        <div className="w-full">
          <ProjectShowcase3D
            projects={filteredProjects}
            onSelectProject={setSelectedProject}
            isVisible={
              isVisible && !selectedProject && viewMode === 'stage'
            }
            reducedMotion={reducedMotion}
          />
        </div>
      ) : (
        <motion.div
          key="grid-view"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="max-w-[1200px] mx-auto px-5 sm:px-8 pt-6 pb-2"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                  className="group cursor-pointer rounded-3xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.18] p-4 flex flex-col justify-between gap-4 transition-all duration-300 shadow-[0_14px_40px_rgba(0,0,0,0.4)]"
                >
                  <div className="space-y-4">
                    {/* 16:10 Visual Frame */}
                    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#0b0d15] border border-white/[0.07]">
                      {renderProjectGridPreview(project)}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/10">
                          {project.number}
                        </span>
                        {project.liveUrl && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-medium text-emerald-300 border border-emerald-400/25">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>Live</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-1 space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px] font-medium text-blue-400/90">
                        <span>{project.category}</span>
                        <span className="text-white/25">·</span>
                        <span className="text-white/45 font-mono">
                          {project.year}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-blue-100 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-white/55 line-clamp-2 leading-relaxed">
                        {project.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="px-1 pt-3 border-t border-white/[0.06] space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-full bg-white/[0.05] text-[10px] font-mono text-white/65"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div
                      className="flex items-center justify-between gap-2 pt-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-white/85 hover:text-white transition-colors"
                      >
                        <span>Lihat Detail</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/25 text-[11px] font-medium text-blue-200 hover:text-white transition-colors"
                          >
                            <span>Demo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.title} GitHub repository`}
                            className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-white/75 hover:text-white transition-colors"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

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
