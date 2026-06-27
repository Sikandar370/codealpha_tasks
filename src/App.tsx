import { useState, useEffect, KeyboardEvent } from "react";
import { Language, SUPPORTED_LANGUAGES, TranslationResponse, HistoryItem, FavoriteItem } from "./types";
import { LanguageSelector } from "./components/LanguageSelector";
import { QuickPresets } from "./components/QuickPresets";
import { NuanceGuide } from "./components/NuanceGuide";
import { TranslationHistory } from "./components/TranslationHistory";
import { VoiceAssistant } from "./components/VoiceAssistant";
import { TechBackground } from "./components/TechBackground";
import {
  Volume2,
  Copy,
  Check,
  Send,
  X,
  VolumeX,
  AlertCircle,
  HelpCircle,
  Languages,
  Moon,
  Sun,
  Star,
  BookOpenCheck,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const getLanguageName = (code: string) => {
  if (code === "auto") return "Auto-Detect";
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code;
};

export default function App() {
  // Translate UI states
  const [inputText, setInputText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [sourceLang, setSourceLang] = useState<string>("auto");
  const [targetLang, setTargetLang] = useState<string>("es");
  const [translationData, setTranslationData] = useState<TranslationResponse | null>(null);

  // Status triggers
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeakingOriginal, setIsSpeakingOriginal] = useState<boolean>(false);
  const [isSpeakingTranslated, setIsSpeakingTranslated] = useState<boolean>(false);

  // Persistence local storage states
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // 1. Initial setup - Load parameters from local storage
  useEffect(() => {
    try {
      // Dark mode state with high-tech default
      const savedTheme = localStorage.getItem("translate_theme") || "dark";
      if (savedTheme === "dark") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
      }

      // History state
      const savedHistory = localStorage.getItem("translate_history");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }

      // Favorites state
      const savedFavorites = localStorage.getItem("translate_favorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (e) {
      console.error("Local storage load fail:", e);
    }
  }, []);

  // 2. Handle Dark / Light Theme toggle
  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("translate_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("translate_theme", "light");
    }
  };

  // 3. Trigger Copy to clipboard support
  const handleCopyText = (text: string) => {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for iframe sandbox restrictions if standard clipboard API is blocked
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error("Copy action failed:", e);
    }
  };

  // 4. Client-side Speech Synthesis helper (TTS)
  const speakText = (text: string, langCode: string, isOriginal: boolean) => {
    if (!text) return;
    const speechLocale = SUPPORTED_LANGUAGES.find((l) => l.code === langCode)?.speechLocale || "en-US";

    try {
      window.speechSynthesis.cancel(); // Abort anything currently voice-playing

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLocale;

      utterance.onstart = () => {
        if (isOriginal) setIsSpeakingOriginal(true);
        else setIsSpeakingTranslated(true);
      };

      utterance.onend = () => {
        if (isOriginal) setIsSpeakingOriginal(false);
        else setIsSpeakingTranslated(false);
      };

      utterance.onerror = () => {
        if (isOriginal) setIsSpeakingOriginal(false);
        else setIsSpeakingTranslated(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Synthesis voice fail:", err);
    }
  };

  const stopSpeaking = () => {
    try {
      window.speechSynthesis.cancel();
      setIsSpeakingOriginal(false);
      setIsSpeakingTranslated(false);
    } catch (e) {
      console.error("Stop speaking failed:", e);
    }
  };

  // 5. Swap Language elements
  const handleSwapLanguages = () => {
    if (sourceLang === "auto") {
      // Revert auto to current target
      setSourceLang(targetLang);
      setTargetLang("en");
    } else {
      const temp = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(temp);
    }
    // Flip actual screen texts
    if (translatedText) {
      const tempText = inputText;
      setInputText(translatedText);
      setTranslatedText(tempText);
      setTranslationData(null);
    }
  };

  // 6. Manage presets insertion
  const handleSelectPreset = (text: string, customSource?: string, customTarget?: string) => {
    setInputText(text);
    const resolvedSrc = customSource || sourceLang;
    const resolvedTgt = customTarget || targetLang;
    if (customSource) setSourceLang(customSource);
    if (customTarget) setTargetLang(customTarget);
    // Trigger direct immediate translation for smooth transitions
    executeTranslation(text, resolvedSrc, resolvedTgt);
  };

  // 7. Core Translation API fetch execution
  const executeTranslation = async (
    overrideText?: string,
    overrideSource?: string,
    overrideTarget?: string
  ) => {
    const targetText = typeof overrideText === "string" ? overrideText : inputText;
    const targetSrc = typeof overrideSource === "string" ? overrideSource : sourceLang;
    const targetTgt = typeof overrideTarget === "string" ? overrideTarget : targetLang;

    if (!targetText || targetText.trim() === "") {
      setError("Please enter some text to translate first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    stopSpeaking();

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: targetText.trim(),
          sourceLang: targetSrc,
          targetLang: targetTgt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const result: TranslationResponse = await response.json();

      setTranslatedText(result.translatedText);
      setTranslationData(result);

      // Append translation record to local history securely
      const newItem: HistoryItem = {
        id: `history-${Date.now()}`,
        originalText: targetText.trim(),
        translatedText: result.translatedText,
        sourceLanguage: targetSrc,
        targetLanguage: targetTgt,
        timestamp: Date.now(),
        pronunciation: result.pronunciation,
        detectedLanguage: result.detectedLanguage,
      };

      setHistory((prev) => {
        // Prevent duplicate consecutive entries to keep list clean
        if (prev.length > 0 && prev[0].originalText.toLowerCase() === newItem.originalText.toLowerCase()) {
          return prev;
        }
        const updated = [newItem, ...prev.slice(0, 49)]; // Cap at 50 records
        localStorage.setItem("translate_history", JSON.stringify(updated));
        return updated;
      });

      return result;
    } catch (err: any) {
      console.error("Translation fail:", err);
      // Give readable, beginner-friendly contextual recommendations
      if (err.message?.includes("GEMINI_API_KEY")) {
        setError("Gemini API Key is missing. Please add a valid API key inside Settings > Secrets in the AI Studio menu.");
      } else {
        setError(err.message || "Unable to translate text. Check network connections and retry.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 8. Handle dictated voice from VoiceDictation Assistant panel
  const handleVoiceInput = async (dictatedText: string) => {
    setInputText(dictatedText);
    const result = await executeTranslation(dictatedText, sourceLang, targetLang);
    if (result && result.translatedText) {
      // Speak back the parsed translation immediately!
      speakText(result.translatedText, targetLang, false);
    }
  };

  // 8. Manage starred bookmarks / favorites list
  const toggleFavorite = (item: HistoryItem | FavoriteItem) => {
    const isFav = favorites.find(
      (f) => f.originalText.trim().toLowerCase() === item.originalText.trim().toLowerCase()
    );

    let updated: FavoriteItem[] = [];
    if (isFav) {
      // Remove it
      updated = favorites.filter((f) => f.originalText.trim().toLowerCase() !== item.originalText.trim().toLowerCase());
    } else {
      // Add it
      const newFav: FavoriteItem = {
        id: `fav-${Date.now()}`,
        originalText: item.originalText,
        translatedText: item.translatedText,
        sourceLanguage: item.sourceLanguage,
        targetLanguage: item.targetLanguage,
        timestamp: Date.now(),
      };
      updated = [newFav, ...favorites];
    }
    setFavorites(updated);
    localStorage.setItem("translate_favorites", JSON.stringify(updated));
  };

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("translate_history", JSON.stringify(updated));
  };

  const clearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire translation history?")) {
      setHistory([]);
      localStorage.removeItem("translate_history");
    }
  };

  // Trigger translate on ENTER (unless Shift + Enter is used for newline)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeTranslation();
    }
  };

  // Quick check if current translation is starred
  const isCurrentStarred = translationData
    ? favorites.some((f) => f.originalText.trim().toLowerCase() === inputText.trim().toLowerCase())
    : false;

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 dark:bg-[#020207] dark:text-zinc-100 transition-colors duration-300 relative overflow-x-hidden">
      {/* Visual Holographic Circuit backdrop layer matching user's loaded mockup */}
      {isDarkMode && <TechBackground />}
      
      {!isDarkMode && (
        <>
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-indigo-100/40 via-violet-50/10 to-transparent pointer-events-none select-none" />
          <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-indigo-200/20 blur-3D pointer-events-none select-none animate-pulse-slow" />
          <div className="absolute top-[400px] -left-[200px] w-[450px] h-[450px] rounded-full bg-violet-200/20 blur-3D pointer-events-none select-none animate-pulse" />
        </>
      )}

      {/* Primary Container Wrap */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 relative z-10">
        {/* Navigation / Header menu */}
        <header className="flex items-center justify-between border-b border-zinc-200/40 dark:border-zinc-800/40 pb-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-2xl text-white shadow-md shadow-emerald-500/20">
              <Languages size={24} />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl tracking-tight bg-linear-to-r from-zinc-900 via-zinc-800 to-emerald-900 dark:from-white dark:via-zinc-100 dark:to-emerald-300 bg-clip-text text-transparent">
                AuraTranslate
              </h1>
              <p className="text-xxs text-zinc-400 font-medium uppercase tracking-wider mt-0.5">
                Autonomous Speech & Nuance Translation AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-650 dark:text-zinc-300 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </header>

        {/* Master Application Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLS: ACTIVE TRANSLATION CARD & NUANCE EXTRAS */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lang Dropdown bar */}
            <LanguageSelector
              sourceLanguage={sourceLang}
              targetLanguage={targetLang}
              onSourceChange={setSourceLang}
              onTargetChange={setTargetLang}
              onSwap={handleSwapLanguages}
              disabledSwap={sourceLang === "auto"}
            />

            {/* Error prompt block */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl border border-red-200/50 bg-red-50/50 dark:border-red-950/50 dark:bg-red-950/20 text-red-700 dark:text-red-400 flex items-start gap-3.5"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold block mb-0.5">Translation failed</span>
                    <p>{error}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="ml-auto text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Visual Workspace: Textboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 glass-panel rounded-3xl p-6 md:p-8 border border-white/20 dark:border-white/5 shadow-2xl relative transition-all duration-300">
              {/* Box 1: Input text block */}
              <div className="flex flex-col min-h-[220px]">
                <div className="flex justify-between items-center mb-3.5">
                  <span className="text-xxs font-extrabold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest pl-1">
                    {sourceLang === "auto" ? "Detecting" : getLanguageName(sourceLang)}
                  </span>
                  {inputText && (
                    <button
                      id="clear-input-text-btn"
                      type="button"
                      onClick={() => {
                        setInputText("");
                        setTranslatedText("");
                        setTranslationData(null);
                        setError(null);
                      }}
                      className="p-1 px-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                      title="Clear text"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                <textarea
                  id="original-text-textarea"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value.slice(0, 2000));
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={`Write or paste anything to translate... (Press Enter)`}
                  rows={6}
                  className="w-full flex-1 bg-transparent border-0 resize-none font-sans text-sm md:text-base font-medium leading-relaxed text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-0 placeholder-zinc-400 dark:placeholder-zinc-650"
                  maxLength={2000}
                />

                <div className="flex justify-between items-center pt-4 border-t border-zinc-200/40 dark:border-zinc-800/60 mt-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      id="speak-original-btn"
                      type="button"
                      onClick={() =>
                        speakText(
                          inputText,
                          sourceLang === "auto" ? translationData?.detectedLanguage || "en" : sourceLang,
                          true
                        )
                      }
                      disabled={!inputText}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                        isSpeakingOriginal
                          ? "bg-red-500 text-white animate-pulse"
                          : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed"
                      }`}
                      title="Listen original text"
                    >
                      {isSpeakingOriginal ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    </button>
                    <span className="text-[10px] font-mono font-bold text-zinc-400 select-none">
                      {inputText.length} / 2000 chars
                    </span>
                  </div>

                  <button
                    id="translate-btn"
                    type="button"
                    onClick={() => executeTranslation()}
                    disabled={isLoading || !inputText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:bg-emerald-600/50 disabled:opacity-40 disabled:hover:bg-emerald-600/50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer group"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        Translating...
                      </>
                    ) : (
                      <>
                        Translate
                        <Send size={11} className="group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Box 2: Target translations output block */}
              <div className="flex flex-col min-h-[220px] border-t md:border-t-0 md:border-l border-zinc-200/40 dark:border-zinc-805 md:pl-8 pt-5 md:pt-0">
                <div className="flex justify-between items-center mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xxs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                      {getLanguageName(targetLang)}
                    </span>
                    {translationData?.detectedLanguage && sourceLang === "auto" && (
                      <span className="text-[10px] bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono font-semibold px-1.5 py-0.5 rounded-md">
                        Detected: {translationData.detectedLanguage}
                      </span>
                    )}
                  </div>

                  {translatedText && (
                    <button
                      id="star-current-translation-btn"
                      type="button"
                      onClick={() => translationData && toggleFavorite(translationData)}
                      className={`p-1.5 rounded-lg border dark:border-zinc-800 cursor-pointer transition-colors ${
                        isCurrentStarred
                          ? "border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-500"
                          : "border-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
                      }`}
                      title={isCurrentStarred ? "Remove Star" : "Star Translation"}
                    >
                      <Star size={13.5} className={isCurrentStarred ? "fill-amber-400" : ""} />
                    </button>
                  )}
                </div>

                {/* Display Output screen */}
                <div className="flex-1 w-full flex flex-col justify-between">
                  <div className="text-sm md:text-base font-normal leading-relaxed text-zinc-850 dark:text-zinc-100 select-all whitespace-pre-wrap flex-1 break-words">
                    {isLoading ? (
                      <div className="space-y-3 pt-2">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-11/12 animate-pulse" />
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4 animate-pulse" />
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-[85%] animate-pulse" />
                      </div>
                    ) : translatedText ? (
                      <span>{translatedText}</span>
                    ) : (
                      <span className="text-zinc-450 dark:text-zinc-600 block pt-2 text-sm">
                        Translation will appear here instantly...
                      </span>
                    )}
                  </div>

                  <div className="flex justify-end items-center gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 mt-3 shrink-0">
                    {translatedText && !isLoading && (
                      <>
                        <button
                          id="speak-translated-btn"
                          type="button"
                          onClick={() => speakText(translatedText, targetLang, false)}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                            isSpeakingTranslated
                              ? "bg-red-500 text-white animate-pulse"
                              : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300"
                          }`}
                          title="Listen translation accent pronuncer"
                        >
                          {isSpeakingTranslated ? <VolumeX size={15} /> : <Volume2 size={15} />}
                        </button>

                        <button
                          id="copy-to-clipboard-btn"
                          type="button"
                          onClick={() => handleCopyText(translatedText)}
                          className="p-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer transition-colors flex items-center gap-1.5"
                          title="Copy translation contents"
                        >
                          {copied ? (
                            <>
                              <Check size={15} className="text-emerald-500" />
                              <span className="text-xxs font-semibold text-emerald-500 uppercase tracking-widest hidden sm:inline">
                                Copied
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy size={15} />
                              <span className="text-xxs font-semibold uppercase tracking-widest hidden sm:inline">
                                Copy
                              </span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Nuance Extra accordion panels package */}
            {translationData && !isLoading && <NuanceGuide data={translationData} />}
          </div>

          {/* RIGHT SIDEBAR (1 OF 3 COLS): VOICE ASSISTANT DICATOR, PRESETS AND HISTORY LOGS */}
          <div className="space-y-6">
            {/* Interactive Voice Assistant Dictator */}
            <VoiceAssistant
              onVoiceInput={handleVoiceInput}
              activeSourceLang={sourceLang}
            />

            {/* Travelling presets card */}
            <QuickPresets onSelectPhrase={handleSelectPreset} />

            {/* History and Starred favorite collections panel */}
            <TranslationHistory
              history={history}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onDeleteHistory={deleteHistoryItem}
              onClearHistory={clearAllHistory}
              onSelectPhrase={handleSelectPreset}
              onSpeak={(text, locale) => speakText(text, locale || "en-US", false)}
            />
          </div>
        </main>
      </div>

      <footer className="border-t border-zinc-200/40 dark:border-zinc-800/40 mt-16 py-8 text-center text-xs text-zinc-500 dark:text-zinc-500 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 font-display text-zinc-700 dark:text-zinc-300">
            <Languages size={14} className="text-emerald-500" />
            <span className="font-semibold select-none">AuraTranslate Suite &copy; 2026. All rights resolved.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer select-none">
              Client TTS Synthesis Voice Active
            </span>
            <span>&bull;</span>
            <span className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer select-none">
              Gemini Translation Proxy
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
