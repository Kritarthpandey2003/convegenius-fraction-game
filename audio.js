// audio.js - Simple synthesizer for game sounds using Web Audio API

class SoundManager {
    constructor() {
        this.audioCtx = null;
        this.initialized = false;
    }

    init() {
        if (!this.initialized) {
            // Initialize AudioContext on first user interaction
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
            this.initialized = true;
        }
    }

    playTone(frequency, type, duration, vol = 0.1) {
        if (!this.initialized) return;

        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
        
        // Envelope
        gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + duration);
    }

    playAdd() {
        // A pleasant pop/boop sound
        this.playTone(440, 'sine', 0.1, 0.2);
        setTimeout(() => this.playTone(660, 'sine', 0.15, 0.2), 50);
    }

    playRemove() {
        // A lower pitched pop/boop
        this.playTone(330, 'sine', 0.1, 0.2);
        setTimeout(() => this.playTone(220, 'sine', 0.15, 0.2), 50);
    }

    playSuccess() {
        // A triumphant arpeggio
        this.playTone(523.25, 'triangle', 0.1, 0.2); // C5
        setTimeout(() => this.playTone(659.25, 'triangle', 0.1, 0.2), 100); // E5
        setTimeout(() => this.playTone(783.99, 'triangle', 0.1, 0.2), 200); // G5
        setTimeout(() => this.playTone(1046.50, 'triangle', 0.4, 0.2), 300); // C6
    }
}

const soundManager = new SoundManager();

// Initialize on first click anywhere
document.addEventListener('click', () => {
    soundManager.init();
}, { once: true });
