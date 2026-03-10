"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/common/button";

const GLOW_SIZE_PX = 288;
const GLOW_HALF_SIZE_PX = GLOW_SIZE_PX / 2;
const LERP_FACTOR = 0.12;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const currentRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  const applyGlowPosition = (x: number, y: number) => {
    const glow = glowRef.current;
    if (!glow) {
      return;
    }

    glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const animate = () => {
    const current = currentRef.current;
    const target = targetRef.current;

    const nextX = current.x + (target.x - current.x) * LERP_FACTOR;
    const nextY = current.y + (target.y - current.y) * LERP_FACTOR;

    currentRef.current = { x: nextX, y: nextY };
    applyGlowPosition(nextX, nextY);

    if (Math.abs(target.x - nextX) < 0.2 && Math.abs(target.y - nextY) < 0.2) {
      rafRef.current = null;
      return;
    }

    rafRef.current = requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (rafRef.current !== null) {
      return;
    }

    rafRef.current = requestAnimationFrame(animate);
  };

  const setTargetFromPointer = (clientX: number, clientY: number) => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const rect = section.getBoundingClientRect();
    const minX = -GLOW_HALF_SIZE_PX;
    const maxX = rect.width - GLOW_HALF_SIZE_PX;
    const minY = -GLOW_HALF_SIZE_PX;
    const maxY = rect.height - GLOW_HALF_SIZE_PX;
    const relativeX = clamp(clientX - rect.left - GLOW_HALF_SIZE_PX, minX, maxX);
    const relativeY = clamp(clientY - rect.top - GLOW_HALF_SIZE_PX, minY, maxY);

    targetRef.current = { x: relativeX, y: relativeY };
    startAnimation();
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const rect = section.getBoundingClientRect();
    const centerX = Math.max(0, rect.width / 2 - GLOW_HALF_SIZE_PX);
    const centerY = Math.max(0, rect.height / 2 - GLOW_HALF_SIZE_PX);

    currentRef.current = { x: centerX, y: centerY };
    targetRef.current = { x: centerX, y: centerY };
    applyGlowPosition(centerX, centerY);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden rounded-[28px] border border-white/60 bg-gradient-to-br from-white via-[var(--panel)] to-[var(--background-soft)] p-8 shadow-[0_30px_70px_-36px_rgba(36,56,110,0.35)] md:p-12"
      onMouseMove={(event) => {
        setTargetFromPointer(event.clientX, event.clientY);
      }}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute -z-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(79,124,255,0.24)_0%,rgba(139,124,255,0.14)_42%,transparent_72%)] blur-2xl transition-opacity duration-200 will-change-transform"
      />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-[var(--blue)]/25 bg-[var(--blue-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--blue-deep)]">
            Sales Operations Platform
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-heading md:text-5xl">
            Organize inbound leads, move deals with confidence, and convert faster.
          </h1>
          <p className="mt-5 max-w-xl text-base text-body md:text-lg">
            LeadFlow CRM gives modern sales teams one premium workspace for pipeline visibility, follow-up execution,
            and conversion analytics.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/register">
              <Button className="h-11 px-5">
                Start Demo Workspace
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="secondary" className="h-11 px-5">
                <PlayCircle className="mr-2 h-4 w-4" aria-hidden />
                Explore Product
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="surface-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-heading">Pipeline snapshot</p>
              <span className="rounded-full bg-[var(--teal-soft)] px-2 py-1 text-xs font-semibold text-[var(--teal)]">+18% QoQ</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="surface-muted p-3">
                <p className="text-xs text-muted">Qualified</p>
                <p className="mt-1 text-lg font-semibold text-heading">124 leads</p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs text-muted">Follow-ups due</p>
                <p className="mt-1 text-lg font-semibold text-heading">19 today</p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs text-muted">Revenue forecast</p>
                <p className="mt-1 text-lg font-semibold text-heading">$472k</p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs text-muted">Avg response</p>
                <p className="mt-1 text-lg font-semibold text-heading">3.6h</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-2 -top-3 rounded-xl border border-white/70 bg-white px-3 py-2 text-xs font-medium text-heading shadow-lg">
            Referral lead scored 87
          </div>
          <div className="absolute -bottom-3 -left-3 rounded-xl border border-white/70 bg-white px-3 py-2 text-xs font-medium text-heading shadow-lg">
            Proposal sent to Northline
          </div>
        </div>
      </div>
    </section>
  );
}

