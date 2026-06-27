import React from "react";
import { Language, SUPPORTED_LANGUAGES } from "../types";
import { Languages, ArrowLeftRight } from "lucide-react";

interface LanguageSelectorProps {
  sourceLanguage: string;
  targetLanguage: string;
  onSourceChange: (code: string) => void;
  onTargetChange: (code: string) => void;
  onSwap: () => void;
  disabledSwap?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLanguage,
  targetLanguage,
  onSourceChange,
  onTargetChange,
  onSwap,
  disabledSwap = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 glass-panel p-5 rounded-3xl shadow-lg border border-white/20 dark:border-white/5 transition-all duration-300">
      {/* Source Language */}
      <div className="flex-1 w-full relative group">
        <label className="block text-xxs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 ml-1">
          Source Language
        </label>
        <div className="flex items-center bg-white/70 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl px-4 py-3 shadow-sm hover:border-emerald-500/50 dark:hover:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/35 focus-within:border-emerald-500 transition-all duration-300">
          <span className="text-2xl mr-3 drop-shadow-xs filter group-hover:scale-110 transition-transform duration-300 select-none">
            {sourceLanguage === "auto"
              ? "🔍"
              : SUPPORTED_LANGUAGES.find((l) => l.code === sourceLanguage)?.flag || "🏳️"}
          </span>
          <div className="flex-1">
            <select
              id="source-language-select"
              value={sourceLanguage}
              onChange={(e) => onSourceChange(e.target.value)}
              className="w-full bg-transparent border-0 text-zinc-900 dark:text-zinc-50 font-bold text-sm focus:outline-none focus:ring-0 cursor-pointer py-0.5"
            >
              <option value="auto" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
                Auto-Detect Language
              </option>
              {SUPPORTED_LANGUAGES.filter((l) => l.code !== targetLanguage).map((lang) => (
                <option
                  key={lang.code}
                  value={lang.code}
                  className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans"
                >
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <button
        id="swap-languages-btn"
        type="button"
        onClick={onSwap}
        disabled={disabledSwap}
        className={`mt-6 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 text-zinc-750 dark:text-zinc-200 transition-all duration-300 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 hover:scale-110 active:scale-90 hover:shadow-md hover:shadow-emerald-500/10 flex items-center justify-center ${
          disabledSwap ? "opacity-30 cursor-not-allowed hover:scale-100 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-400" : "cursor-pointer"
        }`}
        title="Swap languages"
      >
        <ArrowLeftRight size={18} className="transform rotate-90 md:rotate-0 transition-transform duration-300 group-hover:rotate-180" />
      </button>

      {/* Target Language */}
      <div className="flex-1 w-full relative group">
        <label className="block text-xxs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 ml-1">
          Target Language
        </label>
        <div className="flex items-center bg-white/70 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl px-4 py-3 shadow-sm hover:border-emerald-500/50 dark:hover:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/35 focus-within:border-emerald-500 transition-all duration-300">
          <span className="text-2xl mr-3 drop-shadow-xs filter group-hover:scale-110 transition-transform duration-300 select-none">
            {SUPPORTED_LANGUAGES.find((l) => l.code === targetLanguage)?.flag || "🏳️"}
          </span>
          <div className="flex-1">
            <select
              id="target-language-select"
              value={targetLanguage}
              onChange={(e) => onTargetChange(e.target.value)}
              className="w-full bg-transparent border-0 text-zinc-900 dark:text-zinc-50 font-bold text-sm focus:outline-none focus:ring-0 cursor-pointer py-0.5"
            >
              {SUPPORTED_LANGUAGES.filter((l) => l.code !== sourceLanguage).map((lang) => (
                <option
                  key={lang.code}
                  value={lang.code}
                  className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans"
                >
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
