import React from 'react';
import { ProjectScreenshot } from '../data/portfolioData';

interface ProjectVisualPreviewProps {
  schematicType: ProjectScreenshot['schematicType'];
  imageUrl?: string | null;
  title: string;
  compact?: boolean;
}

export const ProjectVisualPreview: React.FC<ProjectVisualPreviewProps> = ({
  schematicType,
  imageUrl,
  title,
  compact = false,
}) => {
  if (imageUrl) {
    return (
      <div className="w-full h-full bg-[#06070c] relative overflow-hidden flex items-center justify-center p-2 sm:p-4">
        {/* Subtle blurred ambient background so vertical mobile apps & wide ERDs fit cleanly */}
        <img
          src={imageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl scale-110 pointer-events-none"
        />
        <img
          src={imageUrl}
          alt={title}
          className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full bg-[#06070c] relative overflow-hidden flex flex-col justify-between ${
        compact ? 'p-4 sm:p-5' : 'p-5 sm:p-7'
      } select-none`}
    >
      {/* Subtle Architectural Blueprint Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top Window / Blueprint Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white/25" />
          <span className="w-2 h-2 rounded-full bg-blue-400/60" />
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-white/50 ml-1">
            {schematicType.toUpperCase().replace(/-/g, ' // ')}
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-blue-400/80 border border-blue-400/25 px-1.5 py-0.5 bg-blue-500/5">
          ARCH PREVIEW
        </span>
      </div>

      {/* Center Bespoke Diagram by Project Type */}
      <div className="relative z-10 my-auto py-4">
        {(schematicType === 'inventrack-dashboard' ||
          schematicType === 'inventrack-transactions') && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="border border-white/10 bg-black/50 p-2.5">
                <div className="font-mono text-[9px] text-white/40">SUPABASE TABLE</div>
                <div className="font-mono text-xs text-white mt-1">inventaris_barang</div>
                <div className="font-mono text-[9px] text-blue-400 mt-0.5">PostgreSQL + RLS</div>
              </div>
              <div className="border border-white/10 bg-black/50 p-2.5">
                <div className="font-mono text-[9px] text-white/40">BORROW FLOW</div>
                <div className="font-mono text-xs text-white mt-1">peminjaman_log</div>
                <div className="font-mono text-[9px] text-violet-400 mt-0.5">Status Tracking</div>
              </div>
              <div className="border border-white/10 bg-black/50 p-2.5">
                <div className="font-mono text-[9px] text-white/40">PWA RUNTIME</div>
                <div className="font-mono text-xs text-white mt-1">sw.js</div>
                <div className="font-mono text-[9px] text-emerald-400 mt-0.5">Service Worker</div>
              </div>
            </div>
            <div className="border border-white/10 bg-black/60 p-3 font-mono text-[10px] space-y-1.5">
              <div className="grid grid-cols-4 text-white/40 border-b border-white/10 pb-1">
                <span>ITEM CODE</span>
                <span>ASSET NAME</span>
                <span>MODE</span>
                <span className="text-right">STATE</span>
              </div>
              <div className="grid grid-cols-4 text-white/85">
                <span className="text-blue-400">INV-001</span>
                <span>Router Mikrotik</span>
                <span>Borrowing</span>
                <span className="text-right text-emerald-400">ACTIVE</span>
              </div>
              <div className="grid grid-cols-4 text-white/75">
                <span className="text-blue-400">INV-002</span>
                <span>Crimping Tool RJ45</span>
                <span>Inventory</span>
                <span className="text-right text-white/60">AVAILABLE</span>
              </div>
              <div className="grid grid-cols-4 text-white/75">
                <span className="text-blue-400">INV-003</span>
                <span>Projector Lab RPL</span>
                <span>Returned</span>
                <span className="text-right text-blue-300">VERIFIED</span>
              </div>
            </div>
          </div>
        )}

        {(schematicType === 'bmi-calculator' ||
          schematicType === 'step-tracker-map') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* Mobile Frame 1: BMI */}
            <div className="border border-white/15 bg-black/65 p-3.5 space-y-2.5">
              <div className="flex justify-between items-center font-mono text-[9px] text-white/45">
                <span>EXPO // REACT NATIVE</span>
                <span className="text-violet-400">BMI MODULE</span>
              </div>
              <div className="py-2 border-y border-white/10 flex items-baseline justify-between">
                <span className="text-xs text-white/60">Mass / Height Formula</span>
                <span className="font-mono text-lg text-white">kg / m²</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px] text-center">
                <span className="py-1 border border-white/10 text-white/50">HEIGHT cm</span>
                <span className="py-1 border border-blue-400/40 text-blue-300 bg-blue-500/10">
                  BMI INDEX
                </span>
                <span className="py-1 border border-white/10 text-white/50">WEIGHT kg</span>
              </div>
            </div>
            {/* Mobile Frame 2: Activity Modes */}
            <div className="border border-white/15 bg-black/65 p-3.5 space-y-2.5">
              <div className="flex justify-between items-center font-mono text-[9px] text-white/45">
                <span>ACTIVITY TRACKER</span>
                <span className="text-blue-400">3 MODES</span>
              </div>
              <div className="space-y-1.5 font-mono text-[10px]">
                <div className="flex justify-between px-2.5 py-1 border border-blue-400/40 bg-blue-500/10 text-white">
                  <span>01. WALKING MODE</span>
                  <span className="text-blue-300">STEPS + DIST</span>
                </div>
                <div className="flex justify-between px-2.5 py-1 border border-white/10 text-white/70">
                  <span>02. RUNNING MODE</span>
                  <span>PACE + DIST</span>
                </div>
                <div className="flex justify-between px-2.5 py-1 border border-white/10 text-white/70">
                  <span>03. CYCLING MODE</span>
                  <span>ROUTE + KM</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {(schematicType === 'bengkel-erd' || schematicType === 'bengkel-sql') && (
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[10px]">
              {[
                { name: 'pelanggan_bengkel', key: 'PK: id_pelanggan' },
                { name: 'kendaraan', key: 'FK: id_pelanggan' },
                { name: 'mekanik', key: 'PK: id_mekanik' },
                { name: 'sparepart', key: 'PK: id_sparepart' },
                { name: 'servis', key: 'FK: kendaraan, mekanik' },
                { name: 'detail_servis', key: 'FK: servis, sparepart' },
              ].map((tbl) => (
                <div
                  key={tbl.name}
                  className="border border-white/15 bg-black/70 p-2.5 hover:border-blue-400/50 transition-colors"
                >
                  <div className="text-blue-400 font-medium truncate">{tbl.name}</div>
                  <div className="text-[9px] text-white/45 mt-1 truncate">{tbl.key}</div>
                </div>
              ))}
            </div>
            <div className="border border-white/10 bg-black/50 px-3 py-2 font-mono text-[10px] text-white/65 flex items-center justify-between">
              <span>
                RELATIONAL FLOW: pelanggan_bengkel → kendaraan → servis → detail_servis ← sparepart
              </span>
              <span className="text-blue-400 hidden sm:inline">MySQL // 6 TABLES</span>
            </div>
          </div>
        )}

        {(schematicType === 'kasir-oop' || schematicType === 'kasir-receipt') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[10px]">
            <div className="border border-white/15 bg-black/70 p-3 space-y-1.5">
              <div className="text-blue-400 text-[9px] tracking-widest uppercase">
                JAVA CLASS STRUCTURE
              </div>
              <div className="text-white/90">class TransaksiKasir &#123;</div>
              <div className="pl-3 text-white/60">- daftarBarang: List&lt;Barang&gt;</div>
              <div className="pl-3 text-white/60">+ tambahItem(kode, qty): void</div>
              <div className="pl-3 text-white/60">+ hitungTotal(): int</div>
              <div className="pl-3 text-white/60">+ hitungKembalian(bayar): int</div>
              <div className="text-white/90">&#125;</div>
            </div>
            <div className="border border-white/15 bg-black/70 p-3 space-y-1.5">
              <div className="text-white/45 text-[9px] tracking-widest uppercase">
                OOP EXECUTION OUTPUT
              </div>
              <div className="text-white/80 border-b border-white/10 pb-1">
                === STRUK TRANSAKSI KASIR ===
              </div>
              <div className="flex justify-between text-white/65">
                <span>Item A (x2)</span>
                <span>Subtotal</span>
              </div>
              <div className="flex justify-between text-white/65">
                <span>Item B (x1)</span>
                <span>Subtotal</span>
              </div>
              <div className="flex justify-between text-blue-400 pt-1 border-t border-white/10">
                <span>STATUS</span>
                <span>OOP VERIFIED</span>
              </div>
            </div>
          </div>
        )}

        {(schematicType === 'python-flowchart' ||
          schematicType === 'python-terminal') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center font-mono text-[10px]">
            {/* Flowchart diagram */}
            <div className="border border-white/15 bg-black/70 p-3 flex flex-col items-center space-y-1.5">
              <div className="px-3 py-1 rounded-full border border-white/25 text-white/80 text-[9px]">
                START / INPUT DATA
              </div>
              <div className="h-2 w-px bg-white/30" />
              <div className="px-3 py-1 border border-blue-400/50 bg-blue-500/10 text-blue-300 text-[9px] rotate-0">
                IF CONDITION / LOOP LOGIC
              </div>
              <div className="h-2 w-px bg-white/30" />
              <div className="px-3 py-1 border border-violet-400/40 text-violet-300 text-[9px]">
                COMPUTE & OUTPUT RESULT
              </div>
            </div>
            {/* Python code */}
            <div className="border border-white/15 bg-black/70 p-3 space-y-1 text-white/75">
              <div className="text-violet-400 text-[9px] mb-1"># Flowgorithm to Python</div>
              <div>def proses_algoritma(nilai):</div>
              <div className="pl-3">if nilai &gt;= 75:</div>
              <div className="pl-6 text-blue-300">return &quot;Tuntas&quot;</div>
              <div className="pl-3">else:</div>
              <div className="pl-6 text-white/50">return &quot;Evaluasi&quot;</div>
            </div>
          </div>
        )}

        {(schematicType === 'excel-ledger' ||
          schematicType === 'excel-formulas') && (
          <div className="border border-white/15 bg-black/70 font-mono text-[10px]">
            <div className="px-3 py-1.5 border-b border-white/10 bg-white/[0.03] flex items-center gap-2 text-white/60">
              <span className="text-blue-400 font-semibold">fx</span>
              <span>=SUM(E4:E18) // =IF(C4&gt;=3, D4*0.05, 0)</span>
            </div>
            <div className="p-2.5 space-y-1">
              <div className="grid grid-cols-5 text-[9px] text-white/40 border-b border-white/10 pb-1">
                <span>A: KODE</span>
                <span className="col-span-2">B: PRODUK ELEKTRONIK</span>
                <span>C: QTY</span>
                <span className="text-right">D: FORMULA</span>
              </div>
              <div className="grid grid-cols-5 text-white/80">
                <span>EL-01</span>
                <span className="col-span-2">Monitor LED 24&quot;</span>
                <span>4</span>
                <span className="text-right text-blue-400">=C4*Harga</span>
              </div>
              <div className="grid grid-cols-5 text-white/80">
                <span>EL-02</span>
                <span className="col-span-2">SSD NVMe 512GB</span>
                <span>6</span>
                <span className="text-right text-blue-400">=C5*Harga</span>
              </div>
              <div className="grid grid-cols-5 text-white/80">
                <span>EL-03</span>
                <span className="col-span-2">Keyboard Mechanical</span>
                <span>3</span>
                <span className="text-right text-blue-400">=C6*Harga</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Technical Caption Bar */}
      <div className="relative z-10 flex items-center justify-between pt-2.5 border-t border-white/10 font-mono text-[9px] tracking-[0.18em] uppercase text-white/40">
        <span>PROJECT BLUEPRINT // {title}</span>
        <span>REPLACE WITH SCREENSHOT IN PORTFOLIODATA.TS</span>
      </div>
    </div>
  );
};
