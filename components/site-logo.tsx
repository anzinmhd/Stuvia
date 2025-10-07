"use client";
import Image from "next/image";

export function SiteLogo({ size = 44 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-flex rounded-full overflow-hidden ring-1 ring-black/10 dark:ring-white/10"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt="Stuvia"
          width={size}
          height={size}
          priority
          className="h-full w-full object-cover"
        />
      </span>
      <span className="font-semibold text-2xl md:text-3xl tracking-tight">Stuvia</span>
    </div>
  );
}
