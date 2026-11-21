import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowUp,
  Check,
  Mail,
  Github,
  Linkedin,
  Instagram,
  Copy,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface ContactSectionProps {
  onBackToTop: () => void;
}

const getChannelIcon = (id: string) => {
  switch (id) {
    case 'email':
      return <Mail className="w-5 h-5 text-white/80" />;
    case 'github':
      return <Github className="w-5 h-5 text-white/80" />;
    case 'linkedin':
      return <Linkedin className="w-5 h-5 text-white/80" />;
    case 'instagram':
      return <Instagram className="w-5 h-5 text-white/80" />;
    default:
      return <ArrowUpRight className="w-5 h-5 text-white/80" />;
  }
};

export const ContactSection: React.FC<ContactSectionProps> = ({
  onBackToTop,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const activeChannels = PERSONAL_INFO.contactLinks.filter((c) => Boolean(c.url));
  const emailChannel = activeChannels.find((c) => c.id === 'email');
  const emailAddress =
    emailChannel?.handlePlaceholder || 'mriskyindrawanto@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <footer
      id="contact"
      className="relative pt-24 sm:pt-32 pb-12 bg-[#040509] border-t border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 space-y-16">
        {/* Clean Centered Apple Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-5"
        >
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-blue-400/90">
            Contact
          </span>
          <h2 className="text-4xl sm:text-6xl font-semibold tracking-[-0.03em] text-white leading-[1.05]">
            Let&apos;s Connect.
          </h2>
          <p className="text-sm sm:text-base text-white/55 max-w-md mx-auto">
            Terbuka untuk kolaborasi, proyek baru, dan kesempatan berkembang bersama.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#05060a] hover:bg-white/90 text-xs sm:text-sm font-medium shadow-[0_8px_30px_rgba(255,255,255,0.14)] transition-all"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Email Disalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{emailAddress}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Clean 4-Card Active Contact Channels (Email, GitHub, LinkedIn, Instagram) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeChannels.map((channel) => (
            <a
              key={channel.id}
              href={channel.url!}
              target={channel.id === 'email' ? undefined : '_blank'}
              rel={channel.id === 'email' ? undefined : 'noopener noreferrer'}
              className="group rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 p-6 flex flex-col justify-between gap-8 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.06] flex items-center justify-center">
                  {getChannelIcon(channel.id)}
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/35 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div>
                <div className="text-base font-semibold text-white tracking-tight">
                  {channel.label}
                </div>
                <div className="text-xs text-white/50 mt-0.5 truncate">
                  {channel.handlePlaceholder}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Minimal Apple Footer */}
        <div className="pt-8 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
          <span>
            © 2026 {PERSONAL_INFO.fullName} · {PERSONAL_INFO.school}
          </span>

          <button
            type="button"
            onClick={onBackToTop}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/75 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
