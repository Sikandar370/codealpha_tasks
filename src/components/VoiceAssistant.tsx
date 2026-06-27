import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Play, Square, Settings, Radio } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface VoiceAssistantProps {
  onVoiceInput: (text: string) => void;
  activeSourceLang: string;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onVoiceInput, activeSourceLang }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [recognitionLang, setRecognitionLang] = useState(activeSourceLang === "auto" ? "en" : activeSourceLang);
  const [soundBars, setSoundBars] = useState<number[]>([10, 10, 10, 10, 10]);

  const recognitionRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);

  // Synchronize listening language when source language changes on main screen
  useEffect(() => {
    if (activeSourceLang !== "auto") {
      setRecognitionLang(activeSourceLang);
    }
  }, [activeSourceLang]);

  // Handle active visualization animation while recording
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setSoundBars(Array.from({ length: 8 }, () => Math.floor(Math.random() * 32) + 8));
      }, 90);
      return () => clearInterval(interval);
    } else {
      setSoundBars([10, 10, 10, 10, 10, 10, 10, 10]);
    }
  }, [isListening]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, []);

  const getLanguageSpeechLocale = (code: string) => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.speechLocale || "en-US";
  };

  const startListening = () => {
    setError(null);
    setTranscript("");

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not fully supported in this browser. Try using Google Chrome.");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = getLanguageSpeechLocale(recognitionLang);

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const activeText = finalTranscript || interimTranscript;
        setTranscript(activeText);
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "not-allowed") {
          setError("Microphone permission denied. Check your browser security permissions.");
        } else if (event.error === "no-speech") {
          setError("No speech was detected. Please try speaking closely to your mic.");
        } else {
          setError(`Voice recognition issue: ${event.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err: any) {
      setError(err.message || "Could not spin up the voice client.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
    }
    setIsListening(false);
    if (transcript.trim()) {
      onVoiceInput(transcript.trim());
    }
  };

  const triggerSearchInput = () => {
    if (transcript.trim()) {
      onVoiceInput(transcript.trim());
      setTranscript("");
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/20 dark:border-white/5 shadow-xl space-y-5 transition-all duration-300">
      {/* Title block */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200/40 dark:border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Radio size={16} className={`text-emerald-600 dark:text-emerald-400 ${isListening ? "animate-pulse" : ""}`} />
            {isListening && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            )}
          </div>
          <h3 className="text-[11px] font-extrabold text-zinc-650 dark:text-zinc-350 uppercase tracking-widest pl-0.5">
            Voice Companion
          </h3>
        </div>

        {/* Listen language select dropdown */}
        <div className="relative">
          <select
            id="voice-recognize-lang-select"
            value={recognitionLang}
            onChange={(e) => setRecognitionLang(e.target.value)}
            disabled={isListening}
            className="text-xxs bg-white/80 dark:bg-zinc-900/90 px-2.5 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-805 font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer disabled:opacity-50 transition-colors"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} Speak {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Voice active content viewport */}
      <div className="bg-zinc-50/60 dark:bg-zinc-950/40 border border-zinc-200/30 dark:border-zinc-850/50 p-5 rounded-2xl min-h-[110px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 group">
        {isListening && (
          <div className="absolute inset-0 bg-emerald-600/[0.02] pointer-events-none select-none animate-pulse-slow" />
        )}

        {/* Live speech feedback text */}
        <div className="text-xs md:text-sm font-medium text-zinc-850 dark:text-zinc-200 leading-relaxed break-words z-10">
          {transcript ? (
            <span className="animate-fade-in italic text-emerald-600 dark:text-emerald-350 select-all font-semibold">"{transcript}"</span>
          ) : isListening ? (
            <span className="text-emerald-500/80 dark:text-emerald-400/80 block animate-pulse font-semibold">
              Live dictation active... Speak now.
            </span>
          ) : (
            <span className="text-zinc-400 dark:text-zinc-500 block text-center py-4 text-xs font-normal">
              Activate hands-free speech assistant to dictate translation instantly.
            </span>
          )}
        </div>

        {/* Animated active wave sound indicators */}
        <div className="flex items-end justify-center gap-1 h-8 mt-5 select-none pointer-events-none">
          {soundBars.map((height, i) => (
            <motion.div
              key={i}
              animate={{ height }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              style={{ width: "3.5px" }}
              className={`rounded-full bg-linear-to-t ${
                isListening
                  ? "from-emerald-600 to-teal-400 dark:from-emerald-500 dark:to-teal-300"
                  : "from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modern Compact Micro Touch Triggers */}
      <div className="flex flex-col items-center gap-4">
        {isListening ? (
          <button
            id="stop-voice-assistant-btn"
            type="button"
            onClick={stopListening}
            className="w-full py-3.5 rounded-2xl bg-linear-to-r from-red-500 to-rose-600 hover:from-red-650 hover:to-rose-700 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-500/15"
          >
            <MicOff size={15} className="animate-bounce" />
            Finish & Translate Text
          </button>
        ) : (
          <div className="relative w-full flex justify-center py-3">
            {/* Ambient pulsed waves behind mic */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="w-16 h-16 rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 opacity-75 animate-ping absolute" />
              <span className="w-24 h-24 rounded-full bg-teal-500/10 dark:bg-teal-500/[0.03] animate-pulse absolute" />
            </div>

            <button
              id="start-voice-assistant-btn"
              type="button"
              onClick={startListening}
              className="relative p-6 rounded-full bg-linear-to-tr from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 flex flex-col items-center justify-center group"
              title="Click to dictate speech"
            >
              <Mic size={28} className="group-hover:rotate-6 transition-transform duration-300" />
            </button>
          </div>
        )}

        {transcript && !isListening && (
          <button
            id="apply-voice-transcript-btn"
            type="button"
            onClick={triggerSearchInput}
            className="w-full py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-850/60 bg-emerald-50/50 dark:bg-emerald-955/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-950/20"
          >
            Use Dictated Text
          </button>
        )}
      </div>

      {/* Error report */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-955/10 border border-amber-200/40 dark:border-amber-900/30 text-amber-700 dark:text-amber-450 text-[11px] flex gap-2 items-start"
          >
            <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-500" />
            <span className="leading-relaxed font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
