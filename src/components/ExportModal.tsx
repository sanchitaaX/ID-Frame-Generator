import React, { useState } from 'react';
import type { HackerPass } from '../types';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Download, Share2, Check, X, Copy, Palmtree } from 'lucide-react';
import { audioEngine } from '../lib/AudioEngine';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  pass: HackerPass;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  pass,
  cardRef
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    audioEngine.playScanBeep();
    setIsExporting(true);

    try {
      const originalTransform = cardRef.current.style.transform;
      cardRef.current.style.transform = 'none';

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 0.98
      });

      cardRef.current.style.transform = originalTransform;

      const link = document.createElement('a');
      link.download = `HH_Goa_2026_ID_${pass.name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#FF9F43', '#00D2D3', '#FF4757']
      });

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareToX = () => {
    audioEngine.playClickSound();
    const tweetText = `Just generated our official HH Goa 2026 ID Pass using the #FrameInGoa generator! 🌊🌴☀️\n\nBuilder: ${pass.name} (@${pass.handle})\nClass: ${pass.roleClass} [${pass.rarity}]\nTeam: ${pass.teamName || 'Goa Builder'}\n\nGenerate your frame in seconds at https://hhgoa.com/! 🚀`;

    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&hashtags=FrameInGoa,HHGoa2026`;
    window.open(shareUrl, '_blank');
  };

  const handleCopyGuideText = () => {
    audioEngine.playClickSound();
    const textToCopy = `How-To generate your #FrameInGoa post:\n1. Visit https://hhgoa.com/\n2. Upload your builder photo (or add squad members)\n3. Pick tech stack & generate your Builder Class\n4. Download HD ID Card & post on X with #FrameInGoa!`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 relative border border-[#FF9F43]/40 shadow-[0_0_50px_rgba(255,159,67,0.25)] text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white rounded-full bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FF9F43]/25 border border-[#FF9F43] flex items-center justify-center mx-auto mb-3">
            <Palmtree className="w-6 h-6 text-[#FF9F43]" />
          </div>
          <h3 className="font-display font-extrabold text-2xl text-white">
            Your HH Goa <span className="text-[#FF9F43]">2026 Pass</span> is Ready!
          </h3>
          <p className="text-xs font-mono text-gray-300 mt-1">
            Download your card or share to X with <span className="text-[#FF9F43]">#FrameInGoa</span> to join the Radar ladder.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleDownloadPNG}
            disabled={isExporting}
            className={`
              py-3.5 px-4 rounded-2xl font-mono font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg
              ${downloadSuccess
                ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'bg-[#FF9F43] hover:bg-[#FF9F43]/80 text-black shadow-[0_0_25px_rgba(255,159,67,0.4)]'}
            `}
          >
            {isExporting ? (
              <span className="animate-pulse">Rendering HD PNG...</span>
            ) : downloadSuccess ? (
              <><Check className="w-5 h-5" /> Downloaded!</>
            ) : (
              <><Download className="w-5 h-5" /> 1-Click HD Download</>
            )}
          </button>

          <button
            onClick={handleShareToX}
            className="py-3.5 px-4 rounded-2xl bg-[#1DA1F2] hover:bg-[#1DA1F2]/80 text-white font-mono font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(29,161,242,0.4)]"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg> 1-Click Share to X
          </button>
        </div>

        <div className="p-4 bg-black/40 rounded-2xl border border-white/15 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#FF9F43] flex items-center gap-1.5">
              <Share2 className="w-4 h-4" /> Quick How-To for X Post
            </span>
            <button
              onClick={handleCopyGuideText}
              className="text-[11px] font-mono text-gray-200 hover:text-white flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg transition"
            >
              {copiedText ? <><Check className="w-3 h-3 text-emerald-400" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy Guide</>}
            </button>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Post your generated ID frame on X with a brief how-to and tag <strong className="text-[#FF9F43]">#FrameInGoa</strong> to get featured on the official HH Goa Radar!
          </p>
        </div>
      </div>
    </div>
  );
};
