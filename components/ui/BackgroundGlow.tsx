"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BackgroundGlow
 * A subtle, reference-inspired aurora/radial glow that respects your theme.
 * Place this inside a relatively positioned container.
 */
export default function BackgroundGlow({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Horizon arc */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-40 w-[120%] rounded-[50%] bg-gradient-to-t from-brand-600/30 via-brand-500/10 to-transparent blur-2xl"
      />
      {/* Soft vertical beams */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(closest-side,theme(colors.brand.500)/22%,transparent_70%)] [mask-image:linear-gradient(to_bottom,black,transparent)] blur-xl"
      />
      {/* Floating orb */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-[10%] top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_30%_30%,theme(colors.brand.400),transparent_60%)] blur-2xl"
      />
    </div>
  );
}
