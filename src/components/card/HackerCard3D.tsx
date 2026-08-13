import React, { useRef, useState } from 'react';
import type { HackerPass } from '../../types';
import { ShieldCheck, QrCode, Sparkles, Flame, Users, Palmtree } from 'lucide-react';

interface HackerCard3DProps {
  pass: HackerPass;
  isScanning?: boolean;
  onScanToggle?: () => void;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

export const HackerCard3D: React.FC<HackerCard3DProps> = ({
  pass,
  isScanning = false,
  cardRef
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [tiltStyle, setTiltStyle] = useState<{ transform: string }>({ transform: '' });

  const calculateTilt = (clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;

    const bounds = el.getBoundingClientRect();
    const leftX = clientX - bounds.x;
    const topY = clientY - bounds.y;

    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2
    };

    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

    const rotateX = center.y / 85;
    const rotateY = -center.x / 85;
    const scale = window.innerWidth < 640 ? 1.02 : 1.04;
    const angle = Math.log(Math.max(distance, 1)) * 2.0;

    setTiltStyle({
      transform: `scale3d(${scale}, ${scale}, ${scale}) rotate3d(${rotateX}, ${rotateY}, 0, ${angle}deg)`
    });

    if (glowRef.current) {
      glowRef.current.style.backgroundImage = `
        radial-gradient(
          circle at ${center.x * 1.8 + bounds.width / 2}px ${center.y * 1.8 + bounds.height / 2}px,
          rgba(255, 255, 255, 0.35),
          rgba(255, 159, 67, 0.2),
          transparent 70%
        )
      `;
    }
  };

  // Mouse Move Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    calculateTilt(e.clientX, e.clientY);
  };

