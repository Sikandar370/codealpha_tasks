import React, { useState } from "react";
import { PRESET_PHRASES } from "../types";
import { Sparkles } from "lucide-react";

interface QuickPresetsProps {
  onSelectPhrase: (text: string) => void;
}

export const QuickPresets: React.FC<QuickPresetsProps> = ({ onSelectPhrase }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Greetings");

  // Get unique categories
  const categories = Array.from(new Set(PRESET_PHRASES.map((item) => item.category)));

  // Filter phrases based on selected category
  const filteredPhrases = PRESET_PHRASES.filter((item) => item.category === selectedCategory);

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/20 dark:border-white/5 shadow-xl transition-all duration-300">
      <div className="flex items-center gap-2.5 mb-4">
        <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-[11px] font-extrabold text-zinc-650 dark:text-zinc-350 uppercase tracking-widest pl-0.5">
          Travel Essentials
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-zinc-200/40 dark:border-zinc-800/60 pb-3.5 mb-4 scrollbar-none overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            id={`preset-category-${category.toLowerCase()}-tab`}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 ${
              selectedCategory === category
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/10 scale-102"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-900"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Phrase Chips */}
      <div className="grid grid-cols-1 gap-2.5">
        {filteredPhrases.map((item, index) => (
          <button
            key={index}
            id={`preset-phrase-${index}`}
            type="button"
            onClick={() => onSelectPhrase(item.text)}
            className="text-left px-4 py-3 rounded-2xl text-xs font-semibold text-zinc-750 dark:text-zinc-200 bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/80 hover:border-emerald-500/45 dark:hover:border-emerald-500/45 hover:bg-emerald-50/20 dark:hover:bg-emerald-500/5 cursor-pointer transition-all duration-200 hover:translate-x-1 active:translate-x-0 group"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="truncate">{item.text}</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono scale-90 group-hover:text-emerald-500 transition-colors">👉</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
