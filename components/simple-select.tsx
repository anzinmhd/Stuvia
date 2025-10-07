"use client";

import { useEffect, useRef, useState } from "react";

type Option = { label: string; value: string };

type Props = {
  id: string;
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: Option[];
};

export default function SimpleSelect({ id, label, value, onChange, placeholder = "Select", options }: Props) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (!open) return;
      
      switch (e.key) {
        case 'Escape':
          setOpen(false);
          setFocusedIndex(-1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, options.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0) {
            onChange(options[focusedIndex].value);
            setOpen(false);
            setFocusedIndex(-1);
          }
          break;
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, focusedIndex, options, onChange]);

  const selected = options.find(o => o.value === value);

  return (
    <div className="grid gap-2">
      {label && <label htmlFor={id} className="text-sm font-medium">{label}</label>}
      <div ref={ref} className="relative">
        <button
          id={id}
          type="button"
          className="w-full rounded-lg border border-black/10 dark:border-white/20 bg-white/80 dark:bg-white/10 text-black dark:text-white px-3 py-2 text-left outline-none focus:ring-2 focus:ring-brand-500 hover:bg-black/[0.03] dark:hover:bg-white/15 transition flex items-center justify-between"
          onClick={() => setOpen(v => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={selected ? "" : "text-black/60 dark:text-white/60"}>{selected ? selected.label : placeholder}</span>
          <span className="ml-2 text-black/60 dark:text-white/60">▾</span>
        </button>
        {open && (
          <div 
            className="absolute z-50 mt-1 w-full rounded-lg border border-white/20 bg-gray-800 text-white shadow-xl max-h-56 overflow-auto" 
            role="listbox"
            aria-labelledby={id}
          >
            {options.map((opt, index) => (
              <div
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                className={`px-3 py-2 cursor-pointer transition-colors hover:bg-white/10 ${
                  opt.value === value ? "bg-gray-600" : ""
                } ${
                  index === focusedIndex ? "bg-white/15" : ""
                }`}
                onClick={() => { 
                  onChange(opt.value); 
                  setOpen(false); 
                  setFocusedIndex(-1);
                }}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