  // Touch Move Handler (for mobile screens & smartphones)
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      calculateTilt(touch.clientX, touch.clientY);
    }
  };

  const handleResetTilt = () => {
    setTiltStyle({ transform: 'scale3d(1, 1, 1) rotate3d(0, 0, 0, 0deg)' });
    if (glowRef.current) {
      glowRef.current.style.backgroundImage = '';
    }
  };

  const getThemeClasses = () => {
    switch (pass.cardTheme) {
      case 'tropical-beach':
        return {
          border: 'border-[#00D2D3]/60 shadow-[0_0_35px_rgba(0,210,211,0.35)]',
          badge: 'bg-[#00D2D3]/20 text-[#00D2D3] border-[#00D2D3]/40',
          gradientBg: 'from-[#0d2a30] via-[#123940] to-[#0a1a24]',
          accentHex: '#00D2D3',
          scanLaserColor: '#00D2D3'
        };
      case 'festive-fiesta':
        return {
          border: 'border-[#FF4757]/60 shadow-[0_0_35px_rgba(255,71,87,0.35)]',
          badge: 'bg-[#FF4757]/20 text-[#FF4757] border-[#FF4757]/40',
          gradientBg: 'from-[#2e1220] via-[#3a152d] to-[#120a1f]',
          accentHex: '#FF4757',
          scanLaserColor: '#FF4757'
        };
      case 'golden-sand':
        return {
          border: 'border-[#FFC857]/60 shadow-[0_0_35px_rgba(255,200,87,0.35)]',
          badge: 'bg-[#FFC857]/20 text-[#FFC857] border-[#FFC857]/40',
          gradientBg: 'from-[#2b2210] via-[#3a2c14] to-[#14120c]',
          accentHex: '#FFC857',
          scanLaserColor: '#FFC857'
        };
      case 'goa-sunset':
      default:
        return {
          border: 'border-[#FF6B6B]/60 shadow-[0_0_35px_rgba(255,107,107,0.35)]',
          badge: 'bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/40',
          gradientBg: 'from-[#2a141b] via-[#381a28] to-[#100d1c]',
          accentHex: '#FF6B6B',
          scanLaserColor: '#FF9F43'
        };
    }
  };

  const theme = getThemeClasses();
  const isSquadMode = pass.teammates && pass.teammates.length > 0;

  return (
    <div className="perspective-container flex items-center justify-center p-2 sm:p-4 w-full">
      <div
        ref={(node) => {
          containerRef.current = node;
          if (cardRef) {
            (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleResetTilt}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleResetTilt}
        style={tiltStyle}
        className={`
          card-3d relative w-full max-w-[350px] sm:max-w-[410px] min-h-[540px] sm:min-h-[580px] rounded-3xl p-4 sm:p-6
          bg-gradient-to-br ${theme.gradientBg}
          border-2 ${theme.border}
          backdrop-blur-xl text-white select-none overflow-hidden
          transition-all duration-200 ease-out box-border
        `}
      >
        {/* Dynamic Cursor Glow Layer */}
        <div
          ref={glowRef}
          className="glow pointer-events-none absolute inset-0 rounded-3xl z-10 transition-opacity duration-300"
        />

        {/* Tropical Holographic Shimmer Foil Overlay */}
        <div className="hologram-shimmer absolute inset-0 pointer-events-none z-20 opacity-45 mix-blend-overlay" />

        {/* Codrops Laser Scanning Overlay */}
        {isScanning && (
          <>
            <div
              className="scan-laser-line"
              style={{
                background: `linear-gradient(90deg, transparent, ${theme.scanLaserColor} 20%, #ffffff 50%, ${theme.accentHex} 80%, transparent)`,
                boxShadow: `0 0 20px ${theme.scanLaserColor}, 0 0 40px ${theme.accentHex}`
              }}
            />
            <div className="scan-grid-overlay absolute inset-0 z-30 pointer-events-none opacity-50 mix-blend-screen" />
          </>
        )}

        {/* Card Header (Branding & Rarity) */}
        <div className="card-layer-depth-2 relative z-30 flex items-center justify-between border-b border-white/15 pb-3 sm:pb-4 mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FF9F43]/25 border border-[#FF9F43]/50 flex items-center justify-center">
              <Palmtree className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF9F43]" />
            </div>
            <div>
              <h4 className="font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase text-white flex items-center gap-1">
                HH GOA <span className="text-[#FF9F43]">2026</span>
              </h4>
              <p className="text-[9px] sm:text-[10px] text-[#00D2D3] font-mono tracking-widest">TASK #1 // GOA PASS</p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold font-mono tracking-wider border uppercase ${theme.badge}`}>
              {pass.rarity}
            </span>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-400 mt-1 font-mono">
              <ShieldCheck className="w-3 h-3" /> VERIFIED
            </div>
          </div>
        </div>

        {/* Card Body: Single Hacker or Teammates Squad Mode */}
        {!isSquadMode ? (
          /* Single Hacker View */
          <div className="card-layer-depth-3 relative z-30 flex flex-col items-center">
            {/* Avatar Frame */}
            <div className="relative group mb-3 sm:mb-4">
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-[#FF6B6B] via-[#FF9F43] to-[#00D2D3] opacity-85 blur-md group-hover:opacity-100 transition duration-300" />
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-white/40 bg-slate-900 shadow-2xl">
                <img
                  src={pass.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'}
                  alt={pass.name}
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  style={{
                    filter: `brightness(${pass.customFilter?.brightness || 1}) contrast(${pass.customFilter?.contrast || 1}) hue-rotate(${pass.customFilter?.hueRotate || 0}deg)`
                  }}
                />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/75 backdrop-blur-md rounded-md py-0.5 px-1.5 text-center text-[9px] sm:text-[10px] font-mono text-[#FF9F43] border border-[#FF9F43]/40 truncate">
                  {pass.roleClass}
                </div>
              </div>
            </div>

            {/* Builder Identity */}
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-center text-white tracking-wide flex items-center justify-center gap-1.5">
              {pass.name || 'Anonymous Hacker'}
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF9F43]" />
            </h2>
            <p className="text-[11px] sm:text-xs text-[#00D2D3] font-mono mb-2 sm:mb-3">@{pass.handle || 'builder'}</p>

            {/* Team Tag */}
            {pass.teamName && (
              <div className="mb-2.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] sm:text-[11px] font-mono text-gray-200 flex items-center gap-1.5">
                <Users className="w-3 h-3 text-[#FF6B6B]" /> Team: <span className="text-white font-bold">{pass.teamName}</span>
              </div>
            )}

            {/* Stack Tags */}
            <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5 mb-3 sm:mb-4 max-w-[320px]">
              {pass.stack && pass.stack.length > 0 ? (
                pass.stack.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono font-medium bg-white/15 text-gray-100 border border-white/20 shadow-sm"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono bg-white/10 text-gray-400">#Solana #AI</span>
              )}
            </div>

            {/* Stats Gauge */}
            <div className="w-full grid grid-cols-3 gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md p-2 sm:p-2.5 rounded-xl border border-white/15 mb-3 sm:mb-4">
              <div className="flex flex-col items-center">
                <span className="text-[8px] sm:text-[9px] font-mono text-gray-300 uppercase">Speed</span>
                <span className="font-display font-extrabold text-xs sm:text-sm text-[#00D2D3]">{pass.stats?.speed || 95}</span>
              </div>
              <div className="flex flex-col items-center border-x border-white/15">
                <span className="text-[8px] sm:text-[9px] font-mono text-gray-300 uppercase">Power</span>
                <span className="font-display font-extrabold text-xs sm:text-sm text-[#FF6B6B]">{pass.stats?.power || 92}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[8px] sm:text-[9px] font-mono text-gray-300 uppercase">Code</span>
                <span className="font-display font-extrabold text-xs sm:text-sm text-[#FF9F43]">{pass.stats?.code || 98}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Multi-Member Squad Mode View */
          <div className="card-layer-depth-3 relative z-30 flex flex-col items-center">
            <div className="mb-2.5 text-center">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B6B]/25 text-[#FF6B6B] border border-[#FF6B6B]/40 text-[10px] sm:text-xs font-mono font-bold flex items-center justify-center gap-1">
                <Flame className="w-3 h-3" /> SQUAD PASS // {pass.teamName || 'GOA BUILDERS'}
              </span>
            </div>

            {/* Squad Avatar Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full mb-3 sm:mb-4">
              {/* Leader */}
              <div className="bg-white/10 border border-white/20 p-1.5 sm:p-2 rounded-xl flex flex-col items-center">
                <img
                  src={pass.avatarUrl}
                  alt={pass.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[#00D2D3]/60 mb-1"
                />
                <span className="font-bold text-[11px] sm:text-xs truncate max-w-[95px] text-white">{pass.name}</span>
                <span className="text-[8px] sm:text-[9px] text-[#00D2D3] font-mono">@{pass.handle}</span>
                <span className="text-[7px] sm:text-[8px] bg-[#00D2D3]/25 text-[#00D2D3] px-1 py-0.2 rounded mt-1 font-bold">LEAD</span>
              </div>

              {/* Teammates */}
              {pass.teammates.slice(0, 3).map((m, idx) => (
                <div key={idx} className="bg-white/10 border border-white/20 p-1.5 sm:p-2 rounded-xl flex flex-col items-center">
                  <img
                    src={m.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80'}
                    alt={m.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[#FF6B6B]/60 mb-1"
                  />
                  <span className="font-bold text-[11px] sm:text-xs truncate max-w-[95px] text-white">{m.name || `Teammate ${idx + 1}`}</span>
                  <span className="text-[8px] sm:text-[9px] text-[#FF6B6B] font-mono">@{m.handle || 'builder'}</span>
                  <span className="text-[7px] sm:text-[8px] bg-[#FF6B6B]/25 text-[#FF6B6B] px-1 py-0.2 rounded mt-1 font-bold">{m.roleClass || 'BUILDER'}</span>
                </div>
              ))}
            </div>

            {/* Stack Tags */}
            <div className="flex flex-wrap justify-center gap-1 mb-2.5">
              {pass.stack?.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono bg-white/15 text-gray-100">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Card Footer */}
        <div className="card-layer-depth-1 relative z-30 mt-auto pt-3 sm:pt-4 border-t border-white/15 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[9px] font-mono text-gray-300 uppercase">PASS HASH</span>
            <span className="text-[9px] sm:text-[10px] font-mono text-[#FF9F43] tracking-wider">
              HH26-GOA-{(pass.id || '8839').slice(0, 8).toUpperCase()}
            </span>
            <span className="text-[8px] sm:text-[9px] font-mono text-gray-400 mt-0.5">#FrameInGoa // radar</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white p-1 rounded-lg shadow-md flex items-center justify-center">
              <QrCode className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
            </div>
          </div>
        </div>

        {/* Bottom Accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.accentHex}, transparent)` }}
        />
      </div>
    </div>
  );
};
