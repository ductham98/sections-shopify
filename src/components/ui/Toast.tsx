"use client";

import React, { useEffect } from "react";
import { Check } from "lucide-react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-zinc-950/20 border border-zinc-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-zinc-950">
        <Check className="h-3.5 w-3.5 stroke-[3]" />
      </div>
      <span>{message}</span>
    </div>
  );
}
