export interface PersonalInfo {
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  monogram: string;
  rolePrimary: string;
  roleSecondary: string;
  locationLabel: string;
  locationCity: string;
  yearLabel: string;
  school: string;
  major: string;
  majorShort: string;
  gradeLevel: string;
  academicYear: string;
  profilePhotoUrl: string | null; // Set to e.g. '/images/rizky-profile.jpg' when available
  signatureImageUrl: string | null; // Optional: set to '/ttd.png' or '/ttd.svg' (transparent background) to use your own signature image behind the face
  bottomSignatureText: string; // Large signature text at the bottom of the Hero section
  aboutIntroId: string;
  aboutExtendedId: string;
  developmentPhilosophy: {
    title: string;
    statement: string;
    pillars: {
      index: string;
      title: string;
      description: string;
    }[];
  };
  interests: {
    code: string;
    label: string;
    detail: string;
  }[];
  contactLinks: {
    id: 'email' | 'github' | 'linkedin' | 'instagram';
    label: string;
    url: string | null; // Leave null until actual contact URL is provided
    handlePlaceholder: string;
    statusNote: string;
  }[];
}

export interface EducationEntry {
  id: string;
  index: string;
  period: string;
  institution: string;
  shortName?: string;
  level: string;
  majorOrFocus: string;
  status: 'CONFIRMED' | 'PLACEHOLDER';
  location: string;
  coordinates?: string;
  summary?: string;
  keySubjects?: string[];
  achievementsOrMilestones?: string[];
  academicProgress?: {
    label: string;
    percentage: number;
    currentStage: string;
  };
  logoUrl?: string | null;
  editableNote?: string;
}

export interface ProjectScreenshot {
  id: string;
  caption: string;
  aspectLabel: string;
  schematicType:
    | 'inventrack-dashboard'
    | 'inventrack-transactions'
    | 'bmi-calculator'
    | 'step-tracker-map'
    | 'bengkel-erd'
    | 'bengkel-sql'
    | 'kasir-oop'
    | 'kasir-receipt'
    | 'python-flowchart'
    | 'python-terminal'
    | 'excel-ledger'
    | 'excel-formulas';
  imageUrl?: string | null; // Optional path to real screenshot image
}

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  shortDescription: string;
  overview: string;
  problemAddressed: string;
  objectives: string[];
  features: string[];
  technologies: string[];
  databaseStructure?: {
    tableName: string;
    role: string;
    keyFields: string[];
  }[];
  developmentProcess: {
    phase: string;
    title: string;
    detail: string;
  }[];
  lessonsLearned: string[];
  screenshots: ProjectScreenshot[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  accentColor: 'blue' | 'violet' | 'silver';
  layoutSpan: 'wide' | 'tall' | 'standard';
}

export type CertificateCategory =
  | 'Programming'
  | 'Web Development'
  | 'Database'
  | 'Technology'
  | 'Education'
  | 'Other';

export interface CertificateItem {
  id: string;
  index: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  category: CertificateCategory;
  credentialId?: string | null;
  verificationUrl?: string | null;
  fileUrl?: string | null; // Path to certificate image or PDF in /public/certificates/
  previewImageUrl?: string | null;
  description?: string;
  isTemplateSpecimen?: boolean;
}

export interface SkillItem {
  name: string;
  category:
    | 'FRONTEND'
    | 'BACKEND & DATABASE'
    | 'PROGRAMMING'
    | 'MOBILE DEVELOPMENT'
    | 'OFFICE & PRODUCTIVITY'
    | 'TOOLS';
  code: string;
  roleSummary: string;
  appliedIn: string[];
  technicalFocus: string;
  iconSlug?: string;
  logoUrl?: string;
}

export interface SkillGroup {
  id: string;
  index: string;
  title:
    | 'FRONTEND'
    | 'BACKEND & DATABASE'
    | 'PROGRAMMING'
    | 'MOBILE DEVELOPMENT'
    | 'OFFICE & PRODUCTIVITY'
    | 'TOOLS';
  subtitle: string;
  skills: SkillItem[];
}

export interface BehindTheCodeItem {
  id: string;
  index: string;
  title: string;
  category: string;
  narrative: string;
  codeLanguage: string;
  codeFilename: string;
  codeSnippet: string;
  technicalNotes: string[];
}

export const PERSONAL_INFO: PersonalInfo = {
  fullName: 'Rizky Indra Wanto',
  firstName: 'Rizky',
  middleName: 'Indra',
  lastName: 'Wanto',
  monogram: 'RIW',
  rolePrimary: 'CREATIVE DEVELOPER',
  roleSecondary: 'SOFTWARE ENGINEERING STUDENT',
  locationLabel: 'INDONESIA — 2026',
  locationCity: 'Sidoarjo, East Java, Indonesia',
  yearLabel: '2026',
  school: 'SMK Krian 1 Sidoarjo',
  major: 'Rekayasa Perangkat Lunak (RPL)',
  majorShort: 'RPL',
  gradeLevel: 'Grade XII',
  academicYear: '2024 — 2027',
  profilePhotoUrl: '/portrait-source.jpg', // Studio chiaroscuro portrait; replace with your own photo in public/ anytime
  signatureImageUrl: null, // null = memakai tanda tangan vektor SVG (dibuat dari model TTDD.png) dengan animasi tulisan tangan. Isi '/TTDD.png' jika ingin memakai gambar mentah
  bottomSignatureText: 'Rizky Indra Wanto',
  aboutIntroId:
    'Saya merupakan siswa Rekayasa Perangkat Lunak yang memiliki ketertarikan pada pengembangan aplikasi, website, pengelolaan database, dan desain antarmuka. Saya senang mempelajari teknologi baru serta mengembangkan ide menjadi sebuah produk digital yang dapat digunakan.',
  aboutExtendedId:
    'Saat ini saya menempuh pendidikan kelas XII jurusan Rekayasa Perangkat Lunak (RPL) di SMK Krian 1 Sidoarjo. Melalui berbagai tugas praktik dan eksplorasi mandiri, saya fokus mempelajari bagaimana struktur data, logika pemrograman, dan antarmuka pengguna saling terhubung membentuk sistem yang rapi dan fungsional.',
  developmentPhilosophy: {
    title: 'Clarity in Logic, Purpose in Interface.',
    statement:
      'Setiap baris kode dan elemen visual harus memiliki alasan yang jelas. Saya percaya proses belajar terbaik datang dari membangun solusi nyata—mulai dari merancang relasi tabel database, menyusun algoritma dasar, hingga menerjemahkannya menjadi antarmuka yang nyaman digunakan.',
    pillars: [
      {
        index: '01',
        title: 'Structured Foundations',
        description:
          'Memahami alur logika, algoritma, pemrograman berorientasi objek, serta struktur relasi database sebelum membangun antarmuka.',
      },
      {
        index: '02',
        title: 'Functional Craft',
        description:
          'Membangun aplikasi web dan mobile yang tidak hanya tampil bersih, tetapi mampu menangani pencatatan data dan transaksi secara akurat.',
      },
      {
        index: '03',
        title: 'Continuous Exploration',
        description:
          'Terus bereksperimen dengan ekosistem modern seperti React, React Native, dan Supabase sambil memperkuat fondasi SQL, Java, dan Python.',
      },
    ],
  },
  interests: [
    {
      code: 'INT—01',
      label: 'Web Application Development',
      detail: 'Membangun aplikasi web progresif (PWA) dan antarmuka responsif menggunakan HTML, CSS, JavaScript, dan React.',
    },
    {
      code: 'INT—02',
      label: 'Mobile App Exploration',
      detail: 'Merancang aplikasi lintas perangkat menggunakan React Native dan Expo dengan integrasi sensor dan kalkulasi data.',
    },
    {
      code: 'INT—03',
      label: 'Relational Database Design',
      detail: 'Pemodelan entitas, relasi tabel, dan query SQL menggunakan MySQL, phpMyAdmin, serta PostgreSQL pada Supabase.',
    },
    {
      code: 'INT—04',
      label: 'UI/UX & Editorial Systems',
      detail: 'Eksplorasi tata letak tipografi, hierarki informasi, dan perancangan antarmuka di Figma sebelum implementasi kode.',
    },
  ],
  contactLinks: [
    {
      id: 'email',
      label: 'Email',
      url: 'mailto:mriskyindrawanto@gmail.com',
      handlePlaceholder: 'mriskyindrawanto@gmail.com',
      statusNote: 'Direct Email Contact',
    },
    {
      id: 'github',
      label: 'GitHub',
      url: 'https://github.com/rizkyindrawanto15',
      handlePlaceholder: 'github.com/rizkyindrawanto15',
      statusNote: 'Source Code & Repositories',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      url: 'https://id.linkedin.com/in/muh-rizky-indrawanto-b15379451',
      handlePlaceholder: 'in/muh-rizky-indrawanto',
      statusNote: 'Professional LinkedIn Profile',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      url: 'https://www.instagram.com/kyyysja_/',
      handlePlaceholder: '@kyyysja_',
      statusNote: 'Personal Instagram Profile',
    },
  ],
};

