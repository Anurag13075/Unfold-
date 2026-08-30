"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

type WaveformStatus = "declined" | "recovering" | "recovered" | "failed" | "escalated";

const colors: Record<WaveformStatus, string> = {
  declined: "#E5536B",
  recovering: "#F2A73B",
  recovered: "#35D0A6",
  failed: "#E5536B",
  escalated: "#F2A73B",
};

interface WaveformProps {
  data?: number[];
  status?: WaveformStatus;
  width?: number;
  height?: number;
  className?: string;
  animate?: boolean;
}

export function Waveform({
  data,
  status = "declined",
  width = 120,
  height = 32,
  className,
  animate = false,
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const generateDefault = useCallback(() => {
    const points = 40;
    const d: number[] = [];
    for (let i = 0; i < points; i++) {
      if (status === "declined") {
        d.push(i < 20 ? 0.5 + Math.sin(i * 0.5) * 0.2 : 0.08);
      } else if (status === "recovering") {
        d.push(i < 25 ? 0.25 : 0.25 + (i - 25) * 0.025);
      } else if (status === "recovered") {
        d.push(i < 12 ? 0.4 + Math.sin(i * 0.4) * 0.15 : 0.5 + Math.sin(i * 0.6) * 0.35);
      } else {
        d.push(0.08);
      }
    }
    return d;
  }, [status]);

  const draw = useCallback(
    (progress = 1) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, width, height);
      const waveData = data ?? generateDefault();
      const color = colors[status];
      const visiblePoints = Math.floor(waveData.length * progress);

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      for (let i = 0; i < visiblePoints; i++) {
        const x = (i / (waveData.length - 1)) * width;
        const y = height - waveData[i] * height * 0.85 - height * 0.075;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (animate && status === "recovered" && progress >= 1) {
        const lastX = width;
        const lastY = height - waveData[waveData.length - 1] * height * 0.85 - height * 0.075;
        const gradient = ctx.createRadialGradient(lastX, lastY, 0, lastX, lastY, 12);
        gradient.addColorStop(0, "rgba(53, 208, 166, 0.4)");
        gradient.addColorStop(1, "rgba(53, 208, 166, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(lastX - 12, lastY - 12, 24, 24);
      }
    },
    [width, height, data, status, generateDefault, animate]
  );

  useEffect(() => {
    if (!animate) {
      draw(1);
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      draw(1);
      return;
    }

    let start: number | null = null;
    const duration = 480;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      draw(progress);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      }
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw, animate]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className={cn("block", className)}
      aria-hidden
    />
  );
}
