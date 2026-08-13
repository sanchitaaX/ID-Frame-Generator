class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private oceanNode: { bufferSource: AudioBufferSourceNode; filter: BiquadFilterNode; gain: GainNode } | null = null;
  private lfo: OscillatorNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.oceanNode) {
      this.stopOceanWaves();
    }
    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  public playOceanWaves() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    if (this.oceanNode) return; // already playing

    try {
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Pink/white noise for sea surf
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Lowpass filter for ocean wave dynamics
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      // LFO to simulate swelling sea waves
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.12; // wave every 8 seconds

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 350; // sweep frequency between 100Hz and 750Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const masterGain = this.ctx.createGain();
      masterGain.gain.value = 0.08; // subtle ambient volume

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      whiteNoise.start();
      lfo.start();

      this.oceanNode = { bufferSource: whiteNoise, filter, gain: masterGain };
      this.lfo = lfo;
    } catch {
      // Audio autoplay block handles gracefully
    }
  }

  public stopOceanWaves() {
    if (this.oceanNode) {
      try {
        this.oceanNode.bufferSource.stop();
        this.oceanNode.bufferSource.disconnect();
        this.lfo?.stop();
        this.lfo?.disconnect();
      } catch {
        // Ignore disconnect errors
      }
      this.oceanNode = null;
      this.lfo = null;
    }
  }

  public playScanBeep() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // Audio ignore
    }
  }

  public playClickSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio ignore
    }
  }
}

export const audioEngine = new SoundEngine();
