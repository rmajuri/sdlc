"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cards } from "@/data/cards";
import FlipCard from "./FlipCard";

export default function CardDeck() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<"all" | "sdlc" | "api">("all");

  const filteredCards = cards.filter(
    (card) => filter === "all" || card.part === filter
  );

  const handleCardClick = useCallback((id: number) => {
    setSelectedId(id);
    setFlippedCards((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleClose = useCallback(() => {
    if (selectedId !== null) {
      setFlippedCards((prev) => {
        const next = new Set(prev);
        next.delete(selectedId);
        return next;
      });
    }
    setSelectedId(null);
  }, [selectedId]);

  const handleFlip = useCallback(() => {
    if (selectedId === null) return;
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(selectedId)) {
        next.delete(selectedId);
      } else {
        next.add(selectedId);
      }
      return next;
    });
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                SDLC & API Product Lifecycle
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Interactive Process Deck &mdash; Click a card to explore, then
                click to flip
              </p>
            </div>
            <div className="flex gap-2">
              {(["all", "sdlc", "api"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filter === f
                      ? f === "sdlc"
                        ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/40"
                        : f === "api"
                          ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40"
                          : "bg-white/10 text-white ring-1 ring-white/20"
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {f === "all" ? "All Cards" : f === "sdlc" ? "SDLC" : "API"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Card Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {filteredCards.map((card, index) => {
            const colors =
              card.part === "sdlc"
                ? {
                    gradient: "from-indigo-600 to-violet-700",
                    border: "border-indigo-500/20 hover:border-indigo-500/40",
                    badge: "bg-indigo-500/20 text-indigo-300",
                    glow: "hover:shadow-indigo-500/10",
                  }
                : {
                    gradient: "from-emerald-600 to-teal-700",
                    border: "border-emerald-500/20 hover:border-emerald-500/40",
                    badge: "bg-emerald-500/20 text-emerald-300",
                    glow: "hover:shadow-emerald-500/10",
                  };

            return (
              <motion.div
                key={card.id}
                layoutId={`card-${card.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
                onClick={() => handleCardClick(card.id)}
                className={`group relative cursor-pointer rounded-2xl border ${colors.border} bg-gray-900/60 backdrop-blur-sm p-5 transition-shadow duration-300 hover:shadow-2xl ${colors.glow}`}
              >
                <div
                  className={`h-1 w-12 rounded-full bg-gradient-to-r ${colors.gradient} mb-4`}
                />
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-[0.65rem] font-mono px-2 py-0.5 rounded-full ${colors.badge}`}
                  >
                    {card.section}
                  </span>
                  <span
                    className={`text-[0.65rem] font-mono px-2 py-0.5 rounded-full ${colors.badge}`}
                  >
                    {card.part === "sdlc" ? "SDLC" : "API"}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white/90 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                  {card.frontContent[0]}
                </p>
                <div className="mt-4 flex items-center text-xs text-gray-600 group-hover:text-gray-400 transition-colors">
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  Click to explore
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* Selected Card Modal */}
      <AnimatePresence>
        {selectedId !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={handleClose}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                layoutId={`card-${selectedId}`}
                className="w-full max-w-2xl h-[80vh] max-h-[700px] pointer-events-auto relative"
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                  className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors shadow-xl"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <FlipCard
                  card={cards.find((c) => c.id === selectedId)!}
                  isFlipped={flippedCards.has(selectedId)}
                  onFlip={handleFlip}
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
