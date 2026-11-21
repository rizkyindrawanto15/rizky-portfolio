import React from 'react';

interface IconProps {
  className?: string;
}

export const SkillIcon: React.FC<{ name: string; className?: string }> = ({
  name,
  className = 'w-full h-full object-contain',
}) => {
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  switch (norm) {
    case 'html':
    case 'html5':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M5 3L7.5 27.5L16 30L24.5 27.5L27 3H5Z" fill="#E44D26" />
          <path d="M16 28V5H25L22.8 25.8L16 28Z" fill="#F16529" />
          <path d="M9.5 8.5H22.5L22.2 12H16V15H21.9L21.3 21.2L16 22.7V25.8L23.4 23.8L24.4 12L24.7 8.5H9.5V8.5Z" fill="#EBEBEB" opacity="0.2" />
          <path d="M10 9H22L21.3 16.5H16V19.5H20.7L20.2 23.5L16 24.7V21.5L16 9Z" fill="#FFFFFF" />
          <path d="M10 9L10.5 14H16V11.5H12.8L12.5 9H10ZM11 16.5L11.3 19.5H16V16.5H11Z" fill="#EBEBEB" />
        </svg>
      );

    case 'css':
    case 'css3':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M5 3L7.5 27.5L16 30L24.5 27.5L27 3H5Z" fill="#1572B6" />
          <path d="M16 28V5H25L22.8 25.8L16 28Z" fill="#33A9DC" />
          <path d="M9.8 9H22.2L22 12H16V14.5H21.7L21.1 21.5L16 22.9V25.8L23.2 23.8L24.2 12L24.5 9H9.8V9Z" fill="#FFFFFF" />
          <path d="M16 14.5H12.5L12.8 17.5H16V14.5ZM16 22.9L12.9 22L12.7 19.5H10.2L10.7 24L16 25.5V22.9Z" fill="#EBEBEB" />
        </svg>
      );

    case 'javascript':
    case 'js':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <rect width="32" height="32" rx="4" fill="#F7DF1E" />
          <path d="M18 13.5V23.5C18 25.5 16.2 26 14.2 24.8L15 22.8C15.8 23.3 16.4 23.2 16.4 22V13.5H18ZM25.8 19.6C25.8 22.8 23.6 24.4 20.8 23.6L21.4 21.4C23 22 24.2 21.2 24.2 19.6C24.2 18.2 23.4 17.6 21.6 16.8C19.2 15.8 18.4 14.6 18.4 13C18.4 10.4 20.4 8.8 23.2 9.4L22.8 11.6C21.4 11.2 20.2 11.8 20.2 13C20.2 14.2 20.8 14.8 22.6 15.6C25 16.6 25.8 17.8 25.8 19.6Z" fill="#000000" />
        </svg>
      );

    case 'react':
    case 'reactnative':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="16" cy="16" r="2.8" fill="#61DAFB" />
          <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" strokeWidth="1.6" transform="rotate(0 16 16)" />
          <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" strokeWidth="1.6" transform="rotate(60 16 16)" />
          <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" strokeWidth="1.6" transform="rotate(120 16 16)" />
        </svg>
      );

    case 'php':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <ellipse cx="16" cy="16" rx="15" ry="9" fill="#777BB4" />
          <text x="16" y="20" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="900" fontSize="11" letterSpacing="0.5">PHP</text>
        </svg>
      );

    case 'mysql':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <rect width="32" height="32" rx="4" fill="#00758F" />
          <path d="M7 21C10 21 12 18 13 14C14 11 16 9 19 9C22 9 24 11 24 14C24 17 21 21 16 23C13 24 9 23 7 21Z" fill="#F29111" opacity="0.9" />
          <circle cx="19.5" cy="12.5" r="1.5" fill="#FFFFFF" />
          <path d="M12 21C14 21 17 19 18 17C17 17 15 18 13 18C10 18 9 19 7 21H12Z" fill="#FFFFFF" />
          <text x="16" y="27" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="bold" fontSize="6.5">MySQL</text>
        </svg>
      );

    case 'supabase':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <rect width="32" height="32" rx="4" fill="#1C1C1C" />
          <path d="M17.5 4L5 18.5H15L13.5 28L27 13.5H16L17.5 4Z" fill="#3ECF8E" />
        </svg>
      );

    case 'java':
    case 'openjdk':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <rect width="32" height="32" rx="4" fill="#1E293B" />
          <path d="M12 22C12 22 14 23 18 23C21 23 23 21.5 23 20C23 18.5 21 17.5 19 17C17 16.5 15.5 15.5 16 14C16.5 12.5 18.5 12 18.5 12" stroke="#EA2D2E" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 25C13 26 19 26 22 25" stroke="#5382A1" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 27C12 28.5 20 28.5 24 27" stroke="#5382A1" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M15 8C15 8 13 10 14 11.5C15 13 17 13.5 17 13.5" stroke="#EA2D2E" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'python':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M15.8 4C10.5 4 11 6.3 11 6.3L11 8.8H16.2V9.6H8.8C6.5 9.6 4.5 11 4.5 14.8C4.5 18.6 6.5 19.1 6.5 19.1H8.5V16.8C8.5 14.2 10.8 14.2 10.8 14.2H16.2C18.4 14.2 19.2 12.6 19.2 11V6.3C19.2 4.6 17.8 4 15.8 4ZM13.8 5.6C14.4 5.6 14.9 6.1 14.9 6.7C14.9 7.3 14.4 7.8 13.8 7.8C13.2 7.8 12.7 7.3 12.7 6.7C12.7 6.1 13.2 5.6 13.8 5.6Z" fill="#3776AB" />
          <path d="M16.2 28C21.5 28 21 25.7 21 25.7L21 23.2H15.8V22.4H23.2C25.5 22.4 27.5 21 27.5 17.2C27.5 13.4 25.5 12.9 25.5 12.9H23.5V15.2C23.5 17.8 21.2 17.8 21.2 17.8H15.8C13.6 17.8 12.8 19.4 12.8 21V25.7C12.8 27.4 14.2 28 16.2 28ZM18.2 26.4C17.6 26.4 17.1 25.9 17.1 25.3C17.1 24.7 17.6 24.2 18.2 24.2C18.8 24.2 19.3 24.7 19.3 25.3C19.3 25.9 18.8 26.4 18.2 26.4Z" fill="#FFD43B" />
        </svg>
      );

    case 'c':
    case 'clanguage':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <rect width="32" height="32" rx="4" fill="#00599C" />
          <path d="M21.5 9.5C20.2 8.5 18.5 8 16.5 8C11.5 8 8 11.5 8 16C8 20.5 11.5 24 16.5 24C18.5 24 20.2 23.5 21.5 22.5L20 19.5C19 20.3 17.8 20.7 16.5 20.7C13.5 20.7 11.5 18.8 11.5 16C11.5 13.2 13.5 11.3 16.5 11.3C17.8 11.3 19 11.7 20 12.5L21.5 9.5Z" fill="#FFFFFF" />
        </svg>
      );

    case 'haskell':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <rect width="32" height="32" rx="4" fill="#1E1E2E" />
          <path d="M4 6L10.5 16L4 26H7.8L12.4 16L7.8 6H4Z" fill="#5E5086" />
          <path d="M11 6L17.5 16L11 26H14.8L19.4 16L14.8 6H11Z" fill="#8F4E8B" />
          <path d="M21 13.5L19.5 16L26 26H29.5L23 16L24.5 13.5H21Z" fill="#5E5086" />
          <path d="M21.5 19H28V21.5H23.1L21.5 19ZM23.5 22.5H28V25H25.1L23.5 22.5Z" fill="#8F4E8B" />
        </svg>
      );

    case 'expo':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <rect width="32" height="32" rx="4" fill="#000020" />
          <path d="M6 24L14.5 9.5L17.5 14.5L12 24H6ZM17 24L22.5 14.5L26 20.5L24 24H17ZM19.5 9.5L23 15.5L21.5 18L18 12L19.5 9.5Z" fill="#FFFFFF" />
        </svg>
      );

    case 'microsoftword':
    case 'word':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <rect x="6" y="4" width="20" height="24" rx="2" fill="#185ABD" />
          <path d="M6 8L20 5V27L6 24V8Z" fill="#2B7CD3" />
          <rect x="18" y="7" width="8" height="18" fill="#103F91" />
          <path d="M4 7H16V25H4V7Z" rx="1.5" fill="#185ABD" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
          <text x="10" y="20" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="900" fontSize="13">W</text>
        </svg>
      );

    case 'microsoftexcel':
    case 'excel':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <rect x="6" y="4" width="20" height="24" rx="2" fill="#107C41" />
          <path d="M6 8L20 5V27L6 24V8Z" fill="#185C37" />
          <rect x="18" y="7" width="8" height="18" fill="#0E4A28" />
          <path d="M4 7H16V25H4V7Z" rx="1.5" fill="#107C41" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
          <text x="10" y="20" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="900" fontSize="13">X</text>
        </svg>
      );

    case 'git':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M30 14.5L17.5 2C16.8 1.3 15.5 1.3 14.7 2L12.5 4.2L15.6 7.3C16.5 7 17.6 7.2 18.3 8C19.1 8.8 19.3 9.9 18.9 10.8L21.8 13.7C22.7 13.3 23.8 13.5 24.6 14.3C25.6 15.3 25.6 16.9 24.6 17.9C23.6 18.9 22 18.9 21 17.9C20.3 17.2 20 16.2 20.3 15.3L17.6 12.6V19.6C18.2 20 18.6 20.8 18.6 21.6C18.6 22.9 17.5 24 16.2 24C14.9 24 13.8 22.9 13.8 21.6C13.8 20.7 14.3 19.9 15 19.5V12.4C14.3 12 13.8 11.2 13.8 10.4C13.8 9.5 14.2 8.7 14.9 8.2L11.8 5.1L2 14.9C1.3 15.6 1.3 16.9 2 17.7L14.5 30.2C15.2 30.9 16.5 30.9 17.3 30.2L29.9 17.6C30.7 16.7 30.7 15.3 30 14.5Z" fill="#F05032" />
        </svg>
      );

    case 'github':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <rect width="32" height="32" rx="16" fill="#FFFFFF" />
          <path fillRule="evenodd" clipRule="evenodd" d="M16 4C9.4 4 4 9.4 4 16C4 21.3 7.4 25.8 12.2 27.4C12.8 27.5 13 27.1 13 26.8V24.7C9.7 25.4 9 23.1 9 23.1C8.5 21.7 7.7 21.3 7.7 21.3C6.6 20.5 7.8 20.6 7.8 20.6C9 20.7 9.6 21.8 9.6 21.8C10.7 23.6 12.4 23.1 13.1 22.8C13.2 22 13.5 21.5 13.9 21.2C11.2 20.9 8.4 19.8 8.4 15.3C8.4 14 8.9 12.9 9.6 12.1C9.5 11.8 9.1 10.5 9.8 8.8C9.8 8.8 10.8 8.5 13.1 10C14 9.7 15 9.6 16 9.6C17 9.6 18 9.7 18.9 10C21.2 8.5 22.2 8.8 22.2 8.8C22.9 10.5 22.5 11.8 22.4 12.1C23.2 12.9 23.6 14 23.6 15.3C23.6 19.9 20.8 20.9 18.1 21.2C18.6 21.6 19 22.4 19 23.7V26.8C19 27.1 19.2 27.5 19.8 27.4C24.6 25.8 28 21.3 28 16C28 9.4 22.6 4 16 4Z" fill="#181717" />
        </svg>
      );

    case 'figma':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M12 4H16V10H12C10.3 10 9 8.7 9 7C9 5.3 10.3 4 12 4Z" fill="#F24E1E" />
          <path d="M16 4H20C21.7 4 23 5.3 23 7C23 8.7 21.7 10 20 10H16V4Z" fill="#FF7262" />
          <path d="M12 10H16V16H12C10.3 16 9 14.7 9 13C9 11.3 10.3 10 12 10Z" fill="#A259FF" />
          <path d="M16 10H20C21.7 10 23 11.3 23 13C23 14.7 21.7 16 20 16C18.3 16 17 14.7 17 13C17 11.3 18.3 10 16 10Z" fill="#1ABCFE" />
          <path d="M12 16H16V22C16 23.7 14.7 25 13 25C11.3 25 10 23.7 10 22C10 20.3 11.3 19 13 19C14.7 19 16 20.3 16 22H12C10.3 22 9 20.7 9 19C9 17.3 10.3 16 12 16Z" fill="#0ACF83" />
        </svg>
      );

    case 'vscode':
    case 'visualstudiocode':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M23.5 2.5L16.5 9L9.5 3.5L6 6V26L9.5 28.5L16.5 23L23.5 29.5L27 27.5V4.5L23.5 2.5Z" fill="#0065A9" />
          <path d="M23.5 2.5L16.5 9V23L23.5 29.5L27 27.5V4.5L23.5 2.5Z" fill="#007ACC" />
          <path d="M16.5 9L9.5 3.5L6 6L14 16L6 26L9.5 28.5L16.5 23V9Z" fill="#1F9CF0" />
        </svg>
      );

    case 'laragon':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <rect width="32" height="32" rx="6" fill="#0E7090" />
          {/* Laragon Whale / L logo representation */}
          <path d="M7 11C7 8.8 8.8 7 11 7H21C23.2 7 25 8.8 25 11V15C25 20.5 20.5 25 15 25H7V11Z" fill="#06B6D4" />
          <circle cx="11.5" cy="12.5" r="1.5" fill="#FFFFFF" />
          <path d="M11 20H19V22H11V20Z" fill="#FFFFFF" />
          <path d="M7 16H14V18H7V16Z" fill="#FFFFFF" opacity="0.8" />
        </svg>
      );

    case 'phpmyadmin':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <rect width="32" height="32" rx="4" fill="#FFFFFF" />
          {/* Official phpMyAdmin multi-colored sail / logo */}
          <path d="M5 24C9 24 13 22 15 17L13 7C11 12 8 18 5 24Z" fill="#F47C20" />
          <path d="M15 17C16 11 19 6 22 4C20 10 18 16 16 22C15.5 20.5 15.2 18.8 15 17Z" fill="#6C78AF" />
          <path d="M16 22C19 22 23 20 27 16C23 18 19 20 16 22Z" fill="#E84F38" />
          <path d="M8 25C13 27 20 27 25 24C21 25.5 15 25.5 8 25Z" fill="#3A559F" />
        </svg>
      );

    default:
      return (
        <div className="w-full h-full rounded bg-blue-500/20 border border-blue-400/40 flex items-center justify-center font-mono text-xs font-bold text-blue-400">
          {name.slice(0, 2).toUpperCase()}
        </div>
      );
  }
};