export const EDUCATION_TIMELINE: EducationEntry[] = [
  {
    id: 'edu-smk',
    index: '01',
    period: '2024 — 2027',
    institution: 'SMK Krian 1 Sidoarjo',
    shortName: 'SMK Krian 1',
    level: 'Sekolah Menengah Kejuruan (SMK) — Kelas XII',
    majorOrFocus: 'Rekayasa Perangkat Lunak (RPL)',
    status: 'CONFIRMED',
    location: 'Krian, Sidoarjo, Jawa Timur',
    logoUrl: '/schools/smk-krian-1.png',
  },
  {
    id: 'edu-smp',
    index: '02',
    period: '2021 — 2024',
    institution: 'MTs Progresif Bumi Shalawat',
    shortName: 'MTs Progresif',
    level: 'Madrasah Tsanawiyah (MTs / Setara SMP)',
    majorOrFocus: 'Pendidikan Menengah Pertama',
    status: 'CONFIRMED',
    location: 'Tulangan, Sidoarjo, Jawa Timur',
    logoUrl: '/schools/mts-bumi-shalawat.png',
  },
  {
    id: 'edu-sd',
    index: '03',
    period: '2015 — 2021',
    institution: 'SDN Pilang 1',
    shortName: 'SDN Pilang 1',
    level: 'Sekolah Dasar Negeri (SD)',
    majorOrFocus: 'Pendidikan Dasar',
    status: 'CONFIRMED',
    location: 'Pilang, Wonoayu, Sidoarjo, Jawa Timur',
    logoUrl: '/schools/sdn-pilang-1.png',
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'tracelab',
    number: '01',
    title: 'TRACELAB',
    category: 'Web Application',
    year: '2026',
    shortDescription:
      'Modern API testing & development platform with real HTTP execution, SSRF-hardened proxy, self-hosted Monaco response inspector, environments, and collections.',
    overview:
      'TraceLab adalah platform pengujian dan pengembangan API modern berbasis Next.js 15 dan TypeScript yang terinspirasi dari Postman, Insomnia, dan Linear. Aplikasi ini memungkinkan developer mengeksekusi request HTTP nyata, menginspeksi respons multi-mode, mengelola environment variable, serta menyusun koleksi endpoint secara terstruktur.',
    problemAddressed:
      'Pengujian endpoint API sering membutuhkan alat desktop berat atau berpindah-pindah antar utilitas untuk memformat JSON, menguji respons, menyusun dokumentasi, dan membuat cuplikan kode. TraceLab menyatukan alur kerja pengujian dan debugging API ke dalam satu workspace web yang cepat dan ringan.',
    objectives: [
      'Menyediakan mesin eksekusi HTTP nyata (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS) lengkap dengan timeout dan pembatalan request.',
      'Menghadirkan Response Inspector multi-mode (Pretty berbasis Monaco Editor, Raw, JSON Tree, Preview aman, serta Headers & Cookies).',
      'Mendukung manajemen Environment (Local, Development, Staging, Production) dengan resolusi variabel otomatis seperti `{{base_url}}` dan secret masking.',
      'Menyediakan mode persistensi ganda: Cloud Mode melalui Supabase PostgreSQL (RLS) dan Local Mode otomatis tanpa konfigurasi awal.',
    ],
    features: [
      'Real HTTP Execution Engine dengan dukungan AbortController, kontrol timeout, dan SSRF-hardened server-side request proxy.',
      'Multi-mode Response Inspector: Pretty (self-hosted Monaco Editor), Raw search, Interactive JSON Tree, Preview, Headers & Cookies.',
      'Declarative Testing & Assertions untuk validasi status code, latensi, dan properti JSON tanpa eksekusi script tidak aman.',
      'Collections, Workspaces, Dynamic Environments, Code Generator (cURL, JavaScript Fetch, Node.js), JSON Utilities, dan Command Palette (`Ctrl+K`).',
    ],
    technologies: [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'Monaco Editor',
      'Supabase',
      'Zustand',
      'TanStack Query',
      'Framer Motion',
    ],
    developmentProcess: [
      {
        phase: '01 / WORKBENCH ARCHITECTURE',
        title: 'Perancangan Workspace & Request Engine',
        detail:
          'Membangun layout panel resizable, tab request, manajemen koleksi berbasis Zustand, serta mesin eksekusi HTTP dan proxy aman dari SSRF.',
      },
      {
        phase: '02 / INSPECTOR & MONACO',
        title: 'Integrasi Monaco Editor & Response Inspector',
        detail:
          'Mengintegrasikan self-hosted Monaco Editor, tree viewer interaktif, assertion builder deklaratif, serta generator cuplikan kode cURL/Fetch/Node.js.',
      },
      {
        phase: '03 / PERSISTENCE & POLISH',
        title: 'Dual-Mode Storage, Command Palette & Testing',
        detail:
          'Menambahkan dukungan Supabase PostgreSQL dengan RLS serta fallback Local Mode, Command Palette (`Ctrl+K`), dan pengujian unit menggunakan Vitest.',
      },
    ],
    lessonsLearned: [
      'Mengelola state aplikasi developer kompleks (multi-tab request, environment variables, riwayat eksekusi) secara responsif dengan Zustand dan TanStack Query.',
      'Menerapkan proteksi SSRF pada server-side HTTP proxy untuk memblokir akses ke alamat loopback dan metadata cloud.',
      'Menghadirkan pengalaman developer ala aplikasi native di web melalui self-hosted Monaco Editor dan shortcut keyboard.',
    ],
    screenshots: [
      {
        id: 'tl-1',
        caption: 'TRACELAB — Landing Page & Interactive Live HTTP Request Runner',
        aspectLabel: '16:10 LIVE INTERFACE',
        schematicType: 'inventrack-dashboard',
        imageUrl: '/projects/tracelab.png',
      },
      {
        id: 'tl-2',
        caption: 'TRACELAB — API Workbench (Collections, Request Builder & Response Inspector)',
        aspectLabel: '16:10 WORKSPACE UI',
        schematicType: 'inventrack-transactions',
        imageUrl: '/projects/tracelab-workbench.png',
      },
    ],
    liveUrl: null,
    repoUrl: null,
    accentColor: 'violet',
    layoutSpan: 'wide',
  },
  {
    id: 'sid-kedungsugo',
    number: '02',
    title: 'SID KEDUNGSUGO',
    category: 'Web Application',
    year: '2026',
    shortDescription:
      'Sistem Informasi Desa Kedungsugo berbasis Laravel untuk layanan publik, profil desa, statistik penduduk, pembangunan, aset desa, dan transparansi APBDes 3D.',
    overview:
      'Sistem Informasi Desa (SID) Kedungsugo adalah portal digital pemerintahan desa berbasis Laravel dan MySQL yang menyajikan informasi profil desa, statistik kependudukan, kegiatan desa, dokumentasi pembangunan, aset desa, layanan publik, serta laporan transparansi realisasi APBDes dengan grafik 3D SVG interaktif.',
    problemAddressed:
      'Masyarakat desa membutuhkan akses informasi pemerintahan, jadwal kegiatan, persyaratan layanan administrasi, dan transparansi anggaran APBDes yang mudah dijangkau kapan saja tanpa harus selalu datang langsung ke balai desa.',
    objectives: [
      'Menyediakan portal publik yang rapi, cepat, dan mudah diakses warga untuk menelusuri profil, kegiatan, pembangunan, aset, dan layanan Desa Kedungsugo.',
      'Menghadirkan transparansi Laporan Realisasi APBDes lengkap dengan tabel rincian bertingkat, ringkasan agregasi, serta grafik batang 3D SVG dan pie chart interaktif.',
      'Membangun panel administrasi terintegrasi bagi perangkat desa untuk mengelola konten, data penduduk per periode, dokumen layanan, dan laporan keuangan.',
    ],
    features: [
      'Portal publik lengkap: Beranda, Profil Desa, Data Penduduk (kelompok umur, agama, jenis kelamin), Kegiatan Desa, Pembangunan, Aset Desa, dan Layanan.',
      'Modul Laporan Realisasi APBDes publik dengan rincian Pendapatan, Belanja, Pembiayaan, perhitungan otomatis Surplus/Defisit & SILPA, serta grafik batang 3D interaktif.',
      'Panel Admin berbasis Laravel untuk manajemen perangkat desa, tahapan pembangunan, galeri foto kegiatan, syarat layanan, dan pengaturan akun.',
      'Perlindungan keamanan rute publik, sitemap/robots SEO, serta validasi klasifikasi baris rincian dan ringkasan APBDes.',
    ],
    technologies: [
      'Laravel',
      'PHP',
      'MySQL',
      'Tailwind CSS',
      'Vite',
      'JavaScript',
      'Blade Template',
    ],
    developmentProcess: [
      {
        phase: '01 / DATABASE & ROUTING',
        title: 'Struktur Basis Data Desa & Arsitektur Laravel',
        detail:
          'Merancang skema relasional MySQL untuk profil desa, periode penduduk, kegiatan, pembangunan, aset, layanan, serta tabel rincian realisasi APBDes.',
      },
      {
        phase: '02 / PUBLIC PORTAL & APBDES',
        title: 'Antarmuka Portal Warga & Visualisasi APBDes',
        detail:
          'Membangun tampilan identitas visual Desa Kedungsugo bernuansa hijau zamrud dan emas serta mengembangkan komponen tabel dan grafik 3D SVG untuk laporan APBDes.',
      },
      {
        phase: '03 / ADMIN PANEL & VERIFICATION',
        title: 'Manajemen Konten Perangkat Desa & Pengujian',
        detail:
          'Melengkapi panel admin CRUD seluruh modul desa, proteksi autentikasi/captcha, serta verifikasi perhitungan agregasi APBDes.',
      },
    ],
    lessonsLearned: [
      'Membangun sistem informasi pemerintahan skala penuh menggunakan arsitektur MVC Laravel, Eloquent ORM, dan relasi database MySQL.',
      'Menjaga akurasi perhitungan nominal keuangan desa (Pendapatan, Belanja, Pembiayaan Netto, SILPA) dan mencegah penghitungan ganda pada baris ringkasan.',
      'Merancang antarmuka layanan publik yang ramah dibaca pada layar desktop maupun perangkat mobile warga.',
    ],
    screenshots: [
      {
        id: 'sid-1',
        caption: 'SID KEDUNGSUGO — Beranda Publik Sistem Informasi Desa Kedungsugo',
        aspectLabel: '16:10 PUBLIC PORTAL',
        schematicType: 'inventrack-dashboard',
        imageUrl: '/projects/sid-kedungsugo.png',
      },
      {
        id: 'sid-2',
        caption: 'SID KEDUNGSUGO — Halaman Informasi & Statistik Data Penduduk Desa',
        aspectLabel: '16:10 DATA VIEW',
        schematicType: 'inventrack-transactions',
        imageUrl: '/projects/sid-kedungsugo-penduduk.png',
      },
    ],
    liveUrl: null,
    repoUrl: null,
    accentColor: 'blue',
    layoutSpan: 'wide',
  },
  {
    id: 'antreku',
    number: '03',
    title: 'ANTREKU',
    category: 'Web Application',
    year: '2026',
    shortDescription:
      'Real-time digital queue & booking system with live SSE sync, TV waiting monitor with Indonesian TTS voice announcements, QR tickets, and operator dashboard.',
    overview:
      'AntreKu adalah aplikasi web sistem antrean digital & booking jadwal layanan secara real-time menggunakan Server-Sent Events (SSE) berbasis Node.js tanpa dependensi eksternal. Mendukung 3 layar sinkron langsung — Portal Pelanggan, Dasbor Operator, dan Layar TV Ruang Tunggu — plus switcher preset 1-klik untuk Klinik, Barbershop, dan Layanan Servis.',
    problemAddressed:
      'Antrean manual di klinik, barbershop, atau tempat servis sering membuat pelanggan menunggu tanpa kepastian giliran. AntreKu mendigitalisasi tiket antrean, estimasi tunggu, dan pemanggilan loket secara real-time langsung dari browser maupun HP.',
    objectives: [
      'Menyediakan sinkronisasi status antrean & loket secara instan menggunakan Server-Sent Events (SSE).',
      'Mendukung mode Walk-In (Antre Sekarang) dan Booking Jadwal Jam dengan Check-In mandiri serta tiket QR Code.',
      'Menghadirkan Layar Monitor TV Ruang Tunggu dengan pengumuman suara bel & Text-to-Speech Bahasa Indonesia otomatis.',
    ],
    features: [
      'Portal Pelanggan Mobile-First: pilih layanan, estimasi tunggu live, mode Antre Sekarang / Booking Jam, dan Tiket Digital QR Code.',
      'Layar Monitor TV Ruang Tunggu (`/display`): dark mode kontras tinggi, jam live, daftar loket aktif, QR scan HP, dan suara TTS Bahasa Indonesia.',
      'Dasbor Admin & Operator (`/admin`): proteksi PIN, Meja Panggilan (Panggil Berikutnya, Mulai Layani, Panggil Ulang, Selesai, Skip), dan CRUD layanan/loket.',
      'Switcher Preset Bisnis 1-Klik untuk mengubah layanan, loket, dan tema antara Klinik Kesehatan, Barbershop Modern, dan Pusat Layanan Servis.',
    ],
    technologies: [
      'Node.js',
      'Server-Sent Events (SSE)',
      'HTML5',
      'CSS3',
      'JavaScript',
      'Web Speech API (TTS)',
      'QR Code',
    ],
    developmentProcess: [
      {
        phase: '01 / REAL-TIME ENGINE',
        title: 'Arsitektur Server Node.js & SSE',
        detail:
          'Membangun server HTTP murni Node.js dengan manajemen antrean, slot booking, dan siaran event real-time ke seluruh klien via Server-Sent Events.',
      },
      {
        phase: '02 / MULTI-SCREEN UI',
        title: 'Portal Pelanggan, Admin & Layar TV',
        detail:
          'Merancang 3 antarmuka terintegrasi (Portal HP, Meja Panggilan Operator, dan Layar Monitor TV ruang tunggu) beserta generator QR Code LAN otomatis.',
      },
      {
        phase: '03 / VOICE & TESTING',
        title: 'Pengumuman TTS & Pengujian Otomatis',
        detail:
          'Menambahkan pengumuman suara Bahasa Indonesia melalui Web Speech API, switcher preset 3 jenis bisnis, serta pengujian otomatis menggunakan `node --test`.',
      },
    ],
    lessonsLearned: [
      'Mengimplementasikan komunikasi real-time ringan dan stabil menggunakan Server-Sent Events (SSE) tanpa dependensi eksternal.',
      'Mengelola sinkronisasi state multi-layar antara portal pelanggan, operator loket, dan layar monitor TV ruang tunggu.',
      'Memanfaatkan Web Speech API dan notifikasi browser untuk pengalaman pemanggilan antrean yang responsif.',
    ],
    screenshots: [
      {
        id: 'ant-1',
        caption: 'ANTREKU — Layar Monitor TV Ruang Tunggu Real-Time Live & QR Scan',
        aspectLabel: '16:10 LIVE TV DISPLAY',
        schematicType: 'inventrack-dashboard',
        imageUrl: '/projects/antreku-display.png',
      },
      {
        id: 'ant-2',
        caption: 'ANTREKU — Portal Pelanggan (Antre Sekarang, Booking Jadwal & Status Loket)',
        aspectLabel: '16:10 CUSTOMER PORTAL',
        schematicType: 'inventrack-transactions',
        imageUrl: '/projects/antreku-portal.png',
      },
    ],
    liveUrl: null,
    repoUrl: null,
    accentColor: 'blue',
    layoutSpan: 'wide',
  },
  {
    id: 'lokasidasur',
    number: '04',
    title: 'LOKASIDASUR',
    category: 'Web Application',
    year: '2026',
    shortDescription:
      'Map-based local UMKM & culinary directory for Sidoarjo and Surabaya with Leaflet interactive maps, Haversine distance filter, live WIB open hours, and OSRM route preview.',
    overview:
      'LokaSidaSur adalah web direktori interaktif berbasis peta untuk menemukan kuliner legendaris, warung, kedai kopi, sentra oleh-oleh, hingga jasa lokal UMKM di wilayah Sidoarjo dan Surabaya. Dilengkapi peta interaktif Leaflet.js, kalkulasi jarak Haversine, filter jam buka real-time WIB, dan pratinjau rute jalan langsung di peta.',
    problemAddressed:
      'Menemukan UMKM lokal atau kuliner terdekat yang sedang benar-benar buka (termasuk shift ganda dan kuliner tengah malam) serta membandingkan kisaran harga dan rute sering merepotkan. LokaSidaSur menyatukan pencarian geospasial, status buka real-time, dan navigasi dalam satu tampilan peta belah layar.',
    objectives: [
      'Menghadirkan katalog 20 UMKM & kuliner terkurasi di Sidoarjo dan Surabaya lengkap dengan koordinat asli, menu/harga, dan tips lokal.',
      'Mengimplementasikan filter jarak dinamis berbasis rumus Haversine dengan GPS perangkat, 6 titik preset, dan lingkaran radius di peta.',
      'Membangun mesin status jam operasional real-time WIB (shift ganda, buka lewat tengah malam, segera tutup ≤ 45 menit, 24 jam) beserta Simulasi Jam.',
    ],
    features: [
      'Peta Interaktif Leaflet.js (layer Jalan, Minimal, Satelit + fallback peta vektor offline) dengan sinkronisasi hover/klik antar kartu dan pin.',
      'Filter Jarak Haversine (GPS / Set Titik / 6 lokasi preset + radius ≤ 2–20 km) serta pratinjau jalur rute jalan raya (OSRM) untuk Motor, Mobil, & Jalan Kaki.',
      'Mesin Status Jam Buka Real-Time WIB mendukung shift terpisah, operasional lewat tengah malam, hari libur mingguan, serta fitur Simulasi Jam.',
      'Filter kategori, kisaran harga & budget maksimum, simpan Favorit, dan formulir pendaftaran UMKM baru tersimpan di localStorage.',
    ],
    technologies: [
      'JavaScript',
      'Leaflet.js',
      'Node.js',
      'HTML5',
      'CSS3',
      'OSRM Routing',
      'Geolocation API',
    ],
    developmentProcess: [
      {
        phase: '01 / GEOSPATIAL ENGINE',
        title: 'Kalkulasi Haversine, Peta Leaflet & Routing',
        detail:
          'Membangun modul perhitungan jarak Haversine, lingkaran radius, integrasi Leaflet.js dengan fallback offline, dan penarikan garis rute OSRM.',
      },
      {
        phase: '02 / HOURS & FILTER LOGIC',
        title: 'Engine Jam Buka WIB & Multi-Filter',
        detail:
          'Merancang parser jadwal operasional lintas tengah malam dan shift terpisah beserta pengujian otomatis unit logic menggunakan `node --test`.',
      },
      {
        phase: '03 / SPLIT-MAP INTERFACE',
        title: 'UI Katalog Split-Screen & Pendaftaran UMKM',
        detail:
          'Menyusun antarmuka split-screen responsif dengan sinkronisasi kartu-peta, penyimpanan favorit, dan form kontribusi UMKM komunitas.',
      },
    ],
    lessonsLearned: [
      'Mengelola logika geospasial (Haversine, bounding box, koordinat marker, dan routing OSRM) secara presisi pada sisi klien.',
      'Menangani edge-case jam operasional dunia nyata seperti shift pagi-malam dan jam buka melewati pukul 00:00 WIB.',
      'Membangun fallback peta vektor ringan agar aplikasi tetap dapat digunakan saat koneksi internet terbatas.',
    ],
    screenshots: [
      {
        id: 'lks-1',
        caption: 'LOKASIDASUR — Direktori UMKM & Kuliner Sidoarjo–Surabaya dengan Peta Interaktif Leaflet',
        aspectLabel: '16:10 GEOSPATIAL MAP UI',
        schematicType: 'inventrack-dashboard',
        imageUrl: '/projects/lokasidasur.png',
      },
    ],
    liveUrl: null,
    repoUrl: null,
    accentColor: 'blue',
    layoutSpan: 'wide',
  },
  {
    id: 'onchain-intelligence',
    number: '05',
    title: 'ONCHAIN INTELLIGENCE',
    category: 'Web Application',
    year: '2026',
    shortDescription:
      'Multi-chain smart money & wallet intelligence terminal analyzing public on-chain transactions with FIFO cost basis and automated 10-stage wallet discovery.',
    overview:
      'Onchain Intelligence adalah platform terminal analitik blockchain multi-jaringan untuk menemukan, menganalisis, mengkualifikasi, dan memantau wallet Smart Money & Whale menggunakan data publik on-chain dengan metodologi FIFO Cost Basis dan kebijakan Zero-Dummy Policy.',
    problemAddressed:
      'Analisis aktivitas wallet lintas jaringan blockchain (EVM dan Non-EVM) sering terpecah di berbagai explorer dan sulit dievaluasi tanpa pemisahan jelas antara transfer biasa dan aktivitas perdagangan DEX serta perhitungan basis biaya FIFO yang akurat.',
    objectives: [
      'Membangun arsitektur Modular Blockchain Adapter yang mendukung 7 jaringan EVM utama (Ethereum, BSC, Base, Arbitrum, Optimism, Polygon, Avalanche) serta jaringan Non-EVM.',
      'Mengimplementasikan 10-tahap Automated Wallet Discovery & Qualification Pipeline lengkap dengan klasifikasi aktivitas (`BUY`, `SELL`, `SWAP`, `TRANSFER`).',
      'Menghitung metrik kuantitatif FIFO Cost Basis, Realized PnL, ROI, Win Rate, Drawdown, dan Smart Money Score (0–100) disertai indikator Data Confidence.',
      'Menghadirkan antarmuka Dark Trading Terminal berdensitas tinggi menggunakan TanStack Table dan TradingView Lightweight Charts.',
    ],
    features: [
      'Global Wallet Discovery Engine dengan 10 tahapan pemindaian, kualifikasi, dan pengindeksan inkremental lintas jaringan.',
      '14 kategori penemuan wallet (Smart Money, Whale, High Realized PnL, High ROI, High Volume, Trending, Early Token Buyers) dengan filter Data Confidence.',
      'Perhitungan performa berbasis FIFO Cost Basis, deteksi outlier, serta pemisahan tegas antara transfer antar-wallet dan transaksi trading DEX.',
      'Multi-page Analytics Terminal: Overview, Wallet Discovery, Smart Money, Leaderboard, Wallet Explorer, Whale Tracker, Token Intelligence, dan Activity Monitor.',
    ],
    technologies: [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'TanStack Query',
      'TanStack Table',
      'Lightweight Charts',
      'Supabase PostgreSQL',
    ],
    developmentProcess: [
      {
        phase: '01 / ADAPTER ARCHITECTURE',
        title: 'Modular Multi-Chain RPC & Indexer Adapters',
        detail:
          'Merancang kontrak `IBlockchainAdapter` untuk pemeriksaan kesehatan RPC langsung, pengambilan transaksi blok/DEX, saldo token, dan normalisasi event lintas chain.',
      },
      {
        phase: '02 / ANALYTICS & FIFO ENGINE',
        title: 'Mesin Perhitungan FIFO, Qualification & Scoring',
        detail:
          'Mengimplementasikan kalkulasi FIFO Cost Basis, Realized PnL, Bayesian Win Rate, deteksi outlier, dan pipeline kualifikasi wallet 10 tahap yang diuji dengan Vitest.',
      },
      {
        phase: '03 / TERMINAL INTERFACE',
        title: 'Antarmuka Dark Trading Terminal & Multi-View Dashboard',
        detail:
          'Membangun antarmuka terminal gelap dengan tabel analitik TanStack Table, grafik TradingView Lightweight Charts, dan status kesehatan jaringan real-time.',
      },
    ],
    lessonsLearned: [
      'Merancang arsitektur adapter modular lintas blockchain dengan penanganan status koneksi dan rate limit yang transparan.',
      'Menyusun algoritma akuntansi FIFO Cost Basis dan penilaian kualitas data (Data Confidence) untuk analitik on-chain.',
      'Mengoptimalkan antarmuka dashboard data berdensitas tinggi menggunakan Next.js App Router, TanStack Query, dan TanStack Table.',
    ],
    screenshots: [
      {
        id: 'oc-1',
        caption: 'ONCHAIN INTELLIGENCE — Global Wallet Discovery Engine & 10-Stage Indexing Pipeline',
        aspectLabel: '16:10 TERMINAL UI',
        schematicType: 'inventrack-dashboard',
        imageUrl: '/projects/onchain-discovery.png',
      },
    ],
    liveUrl: null,
    repoUrl: null,
    accentColor: 'blue',
    layoutSpan: 'wide',
  },
  {
    id: 'prestasihub',
    number: '06',
    title: 'PRESTASIHUB',
    category: 'Web Application',
    year: '2026',
    shortDescription:
      'Curated Indonesian student portal for IT competitions, hackathons, scholarships, and tech events with live countdowns, 8-axis filtering, deadline calendar, and .ics export.',
    overview:
      'PrestasiHub adalah portal informasi terkurasi untuk pelajar SD hingga Pascasarjana & Umum yang menghimpun 41 program Kompetisi IT, Hackathon, Beasiswa dalam/luar negeri, serta Seminar & Bootcamp — dilengkapi hitung mundur deadline real-time per detik, filter multi-dimensi, kalender bulanan, dan pembanding program side-by-side.',
    problemAddressed:
      'Informasi lomba IT bergengsi, hackathon, dan beasiswa pelajar sering tersebar di berbagai media sosial dengan tenggat waktu dan syarat dokumen yang mudah terlewat. PrestasiHub mengkurasi seluruh program lengkap dengan indikator urgensi deadline dan checklist persyaratan interaktif.',
    objectives: [
      'Mengkurasi 41 program terverifikasi (GEMASTIK, OSN, COMPFEST, LKS SMK, Garuda Hacks, LPDP, IISMA, Bangkit, dll.) dengan countdown real-time.',
      'Menyediakan filter serentak 8 dimensi (Tipe Program, Jenjang, Deadline, 10 Bidang, Biaya, Tingkat, Format, Individu/Tim) dan pencarian instan (`/`).',
      'Membantu persiapan peserta lewat Modal Detail 5 Tab, Checklist Dokumen interaktif, Kalender Deadline + ekspor `.ics`, serta Bandingkan 3 Program.',
    ],
    features: [
      '41 program terkurasi dengan Live Countdown detik-demi-detik & indikator urgensi (Darurat ≤ 3 hari, Minggu Ini ≤ 7 hari, Masih Dibuka, Arsip).',
      'Filter multi-dimensi serentak (jenjang SD–S3/Umum, bidang, pendanaan, format, deadline) + pencarian instan shortcut `/`.',
      'Modal Detail 5 Tab lengkap dengan Checklist Dokumen Interaktif per program, Kalender Deadline bulanan + ekspor `.ics` (Google/Apple Calendar).',
      'Bandingkan Side-by-Side hingga 3 program, Panduan & Sumber Belajar Gratis, Bookmark, Form Kirim Info Event Baru, serta Mode Terang/Gelap.',
    ],
    technologies: [
      'JavaScript',
      'HTML5',
      'CSS3',
      'Node.js',
      'LocalStorage',
      'iCalendar (.ics)',
    ],
    developmentProcess: [
      {
        phase: '01 / DATA ARCHITECTURE',
        title: 'Kurasi 41 Program & Skema Multi-Dimensi',
        detail:
          'Menyusun modul dataset terstruktur (`data-competitions`, `data-scholarships`, `data-events`, `data-guides`) mencakup syarat, timeline, hadiah, dan FAQ.',
      },
      {
        phase: '02 / COUNTDOWN & FILTER ENGINE',
        title: 'Real-Time Countdown, Filter 8-Axis & Compare',
        detail:
          'Mengimplementasikan mesin penyaringan multi-kriteria, pembaruan hitung mundur real-time, komparasi 3 program, dan ekspor jadwal `.ics`.',
      },
      {
        phase: '03 / EDITORIAL PORTAL UI',
        title: 'Antarmuka Portal Responsif & Mode Gelap/Terang',
        detail:
          'Merancang antarmuka portal bersih dengan ticker pengumuman segera tutup, modal 5 tab, checklist interaktif, dan persistensi `localStorage`.',
      },
    ],
    lessonsLearned: [
      'Merancang mesin filter multi-dimensi yang cepat dan sinkron dengan jumlah hitungan dinamis di setiap opsi kategori.',
      'Membuat file standar iCalendar (`.ics`) secara dinamis di browser agar deadline lomba bisa langsung ditambahkan ke kalender pengguna.',
      'Menyusun hierarki informasi padat agar tetap mudah dipindai oleh pelajar dari berbagai jenjang pendidikan.',
    ],
    screenshots: [
      {
        id: 'ph-1',
        caption: 'PRESTASIHUB — Beranda Portal Info Lomba IT, Hackathon & Beasiswa dengan Live Countdown',
        aspectLabel: '16:10 PORTAL HERO',
        schematicType: 'inventrack-dashboard',
        imageUrl: '/projects/prestasihub.png',
      },
      {
        id: 'ph-2',
        caption: 'PRESTASIHUB — Katalog 41 Program Terkurasi & Filter Multi-Dimensi',
        aspectLabel: '16:10 CATALOG & FILTERS',
        schematicType: 'inventrack-transactions',
        imageUrl: '/projects/prestasihub-catalog.png',
      },
    ],
    liveUrl: null,
    repoUrl: null,
    accentColor: 'violet',
    layoutSpan: 'wide',
  },
  {
    id: 'inventrack',
    number: '07',
    title: 'INVENTRACK',
    category: 'Inventory Management System',
    year: '2026',
    shortDescription:
      'A Progressive Web App for inventory management, including item records, borrowing transactions, inventory information, and reporting.',
    overview:
      'InvenTrack adalah aplikasi manajemen inventaris berbasis Progressive Web App (PWA) yang dirancang untuk mempermudah pencatatan barang, pemantauan transaksi peminjaman dan pengembalian, serta penyusunan laporan inventaris secara terpusat menggunakan dukungan database cloud Supabase.',
    problemAddressed:
      'Pencatatan inventaris dan peminjaman barang secara manual menggunakan buku fisik atau lembaran terpisah sering menimbulkan ketidaksesuaian jumlah stok, riwayat peminjam yang sulit dilacak, serta keterlambatan pembuatan laporan berkala.',
    objectives: [
      'Menyediakan sistem pencatatan data barang dan ketersediaan stok secara terstruktur.',
      'Mendigitalisasi alur transaksi peminjaman dan pengembalian barang beserta statusnya.',
      'Mengintegrasikan autentikasi pengguna, database PostgreSQL, dan penyimpanan media menggunakan Supabase.',
      'Menghadirkan pengalaman Progressive Web App (PWA) dengan Service Worker agar akses tetap responsif.',
    ],
    features: [
      'Manajemen data barang (pencatatan item, kategori, kondisi, dan ketersediaan stok).',
      'Pencatatan transaksi peminjaman dan pengembalian inventaris.',
      'Sistem autentikasi pengguna menggunakan Supabase Auth.',
      'Unggah dan kelola foto/dokumen barang melalui Supabase Storage.',
      'Rekapitulasi informasi inventaris dan pembuatan laporan transaksi.',
      'Dukungan Progressive Web App (Service Worker) dan publikasi melalui GitHub Pages.',
    ],
    technologies: [
      'HTML',
      'CSS',
      'JavaScript',
      'Supabase PostgreSQL',
      'Supabase Auth',
      'Supabase Storage',
      'Service Worker',
      'GitHub Pages',
    ],
    developmentProcess: [
      {
        phase: '01 / SCHEMA & AUTH',
        title: 'Perancangan Tabel Supabase & Hak Akses',
        detail:
          'Menyusun skema tabel inventaris dan riwayat transaksi di Supabase PostgreSQL serta mengonfigurasi autentikasi pengguna dengan Supabase Auth.',
      },
      {
        phase: '02 / INTERFACE & LOGIC',
        title: 'Implementasi Antarmuka & Operasi CRUD',
        detail:
          'Membangun antarmuka pengguna dengan HTML, CSS, dan JavaScript modular untuk menangani input barang, transaksi peminjaman, unggah file ke Supabase Storage, serta filter laporan.',
      },
      {
        phase: '03 / PWA & DEPLOYMENT',
        title: 'Konfigurasi Service Worker & Publikasi',
        detail:
          'Menambahkan manifest dan Service Worker agar aplikasi dapat dijalankan layaknya aplikasi mandiri serta dideploy pada GitHub Pages.',
      },
    ],
    lessonsLearned: [
      'Memahami integrasi aplikasi frontend JavaScript murni dengan layanan Backend-as-a-Service (Supabase PostgreSQL, Auth, dan Storage).',
      'Mempelajari cara kerja siklus hidup Service Worker untuk caching aset pada Progressive Web App.',
      'Menyusun struktur data transaksi peminjaman yang menjaga konsistensi stok barang.',
    ],
    screenshots: [
      {
        id: 'inv-1',
        caption: 'INVENTRACK (InventarisKu) — Dashboard Statistik, Ringkasan Kategori & Status Stok',
        aspectLabel: '16:10 LIVE INTERFACE',
        schematicType: 'inventrack-dashboard',
        imageUrl: '/projects/inventaris.png',
      },
      {
        id: 'inv-2',
        caption: 'PREVIEW SCHEMATIC 02 — Borrowing Transaction & Reporting Ledger',
        aspectLabel: '16:10 TRANSACTION FLOW',
        schematicType: 'inventrack-transactions',
        imageUrl: null,
      },
    ],
    liveUrl: null,
    repoUrl: null,
    accentColor: 'blue',
    layoutSpan: 'wide',
  },
  {
    id: 'bmi-step-tracker',
    number: '08',
    title: 'BMI & STEP TRACKER',
    category: 'Mobile Application',
    year: '2026',
    shortDescription:
      'A mobile application concept combining BMI calculation and distance/activity tracking with walking, running, and cycling modes.',
    overview:
      'BMI & Step Tracker merupakan proyek aplikasi perangkat bergerak berbasis React Native dan Expo yang menggabungkan fitur kalkulator Indeks Massa Tubuh (Body Mass Index) dengan pelacak aktivitas fisik yang mendukung mode berjalan kaki (walking), berlari (running), dan bersepeda (cycling).',
    problemAddressed:
      'Pengguna yang ingin memantau kebugaran dasar sering kali harus berpindah antara aplikasi kalkulator BMI sederhana dan aplikasi pencatat aktivitas harian. Proyek ini mengeksplorasi penggabungan kedua fungsi tersebut dalam satu antarmuka mobile yang ringkas.',
    objectives: [
      'Membangun antarmuka aplikasi mobile menggunakan React Native dan ekosistem Expo.',
      'Mengimplementasikan kalkulasi BMI akurat beserta klasifikasi kategori indeks tubuh.',
      'Menyediakan fitur pelacakan jarak dan aktivitas dengan pilihan mode berjalan, berlari, dan bersepeda.',
      'Mempelajari proses kompilasi aplikasi menggunakan Expo Application Services (EAS Build).',
    ],
    features: [
      'Kalkulator BMI interaktif berdasarkan input tinggi dan berat badan beserta indikator kategori.',
      'Pemilihan mode aktivitas: Walking (Berjalan), Running (Berlari), dan Cycling (Bersepeda).',
      'Panel pemantauan jarak tempuh, durasi aktivitas, dan ringkasan sesi.',
      'Antarmuka mobile yang dioptimalkan untuk layar smartphone dengan alur navigasi sederhana.',
    ],
    technologies: ['React Native', 'Expo', 'JavaScript', 'EAS Build'],
    developmentProcess: [
      {
        phase: '01 / MOBILE UI ARCHITECTURE',
        title: 'Perancangan Komponen Layar React Native',
        detail:
          'Menyusun tata letak layar kalkulator BMI dan layar pelacak aktivitas menggunakan komponen dasar React Native.',
      },
      {
        phase: '02 / STATE & ACTIVITY MODES',
        title: 'Logika Perhitungan BMI & Mode Aktivitas',
        detail:
          'Mengimplementasikan fungsi perhitungan BMI serta pengelolaan state untuk mode jalan kaki, lari, dan bersepeda.',
      },
      {
        phase: '03 / PACKAGING',
        title: 'Pengujian Expo & Konfigurasi EAS Build',
        detail:
          'Menguji aplikasi melalui lingkungan Expo dan menyiapkan konfigurasi build perangkat menggunakan EAS Build.',
      },
    ],
    lessonsLearned: [
      'Memahami perbedaan paradigma tata letak Flexbox pada React Native dibandingkan CSS web.',
      'Mengelola state reaktif untuk perhitungan metrik kesehatan dan mode aktivitas secara real-time.',
      'Mengenal alur kerja build aplikasi mobile dari proyek Expo menuju paket instalasi melalui EAS Build.',
    ],
    screenshots: [
      {
        id: 'bmi-1',
        caption: 'BMI & STEP TRACKER — Kalkulator BMI & Pemantau Aktivitas (Jalan, Lari, Sepeda)',
        aspectLabel: 'MOBILE APP SCREENSHOT',
        schematicType: 'bmi-calculator',
        imageUrl: '/projects/bmi.png',
      },
      {
        id: 'bmi-2',
        caption: 'PREVIEW SCHEMATIC 02 — Multi-Mode Activity Tracker (Walk / Run / Cycle)',
        aspectLabel: 'MOBILE TELEMETRY SPEC',
        schematicType: 'step-tracker-map',
        imageUrl: null,
      },
    ],
    liveUrl: null,
    repoUrl: null,
    accentColor: 'violet',
    layoutSpan: 'tall',
  },
  {
    id: 'sistem-bengkel-otomotif',
    number: '09',
    title: 'SISTEM BENGKEL OTOMOTIF',
    category: 'Database Management',
    year: '2026',
    shortDescription:
      'A relational database project for an automotive workshop, managing customers, vehicles, mechanics, spare parts, and service transactions.',
    overview:
      'Sistem Bengkel Otomotif adalah proyek perancangan dan implementasi basis data relasional menggunakan MySQL untuk menangani operasional bengkel kendaraan—mulai dari pendataan pelanggan dan kendaraan, penugasan mekanik, pengelolaan stok suku cadang (sparepart), hingga pencatatan transaksi servis dan rincian detail servis.',
    problemAddressed:
      'Operasional bengkel melibatkan banyak entitas yang saling berkaitan (satu pelanggan dapat memiliki kendaraan, satu transaksi servis ditangani mekanik dan dapat menggunakan beberapa suku cadang). Tanpa skema relasional yang ternormalisasi, data transaksi menjadi duplikat dan sulit diaudit.',
    objectives: [
      'Merancang struktur tabel relasional yang saling terhubung melalui Primary Key dan Foreign Key.',
      'Memisahkan tabel header transaksi (`servis`) dan tabel rincian item (`detail_servis`) untuk mendukung hubungan one-to-many.',
      'Mengimplementasikan dan menguji query SQL pada lingkungan lokal Laragon dan phpMyAdmin.',
    ],
    features: [
      'Struktur 6 tabel utama: `pelanggan_bengkel`, `kendaraan`, `mekanik`, `sparepart`, `servis`, dan `detail_servis`.',
      'Relasi terintegrasi antara data pemilik (`pelanggan_bengkel`) dan unit kendaraan (`kendaraan`).',
      'Pencatatan penugasan `mekanik` pada setiap jadwal/transaksi `servis`.',
      'Pengelolaan penggunaan suku cadang (`sparepart`) melalui tabel relasi `detail_servis`.',
      'Dukungan query SQL untuk rekapitulasi riwayat servis per kendaraan dan penggunaan sparepart.',
    ],
    technologies: ['MySQL', 'SQL', 'phpMyAdmin', 'Laragon'],
    databaseStructure: [
      {
        tableName: 'pelanggan_bengkel',
        role: 'Menyimpan identitas dan informasi kontak pemilik kendaraan.',
        keyFields: ['id_pelanggan (PK)', 'nama_pelanggan', 'no_telp', 'alamat'],
      },
      {
        tableName: 'kendaraan',
        role: 'Menyimpan data kendaraan yang terhubung ke pemilik pada tabel pelanggan_bengkel.',
        keyFields: ['id_kendaraan (PK)', 'id_pelanggan (FK)', 'no_polisi', 'merk', 'tipe', 'tahun'],
      },
      {
        tableName: 'mekanik',
        role: 'Menyimpan data teknisi/mekanik bengkel yang menangani pengerjaan servis.',
        keyFields: ['id_mekanik (PK)', 'nama_mekanik', 'spesialisasi', 'no_telp'],
      },
      {
        tableName: 'sparepart',
        role: 'Menyimpan katalog suku cadang, harga satuan, dan jumlah stok tersedia.',
        keyFields: ['id_sparepart (PK)', 'nama_sparepart', 'harga', 'stok'],
      },
      {
        tableName: 'servis',
        role: 'Tabel transaksi utama yang mencatat tanggal servis, kendaraan, dan mekanik bertugas.',
        keyFields: ['id_servis (PK)', 'id_kendaraan (FK)', 'id_mekanik (FK)', 'tanggal_servis', 'keluhan', 'total_biaya'],
      },
      {
        tableName: 'detail_servis',
        role: 'Tabel rincian transaksi yang menghubungkan servis dengan sparepart yang digunakan beserta kuantitas dan subtotal.',
        keyFields: ['id_detail (PK)', 'id_servis (FK)', 'id_sparepart (FK)', 'jumlah', 'subtotal'],
      },
    ],
    developmentProcess: [
      {
        phase: '01 / ENTITY MODELING',
        title: 'Identifikasi Entitas & Normalisasi Tabel',
        detail:
          'Memetakan kebutuhan data bengkel ke dalam 6 tabel terpisah agar tidak terjadi redundansi data pelanggan maupun suku cadang.',
      },
      {
        phase: '02 / DDL & CONSTRAINTS',
        title: 'Pembuatan Tabel SQL di MySQL / Laragon',
        detail:
          'Menulis perintah DDL (CREATE TABLE, PRIMARY KEY, FOREIGN KEY) menggunakan MySQL melalui Laragon dan phpMyAdmin.',
      },
      {
        phase: '03 / DML & RELATIONAL QUERIES',
        title: 'Pengujian Data Transaksi & Query JOIN',
        detail:
          'Mengisi data uji dan menjalankan query SELECT dengan INNER JOIN untuk menampilkan laporan transaksi servis lengkap.',
      },
    ],
    lessonsLearned: [
      'Memahami pentingnya pemisahan tabel transaksi utama (`servis`) dan tabel detail (`detail_servis`) dalam basis data relasional.',
      'Menguasai penerapan Foreign Key untuk menjaga integritas referensial antar tabel di MySQL.',
      'Menggunakan phpMyAdmin dan Laragon untuk manajemen skema database lokal dan pengujian query SQL.',
    ],
    screenshots: [
      {
        id: 'bkl-1',
        caption: 'SISTEM BENGKEL OTOMOTIF — Diagram Relasi Entitas (ERD) 6 Tabel Utama',
        aspectLabel: 'RELATIONAL ERD DIAGRAM',
        schematicType: 'bengkel-erd',
        imageUrl: '/projects/basisdata.png',
      },
      {
        id: 'bkl-2',
        caption: 'PREVIEW SCHEMATIC 02 — SQL DDL/JOIN Query Structure & phpMyAdmin Table Matrix',
        aspectLabel: 'SQL INSPECTION VIEW',
        schematicType: 'bengkel-sql',
        imageUrl: null,
      },
    ],
    liveUrl: null,
    repoUrl: null,
    accentColor: 'blue',
    layoutSpan: 'standard',
  },
];

