export interface TranslationExample {
  original: string;
  translated: string;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
  pronunciation?: string;
  partsOfSpeech?: string;
  alternatives: string[];
  examples: TranslationExample[];
  nuanceNote?: string;
  originalText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface HistoryItem {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
  pronunciation?: string;
  detectedLanguage?: string;
}

export interface FavoriteItem {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}

export interface Language {
  code: string;
  name: string;
  flag: string; // Emoji flag representation
  speechLocale?: string; // Standard voice synthesis locales
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸", speechLocale: "en-US" },
  { code: "es", name: "Spanish", flag: "🇪🇸", speechLocale: "es-ES" },
  { code: "fr", name: "French", flag: "🇫🇷", speechLocale: "fr-FR" },
  { code: "de", name: "German", flag: "🇩🇪", speechLocale: "de-DE" },
  { code: "it", name: "Italian", flag: "🇮🇹", speechLocale: "it-IT" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", speechLocale: "ja-JP" },
  { code: "zh", name: "Chinese (Simplified)", flag: "🇨🇳", speechLocale: "zh-CN" },
  { code: "ko", name: "Korean", flag: "🇰🇷", speechLocale: "ko-KR" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", speechLocale: "hi-IN" },
  { code: "kn", name: "Kannada", flag: "🇮🇳", speechLocale: "kn-IN" },
  { code: "ta", name: "Tamil", flag: "🇮🇳", speechLocale: "ta-IN" },
  { code: "te", name: "Telugu", flag: "🇮🇳", speechLocale: "te-IN" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳", speechLocale: "ml-IN" },
  { code: "mr", name: "Marathi", flag: "🇮🇳", speechLocale: "mr-IN" },
  { code: "bn", name: "Bengali", flag: "🇮🇳", speechLocale: "bn-IN" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", speechLocale: "ar-SA" },
  { code: "ru", name: "Russian", flag: "🇷🇺", speechLocale: "ru-RU" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹", speechLocale: "pt-PT" },
  { code: "tr", name: "Turkish", flag: "🇹🇷", speechLocale: "tr-TR" },
  { code: "nl", name: "Dutch", flag: "🇳🇱", speechLocale: "nl-NL" },
  { code: "pl", name: "Polish", flag: "🇵🇱", speechLocale: "pl-PL" },
  { code: "sv", name: "Swedish", flag: "🇸🇪", speechLocale: "sv-SE" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳", speechLocale: "vi-VN" },
  { code: "id", name: "Indonesian", flag: "🇮🇩", speechLocale: "id-ID" }
];

export const PRESET_PHRASES = [
  { text: "Hello, how are you?", category: "Greetings" },
  { text: "Where is the nearest train station?", category: "Travel" },
  { text: "How much does this cost?", category: "Shopping" },
  { text: "Could I have the menu and water, please?", category: "Dining" },
  { text: "I need help, this is an emergency.", category: "Urgent" }
];
