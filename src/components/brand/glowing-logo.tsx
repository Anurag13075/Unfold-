"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Logomark } from "@/components/brand/wordmark";

interface GlowingLogoProps {
  size?: number;
  className?: string;
}

export function GlowingLogo({ size = 28, className = "" }: GlowingLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center justify-center cursor-pointer group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: size, height: size }}
    >
      {/* Ambient Light Glow Aura on Hover */}
      <motion.div
        className="absolute -inset-3 rounded-full pointer-events-none blur-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 0.9 : 0,
          scale: isHovered ? 1.25 : 0.8,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(circle, rgba(242, 167, 59, 0.6) 0%, rgba(242, 167, 59, 0.2) 55%, transparent 80%)",
        }}
      />

      {/* Logomark icon with drop-shadow glow on hover */}
      <motion.div
        className="relative z-10 flex items-center justify-center w-full h-full"
        animate={{
          filter: isHovered
            ? "drop-shadow(0px 0px 8px rgba(242, 167, 59, 0.95)) drop-shadow(0px 0px 16px rgba(242, 167, 59, 0.6))"
            : "drop-shadow(0px 0px 0px rgba(242, 167, 59, 0))",
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{ duration: 0.25 }}
      >
        <Logomark className="w-full h-full" />
      </motion.div>
    </div>
  );
}
