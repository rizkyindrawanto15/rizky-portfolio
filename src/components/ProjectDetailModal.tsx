import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Database,
  Check,
  ExternalLink,
  Github,
} from 'lucide-react';
import { ProjectItem } from '../data/portfolioData';
import { ProjectVisualPreview } from './ProjectVisualPreview';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onSelectProject: (project: ProjectItem) => void;
  allProjects: ProjectItem[];
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onSelectProject,
  allProjects,
}) => {
  const [activeShotIndex, setActiveShotIndex] = useState(0);

  useEffect(() => {
    setActiveShotIndex(0);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject =
    allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const activeScreenshot =
    project.screenshots[activeShotIndex] || project.screenshots[0];

  return (
    <AnimatePresence>
      <motion.div
        key={project.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-[70] bg-black/82 backdrop-blur-xl overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-6 sm:py-10 flex items-center justify-center">
          <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

          {/* Clean Apple Dark Glass Product Sheet */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[960px] rounded-3xl bg-[#0a0c12]/95 border border-white/[0.1] shadow-[0_32px_90px_rgba(0,0,0,0.75)] overflow-hidden"
          >
            {/* Minimal Top Bar */}
            <div className="sticky top-0 z-20 bg-[#0a0c12]/90 backdrop-blur-md border-b border-white/[0.07] px-5 sm:px-7 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs text-white/55">
                <span className="text-blue-400 font-medium">{project.category}</span>
                <span>·</span>
                <span>{project.year}</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.16] flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label="Close project details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Clean Concise Body */}
            <div className="p-5 sm:p-8 space-y-7">
              {/* Visual Preview Stage */}
              <div className="space-y-3">
                <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-[#06070c]">
                  <ProjectVisualPreview
                    schematicType={activeScreenshot.schematicType}
                    imageUrl={activeScreenshot.imageUrl}
                    title={project.title}
                  />
                </div>

                {project.screenshots.length > 1 && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-white/45 truncate">
                      {activeScreenshot.caption}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {project.screenshots.map((shot, idx) => (
                        <button
                          key={shot.id}
                          type="button"
                          onClick={() => setActiveShotIndex(idx)}
                          className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                            activeShotIndex === idx
                              ? 'bg-white text-[#05060a]'
                              : 'bg-white/[0.06] text-white/60 hover:text-white'
                          }`}
                        >
                          0{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Concise Title + Overview + Optional External Links */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2
                    id="project-modal-title"
                    className="text-2xl sm:text-4xl font-semibold tracking-[-0.02em] text-white"
                  >
                    {project.title}
                  </h2>

                  {(project.liveUrl || project.repoUrl) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-white/90 text-[#05060a] text-xs font-medium transition-colors"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] text-white text-xs font-medium transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>GitHub</span>
                          <ExternalLink className="w-3 h-3 opacity-75" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-sm sm:text-base text-white/65 leading-relaxed">
                  {project.overview}
                </p>
              </div>

              {/* Compact Key Features + Tech Stack Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 border-t border-white/[0.07]">
                <div className="md:col-span-7 space-y-3">
                  <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-white/40">
                    Fitur Utama
                  </h3>
                  <ul className="space-y-2">
                    {project.features.slice(0, 4).map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-white/75 leading-relaxed"
                      >
                        <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-5 space-y-3">
                  <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-white/40">
                    Teknologi
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs text-white/85"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compact Database Schema (only for Sistem Bengkel Otomotif) */}
              {project.databaseStructure && project.databaseStructure.length > 0 && (
                <div className="space-y-3 pt-5 border-t border-white/[0.07]">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-white/40">
                    <Database className="w-3.5 h-3.5 text-blue-400" />
                    <span>Struktur Tabel ({project.databaseStructure.length})</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {project.databaseStructure.map((table) => (
                      <div
                        key={table.tableName}
                        className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-3 space-y-1.5"
                      >
                        <div className="font-mono text-xs text-blue-400 font-medium">
                          {table.tableName}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {table.keyFields.slice(0, 3).map((field) => (
                            <span
                              key={field}
                              className="text-[10px] font-mono text-white/55"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Minimal Prev / Next Footer */}
              <div className="pt-5 border-t border-white/[0.07] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onSelectProject(prevProject)}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.11] text-xs text-white/80 hover:text-white transition-colors min-w-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[120px] sm:max-w-[200px]">
                    {prevProject.title}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectProject(nextProject)}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.11] text-xs text-white/80 hover:text-white transition-colors min-w-0"
                >
                  <span className="truncate max-w-[120px] sm:max-w-[200px]">
                    {nextProject.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
