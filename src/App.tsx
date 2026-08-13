import { useState, useRef } from 'react';
import type { HackerPass } from './types';
import { OceanCanvas } from './components/canvas/OceanCanvas';
import { HackerCard3D } from './components/card/HackerCard3D';
import { CardControls } from './components/card/CardControls';
import { RadarGallery } from './components/RadarGallery';
import { ExportModal } from './components/ExportModal';
import { audioEngine } from './lib/AudioEngine';
import {
  Palmtree,
  Sparkles,
  Share2,
  Scan,
  Compass,
  Layers,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

const INITIAL_PASS: HackerPass = {
  id: 'hh26-pass-001',
  name: 'Kavya Sharma',
  handle: 'kavya_builds',
  roleClass: 'Solana Alchemist',
  rarity: 'Legendary',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  stack: ['Solana', 'Rust', 'AI Agents'],
  bio: 'Building autonomous Solana trading agents in Goa.',
  teamName: 'Goa Solana Alchemists',
  teammates: [],
  cardTheme: 'goa-sunset',
  qrCodeData: 'https://hhgoa.com/radar/kavya_builds',
  verified: true,
  stats: {
    speed: 98,
    power: 94,
    code: 96
  },
  customFilter: {
    brightness: 1,
    contrast: 1.05,
    hueRotate: 0
  }
};

export function App() {
  const [pass, setPass] = useState<HackerPass>(INITIAL_PASS);
  const [isScanning, setIsScanning] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showOceanBg, setShowOceanBg] = useState(true);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleSelectPreset = (presetPass: HackerPass) => {
    setPass(presetPass);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative text-white flex flex-col font-sans selection:bg-[#FF9F43]/30 selection:text-[#FF9F43]">
      {/* 3D Three.js Ocean & Procedural Palm Trees Background */}
      {showOceanBg && <OceanCanvas showTrees={true} />}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#09131f]/70 border-b border-white/15 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] via-[#FF9F43] to-[#00D2D3] p-0.5 shadow-[0_0_20px_rgba(255,159,67,0.4)]">
              <div className="w-full h-full bg-[#0d1b2a] rounded-[14px] flex items-center justify-center">
                <Palmtree className="w-5 h-5 text-[#FF9F43]" />
              </div>
            </div>
            <div>
              <h1 className="font-display font-black text-lg sm:text-xl tracking-wider text-white flex items-center gap-1.5">
                HH GOA <span className="text-[#FF9F43]">2026</span>
              </h1>
              <p className="text-[10px] font-mono text-gray-300 tracking-widest uppercase">
                TASK #1 // ID FRAME GENERATOR
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                audioEngine.playClickSound();
                setShowOceanBg(!showOceanBg);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-gray-200 border border-white/15 transition"
            >
              <Layers className="w-3.5 h-3.5 text-[#FF9F43]" /> 3D Ocean: {showOceanBg ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => {
                audioEngine.playScanBeep();
                setIsExportOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#FF9F43] hover:bg-[#FF9F43]/80 text-black font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,159,67,0.4)]"
            >
              <Share2 className="w-4 h-4" /> Export & Share Pass
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 relative z-10 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col items-center">
        {/* Task #1 Announcement Banner */}
        <div className="w-full max-w-4xl glass-panel rounded-2xl p-4 mb-8 border border-[#FF9F43]/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#FF6B6B]/15 via-transparent to-[#00D2D3]/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF9F43]/20 text-[#FF9F43]">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#FF9F43] uppercase tracking-wider">Hacker House Task #1</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> OFFICIAL SUBMISSION READY
                </span>
              </div>
              <p className="text-xs text-gray-200 font-sans mt-0.5">
                Generate your HH Goa 2026 ID card with colorful beach vibes, 3D ocean water, depth scanning laser & squad frame support!
              </p>
            </div>
          </div>

          <a
            href="https://hhgoa.com/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono text-[#FF9F43] hover:underline flex items-center gap-1 shrink-0"
          >
            Visit hhgoa.com <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Generator Studio Layout (3D Card on left, Controls on right) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left Column: 3D Tilt Card Display Area */}
          <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-24">
            <div className="relative w-full flex flex-col items-center">
              {/* Scan Toggle quick button above card */}
              <div className="mb-3 flex items-center justify-between w-full max-w-[410px] px-2">
                <span className="text-xs font-mono text-gray-300 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#FF9F43]" /> Hover card to experience 3D tilt
                </span>
                <button
                  onClick={() => {
                    audioEngine.playScanBeep();
                    setIsScanning(!isScanning);
                  }}
                  className={`text-[11px] font-mono font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg border transition ${
                    isScanning
                      ? 'bg-[#FF9F43] text-black border-[#FF9F43]'
                      : 'bg-white/10 text-gray-200 border-white/15 hover:border-[#FF9F43]'
                  }`}
                >
                  <Scan className="w-3 h-3" /> {isScanning ? 'Depth Laser ON' : 'Toggle Scan FX'}
                </button>
              </div>

              {/* The 3D Card */}
              <HackerCard3D
                pass={pass}
                isScanning={isScanning}
                cardRef={cardRef}
              />
            </div>
          </div>

          {/* Right Column: Studio Controls Panel */}
          <div className="lg:col-span-7 flex justify-center">
            <CardControls
              pass={pass}
              onChange={setPass}
              isScanning={isScanning}
              onToggleScanning={() => setIsScanning(!isScanning)}
            />
          </div>
        </div>

        {/* Live Radar Showcase & Templates */}
        <RadarGallery onSelectPreset={handleSelectPreset} />
      </main>

      {/* Export & Sharing Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        pass={pass}
        cardRef={cardRef}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/15 py-6 px-4 text-center text-xs font-mono text-gray-400 bg-[#09131f]/80 backdrop-blur-md">
        <p>
          Hacker House Goa 2026 // Task #1 Frame Generator — Built with Three.js, Colorful Ocean Shaders & Auth0 3D Tilt FX.
        </p>
        <p className="text-[10px] text-gray-400 mt-1">
          Post on X with <span className="text-[#FF9F43]">#FrameInGoa</span> to get featured on the Radar!
        </p>
      </footer>
    </div>
  );
}

export default App;