export const CERTIFICATE_CATEGORIES: ('All' | CertificateCategory)[] = [
  'All',
  'Programming',
  'Web Development',
  'Database',
  'Technology',
  'Education',
  'Other',
];

/**
 * IMPORTANT:
 * Following the strict authenticity rule: no fake certificates, fake institutions,
 * fake credential IDs, or fake verification links are added here.
 *
 * Add real certificates to `CERTIFICATES_DATA` below as they are uploaded.
 * Place certificate images or PDFs in `public/certificates/` and reference them in `fileUrl` / `previewImageUrl`.
 */
export const CERTIFICATES_DATA: CertificateItem[] = [
  {
    id: 'cert-haskell-dicoding',
    index: '01',
    title: 'Memulai Pemrograman dengan Haskell',
    issuingOrganization: 'Dicoding Indonesia',
    issueDate: '08 November 2026',
    category: 'Programming',
    credentialId: 'L4PQWER84PO1',
    verificationUrl: 'https://www.dicoding.com/certificates/L4PQWER84PO1',
    fileUrl: '/certificates/haskel-dicoding.pdf',
    previewImageUrl: '/certificates/haskel-dicoding.png',
    description:
      'Sertifikat Kompetensi Kelulusan Dicoding Indonesia pada kelas Memulai Pemrograman dengan Haskell (Berlaku hingga 08 November 2029).',
  },
  {
    id: 'cert-c-dicoding',
    index: '02',
    title: 'Memulai Pemrograman Dengan C',
    issuingOrganization: 'Dicoding Indonesia',
    issueDate: '08 November 2026',
    category: 'Programming',
    credentialId: 'RVZKMW9WNXD5',
    verificationUrl: 'https://www.dicoding.com/certificates/RVZKMW9WNXD5',
    fileUrl: '/certificates/pemogramanc-dicoding.pdf',
    previewImageUrl: '/certificates/pemogramanc-dicoding.png',
    description:
      'Sertifikat Kompetensi Kelulusan Dicoding Indonesia pada kelas Memulai Pemrograman Dengan C (Berlaku hingga 08 November 2029).',
  },
  {
    id: 'cert-java-dicoding',
    index: '03',
    title: 'Memulai Pemrograman Dengan Java',
    issuingOrganization: 'Dicoding Indonesia',
    issueDate: '27 Oktober 2026',
    category: 'Programming',
    credentialId: 'MEPJM9QQ6P3V',
    verificationUrl: 'https://www.dicoding.com/certificates/MEPJM9QQ6P3V',
    fileUrl: '/certificates/pemogramanjava-dicoding.pdf',
    previewImageUrl: '/certificates/pemogramanjava-dicoding.png',
    description:
      'Sertifikat Kompetensi Kelulusan Dicoding Indonesia pada kelas Memulai Pemrograman Dengan Java (Berlaku hingga 27 Oktober 2029).',
  },
  {
    id: 'cert-solid-dicoding',
    index: '04',
    title: 'Belajar Prinsip Pemrograman SOLID',
    issuingOrganization: 'Dicoding Indonesia',
    issueDate: '27 Oktober 2026',
    category: 'Programming',
    credentialId: 'ERZR7YE7MZYV',
    verificationUrl: 'https://www.dicoding.com/certificates/ERZR7YE7MZYV',
    fileUrl: '/certificates/prinsipsolid-dicoding.pdf',
    previewImageUrl: '/certificates/prinsipsolid-dicoding.png',
    description:
      'Sertifikat Kompetensi Kelulusan Dicoding Indonesia pada kelas Belajar Prinsip Pemrograman SOLID (Berlaku hingga 27 Oktober 2029).',
  },
  {
    id: 'cert-manajemen-proyek-dicoding',
    index: '05',
    title: 'Belajar Dasar Manajemen Proyek',
    issuingOrganization: 'Dicoding Indonesia',
    issueDate: '26 Oktober 2026',
    category: 'Technology',
    credentialId: '81P2K4L1QXOY',
    verificationUrl: 'https://www.dicoding.com/certificates/81P2K4L1QXOY',
    fileUrl: '/certificates/manajemenproyek-dicoding.pdf',
    previewImageUrl: '/certificates/manajemenproyek-dicoding.png',
    description:
      'Sertifikat Kompetensi Kelulusan Dicoding Indonesia pada kelas Belajar Dasar Manajemen Proyek (Berlaku hingga 26 Oktober 2029).',
  },
];

