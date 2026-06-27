import React, { useState } from "react";
import { HistoryItem, FavoriteItem, SUPPORTED_LANGUAGES } from "../types";
import { Trash2, Star, Volume2, ArrowRight, History, Calendar, Bookmark, FolderHeart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TranslationHistoryProps {
  history: HistoryItem[];
  favorites: FavoriteItem[];
  onToggleFavorite: (item: HistoryItem | FavoriteItem) => void;
  onDeleteHistory: (id: string) => void;
  onClearHistory: () => void;
  onSelectPhrase: (text: string, source: string, target: string) => void;
  onSpeak: (text: string, locale?: string) => void;
}

export const TranslationHistory: React.FC<TranslationHistoryProps> = ({
  history,
  favorites,
  onToggleFavorite,
  onDeleteHistory,
  onClearHistory,
  onSelectPhrase,
  onSpeak,
}) => {
  const [activeTab, setActiveTab] = useState<"recent" | "starred">("recent");

  const getLanguageFlag = (code: string) => {
    if (code === "auto") return "🔍";
    return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.flag || "🏳️";
  };

  const getLanguageName = (code: string) => {
    if (code === "auto") return "Auto-Detect";
    return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code;
  };

  const getSpeechLocale = (code: string) => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.speechLocale;
  };

  const isFavorite = (text: string) => {
    return favorites.some((f) => f.originalText.trim().toLowerCase() === text.trim().toLowerCase());
  };

  return (
    <div className="glass-panel rounded-3xl border border-white/20 dark:border-white/5 shadow-xl transition-all duration-300">
      {/* Tab select bar */}
      <div className="flex items-center justify-between border-b border-zinc-200/40 dark:border-zinc-800/60 p-4">
        <div className="flex gap-1.5 bg-zinc-100/80 dark:bg-zinc-900/80 p-1 rounded-2xl">
          <button
            id="history-recent-tab"
            type="button"
            onClick={() => setActiveTab("recent")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 ${
              activeTab === "recent"
                ? "bg-white dark:bg-zinc-800 shadow-md text-emerald-600 dark:text-emerald-400 scale-102"
                : "text-zinc-550 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <History size={14} />
            Recent ({history.length})
          </button>
          <button
            id="history-starred-tab"
            type="button"
            onClick={() => setActiveTab("starred")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 ${
              activeTab === "starred"
                ? "bg-white dark:bg-zinc-800 shadow-md text-emerald-600 dark:text-emerald-400 scale-102"
                : "text-zinc-550 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <Star size={14} className={favorites.length > 0 ? "fill-amber-400 text-amber-500" : ""} />
            Starred ({favorites.length})
          </button>
        </div>

        {activeTab === "recent" && history.length > 0 && (
          <button
            id="clear-all-history-btn"
            type="button"
            onClick={onClearHistory}
            className="text-xs font-bold text-red-500 hover:text-red-650 transition-colors cursor-pointer flex items-center gap-1 hover:underline"
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>

      {/* List content Container */}
      <div className="p-4 max-h-[380px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {activeTab === "recent" ? (
            history.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center text-zinc-500 dark:text-zinc-400 flex flex-col items-center gap-2"
              >
                <History className="text-zinc-300 dark:text-zinc-700" size={32} />
                <p className="text-sm font-bold">No translation history.</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">Your translation events list will populate here.</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group relative p-3.5 rounded-2xl bg-white/75 dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-800/80 hover:border-emerald-500/30 hover:shadow-md hover:shadow-zinc-200/5 dark:hover:shadow-none transition-all flex items-start gap-3"
                  >
                    {/* Flags */}
                    <div className="flex flex-col items-center text-xs text-zinc-400 font-mono mt-0.5 select-none shrink-0 border border-zinc-200/50 dark:border-zinc-800 p-1.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-950">
                      <span>{getLanguageFlag(item.sourceLanguage)}</span>
                      <ArrowRight size={10} className="my-1.5 text-zinc-300 dark:text-zinc-700" />
                      <span>{getLanguageFlag(item.targetLanguage)}</span>
                    </div>

                    {/* Text block & reinsert trigger */}
                    <div className="flex-1 min-w-0 pr-18">
                      <div
                        onClick={() => onSelectPhrase(item.originalText, item.sourceLanguage, item.targetLanguage)}
                        className="text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer break-words flex items-center gap-1.5"
                        title="Click to translate again"
                      >
                        <span className="truncate max-w-full block">{item.originalText}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-1 italic break-words leading-relaxed">
                        {item.translatedText}
                      </p>

                      {/* Accent details if detected */}
                      {item.detectedLanguage && item.sourceLanguage === "auto" && (
                        <span className="inline-block mt-2 font-mono text-[9px] font-extrabold tracking-wide bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md text-zinc-500 dark:text-zinc-450">
                          Detected: {item.detectedLanguage}
                        </span>
                      )}
                    </div>

                    {/* Hover actions panel */}
                    <div className="absolute right-3 top-3 flex items-center gap-1 opacity-90 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {/* Audio trigger */}
                      <button
                        id={`history-speak-btn-${item.id}`}
                        type="button"
                        onClick={() => onSpeak(item.translatedText, getSpeechLocale(item.targetLanguage))}
                        className="p-1 px-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-zinc-650 dark:text-zinc-305 hover:bg-emerald-100 hover:border-emerald-200 hover:text-emerald-600 dark:hover:bg-emerald-950/25 transition-all cursor-pointer"
                        title="Listen translation"
                      >
                        <Volume2 size={12} />
                      </button>

                      {/* Favorite/Bookmark trigger */}
                      <button
                        id={`history-favorite-btn-${item.id}`}
                        type="button"
                        onClick={() => onToggleFavorite(item)}
                        className={`p-1 px-1.5 rounded-lg border bg-white dark:bg-zinc-900 transition-all cursor-pointer ${
                          isFavorite(item.originalText)
                            ? "border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-500"
                            : "border-zinc-200/50 dark:border-zinc-850 text-zinc-650 dark:text-zinc-305 hover:text-amber-500"
                        }`}
                        title="Bookmark phrase"
                      >
                        <Star size={12} className={isFavorite(item.originalText) ? "fill-amber-400" : ""} />
                      </button>

                      {/* Delete History trigger */}
                      <button
                        id={`history-delete-btn-${item.id}`}
                        type="button"
                        onClick={() => onDeleteHistory(item.id)}
                        className="p-1 px-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-zinc-400 hover:text-red-500 hover:border-red-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                        title="Delete from history"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center text-zinc-500 dark:text-zinc-400 flex flex-col items-center gap-2"
            >
              <Bookmark className="text-zinc-300 dark:text-zinc-700" size={32} />
              <p className="text-sm font-bold">No starred phrases.</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Favorite translation results to pin them here for quick offline or travel reference.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {favorites.map((item) => (
                <motion.div
                  key={item.id}
                  layoutId={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="group relative p-3.5 rounded-2xl bg-white/75 dark:bg-zinc-900/60 border border-amber-200/20 dark:border-amber-500/10 hover:shadow-md transition-all flex items-start gap-3"
                >
                  {/* Flags */}
                  <div className="flex flex-col items-center text-xs text-zinc-400 font-mono mt-0.5 select-none shrink-0 border border-amber-205/20 dark:border-amber-500/10 p-1.5 rounded-xl bg-amber-50/20 dark:bg-amber-950/10 text-amber-500">
                    <span>{getLanguageFlag(item.sourceLanguage)}</span>
                    <ArrowRight size={10} className="my-1.5 text-zinc-300 dark:text-zinc-700" />
                    <span>{getLanguageFlag(item.targetLanguage)}</span>
                  </div>

                  {/* Text block and trigger */}
                  <div className="flex-1 min-w-0 pr-12">
                    <div
                      onClick={() => onSelectPhrase(item.originalText, item.sourceLanguage, item.targetLanguage)}
                      className="text-xs font-bold text-zinc-800 dark:text-zinc-250 hover:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer break-words"
                      title="Translate phrase again"
                    >
                      {item.originalText}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-1 italic break-words leading-relaxed">
                      {item.translatedText}
                    </p>
                  </div>

                  {/* Right side floating triggers */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5">
                    {/* Speak trigger */}
                    <button
                      id={`starred-speak-btn-${item.id}`}
                      type="button"
                      onClick={() => onSpeak(item.translatedText, getSpeechLocale(item.targetLanguage))}
                      className="p-1 px-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-zinc-650 dark:text-zinc-305 hover:bg-emerald-100 hover:text-emerald-650 transition-all cursor-pointer"
                      title="Speak phrase"
                    >
                      <Volume2 size={12} />
                    </button>

                    {/* Un-Bookmark trigger */}
                    <button
                      id={`starred-unfavorite-btn-${item.id}`}
                      type="button"
                      onClick={() => onToggleFavorite({ ...item } as any)}
                      className="p-1 px-1.5 rounded-lg border border-amber-100 bg-amber-50 dark:bg-amber-955/20 text-amber-500 hover:text-zinc-400 transition-all cursor-pointer"
                      title="Unstar phrase"
                    >
                      <Star size={12} className="fill-amber-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
