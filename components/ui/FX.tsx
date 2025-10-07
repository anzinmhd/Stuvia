"use client";

import React, { PropsWithChildren } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";

export const easeOutExpo = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOutExpo },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3, ease: easeOutExpo } },
};

export const scalePop: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: easeOutExpo },
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.18, ease: "easeInOut" } },
};

export const slideH: Variants = {
  left: { x: -16, opacity: 0 },
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: easeOutExpo } },
  right: { x: 16, opacity: 0 },
};

export function Stagger({ children, delay = 0.05 }: PropsWithChildren<{ delay?: number }>) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function FadeUp({ children }: PropsWithChildren) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}

export function PageTransition({ children }: PropsWithChildren) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: easeOutExpo }}>
      {children}
    </motion.div>
  );
}

export function ModalShell({ open, children }: PropsWithChildren<{ open: boolean }>) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            variants={fadeIn}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <motion.div variants={scalePop} initial="hidden" animate="show" exit="exit" className="w-full max-w-3xl">
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