/**
 * Optional structural specimen slots ONLY shown when the user explicitly toggles
 * "Preview Archive Structure" in the UI to test filtering, search, zoom, and modal navigation.
 * Clearly marked as editable structural slots — zero fake institutions or fake credentials.
 */
export const CERTIFICATE_TEMPLATE_SPECIMENS: CertificateItem[] = [
  {
    id: 'specimen-slot-01',
    index: 'SLOT—01',
    title: '[ Certificate Slot 01 — Web Development ]',
    issuingOrganization: 'Editable in src/data/portfolioData.ts',
    issueDate: 'Add Issue Date',
    category: 'Web Development',
    credentialId: null,
    verificationUrl: null,
    fileUrl: null,
    previewImageUrl: null,
    description:
      'Structural preview slot for Web Development certificates. Replace this template object in CERTIFICATES_DATA inside src/data/portfolioData.ts with your actual certificate metadata and file path.',
    isTemplateSpecimen: true,
  },
  {
    id: 'specimen-slot-02',
    index: 'SLOT—02',
    title: '[ Certificate Slot 02 — Database Management ]',
    issuingOrganization: 'Editable in src/data/portfolioData.ts',
    issueDate: 'Add Issue Date',
    category: 'Database',
    credentialId: null,
    verificationUrl: null,
    fileUrl: null,
    previewImageUrl: null,
    description:
      'Structural preview slot for Database certificates. Supports zoom in/out, keyboard navigation, and direct file download once fileUrl is configured.',
    isTemplateSpecimen: true,
  },
  {
    id: 'specimen-slot-03',
    index: 'SLOT—03',
    title: '[ Certificate Slot 03 — Programming Fundamentals ]',
    issuingOrganization: 'Editable in src/data/portfolioData.ts',
    issueDate: 'Add Issue Date',
    category: 'Programming',
    credentialId: null,
    verificationUrl: null,
    fileUrl: null,
    previewImageUrl: null,
    description:
      'Structural preview slot for Programming certificates. Add your image or PDF to /public/certificates/ and update CERTIFICATES_DATA.',
    isTemplateSpecimen: true,
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'frontend',
    index: '01',
    title: 'FRONTEND',
    subtitle: 'Web Structure, Styling & Component Interfaces',
    skills: [
      {
        name: 'HTML5',
        category: 'FRONTEND',
        code: 'FE—01',
        roleSummary: 'Menyusun struktur dokumen web semantik, formulir input transaksi, dan kerangka halaman.',
        appliedIn: ['AntreKu', 'InvenTrack PWA', 'SID Kedungsugo'],
        technicalFocus: 'Semantic Markup, Accessible Forms, Document Hierarchy',
        iconSlug: 'html5',
      },
      {
        name: 'CSS3',
        category: 'FRONTEND',
        code: 'FE—02',
        roleSummary: 'Mengatur tata letak responsif, tipografi, grid, dan transisi visual antar elemen.',
        appliedIn: ['AntreKu', 'InvenTrack PWA', 'Personal Portfolio'],
        technicalFocus: 'Flexbox & Grid Architecture, Responsive Media Queries, Custom Properties',
        iconSlug: 'css3',
      },
      {
        name: 'JavaScript',
        category: 'FRONTEND',
        code: 'FE—03',
        roleSummary: 'Mengelola interaksi DOM, logika aplikasi sisi klien, Service Worker, dan komunikasi API asynchronous.',
        appliedIn: ['AntreKu', 'InvenTrack PWA', 'BMI & Step Tracker'],
        technicalFocus: 'ES6+ Modules, Async/Await Data Fetching, State & Event Handling, PWA Service Workers',
        iconSlug: 'javascript',
      },
      {
        name: 'React',
        category: 'FRONTEND',
        code: 'FE—04',
        roleSummary: 'Membangun antarmuka pengguna berbasis komponen modular yang dapat digunakan kembali.',
        appliedIn: ['TraceLab', 'Onchain Intelligence', 'Personal Portfolio'],
        technicalFocus: 'Component Architecture, Hooks (useState, useEffect, useMemo), Declarative UI',
        iconSlug: 'react',
      },
    ],
  },
  {
    id: 'backend-database',
    index: '02',
    title: 'BACKEND & DATABASE',
    subtitle: 'Server Scripting, Relational Schema & Cloud BaaS',
    skills: [
      {
        name: 'PHP',
        category: 'BACKEND & DATABASE',
        code: 'BD—01',
        roleSummary: 'Mempelajari pemrograman sisi server dan koneksi aplikasi web ke basis data MySQL.',
        appliedIn: ['SID Kedungsugo (Laravel)', 'Local Laragon Projects'],
        technicalFocus: 'Server-Side Scripting, Form Processing, MySQL Database Connectivity',
        iconSlug: 'php',
      },
      {
        name: 'MySQL',
        category: 'BACKEND & DATABASE',
        code: 'BD—02',
        roleSummary: 'Merancang tabel relasional, Primary/Foreign Key, dan menulis query SQL untuk manajemen data.',
        appliedIn: ['SID Kedungsugo', 'Sistem Bengkel Otomotif'],
        technicalFocus: 'Relational Schema Design, DDL & DML Queries, Multi-Table JOIN Operations',
        iconSlug: 'mysql',
      },
      {
        name: 'Supabase',
        category: 'BACKEND & DATABASE',
        code: 'BD—03',
        roleSummary: 'Mengintegrasikan database PostgreSQL cloud, autentikasi pengguna, dan penyimpanan file.',
        appliedIn: ['TraceLab', 'Onchain Intelligence', 'InvenTrack PWA'],
        technicalFocus: 'Supabase PostgreSQL, Supabase Auth, Supabase Storage Buckets',
        iconSlug: 'supabase',
      },
    ],
  },
  {
    id: 'programming',
    index: '03',
    title: 'PROGRAMMING',
    subtitle: 'Object-Oriented, Algorithmic & Functional Foundations',
    skills: [
      {
        name: 'Java',
        category: 'PROGRAMMING',
        code: 'PR—01',
        roleSummary: 'Menerapkan konsep Pemrograman Berorientasi Objek (OOP) untuk membangun aplikasi terstruktur.',
        appliedIn: ['Dicoding Pemrograman Java', 'Prinsip OOP & SOLID'],
        technicalFocus: 'Classes & Objects, Encapsulation, Methods, Control Flow & Console/Desktop Logic',
        iconSlug: 'openjdk',
      },
      {
        name: 'Python',
        category: 'PROGRAMMING',
        code: 'PR—02',
        roleSummary: 'Mengimplementasikan algoritma dasar, kalkulasi logika, dan struktur kontrol pemrograman.',
        appliedIn: ['Algoritma & Logika Pemrograman', 'Eksplorasi Skrip Python'],
        technicalFocus: 'Algorithmic Implementation, Conditional Logic, Iterative Loops & Data Processing',
        iconSlug: 'python',
      },
      {
        name: 'C Language',
        category: 'PROGRAMMING',
        code: 'PR—03',
        roleSummary: 'Mempelajari fondasi dasar pemrograman prosedural, variabel, dan struktur memori/algoritma.',
        appliedIn: ['Dicoding Pemrograman C', 'Dasar Logika Komputasi'],
        technicalFocus: 'Syntax, Data Types, Control Flow, Procedural Logic',
        iconSlug: 'c',
      },
      {
        name: 'Haskell',
        category: 'PROGRAMMING',
        code: 'PR—04',
        roleSummary: 'Mengeksplorasi paradigma pemrograman fungsional, ekspresi matematis, dan fungsi murni.',
        appliedIn: ['Functional Programming Explorations', 'Dicoding Haskell'],
        technicalFocus: 'Pure Functions, Type Signatures, Recursion & List Comprehensions',
        iconSlug: 'haskell',
      },
    ],
  },
  {
    id: 'mobile-development',
    index: '04',
    title: 'MOBILE DEVELOPMENT',
    subtitle: 'Cross-Platform Mobile Interfaces & Build Workflows',
    skills: [
      {
        name: 'React Native',
        category: 'MOBILE DEVELOPMENT',
        code: 'MB—01',
        roleSummary: 'Merancang komponen layar perangkat bergerak dan logika interaksi aplikasi mobile.',
        appliedIn: ['BMI & Step Tracker'],
        technicalFocus: 'Native UI Components, Mobile Flexbox Layout, Multi-Mode Activity State',
        iconSlug: 'react',
      },
      {
        name: 'Expo',
        category: 'MOBILE DEVELOPMENT',
        code: 'MB—02',
        roleSummary: 'Menjalankan pengembangan aplikasi React Native, pengujian perangkat, dan kompilasi EAS Build.',
        appliedIn: ['BMI & Step Tracker'],
        technicalFocus: 'Expo SDK Workflow, Device Testing, EAS Build Configuration',
        iconSlug: 'expo',
      },
    ],
  },
  {
    id: 'office-productivity',
    index: '05',
    title: 'OFFICE & PRODUCTIVITY',
    subtitle: 'Document Publishing, Spreadsheet Analytics & Calculations',
    skills: [
      {
        name: 'Microsoft Word',
        category: 'OFFICE & PRODUCTIVITY',
        code: 'OF—01',
        roleSummary: 'Penyusunan dokumen teknis, proposal proyek, dokumentasi laporan kerja, dan format karya tulis standar.',
        appliedIn: ['Dokumentasi Proyek RPL', 'Laporan Akademik & Panduan Pengguna'],
        technicalFocus: 'Document Styling, Table of Contents, Technical Documentation, Editorial Layout',
        iconSlug: 'microsoftword',
      },
      {
        name: 'Microsoft Excel',
        category: 'OFFICE & PRODUCTIVITY',
        code: 'OF—02',
        roleSummary: 'Pengolahan dan rekapitulasi data numerik, otomatisasi kalkulasi rumus (formula), dan penyusunan tabel laporan.',
        appliedIn: ['Pengolahan Data & Rekapitulasi', 'Logika Formula Spreadsheet'],
        technicalFocus: 'Formulas (SUM, IF, VLOOKUP/XLOOKUP), Data Tables, Aggregation',
        iconSlug: 'microsoftexcel',
      },
    ],
  },
  {
    id: 'tools',
    index: '06',
    title: 'TOOLS',
    subtitle: 'Version Control, Interface Design & Local Environment',
    skills: [
      {
        name: 'Git',
        category: 'TOOLS',
        code: 'TL—01',
        roleSummary: 'Melacak perubahan kode sumber dan mengelola riwayat versi proyek selama pengembangan.',
        appliedIn: ['InvenTrack PWA', 'RPL Software Projects'],
        technicalFocus: 'Repository Versioning, Commit History, Branch Workflow',
        iconSlug: 'git',
      },
      {
        name: 'GitHub',
        category: 'TOOLS',
        code: 'TL—02',
        roleSummary: 'Menyimpan repositori proyek secara daring dan mempublikasikan aplikasi web melalui GitHub Pages.',
        appliedIn: ['InvenTrack PWA'],
        technicalFocus: 'Remote Repositories, GitHub Pages Deployment, Project Documentation',
        iconSlug: 'github',
      },
      {
        name: 'Figma',
        category: 'TOOLS',
        code: 'TL—03',
        roleSummary: 'Merancang wireframe, tata letak antarmuka (UI), dan eksplorasi alur pengalaman pengguna (UX).',
        appliedIn: ['InvenTrack UI Concept', 'BMI & Step Tracker Wireframe'],
        technicalFocus: 'Interface Wireframing, Typography & Layout Grids, Interactive Prototyping',
        iconSlug: 'figma',
      },
      {
        name: 'VS Code',
        category: 'TOOLS',
        code: 'TL—04',
        roleSummary: 'Editor kode utama untuk pengembangan web, mobile, skrip Python, dan penulisan query.',
        appliedIn: ['All Projects'],
        technicalFocus: 'Code Editing, Debugging, Integrated Terminal & Extensions',
        iconSlug: 'visualstudiocode',
      },
      {
        name: 'Laragon',
        category: 'TOOLS',
        code: 'TL—05',
        roleSummary: 'Lingkungan server pengembangan lokal untuk menjalankan layanan MySQL dan PHP.',
        appliedIn: ['Sistem Bengkel Otomotif'],
        technicalFocus: 'Local Web & Database Server Management, MySQL Service Environment',
        iconSlug: 'laragon',
      },
      {
        name: 'phpMyAdmin',
        category: 'TOOLS',
        code: 'TL—06',
        roleSummary: 'Mengelola struktur tabel database MySQL, relasi Foreign Key, dan pengujian query SQL secara visual.',
        appliedIn: ['Sistem Bengkel Otomotif'],
        technicalFocus: 'Database Administration, Relational Designer, SQL Query Execution',
        iconSlug: 'phpmyadmin',
      },
    ],
  },
];

