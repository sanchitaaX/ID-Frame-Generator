import React, { useState } from 'react';
import type { HackerPass, CardThemeId, Teammate } from '../../types';
import { generateBuilderClass, getAllClasses } from '../../lib/builderClassEngine';
import { audioEngine } from '../../lib/AudioEngine';
import {
  User,
  Users,
  Sparkles,
  Palette,
  Scan,
  Volume2,
  VolumeX,
  Upload,
  Plus,
  Trash2,
  Wand2,
  Sliders,
  Palmtree
} from 'lucide-react';

interface CardControlsProps {
  pass: HackerPass;
  onChange: (updatedPass: HackerPass) => void;
  isScanning: boolean;
  onToggleScanning: () => void;
}

const AVAILABLE_STACKS = [
  'Solana', 'Rust', 'AI Agents', 'React', 'Python',
  'ZK Proofs', 'DeFi', 'WASM', 'Move', 'TypeScript',
  'Next.js', 'Tailwind', 'GraphQL', 'Anchor'
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80'
];

export const CardControls: React.FC<CardControlsProps> = ({
  pass,
  onChange,
  isScanning,
  onToggleScanning
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'stack' | 'squad' | 'style'>('profile');
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isTeammateIdx?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    audioEngine.playClickSound();
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (typeof isTeammateIdx === 'number') {
        const newTeammates = [...pass.teammates];
        newTeammates[isTeammateIdx] = { ...newTeammates[isTeammateIdx], avatarUrl: dataUrl };
        onChange({ ...pass, teammates: newTeammates });
      } else {
        onChange({ ...pass, avatarUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleStack = (tag: string) => {
    audioEngine.playClickSound();
    const exists = pass.stack.includes(tag);
    const newStack = exists
      ? pass.stack.filter(s => s !== tag)
      : [...pass.stack, tag];

    const assignedClass = generateBuilderClass(newStack, pass.name);
    onChange({
      ...pass,
      stack: newStack,
      roleClass: assignedClass.title,
      rarity: assignedClass.rarity,
      stats: assignedClass.defaultStats
    });
  };

  const handleAutoGenerateClass = () => {
    audioEngine.playScanBeep();
    const assignedClass = generateBuilderClass(pass.stack, pass.name || 'Hacker');
    onChange({
      ...pass,
      roleClass: assignedClass.title,
      rarity: assignedClass.rarity,
      stats: assignedClass.defaultStats
    });
  };

  const handleAddTeammate = () => {
    if (pass.teammates.length >= 3) return;
    audioEngine.playClickSound();
    const newTeammate: Teammate = {
      id: Math.random().toString(),
      name: `Teammate ${pass.teammates.length + 1}`,
      handle: `builder_${pass.teammates.length + 1}`,
      roleClass: 'Core Builder',
      avatarUrl: PRESET_AVATARS[(pass.teammates.length + 1) % PRESET_AVATARS.length]
    };
    onChange({ ...pass, teammates: [...pass.teammates, newTeammate] });
  };

  const handleRemoveTeammate = (index: number) => {
    audioEngine.playClickSound();
    const newTeammates = pass.teammates.filter((_, i) => i !== index);
    onChange({ ...pass, teammates: newTeammates });
  };

  const handleToggleSound = () => {
    const muted = audioEngine.toggleMute();
    setIsAudioMuted(muted);
    if (!muted) {
      audioEngine.playOceanWaves();
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 w-full max-w-xl text-white shadow-2xl border border-[#FF9F43]/30">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <Palmtree className="w-5 h-5 text-[#FF9F43]" /> Goa Studio Controls
          </h3>
          <p className="text-xs text-gray-300 font-mono">Customize identity, squad & beach vibes</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioEngine.playScanBeep();
              onToggleScanning();
            }}
            className={`
              px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all
              ${isScanning
                ? 'bg-[#FF9F43] text-black shadow-[0_0_20px_rgba(255,159,67,0.6)] animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-gray-200 border border-white/15'}
            `}
          >
            <Scan className="w-4 h-4" /> {isScanning ? 'DEPTH FX ON' : 'DEPTH SCAN'}
          </button>

          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 border border-white/15 transition"
            title="Toggle Ocean Ambience SFX"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-[#FF9F43]" />}
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 p-1.5 bg-black/40 rounded-2xl border border-white/15">
        <button
          onClick={() => { audioEngine.playClickSound(); setActiveTab('profile'); }}
          className={`py-2 text-[11px] sm:text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1 transition ${
            activeTab === 'profile' ? 'bg-[#FF9F43] text-black shadow-md' : 'text-gray-300 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Identity
        </button>

        <button
          onClick={() => { audioEngine.playClickSound(); setActiveTab('stack'); }}
          className={`py-2 text-[11px] sm:text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1 transition ${
            activeTab === 'stack' ? 'bg-[#FF9F43] text-black shadow-md' : 'text-gray-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Stack & Class
        </button>

        <button
          onClick={() => { audioEngine.playClickSound(); setActiveTab('squad'); }}
          className={`py-2 text-[11px] sm:text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1 transition ${
            activeTab === 'squad' ? 'bg-[#FF9F43] text-black shadow-md' : 'text-gray-300 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Squad ({pass.teammates.length + 1})
        </button>

        <button
          onClick={() => { audioEngine.playClickSound(); setActiveTab('style'); }}
          className={`py-2 text-[11px] sm:text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1 transition ${
            activeTab === 'style' ? 'bg-[#FF9F43] text-black shadow-md' : 'text-gray-300 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" /> Themes
        </button>
      </div>

      {/* Tab 1: Profile & Identity */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Builder Name</label>
              <input
                type="text"
                value={pass.name}
                onChange={(e) => onChange({ ...pass, name: e.target.value })}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-sm font-sans text-white focus:outline-none focus:border-[#FF9F43]"
                placeholder="e.g. Alex Vance"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">X (Twitter) Handle</label>
              <input
                type="text"
                value={pass.handle}
                onChange={(e) => onChange({ ...pass, handle: e.target.value.replace('@', '') })}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#FF9F43]"
                placeholder="e.g. alex_vance"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">Team / Squad Name</label>
            <input
              type="text"
              value={pass.teamName}
              onChange={(e) => onChange({ ...pass, teamName: e.target.value })}
              className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-sm font-sans text-white focus:outline-none focus:border-[#FF9F43]"
              placeholder="e.g. Goa Solana Pirates"
            />
          </div>

          {/* Photo Uploader */}
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">Avatar Photo (Auto-Fit)</label>
            <div className="flex items-center gap-3">
              <img
                src={pass.avatarUrl}
                alt="preview"
                className="w-12 h-12 rounded-xl object-cover border border-[#FF9F43]"
              />
              <label className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 border border-dashed border-white/25 hover:border-[#FF9F43] rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-xs font-mono text-gray-200 transition">
                <Upload className="w-4 h-4 text-[#FF9F43]" /> Upload Custom Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            {/* Quick Preset Avatars */}
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-400">Preset Avatars:</span>
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => onChange({ ...pass, avatarUrl: url })}
                  className="w-6 h-6 rounded-full overflow-hidden border border-white/40 hover:border-[#FF9F43] transition"
                >
                  <img src={url} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Avatar Filter Fine-Tuning */}
          <div className="p-3 bg-black/30 rounded-xl border border-white/15 space-y-2">
            <span className="text-xs font-mono text-gray-200 flex items-center gap-1.5 mb-1">
              <Sliders className="w-3.5 h-3.5 text-[#FF9F43]" /> Avatar Color Fine-Tuning
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] font-mono text-gray-400">Brightness</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={pass.customFilter?.brightness ?? 1}
                  onChange={(e) => onChange({
                    ...pass,
                    customFilter: { ...pass.customFilter, brightness: parseFloat(e.target.value), contrast: pass.customFilter?.contrast ?? 1, hueRotate: pass.customFilter?.hueRotate ?? 0 }
                  })}
                  className="w-full accent-[#FF9F43]"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-gray-400">Contrast</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.05"
                  value={pass.customFilter?.contrast ?? 1}
                  onChange={(e) => onChange({
                    ...pass,
                    customFilter: { ...pass.customFilter, contrast: parseFloat(e.target.value), brightness: pass.customFilter?.brightness ?? 1, hueRotate: pass.customFilter?.hueRotate ?? 0 }
                  })}
                  className="w-full accent-[#FF6B6B]"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-gray-400">Hue Shift</span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="10"
                  value={pass.customFilter?.hueRotate ?? 0}
                  onChange={(e) => onChange({
                    ...pass,
                    customFilter: { ...pass.customFilter, hueRotate: parseInt(e.target.value), brightness: pass.customFilter?.brightness ?? 1, contrast: pass.customFilter?.contrast ?? 1 }
                  })}
                  className="w-full accent-[#00D2D3]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tech Stack & Builder Class */}
      {activeTab === 'stack' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-gray-200">Select Tech Stack Pills</label>
            <button
              onClick={handleAutoGenerateClass}
              className="text-xs font-mono font-bold text-[#FF9F43] hover:underline flex items-center gap-1"
            >
              <Wand2 className="w-3.5 h-3.5" /> Re-roll Class
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {AVAILABLE_STACKS.map((tag) => {
              const active = pass.stack.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleStack(tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono transition-all ${
                    active
                      ? 'bg-[#FF9F43] text-black font-bold shadow-[0_0_12px_rgba(255,159,67,0.5)]'
                      : 'bg-white/10 hover:bg-white/20 text-gray-200 border border-white/15'
                  }`}
                >
                  {active ? `✓ #${tag}` : `+#${tag}`}
                </button>
              );
            })}
          </div>

          {/* Builder Class Selector */}
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">Generated Builder Class</label>
            <select
              value={pass.roleClass}
              onChange={(e) => {
                const selectedTitle = e.target.value;
                const foundClass = getAllClasses().find(c => c.title === selectedTitle);
                onChange({
                  ...pass,
                  roleClass: selectedTitle,
                  rarity: foundClass?.rarity || 'Legendary',
                  stats: foundClass?.defaultStats || pass.stats
                });
              }}
              className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-sm font-sans text-white focus:outline-none focus:border-[#FF9F43]"
            >
              {getAllClasses().map((c) => (
                <option key={c.title} value={c.title} className="bg-slate-900 text-white">
                  [{c.rarity}] {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Tab 3: Teammates Squad Manager */}
      {activeTab === 'squad' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-mono font-bold text-white flex items-center gap-1.5">
                Bring Your Teammates Into One Frame
              </h4>
              <p className="text-[11px] text-gray-300 font-mono">HH Goa 2026 Task #1 Squad Pass</p>
            </div>
            {pass.teammates.length < 3 && (
              <button
                onClick={handleAddTeammate}
                className="px-3 py-1.5 rounded-xl bg-[#FF6B6B] hover:bg-[#FF6B6B]/80 text-white text-xs font-mono font-bold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Teammate
              </button>
            )}
          </div>

          {pass.teammates.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-white/20 rounded-2xl bg-white/5">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-mono text-gray-200">Currently in Single Hacker Pass mode.</p>
              <p className="text-[11px] font-mono text-gray-400 mt-1">
                Click <strong>Add Teammate</strong> to combine up to 4 builders into one Goa frame!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {pass.teammates.map((m, idx) => (
                <div key={m.id} className="p-3 bg-black/40 border border-white/15 rounded-2xl flex items-center gap-3">
                  <img src={m.avatarUrl} alt={m.name} className="w-10 h-10 rounded-xl object-cover border border-white/30" />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => {
                        const updated = [...pass.teammates];
                        updated[idx].name = e.target.value;
                        onChange({ ...pass, teammates: updated });
                      }}
                      placeholder="Teammate Name"
                      className="bg-white/10 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={m.handle}
                      onChange={(e) => {
                        const updated = [...pass.teammates];
                        updated[idx].handle = e.target.value;
                        onChange({ ...pass, teammates: updated });
                      }}
                      placeholder="X Handle"
                      className="bg-white/10 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveTeammate(idx)}
                    className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Colorful Goa Themes */}
      {activeTab === 'style' && (
        <div className="space-y-4">
          <label className="block text-xs font-mono text-gray-300">Colorful Goa Theme Palette</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'goa-sunset', name: 'Goa Sunset', color: 'from-[#FF6B6B] to-[#FF9F43]' },
              { id: 'tropical-beach', name: 'Tropical Beach', color: 'from-[#00D2D3] to-[#10AC84]' },
              { id: 'festive-fiesta', name: 'Festive Fiesta', color: 'from-[#FF4757] to-[#5F27CD]' },
              { id: 'golden-sand', name: 'Golden Sand', color: 'from-[#FFC857] to-[#E67E22]' }
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => {
                  audioEngine.playClickSound();
                  onChange({ ...pass, cardTheme: th.id as CardThemeId });
                }}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                  pass.cardTheme === th.id
                    ? 'border-[#FF9F43] bg-[#FF9F43]/20 text-white'
                    : 'border-white/15 bg-black/40 text-gray-300 hover:border-white/35'
                }`}
              >
                <span className="text-xs font-mono font-bold">{th.name}</span>
                <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${th.color} shadow-sm`} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
