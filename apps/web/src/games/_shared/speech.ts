// Web Speech API helper for Spanish word pronunciation.
//
// Why this and not Azure/ElevenLabs by default:
//   - Zero setup. No keys, no quota, works offline after first voice load.
//   - Mac/iOS/Android ship great es-MX voices; Windows is OK.
//   - Premium swap: when AZURE_SPEECH_KEY is set (env vars per
//     docs/deployment.md §5), the upload-pipeline-built audio URL on
//     each Word takes precedence and we fall back to this.
//
// Notes:
//   - speechSynthesis.getVoices() is async on Chrome — voices arrive via
//     a 'voiceschanged' event. We cache once they load.
//   - Must be triggered from a user gesture (click handler is fine).

let cachedVoices: SpeechSynthesisVoice[] | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') {
    return Promise.resolve([]);
  }
  if (cachedVoices && cachedVoices.length > 0) return Promise.resolve(cachedVoices);

  return new Promise((resolve) => {
    const initial = window.speechSynthesis.getVoices();
    if (initial.length > 0) {
      cachedVoices = initial;
      resolve(initial);
      return;
    }
    const onChange = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', onChange);
      resolve(cachedVoices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', onChange);
    // Fallback timeout — some browsers never fire the event.
    window.setTimeout(() => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    }, 800);
  });
}

function pickSpanishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const preferences = ['es-MX', 'es-US', 'es-ES', 'es-419', 'es'];
  for (const pref of preferences) {
    const v = voices.find((voice) => voice.lang.toLowerCase().startsWith(pref.toLowerCase()));
    if (v) return v;
  }
  return undefined;
}

export interface SpeakOptions {
  /** BCP-47 tag, e.g. 'es-MX'. Falls back through es-MX → es-US → es-ES → es. */
  lang?: string;
  /** Default 0.85 — slightly slower than normal so kids can mimic. */
  rate?: number;
  /** Default 1. */
  pitch?: number;
}

export async function speakSpanish(text: string, options: SpeakOptions = {}): Promise<void> {
  if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') return;

  const voices = await loadVoices();
  const voice = pickSpanishVoice(voices);

  // Cancel any in-flight utterance so rapid taps don't stack up.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang ?? voice?.lang ?? 'es-MX';
  utterance.rate = options.rate ?? 0.85;
  utterance.pitch = options.pitch ?? 1;
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}