export const BEHIND_THE_CODE_ITEMS: BehindTheCodeItem[] = [
  {
    id: 'btc-01',
    index: '01',
    title: 'Learning Programming Fundamentals',
    category: 'ALGORITHMS & FLOW',
    narrative:
      'Sebelum membangun aplikasi utuh, saya memulai dari memetakan alur logika menggunakan diagram alir di Flowgorithm dan menerjemahkannya ke Python serta Haskell. Tahap ini melatih saya memahami bagaimana data masuk, diproses melalui kondisi atau perulangan, hingga menghasilkan keluaran yang tepat.',
    codeLanguage: 'python',
    codeFilename: 'algorithm_flow.py',
    codeSnippet: `def evaluasi_transaksi(jumlah_unit: int, harga_satuan: int) -> dict:
    subtotal = jumlah_unit * harga_satuan
    potongan = int(subtotal * 0.05) if jumlah_unit >= 5 else 0
    total_akhir = subtotal - potongan
    return {
        "unit": jumlah_unit,
        "subtotal": subtotal,
        "potongan": potongan,
        "total_bayar": total_akhir,
    }`,
    technicalNotes: [
      'Menyusun dekomposisi masalah: Input -> Proses -> Output',
      'Menerjemahkan diagram alir Flowgorithm menjadi fungsi Python terstruktur',
      'Mempelajari pendekatan fungsional di Haskell untuk memahami ekspresi murni',
    ],
  },
  {
    id: 'btc-02',
    index: '02',
    title: 'Working with Databases',
    category: 'RELATIONAL ARCHITECTURE',
    narrative:
      'Dalam proyek Sistem Bengkel Otomotif dan InvenTrack, saya mempelajari bagaimana merancang struktur tabel yang saling berelasi. Memisahkan data pelanggan, kendaraan, mekanik, suku cadang, dan detail servis mengajarkan pentingnya menjaga kerapian dan integritas data.',
    codeLanguage: 'sql',
    codeFilename: 'bengkel_schema.sql',
    codeSnippet: `CREATE TABLE detail_servis (
    id_detail INT AUTO_INCREMENT PRIMARY KEY,
    id_servis INT NOT NULL,
    id_sparepart INT NOT NULL,
    jumlah INT NOT NULL CHECK (jumlah > 0),
    subtotal DECIMAL(12, 2) NOT NULL,
    CONSTRAINT fk_detail_servis
      FOREIGN KEY (id_servis) REFERENCES servis(id_servis),
    CONSTRAINT fk_detail_sparepart
      FOREIGN KEY (id_sparepart) REFERENCES sparepart(id_sparepart)
);`,
    technicalNotes: [
      'Perancangan 6 tabel relasional pada MySQL melalui Laragon & phpMyAdmin',
      'Penerapan Primary Key dan Foreign Key untuk mencegah duplikasi data',
      'Integrasi PostgreSQL cloud & autentikasi menggunakan Supabase pada InvenTrack',
    ],
  },
  {
    id: 'btc-03',
    index: '03',
    title: 'Building Applications & OOP Practice',
    category: 'APPLICATION ENGINEERING',
    narrative:
      'Melalui pengembangan Aplikasi Kasir Java, InvenTrack PWA, dan BMI & Step Tracker, saya berlatih menerapkan konsep pemrograman ke dalam produk nyata—mulai dari enkapsulasi objek di Java hingga pengelolaan transaksi inventaris dan kalkulasi aktivitas mobile.',
    codeLanguage: 'java',
    codeFilename: 'TransaksiKasir.java',
    codeSnippet: `public class ItemBelanja {
    private final String namaBarang;
    private final int hargaSatuan;
    private final int jumlah;

    public ItemBelanja(String namaBarang, int hargaSatuan, int jumlah) {
        this.namaBarang = namaBarang;
        this.hargaSatuan = hargaSatuan;
        this.jumlah = jumlah;
    }

    public int hitungSubtotal() {
        return this.hargaSatuan * this.jumlah;
    }
}`,
    technicalNotes: [
      'Penerapan Class, Constructor, dan Method pada Aplikasi Kasir Java',
      'Pengembangan Progressive Web App (PWA) dengan Service Worker pada InvenTrack',
      'Eksplorasi lintas perangkat dengan React Native, Expo, dan EAS Build',
    ],
  },
  {
    id: 'btc-04',
    index: '04',
    title: 'Exploring UI/UX & New Technologies',
    category: 'INTERFACE & GROWTH',
    narrative:
      'Bagi saya, antarmuka yang baik adalah antarmuka yang membantu pengguna memahami informasi dengan cepat. Saya menggunakan Figma untuk menyusun tata letak sebelum menulis kode HTML, CSS, JavaScript, maupun React, sambil terus mengeksplorasi teknologi web modern.',
    codeLanguage: 'javascript',
    codeFilename: 'inventrack_sync.js',
    codeSnippet: `async function fetchInventoryCatalog(supabaseClient) {
  const { data, error } = await supabaseClient
    .from('inventaris_barang')
    .select('id_barang, nama_barang, kategori, stok_tersedia, kondisi')
    .order('nama_barang', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}`,
    technicalNotes: [
      'Perancangan hierarki tipografi dan tata letak antarmuka di Figma',
      'Eksplorasi berkelanjutan pada ekosistem React, JavaScript modern, dan Supabase',
      'Fokus pada kode yang bersih, mudah dipelihara, dan fungsional',
    ],
  },
];
