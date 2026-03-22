"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/common/button";

export function MobileStickyCta() {
  return (
    <div
      data-mobile-sticky-cta
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:hidden"
    >
      <div className="pointer-events-auto mx-auto w-full max-w-md rounded-[22px] border border-white/12 bg-[rgba(6,14,24,0.9)] p-3 shadow-[0_-12px_40px_-26px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <Link href="/register" className="block">
          <Button className="h-12 w-full justify-between rounded-2xl px-5 text-sm">
            Book Demo
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </Link>
      </div>
    </div>
  );
}
