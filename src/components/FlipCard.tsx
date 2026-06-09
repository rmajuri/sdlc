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
    ctaText: "text-indigo-300",
    ctaBg: "bg-indigo-500/10 hover:bg-indigo-500/20",
    ctaBorder: "border-indigo-500/30",
    ctaFade: "from-transparent via-gray-950/80 to-gray-950",
  },
  api: {
    gradient: "from-emerald-600 to-teal-700",
    accent: "bg-emerald-500/20",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/30 text-emerald-200",
    glow: "shadow-emerald-500/20",
    ctaText: "text-emerald-300",
    ctaBg: "bg-emerald-500/10 hover:bg-emerald-500/20",
    ctaBorder: "border-emerald-500/30",
    ctaFade: "from-transparent via-gray-950/80 to-gray-950",
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
          className={`absolute inset-0 rounded-2xl border ${colors.border} bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl overflow-hidden flex flex-col`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className={`h-1.5 w-full bg-gradient-to-r ${colors.gradient} shrink-0`}
          />
          <div className="p-6 md:p-8 flex flex-col min-h-0 flex-1">
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
            <div className="space-y-3 text-sm md:text-[0.9rem] leading-relaxed text-gray-300 flex-1 overflow-y-auto min-h-0 pb-4">
              {card.frontContent.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Fade overlay above footer */}
          <div
            className={`pointer-events-none h-12 bg-gradient-to-b ${colors.ctaFade} shrink-0 -mt-12 relative z-10`}
          />

          {/* Sticky CTA footer */}
          <div className="shrink-0 px-6 md:px-8 pb-5 pt-1 relative z-10 bg-gray-950">
            <div
              className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border ${colors.ctaBorder} ${colors.ctaBg} transition-all duration-200 animate-[subtle-pulse_3s_ease-in-out_infinite]`}
            >
              <svg
                className={`w-4.5 h-4.5 ${colors.ctaText}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                />
              </svg>
              <span
                className={`text-sm font-semibold ${colors.ctaText}`}
              >
                Click to see decision questions
              </span>
              <svg
                className={`w-4 h-4 ${colors.ctaText}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-2xl border ${colors.border} bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl overflow-hidden flex flex-col`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className={`h-1.5 w-full bg-gradient-to-r ${colors.gradient} shrink-0`}
          />
          <div className="p-6 md:p-8 flex flex-col flex-1">
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
                  <div
                    key={i}
                    className={`p-5 rounded-xl ${colors.accent} border ${colors.border}`}
                  >
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
          </div>

          {/* Back CTA footer */}
          <div className="shrink-0 px-6 md:px-8 pb-5 pt-1 bg-gray-950">
            <div
              className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border ${colors.ctaBorder} ${colors.ctaBg} transition-all duration-200`}
            >
              <svg
                className={`w-4.5 h-4.5 ${colors.ctaText}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                />
              </svg>
              <span
                className={`text-sm font-semibold ${colors.ctaText}`}
              >
                Click to return to content
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
