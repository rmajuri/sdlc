"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  appendixIntro,
  appendixSections,
  type AppendixContentItem,
} from "@/data/appendix";

function ContentRenderer({ item }: { item: AppendixContentItem }) {
  if (typeof item === "string") {
    return <p className="text-gray-300 leading-relaxed">{item}</p>;
  }

  if (item.type === "code") {
    return (
      <pre className="bg-gray-950 border border-white/10 rounded-lg p-4 overflow-x-auto text-sm font-mono text-gray-400 leading-relaxed">
        {item.content}
      </pre>
    );
  }

  if (item.type === "table") {
    return (
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800/80">
              {item.headers.map((header, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left font-semibold text-gray-200 border-b border-white/10"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {item.rows.map((row, i) => (
              <tr
                key={i}
                className={
                  i % 2 === 0 ? "bg-gray-900/50" : "bg-gray-900/30"
                }
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-4 py-3 text-gray-300 border-b border-white/5 ${
                      j === 0 ? "font-medium text-white" : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

function AccordionSection({
  section,
  isOpen,
  onToggle,
}: {
  section: (typeof appendixSections)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-800/50 hover:bg-gray-800/80 transition-colors text-left"
      >
        <span className="font-semibold text-white">{section.title}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-gray-400 shrink-0 ml-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 py-5 space-y-4 bg-gray-900/40">
              {section.content.map((item, i) => (
                <ContentRenderer key={i} item={item} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ReferenceDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenSections(new Set(appendixSections.map((s) => s.id)));
  };

  const collapseAll = () => {
    setOpenSections(new Set());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-gray-950 border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="shrink-0 flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gray-950">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Technical Appendix
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Part 3 — Tooling, Architecture & Adoption
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
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
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {appendixIntro}
              </p>

              <div className="flex gap-2 mb-6">
                <button
                  onClick={expandAll}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Expand all
                </button>
                <button
                  onClick={collapseAll}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Collapse all
                </button>
              </div>

              <div className="space-y-3">
                {appendixSections.map((section) => (
                  <AccordionSection
                    key={section.id}
                    section={section}
                    isOpen={openSections.has(section.id)}
                    onToggle={() => toggleSection(section.id)}
                  />
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
