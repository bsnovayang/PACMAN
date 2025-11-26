class AudioController {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = false;

        // Resume context on user interaction
        window.addEventListener('keydown', () => {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            this.enabled = true;
        }, { once: true });
    }

    playTone(freq, type, duration, startTime = 0) {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + startTime);
        osc.stop(this.ctx.currentTime + startTime + duration);
    }

    playWaka() {
        // Simple waka sound: two alternating tones
        // This needs to be throttled in game loop usually, or called on specific frames
        this.playTone(200, 'triangle', 0.1);
        setTimeout(() => this.playTone(400, 'triangle', 0.1), 150);
    }

    playEatPellet() {
        this.playTone(300, 'sine', 0.05);
    }

    playEatPowerPellet() {
        this.playTone(600, 'square', 0.1);
    }

    playEatGhost() {
        this.playTone(800, 'sawtooth', 0.1);
        setTimeout(() => this.playTone(1200, 'sawtooth', 0.2), 100);
    }

    playDeath() {
        // Descending slide
        for (let i = 0; i < 10; i++) {
            this.playTone(500 - i * 50, 'sawtooth', 0.1, i * 0.1);
        }
    }

    playGameStart() {
        // Classic intro-ish melody
        const notes = [523, 1046, 783, 392, 523, 1046, 783, 392]; // C5, C6, G5, G4...
        notes.forEach((freq, i) => {
            this.playTone(freq, 'square', 0.1, i * 0.15);
        });
    }
}
