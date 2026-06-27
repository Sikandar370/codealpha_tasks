import React from "react";
import { motion } from "motion/react";

export const TechBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Dense Dark Green Bio-Quantum Base Layer */}
      <div className="absolute inset-0 bg-[#010302] bg-radial-[circle_at_center,rgba(4,38,15,0.3)_0%,rgba(0,1,0,1)_100%]" />

      {/* Futuristic Bio-Radar Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 197, 94, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 197, 94, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Glowing Bio-Cybernetic Aperture (Main Center-Right Element inspired by uploaded mockup) */}
      <div className="absolute -top-[50px] -right-[150px] md:right-[-100px] lg:right-[0px] w-full max-w-[750px] aspect-square opacity-60 md:opacity-85 mix-blend-screen scale-95 md:scale-105">
        <svg viewBox="0 0 800 800" className="w-full h-full filter drop-shadow-[0_0_60px_rgba(34,197,94,0.35)]">
          <defs>
            {/* Color Gradients */}
            <linearGradient id="emeraldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#052e16" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#15803d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.2" />
            </linearGradient>
            
            <linearGradient id="cyberGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#22c55e" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#14532d" stopOpacity="0.2" />
            </linearGradient>

            <radialGradient id="centerCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="15%" stopColor="#86efac" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#22c55e" stopOpacity="0.6" />
              <stop offset="80%" stopColor="#15803d" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#022c22" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="ringHalos" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#16a34a" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central Pulsating Energy Glow */}
          <motion.circle 
            cx="400" 
            cy="400" 
            r="170" 
            fill="url(#ringHalos)"
            animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.7, 0.9, 0.7] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />

          {/* Concentric Bio-Radar Rings */}
          <circle cx="400" cy="400" r="320" fill="none" stroke="#22c55e" strokeWidth="0.75" strokeDasharray="3 9" opacity="0.45" />
          <circle cx="400" cy="400" r="280" fill="none" stroke="#16a34a" strokeWidth="1.2" strokeDasharray="180 90" opacity="0.35" />
          
          <motion.circle 
            cx="400" 
            cy="400" 
            r="230" 
            fill="none" 
            stroke="#4ade80" 
            strokeWidth="0.5" 
            opacity="0.5"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          />

          <motion.circle 
            cx="400" 
            cy="400" 
            r="190" 
            fill="none" 
            stroke="#22c55e" 
            strokeWidth="1.5" 
            strokeDasharray="6 30 180 15" 
            opacity="0.6"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          />

          <circle cx="400" cy="400" r="140" fill="none" stroke="#86efac" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
          <circle cx="400" cy="400" r="90" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="45 15" opacity="0.5" />

          {/* Segmented Outer Aperture Shards (Arranged in a dynamic ring like the image mockup) */}
          <motion.g 
            className="origin-[400px_400px]"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 65, ease: "linear" }}
          >
            {[...Array(16)].map((_, i) => {
              const angle = (i * 360) / 16;
              const rad = (angle * Math.PI) / 180;
              const r1 = 205;
              const r2 = 220;
              const x1 = 400 + r1 * Math.cos(rad);
              const y1 = 400 + r1 * Math.sin(rad);
              const x2 = 400 + r2 * Math.cos(rad);
              const y2 = 400 + r2 * Math.sin(rad);
              const styleVariant = i % 3 === 0;

              return (
                <g key={i} opacity={styleVariant ? 0.9 : 0.45}>
                  {/* Crystalline shard triangle anchors */}
                  <polygon
                    points={`${x1},${y1} ${x2},${y2} ${400 + (r2 - 5) * Math.cos(rad + 0.05)},${400 + (r2 - 5) * Math.sin(rad + 0.05)}`}
                    fill={styleVariant ? "#86efac" : "#22c55e"}
                  />
                  {/* Micro link lines */}
                  <line x1={x1} y1={y1} x2="400" y2="400" stroke="#15803d" strokeWidth="0.25" opacity="0.2" />
                </g>
              );
            })}
          </motion.g>

          <motion.g 
            className="origin-[400px_400px]"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
          >
            {[...Array(24)].map((_, i) => {
              const angle = (i * 360) / 24 + 10;
              const rad = (angle * Math.PI) / 180;
              const r = 260;
              const x = 400 + r * Math.cos(rad);
              const y = 400 + r * Math.sin(rad);
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={i % 4 === 0 ? "2.5" : "1"} fill="#4ade80" opacity="0.75" />
                  {i % 4 === 0 && (
                    <circle cx={x} cy={y} r="6" fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.4" />
                  )}
                </g>
              );
            })}
          </motion.g>

          {/* Finer details and Star Crosshair Compass Markers */}
          <g opacity="0.6">
            <line x1="400" y1="50" x2="400" y2="750" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="5 15" />
            <line x1="50" y1="400" x2="750" y2="400" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="5 15" />
            <path d="M 400 120 L 400 140 M 400 660 L 400 680 M 120 400 L 140 400 M 660 400 L 680 400" stroke="#4ade80" strokeWidth="1.5" />
          </g>

          {/* Central Brilliant Radiant Core matching exactly the bright blinding white core */}
          <circle cx="400" cy="400" r="50" fill="url(#centerCore)" />
          <circle cx="400" cy="400" r="22" fill="#ffffff" />
          <circle cx="400" cy="400" r="10" fill="#ffffff" className="animate-ping" style={{ animationDuration: '3s' }} />
        </svg>
      </div>

      {/* Bottom Left Cyber-Quantum Bio Radar (Simulated reflection viewport) */}
      <div className="absolute bottom-[-180px] left-[-150px] w-full max-w-[550px] aspect-square opacity-30 md:opacity-60 mix-blend-screen">
        <svg viewBox="0 0 800 800" className="w-full h-full filter drop-shadow-[0_0_60px_rgba(21,128,61,0.25)]">
          {/* Symmetrical Mini Bio Quantum Core */}
          <circle cx="400" cy="400" r="260" fill="none" stroke="#16a34a" strokeWidth="0.5" strokeDasharray="8 6" opacity="0.3" />
          <motion.circle 
            cx="400" 
            cy="400" 
            r="190" 
            fill="none" 
            stroke="#22c55e" 
            strokeWidth="1.5" 
            strokeDasharray="40 180" 
            animate={{ rotate: 180 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          />
          <circle cx="400" cy="400" r="110" fill="none" stroke="#4ade80" strokeWidth="0.75" />
          <circle cx="400" cy="400" r="30" fill="url(#centerCore)" opacity="0.8" />
          <circle cx="400" cy="400" r="8" fill="#ffffff" />
        </svg>
      </div>

      {/* Cybernetic Diamond Grid Scatter Points like background of original image */}
      <div className="absolute bottom-10 right-10 w-[240px] h-[240px] opacity-[0.18]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-green-500">
          <pattern id="emeraldDiamondPattern" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 6 0 L 12 6 L 6 12 L 0 6 Z" fill="currentColor" fillOpacity="0.08" />
            <circle cx="6" cy="6" r="0.75" fill="#4ade80" fillOpacity="0.35" />
          </pattern>
          <rect width="100" height="100" fill="url(#emeraldDiamondPattern)" />
        </svg>
      </div>

      <div className="absolute top-20 left-10 w-[180px] h-[180px] opacity-[0.12]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-500">
          <rect width="100" height="100" fill="url(#emeraldDiamondPattern)" />
        </svg>
      </div>
    </div>
  );
};
