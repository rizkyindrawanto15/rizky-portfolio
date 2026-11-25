import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  ArrowUpRight,
  Check,
  Compass,
  Copy,
  ExternalLink,
  FolderGit2,
  Github,
  Instagram,
  Linkedin,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import {
  CERTIFICATES_DATA,
  PERSONAL_INFO,
  PROJECTS_DATA,
  SKILL_GROUPS,
} from '../data/portfolioData';
import { NavSectionId } from './Navbar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (id: NavSectionId) => void;
  onOpenProject: (projectId: string) => void;
  onOpenCertificate: (certId: string) => void;
}

interface PaletteItem {
  id: string;
  group: 'Quick Actions' | 'Projects' | 'Live Demos' | 'Certificates' | 'Navigation' | 'Tech Stack';
  title: string;
  subtitle: string;
  keywords: string;
  badge?: string;
  icon: React.ReactNode;
  onSelect: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateSection,
  onOpenProject,
  onOpenCertificate,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 40);
      document.body.style.overflow = 'hidden';
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  const emailAddress =
    PERSONAL_INFO.contactLinks.find((c) => c.id === 'email')
      ?.handlePlaceholder || 'mriskyindrawanto@gmail.com';

  const allItems = useMemo<PaletteItem[]>(() => {
    const navItems: PaletteItem[] = [
      { id: 'home', label: 'Home — Hero 3D Portrait' },
      { id: 'about', label: 'About — Profile & Metrics' },
      { id: 'journey', label: 'Education — Academic Timeline' },
      { id: 'projects', label: `Projects — ${PROJECTS_DATA.length} Selected Works` },
      {
        id: 'certificates',
        label: `Certificates — ${CERTIFICATES_DATA.length} Verified Credentials`,
      },
      { id: 'skills', label: 'Skills — 30 Tools & Tech Stack' },
      { id: 'contact', label: 'Contact — Channels & Collaboration' },
    ].map((s) => ({
      id: `nav-${s.id}`,
      group: 'Navigation',
      title: s.label.split(' — ')[0],
      subtitle: s.label.split(' — ')[1] || '',
      keywords: `section navigate go to ${s.label}`,
      icon: <Compass className="w-4 h-4 text-blue-400" />,
      onSelect: () => {
        onClose();
        onNavigateSection(s.id as NavSectionId);
      },
    }));

    const quickActions: PaletteItem[] = [
      {
        id: 'action-copy-email',
        group: 'Quick Actions',
        title: copiedEmail ? 'Email Copied to Clipboard!' : 'Copy Email Address',
        subtitle: emailAddress,
        keywords: `email contact mail copy ${emailAddress}`,
        badge: 'Copy',
        icon: copiedEmail ? (
          <Check className="w-4 h-4 text-emerald-400" />
        ) : (
          <Copy className="w-4 h-4 text-white/80" />
        ),
        onSelect: () => {
          navigator.clipboard?.writeText(emailAddress);
          setCopiedEmail(true);
          window.setTimeout(() => {
            setCopiedEmail(false);
            onClose();
          }, 650);
        },
      },
      {
        id: 'action-github',
        group: 'Quick Actions',
        title: 'Open GitHub Profile',
        subtitle: '@rizkyindrawanto15',
        keywords: 'github repository code source profile',
        badge: 'External',
        icon: <Github className="w-4 h-4 text-white/80" />,
        onSelect: () => {
          window.open(
            'https://github.com/rizkyindrawanto15',
            '_blank',
            'noopener,noreferrer'
          );
          onClose();
        },
      },
      {
        id: 'action-linkedin',
        group: 'Quick Actions',
        title: 'Open LinkedIn Profile',
        subtitle: 'Muh. Rizky Indra Wanto',
        keywords: 'linkedin network career connect',
        badge: 'External',
        icon: <Linkedin className="w-4 h-4 text-blue-400" />,
        onSelect: () => {
          window.open(
            'https://www.linkedin.com/in/muh-rizky-indra-wanto-4a626b3b8/',
            '_blank',
            'noopener,noreferrer'
          );
          onClose();
        },
      },
      {
        id: 'action-instagram',
        group: 'Quick Actions',
        title: 'Open Instagram',
        subtitle: '@kiii.neee',
        keywords: 'instagram social media dm',
        badge: 'External',
        icon: <Instagram className="w-4 h-4 text-pink-400" />,
        onSelect: () => {
          window.open(
            'https://www.instagram.com/kiii.neee/',
            '_blank',
            'noopener,noreferrer'
          );
          onClose();
        },
      },
    ];

    const projectItems: PaletteItem[] = PROJECTS_DATA.map((p) => ({
      id: `proj-${p.id}`,
      group: 'Projects',
      title: p.title,
      subtitle: `${p.category} · ${p.technologies.slice(0, 3).join(', ')}`,
      keywords: `${p.title} ${p.category} ${p.shortDescription} ${p.technologies.join(' ')}`,
      badge: p.liveUrl ? 'Live' : p.number,
      icon: <FolderGit2 className="w-4 h-4 text-indigo-400" />,
      onSelect: () => {
        onClose();
        onOpenProject(p.id);
      },
    }));

    const liveDemoItems: PaletteItem[] = PROJECTS_DATA.filter((p) =>
      Boolean(p.liveUrl)
    ).map((p) => ({
      id: `demo-${p.id}`,
      group: 'Live Demos',
      title: `Launch ${p.title}`,
      subtitle: p.liveUrl!.replace(/^https?:\/\//, ''),
      keywords: `live demo launch open preview ${p.title} ${p.liveUrl}`,
      badge: 'Open App',
      icon: <ExternalLink className="w-4 h-4 text-emerald-400" />,
      onSelect: () => {
        window.open(p.liveUrl!, '_blank', 'noopener,noreferrer');
        onClose();
      },
    }));

    const certItems: PaletteItem[] = CERTIFICATES_DATA.map((c) => ({
      id: `cert-${c.id}`,
      group: 'Certificates',
      title: c.title,
      subtitle: `${c.issuingOrganization} · ${c.credentialId || c.issueDate}`,
      keywords: `${c.title} ${c.issuingOrganization} ${c.category} ${c.credentialId || ''} ${c.issueDate} certificate sertifikat`,
      badge: c.index,
      icon: <Award className="w-4 h-4 text-amber-300" />,
      onSelect: () => {
        onClose();
        onOpenCertificate(c.id);
      },
    }));

    const skillItems: PaletteItem[] = SKILL_GROUPS.flatMap((g) =>
      g.skills.map((s) => ({
        id: `skill-${g.id}-${s.name}`,
        group: 'Tech Stack' as const,
        title: s.name,
        subtitle: `${g.title} · ${s.appliedIn.slice(0, 2).join(', ')}`,
        keywords: `skill stack tool ${s.name} ${g.title} ${s.appliedIn.join(' ')}`,
        icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
        onSelect: () => {
          onClose();
          onNavigateSection('skills');
        },
      }))
    );

    return [
      ...quickActions,
      ...projectItems,
      ...liveDemoItems,
      ...certItems,
      ...navItems,
      ...skillItems,
    ];
  }, [
    copiedEmail,
    emailAddress,
    onClose,
    onNavigateSection,
    onOpenCertificate,
    onOpenProject,
  ]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Curated default spotlight view when query is empty
      return [
        ...allItems.filter((i) => i.group === 'Navigation'),
        ...allItems.filter((i) => i.group === 'Live Demos'),
        ...allItems.filter((i) => i.group === 'Certificates').slice(0, 5),
        ...allItems.filter((i) => i.group === 'Quick Actions'),
      ];
    }
    const tokens = q.split(/\s+/);
    return allItems.filter((item) => {
      const hay = `${item.title} ${item.subtitle} ${item.keywords}`.toLowerCase();
      return tokens.every((tok) => hay.includes(tok));
    });
  }, [allItems, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredItems.length > 0) {
          setActiveIndex((prev) => (prev + 1) % filteredItems.length);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredItems.length > 0) {
          setActiveIndex(
            (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
          );
        }
      } else if (e.key === 'Enter') {
        if (filteredItems[activeIndex]) {
          e.preventDefault();
          filteredItems[activeIndex].onSelect();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, filteredItems, isOpen, onClose]);

  // Group items preserving order for crisp Spotlight headers
  const groupedSections = useMemo(() => {
    const map = new Map<string, { item: PaletteItem; flatIndex: number }[]>();
    filteredItems.forEach((item, idx) => {
      const list = map.get(item.group) || [];
      list.push({ item, flatIndex: idx });
      map.set(item.group, list);
    });
    return Array.from(map.entries());
  }, [filteredItems]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-[90] bg-black/75 backdrop-blur-md flex items-start justify-center pt-[10vh] sm:pt-[13vh] px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio Command Palette"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[620px] rounded-3xl bg-[#0b0d15]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_28px_90px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[76vh]"
          >
            {/* Top Search Input */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-white/[0.08]">
              <Search className="w-4 h-4 text-blue-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari project, sertifikat (IBM / HackerRank / Dicoding), atau skill..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-xs text-white/45 hover:text-white px-1.5 py-0.5"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/65 hover:text-white transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable Results */}
            <div className="overflow-y-auto p-2 sm:p-2.5 space-y-3">
              {groupedSections.length === 0 ? (
                <div className="py-12 text-center text-sm text-white/45">
                  Tidak ditemukan hasil untuk &ldquo;{query}&rdquo;.
                </div>
              ) : (
                groupedSections.map(([groupName, entries]) => (
                  <div key={groupName} className="space-y-1">
                    <div className="px-3 pt-1 pb-0.5 text-[10px] font-mono uppercase tracking-[0.16em] text-white/40">
                      {groupName}
                    </div>
                    {entries.map(({ item, flatIndex }) => {
                      const isSelected = flatIndex === activeIndex;
                      return (
                        <button
                          key={item.id}
                          ref={(el) => {
                            itemRefs.current[flatIndex] = el;
                          }}
                          type="button"
                          onMouseEnter={() => setActiveIndex(flatIndex)}
                          onClick={item.onSelect}
                          className={`w-full px-3 py-2.5 rounded-2xl flex items-center justify-between gap-3 text-left transition-colors ${
                            isSelected
                              ? 'bg-white/[0.09] text-white'
                              : 'text-white/75 hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                                isSelected
                                  ? 'bg-white/[0.1] border-white/20'
                                  : 'bg-white/[0.04] border-white/[0.07]'
                              }`}
                            >
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-medium text-white truncate">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-white/45 truncate">
                                {item.subtitle}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.badge && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                                  item.badge === 'Live' ||
                                  item.badge === 'Open App'
                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/25'
                                    : 'bg-white/[0.06] text-white/55'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            <ArrowUpRight
                              className={`w-3.5 h-3.5 transition-opacity ${
                                isSelected ? 'opacity-90 text-white' : 'opacity-25'
                              }`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer Keyboard Hints */}
            <div className="px-4 sm:px-5 py-2.5 border-t border-white/[0.07] bg-[#080a11] flex items-center justify-between text-[11px] text-white/40 font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
                <span>ESC Close</span>
              </div>
              <span className="hidden sm:inline">
                {PROJECTS_DATA.length} Projects · {CERTIFICATES_DATA.length}{' '}
                Credentials
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
