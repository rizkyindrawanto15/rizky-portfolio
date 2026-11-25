import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export type NavSectionId =
  | 'home'
  | 'about'
  | 'journey'
  | 'projects'
  | 'certificates'
  | 'skills'
  | 'contact';

interface NavbarProps {
  activeSection: NavSectionId;
  onNavigate: (id: NavSectionId) => void;
  onOpenCommandPalette: () => void;
}

const NAV_ITEMS: { id: NavSectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenCommandPalette,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 36);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: NavSectionId) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4 pointer-events-none">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
          {/* Brand Monogram Pill */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            aria-label="Rizky Indra Wanto — Back to top"
            className={`pointer-events-auto inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full transition-all duration-300 ${
              isScrolled
                ? 'bg-[#0e1017]/80 backdrop-blur-xl border border-white/[0.1] shadow-[0_8px_30px_rgba(0,0,0,0.45)]'
                : 'bg-black/40 backdrop-blur-md border border-white/[0.07]'
            }`}
          >
            <svg
              width="22"
              height="18"
              viewBox="0 0 36 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M2 3L13.5 27L21.5 10.5H14.5L11.5 17L5.8 3H2Z"
                fill="currentColor"
              />
              <path
                d="M18.5 3L25.5 18.5L32.5 3H28.5L25.5 10L22.5 3H18.5Z"
                fill="#60a5fa"
              />
              <path
                d="M23 23.5L34 3H30.2L19.2 23.5H23Z"
                fill="currentColor"
                fillOpacity="0.85"
              />
            </svg>
            <span className="text-xs font-medium tracking-tight text-white/90 hidden sm:inline">
              {PERSONAL_INFO.monogram}
            </span>
          </button>

          {/* Centered Apple Frosted Glass Navigation Pill (Desktop) */}
          <nav
            aria-label="Primary Navigation"
            className="pointer-events-auto hidden lg:flex items-center gap-0.5 p-1 rounded-full bg-[#0e1017]/78 backdrop-blur-2xl border border-white/[0.09] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-[#05060a] shadow-sm'
                      : 'bg-transparent text-white/65 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action / Spotlight Search / Mobile Toggle */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open quick search (Ctrl+K)"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#0e1017]/80 hover:bg-white/[0.14] backdrop-blur-xl border border-white/[0.1] text-xs font-medium text-white/80 hover:text-white transition-all"
            >
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline font-mono text-[11px] text-white/55">
                ⌘K
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-xl border border-white/[0.1] text-xs font-medium text-white transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Connect</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden w-10 h-10 rounded-full bg-[#0e1017]/85 backdrop-blur-xl border border-white/[0.1] flex items-center justify-center text-white"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Clean Apple Full-Screen Frosted Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-[#05060a]/96 backdrop-blur-2xl pt-24 pb-10 px-6 flex flex-col justify-between lg:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.03 * idx }}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full py-3.5 px-4 rounded-2xl text-left text-2xl font-medium tracking-tight transition-colors ${
                      isActive
                        ? 'bg-white/[0.08] text-white'
                        : 'text-white/55 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/50">
              <span>{PERSONAL_INFO.fullName}</span>
              <span>{PERSONAL_INFO.school}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
