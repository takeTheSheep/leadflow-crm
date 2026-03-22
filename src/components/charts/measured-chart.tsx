"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ChartSize = {
  width: number;
  height: number;
};

type MeasuredChartProps = {
  className?: string;
  children: (size: ChartSize) => ReactNode;
};

export function MeasuredChart({ className, children }: MeasuredChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<ChartSize>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateSize = () => {
      const nextSize = {
        width: Math.round(element.clientWidth),
        height: Math.round(element.clientHeight),
      };

      setSize((current) => {
        if (current.width === nextSize.width && current.height === nextSize.height) {
          return current;
        }

        return nextSize;
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {size.width > 0 && size.height > 0 ? children(size) : null}
    </div>
  );
}
