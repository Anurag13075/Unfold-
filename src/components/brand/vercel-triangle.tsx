"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface VercelTriangleProps {
  size?: number;
  className?: string;
}

export function VercelTriangle({ size = 24, className = "" }: VercelTriangleProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center justify-center cursor-pointer group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: size, height: size }}
    >
      {/* Ambient Light Cone / Aura Background on Hover */}
      <motion.div
        className="absolute -inset-4 rounded-full pointer-events-none blur-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 0.85 : 0,
          scale: isHovered ? 1.2 : 0.8,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.15) 50%, transparent 80%)",
        }}
      />

      {/* Light Beam Ray radiating downwards */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 w-16 h-20 pointer-events-none origin-top blur-md"
        initial={{ opacity: 0, scaleY: 0.5 }}
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scaleY: isHovered ? 1 : 0.5,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          background:
            "conic-gradient(from 150deg at 50% 0%, rgba(255,255,255,0.7) 0deg, transparent 60deg, transparent 300deg, rgba(255,255,255,0.7) 360deg)",
        }}
      />

      {/* SVG Triangle with dynamic lighting & drop-shadow glow */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 75 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{
          filter: isHovered
            ? "drop-shadow(0px 0px 8px rgba(255,255,255,0.9)) drop-shadow(0px 0px 16px rgba(255,255,255,0.6))"
            : "drop-shadow(0px 0px 0px rgba(255,255,255,0))",
        }}
        transition={{ duration: 0.3 }}
        className="relative z-10 overflow-visible"
      >
        <defs>
          <linearGradient id="vercelTriangleGradient" x1="37.5" y1="0" x2="37.5" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor={isHovered ? "#FFFFFF" : "#E5E5E5"} />
            <stop offset="100%" stopColor={isHovered ? "#F5F5F5" : "#A3A3A3"} />
          </linearGradient>

          <radialGradient id="filamentGlow" cx="37.5" cy="20" r="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Triangle Path */}
        <motion.path
          d="M37.5 0L75 65H0L37.5 0Z"
          fill="url(#vercelTriangleGradient)"
          animate={{
            fillOpacity: isHovered ? 1 : 0.95,
          }}
          transition={{ duration: 0.25 }}
        />

        {/* Inner Filament Light Line on Hover */}
        <motion.path
          d="M37.5 6L68 59H7L37.5 6Z"
          stroke="url(#filamentGlow)"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.8 : 0 }}
          transition={{ duration: 0.25 }}
          fill="none"
        />
      </motion.svg>
    </div>
  );
}
