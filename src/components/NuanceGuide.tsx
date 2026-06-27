import React from "react";
import { TranslationResponse } from "../types";
import { BookOpen, HelpCircle, RefreshCw, MessageSquareCode, Languages } from "lucide-react";
import { motion } from "motion/react";

interface NuanceGuideProps {
  data: TranslationResponse;
}

export const NuanceGuide: React.FC<NuanceGuideProps> = ({ data }) => {
  const { pronunciation, partsOfSpeech, alternatives, examples, nuanceNote } = data;

  const hasExtraContent =
    pronunciation || partsOfSpeech || alternatives?.length > 0 || examples?.length > 0 || nuanceNote;

  if (!hasExtraContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="mt-6 glass-panel rounded-3xl p-6 border border-white/20 dark:border-white/5 shadow-xl space-y-6 transition-all duration-300"
    >
      <div className="flex items-center gap-2.5 border-b border-zinc-200/40 dark:border-zinc-800/60 pb-3.5">
        <BookOpen className="text-emerald-600 dark:text-emerald-400" size={18} />
        <h3 className="font-sans text-xs font-extrabold text-zinc-650 dark:text-zinc-350 uppercase tracking-widest pl-0.5">
          Linguistic Insights
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Pronunciation, Grammatical category & Politeness guide */}
        <div className="space-y-4.5">
          {/* Pronunciation & grammar header */}
          {(pronunciation || partsOfSpeech) && (
            <div className="p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/40">
              {pronunciation && (
                <div className="mb-2.5">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                    Phonetic Pronunciation
                  </span>
                  <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                    {pronunciation}
                  </span>
                </div>
              )}
              {partsOfSpeech && (
                <div>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                    Grammatical Category
                  </span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                    {partsOfSpeech}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Social and cultural Nuance note */}
          {nuanceNote && (
            <div className="p-4 rounded-xl bg-amber-50/10 dark:bg-amber-950/10 border border-amber-200/20 dark:border-amber-500/10">
              <div className="flex gap-2 items-start">
                <HelpCircle className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" size={16} />
                <div>
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                    Cultural Note & Politeness Form
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-350 mt-1 leading-relaxed">
                    {nuanceNote}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Alternative phrasing translations */}
        <div className="space-y-4">
          {alternatives && alternatives.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <RefreshCw size={12} className="text-emerald-400 animate-spin-slow" />
                Alternative Phrasings
              </span>
              <div className="space-y-2">
                {alternatives.map((alt, i) => (
                  <div
                    key={i}
                    className="px-3.5 py-2 rounded-lg bg-zinc-100/40 dark:bg-zinc-800/20 border border-zinc-205/30 dark:border-zinc-800/40 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    {alt}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Examples section span full width */}
      {examples && examples.length > 0 && (
        <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-5">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <MessageSquareCode size={14} className="text-emerald-500" />
            Contextual Usage Examples
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {examples.map((ex, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-zinc-50/75 dark:bg-zinc-900/60 border border-zinc-200/30 dark:border-zinc-850 text-xs hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all shadow-2xs"
              >
                <div className="font-semibold text-zinc-800 dark:text-zinc-250 mb-1 flex items-start gap-1.5">
                  <span className="font-mono text-xxs px-1.5 py-0.5 rounded-md bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                    Orig
                  </span>
                  <q className="not-italic block flex-1">{ex.original}</q>
                </div>
                <div className="text-zinc-650 dark:text-zinc-400 pl-0.5 border-l-2 border-emerald-500/40 mt-1.5 flex items-start gap-1.5">
                  <span className="font-mono text-xxs px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/55 text-emerald-500 dark:text-emerald-400">
                    Trans
                  </span>
                  <p className="flex-1 italic">{ex.translated}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
