import React, { Component, ErrorInfo, ReactNode, Suspense, useEffect, useState } from 'react';
import { Navbar, NavSectionId } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CustomCursor } from './components/CustomCursor';

const EducationTimelineSection = React.lazy(() =>
  import('./components/EducationTimelineSection').then((m) => ({
    default: m.EducationTimelineSection,
  }))
);
const ProjectsSection = React.lazy(() =>
  import('./components/ProjectsSection').then((m) => ({
    default: m.ProjectsSection,
  }))
);
const CertificatesSection = React.lazy(() =>
  import('./components/CertificatesSection').then((m) => ({
    default: m.CertificatesSection,
  }))
);
const SkillsSection = React.lazy(() =>
  import('./components/SkillsSection').then((m) => ({
    default: m.SkillsSection,
  }))
);
const ContactSection = React.lazy(() =>
  import('./components/ContactSection').then((m) => ({
    default: m.ContactSection,
  }))
);

interface ErrorBoundaryState {
  hasError: boolean;
}

class PortfolioErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Portfolio runtime error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030305] text-white flex items-center justify-center p-6">
          <div className="max-w-md border border-white/15 p-8 space-y-4">
            <div className="font-mono text-xs text-blue-400 uppercase tracking-widest">
              SYSTEM RECOVERY
            </div>
            <h1 className="text-2xl font-light">
              A rendering error occurred in the current view.
            </h1>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-white/25 font-mono text-xs uppercase hover:border-blue-400"
            >
              Reload Portfolio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const SECTION_IDS: NavSectionId[] = [
  'home',
  'about',
  'journey',
  'projects',
  'certificates',
  'skills',
  'contact',
];

export function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.34;

      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const id = SECTION_IDS[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: NavSectionId) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <PortfolioErrorBoundary>
      <div className="min-h-screen bg-[#030305] text-[#f4f4f6] relative selection:bg-blue-500/30 selection:text-white">
        {/* Delicate Film Grain Texture Overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-[60] grain-overlay"
          aria-hidden="true"
        />

        {/* Custom Desktop Cursor */}
        <CustomCursor />

        {/* Minimalist Editorial Navigation */}
        <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

        {/* Main Content */}
        <main>
          <HeroSection onEnterPortfolio={() => scrollToSection('about')} />
          <AboutSection />
          <Suspense
            fallback={
              <div className="py-24 text-center font-mono text-xs tracking-widest uppercase text-white/40">
                LOADING PORTFOLIO MODULES...
              </div>
            }
          >
            <EducationTimelineSection />
            <ProjectsSection />
            <CertificatesSection />
            <SkillsSection />
          </Suspense>
        </main>

        {/* Contact & Footer */}
        <Suspense fallback={null}>
          <ContactSection onBackToTop={() => scrollToSection('home')} />
        </Suspense>
      </div>
    </PortfolioErrorBoundary>
  );
}

export default App;
