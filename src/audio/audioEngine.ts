/**
 * Audio Engine for Slime Time
 *
 * Manages Web Audio API for touch-triggered sound effects.
 * Unlocks on first user gesture, provides gain control per category.
 *
 * M2: Uses simple oscillator-based sounds as placeholders.
 * Future: Replace with decoded audio buffers from files.
 */

interface AudioEngineConfig {
  masterVolume: number
  lowStimulationMode: boolean
}

class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private squishGain: GainNode | null = null
  private popGain: GainNode | null = null

  private isUnlocked = false
  private config: AudioEngineConfig = {
    masterVolume: 0.7,
    lowStimulationMode: false,
  }

  // Drag sound state
  private dragOscillator: OscillatorNode | null = null
  private dragGain: GainNode | null = null

  // Pop rate limiting
  private lastPopTime = 0
  private popCooldownMs = 150

  /**
   * Unlock the audio context on first user gesture.
   * Call this on pointer down.
   */
  unlock() {
    if (this.isUnlocked) return

    // Create AudioContext if needed
    if (!this.ctx) {
      this.ctx = new AudioContext()
    }

    // Resume context (needed for some browsers that suspend by default)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    // Create gain nodes
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = this.config.masterVolume
    this.masterGain.connect(this.ctx.destination)

    this.squishGain = this.ctx.createGain()
    this.squishGain.gain.value = 1.0
    this.squishGain.connect(this.masterGain)

    this.popGain = this.ctx.createGain()
    this.popGain.gain.value = 0.8
    this.popGain.connect(this.masterGain)

    this.isUnlocked = true
    console.log('[AudioEngine] Unlocked')
  }

  /**
   * Play a squish sound on press.
   * Volume is affected by pressure (0-1).
   */
  playSquish(pressure = 1.0) {
    if (!this.isUnlocked || !this.ctx || !this.squishGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(120, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.1)

    const volume = Math.max(0.1, pressure) * 0.3
    gain.gain.setValueAtTime(volume, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15)

    osc.connect(gain)
    gain.connect(this.squishGain)

    osc.start(this.ctx.currentTime)
    osc.stop(this.ctx.currentTime + 0.15)
  }

  /**
   * Start a continuous drag sound (looped texture).
   * Volume is tied to velocity (0-1).
   */
  startDrag(velocity = 0.5) {
    if (!this.isUnlocked || !this.ctx || !this.squishGain) return

    // Stop previous drag sound if any
    this.stopDrag()

    this.dragOscillator = this.ctx.createOscillator()
    this.dragGain = this.ctx.createGain()

    this.dragOscillator.type = 'triangle'
    this.dragOscillator.frequency.value = 180

    const volume = Math.max(0.05, velocity) * 0.15
    this.dragGain.gain.value = volume

    this.dragOscillator.connect(this.dragGain)
    this.dragGain.connect(this.squishGain)

    this.dragOscillator.start(this.ctx.currentTime)
  }

  /**
   * Update drag sound volume based on current velocity.
   */
  updateDrag(velocity = 0.5) {
    if (!this.dragGain || !this.ctx) return

    const volume = Math.max(0.05, velocity) * 0.15
    this.dragGain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.05)
  }

  /**
   * Stop the drag sound.
   */
  stopDrag() {
    if (this.dragOscillator && this.ctx) {
      this.dragOscillator.stop(this.ctx.currentTime)
      this.dragOscillator.disconnect()
      this.dragOscillator = null
    }

    if (this.dragGain) {
      this.dragGain.disconnect()
      this.dragGain = null
    }
  }

  /**
   * Play a pop sound on release.
   * Rate-limited to avoid excessive pops.
   */
  playPop() {
    if (!this.isUnlocked || !this.ctx || !this.popGain) return

    const now = Date.now()
    if (now - this.lastPopTime < this.popCooldownMs) return
    this.lastPopTime = now

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08)

    osc.connect(gain)
    gain.connect(this.popGain)

    osc.start(this.ctx.currentTime)
    osc.stop(this.ctx.currentTime + 0.08)
  }

  /**
   * Set master volume (0-1).
   */
  setMasterVolume(volume: number) {
    this.config.masterVolume = Math.max(0, Math.min(1, volume))
    if (this.masterGain) {
      this.masterGain.gain.value = this.config.masterVolume
    }
  }

  /**
   * Enable or disable low stimulation mode.
   * Reduces master volume and increases pop cooldown.
   */
  setLowStimulationMode(enabled: boolean) {
    this.config.lowStimulationMode = enabled

    if (enabled) {
      this.setMasterVolume(0.3)
      this.popCooldownMs = 400
    } else {
      this.setMasterVolume(0.7)
      this.popCooldownMs = 150
    }
  }

  /**
   * Enable or disable all sound. Convenience wrapper for the UI toggle.
   */
  setSoundEnabled(enabled: boolean) {
    if (enabled) {
      this.unmute()
    } else {
      this.mute()
      this.stopDrag()
    }
  }

  /**
   * Mute all audio.
   */
  mute() {
    if (this.masterGain) {
      this.masterGain.gain.value = 0
    }
  }

  /**
   * Unmute audio.
   */
  unmute() {
    if (this.masterGain) {
      this.masterGain.gain.value = this.config.masterVolume
    }
  }

  /**
   * Get current unlock state.
   */
  isAudioUnlocked(): boolean {
    return this.isUnlocked
  }
}

// Singleton instance
export const audioEngine = new AudioEngine()
