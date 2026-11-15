interface SoundNote {
  frequency: number;
  start: number;
  duration: number;
}

function playToneSequence(notes: SoundNote[], waveform: OscillatorType, volume = 0.055): void {
  try {
    const settings = JSON.parse(localStorage.getItem('lglh_settings') || '{}');
    if (settings.soundEnabled !== true) return;
    const AudioContextClass = window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    notes.forEach(note => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = waveform;
      oscillator.frequency.setValueAtTime(note.frequency, context.currentTime + note.start);
      gain.gain.setValueAtTime(0.0001, context.currentTime + note.start);
      gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + note.start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + note.start + note.duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(context.currentTime + note.start);
      oscillator.stop(context.currentTime + note.start + note.duration);
    });
    window.setTimeout(() => { void context.close(); }, 500);
  } catch {
    // Audio is optional; never interrupt the app if audio is unavailable.
  }
}

// Short, distinct feedback sounds for game answers. Respects Settings > Sound.
export function playGameSound(result: 'correct' | 'wrong'): void {
  const notes = result === 'correct'
    ? [{ frequency: 880, start: 0, duration: 0.11 }, { frequency: 1175, start: 0.10, duration: 0.14 }]
    : [{ frequency: 260, start: 0, duration: 0.16 }, { frequency: 190, start: 0.12, duration: 0.18 }];
  playToneSequence(notes, result === 'correct' ? 'sine' : 'triangle');
}

export function playNavigationSound(): void {
  playToneSequence([
    { frequency: 620, start: 0, duration: 0.06 },
    { frequency: 820, start: 0.035, duration: 0.07 },
  ], 'sine', 0.025);
}
