"use client";

import { motion } from "framer-motion";
import type { CardData } from "@/data/cards";

interface FlipCardProps {
  card: CardData;
  isFlipped: boolean;
  onFlip: () => void;
}

const partColors = {
  sdlc: {
    gradient: "from-indigo-600 to-violet-700",
    accent: "bg-indigo-500/20",
    border: "border-indigo-500/30",
    badge: "bg-indigo-500/30 text-indigo-200",
    glow: "shadow-indigo-500/20",
  },
  api: {
    gradient: "from-emerald-600 to-teal-700",
    accent: "bg-emerald-500/20",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/30 text-emerald-200",
    glow: "shadow-emerald-500/20",
  },
};

export default function FlipCard({ card, isFlipped, onFlip }: FlipCardProps) {
  const colors = partColors[card.part];

  return (
    <div className="w-full h-full" style={{ perspective: "1200px" }}>
      <motion.div
        className="relative w-full h-full cursor-pointer"
        onClick={onFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-2xl border ${colors.border} bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl overflow-hidden`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className={`h-1.5 w-full bg-gradient-to-r ${colors.gradient}`}
          />
          <div className="p-6 md:p-8 h-full flex flex-col overflow-y-auto">
            <div className="flex items-center gap-3 mb-4 shrink-0">
              <span
                className={`text-xs font-mono px-2.5 py-1 rounded-full ${colors.badge}`}
              >
                {card.section}
              </span>
              <span
                className={`text-xs font-mono px-2.5 py-1 rounded-full ${colors.badge}`}
              >
                {card.part === "sdlc" ? "SDLC" : "API Lifecycle"}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-5 shrink-0">
              {card.title}
            </h3>
            <div className="space-y-3 text-sm md:text-[0.9rem] leading-relaxed text-gray-300 flex-1 min-h-0">
              {card.frontContent.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-500 text-center shrink-0">
              Click to see decision questions
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-2xl border ${colors.border} bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl overflow-hidden`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className={`h-1.5 w-full bg-gradient-to-r ${colors.gradient}`}
          />
          <div className="p-6 md:p-8 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-xs font-mono px-2.5 py-1 rounded-full ${colors.badge}`}
              >
                {card.section}
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/30 text-amber-200">
                Decision Questions
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
              {card.title}
            </h3>

            <div className="flex-1 flex flex-col justify-center">
              <div className="space-y-6">
                {card.backQuestions.map((question, i) => (
                  <div key={i} className={`p-5 rounded-xl ${colors.accent} border ${colors.border}`}>
                    <div className="flex items-start gap-4">
                      <span
                        className={`shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${colors.gradient} flex items-center justify-center text-white font-bold text-sm`}
                      >
                        {i + 1}
                      </span>
                      <p className="text-base md:text-lg text-white leading-relaxed font-medium">
                        {question}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-500 text-center shrink-0">
              Click to return to content
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
