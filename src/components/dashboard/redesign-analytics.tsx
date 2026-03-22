"use client";

import { useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MeasuredChart } from "@/components/charts/measured-chart";
import { ScrollReveal } from "@/components/common/scroll-reveal";

type FunnelPoint = {
  name: string;
  value: number;
  fill: string;
};

type SourcePoint = {
  name: string;
  value: number;
  color: string;
};

type VelocityPoint = {
  week: string;
  days: number;
};

type RedesignAnalyticsProps = {
  funnelData: FunnelPoint[];
  sourceData: SourcePoint[];
  velocityData: VelocityPoint[];
};

const funnelFallbackRatios = [1, 0.72, 0.54, 0.34, 0.14];
const tooltipBoxStyle = {
  border: "1px solid rgba(226, 232, 240, 0.96)",
  borderRadius: "14px",
  boxShadow: "0 18px 40px -28px rgba(15, 23, 42, 0.35)",
  backgroundColor: "rgba(255, 255, 255, 0.98)",
  padding: "10px 12px",
};

type HoverTooltip = {
  title: string;
  detail: string;
  x: number;
  y: number;
};

function formatFunnelRatios(funnelData: FunnelPoint[]) {
  const maxValue = Math.max(...funnelData.map((point) => point.value), 0);

  return funnelData.map((point, index) => {
    if (maxValue <= 0) {
      return funnelFallbackRatios[index] ?? 0.14;
    }

    const fallbackRatio = funnelFallbackRatios[index] ?? 0.14;
    const liveRatio = point.value / maxValue;
    const floor = index === funnelData.length - 1 ? 0.12 : 0.2;

    return Math.max(floor, fallbackRatio * 0.7 + liveRatio * 0.3);
  });
}

function TooltipBubble({ tooltip }: { tooltip: HoverTooltip | null }) {
  if (!tooltip) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute z-20 w-40"
      style={{
        left: tooltip.x,
        top: tooltip.y,
        transform: "translate(-50%, -110%)",
      }}
    >
      <div style={tooltipBoxStyle}>
        <p className="text-xs font-semibold text-heading">{tooltip.title}</p>
        <p className="mt-1 text-xs text-muted">{tooltip.detail}</p>
      </div>
    </div>
  );
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians),
  };
}

function describeDonutSlice(centerX: number, centerY: number, outerRadius: number, innerRadius: number, startAngle: number, endAngle: number) {
  const outerStart = polarToCartesian(centerX, centerY, outerRadius, endAngle);
  const outerEnd = polarToCartesian(centerX, centerY, outerRadius, startAngle);
  const innerStart = polarToCartesian(centerX, centerY, innerRadius, startAngle);
  const innerEnd = polarToCartesian(centerX, centerY, innerRadius, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
}

function AnalyticsFunnel({ funnelData }: { funnelData: FunnelPoint[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<HoverTooltip | null>(null);
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const ratios = formatFunnelRatios(funnelData);
  const centerX = 158;
  const maxWidth = 238;
  const topY = 18;
  const segmentHeight = 44;

  const updateTooltip = (event: ReactMouseEvent<SVGPathElement>, title: string, detail: string) => {
    const bounds = wrapperRef.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }

    setTooltip({
      title,
      detail,
      x: Math.min(bounds.width - 86, Math.max(86, event.clientX - bounds.left)),
      y: Math.max(46, event.clientY - bounds.top),
    });
  };

  return (
    <div
      ref={wrapperRef}
      className="relative h-72 min-w-0"
      onMouseLeave={() => {
        setTooltip(null);
        setActiveSegment(null);
      }}
    >
      <TooltipBubble tooltip={tooltip} />
      <svg viewBox="0 0 420 288" className="h-full w-full overflow-visible" aria-label="Conversion funnel">
        {funnelData.map((point, index) => {
          const isActive = activeSegment === point.name;
          const topWidth = maxWidth * ratios[index];
          const bottomWidth = index === funnelData.length - 1 ? maxWidth * 0.12 : maxWidth * ratios[index + 1];
          const y1 = topY + segmentHeight * index;
          const y2 = y1 + segmentHeight - 3;
          const path = [
            `M ${centerX - topWidth / 2} ${y1}`,
            `L ${centerX + topWidth / 2} ${y1}`,
            `L ${centerX + bottomWidth / 2} ${y2}`,
            `L ${centerX - bottomWidth / 2} ${y2}`,
            "Z",
          ].join(" ");

          return (
            <g key={point.name}>
              <path
                d={path}
                fill={point.fill}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinejoin="round"
                style={{
                  cursor: "pointer",
                  opacity: activeSegment && !isActive ? 0.76 : 1,
                  filter: isActive ? "drop-shadow(0 10px 20px rgba(15, 23, 42, 0.14)) saturate(1.05)" : "none",
                  transform: isActive ? "scale(1.045)" : "scale(1)",
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transition: "transform 180ms ease, opacity 180ms ease, filter 180ms ease",
                }}
                onMouseMove={(event) => {
                  setActiveSegment(point.name);
                  updateTooltip(event, point.name, `${point.value.toLocaleString()} leads`);
                }}
                onFocus={(event) =>
                  {
                    setActiveSegment(point.name);
                    updateTooltip(
                      event as unknown as ReactMouseEvent<SVGPathElement>,
                      point.name,
                      `${point.value.toLocaleString()} leads`,
                    );
                  }
                }
                onBlur={() => setActiveSegment(null)}
                tabIndex={0}
                role="img"
                aria-label={`${point.name}: ${point.value.toLocaleString()} leads`}
              />
              <text
                x="314"
                y={(y1 + y2) / 2 + 3}
                fill={isActive ? "#334155" : "#667085"}
                fontSize="12"
                fontWeight={isActive ? 600 : 400}
                style={{ transition: "fill 180ms ease, font-weight 180ms ease, opacity 180ms ease", opacity: activeSegment && !isActive ? 0.72 : 1 }}
              >
                {point.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function AnalyticsDonut({ sourceData }: { sourceData: SourcePoint[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<HoverTooltip | null>(null);
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  const segments = useMemo(() => {
    const total = sourceData.reduce((sum, point) => sum + point.value, 0);

    return sourceData.reduce<{ segments: Array<SourcePoint & { path: string; isActive: boolean }>; angle: number }>(
      (accumulator, point) => {
        const sweep = total > 0 ? (point.value / total) * 360 : 0;
        const gap = Math.min(3, sweep * 0.08);
        const startAngle = accumulator.angle + gap / 2;
        const endAngle = accumulator.angle + sweep - gap / 2;
        const midAngle = accumulator.angle + sweep / 2;
        const isActive = activeSegment === point.name;
        const offset = isActive ? 8 : 0;
        const angleRadians = ((midAngle - 90) * Math.PI) / 180;
        const centerShiftX = Math.cos(angleRadians) * offset;
        const centerShiftY = Math.sin(angleRadians) * offset;

        return {
          angle: accumulator.angle + sweep,
          segments: [
            ...accumulator.segments,
            {
              ...point,
              isActive,
              path: describeDonutSlice(130 + centerShiftX, 130 + centerShiftY, isActive ? 94 : 88, isActive ? 44 : 48, startAngle, endAngle),
            },
          ],
        };
      },
      { segments: [], angle: -90 },
    ).segments;
  }, [activeSegment, sourceData]);

  const updateTooltip = (event: ReactMouseEvent<SVGPathElement>, title: string, detail: string) => {
    const bounds = wrapperRef.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }

    setTooltip({
      title,
      detail,
      x: Math.min(bounds.width - 86, Math.max(86, event.clientX - bounds.left)),
      y: Math.max(46, event.clientY - bounds.top),
    });
  };

  return (
    <div
      ref={wrapperRef}
      className="relative flex h-72 min-w-0 items-center justify-center"
      onMouseLeave={() => {
        setTooltip(null);
        setActiveSegment(null);
      }}
    >
      <TooltipBubble tooltip={tooltip} />
      <svg viewBox="0 0 260 260" className="h-60 w-60 overflow-visible" aria-label="Source distribution">
        {segments.map((segment) => (
          <path
            key={segment.name}
            d={segment.path}
            fill={segment.color}
            stroke="#FFFFFF"
            strokeWidth="2.5"
            style={{
              cursor: "pointer",
              opacity: activeSegment && !segment.isActive ? 0.74 : 1,
              filter: segment.isActive ? "drop-shadow(0 12px 22px rgba(15, 23, 42, 0.16))" : "none",
              transition: "opacity 180ms ease, filter 180ms ease",
            }}
            onMouseMove={(event) => {
              setActiveSegment(segment.name);
              updateTooltip(event, segment.name, `${segment.value}% of sourced deals`);
            }}
            onFocus={(event) =>
              {
                setActiveSegment(segment.name);
                updateTooltip(
                  event as unknown as ReactMouseEvent<SVGPathElement>,
                  segment.name,
                  `${segment.value}% of sourced deals`,
                );
              }
            }
            onBlur={() => setActiveSegment(null)}
            tabIndex={0}
            role="img"
            aria-label={`${segment.name}: ${segment.value}% of sourced deals`}
          />
        ))}
      </svg>
    </div>
  );
}

function VelocityTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div style={tooltipBoxStyle}>
      <p className="text-xs font-semibold text-heading">{label}</p>
      <p className="mt-1 text-xs text-muted">{payload[0].value.toFixed(1)} days to close</p>
    </div>
  );
}

export function RedesignAnalytics({ funnelData, sourceData, velocityData }: RedesignAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-heading">Analytics</h1>
        <p className="mt-1 text-sm text-muted">Understand your sales performance</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScrollReveal className="min-w-0">
          <section className="min-w-0 rounded-xl border border-[var(--border)] bg-white p-5 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.18)]">
            <h3 className="mb-4 font-semibold text-heading">Conversion Funnel</h3>
            <AnalyticsFunnel funnelData={funnelData} />
          </section>
        </ScrollReveal>

        <ScrollReveal delay={80} className="min-w-0">
          <section className="min-w-0 rounded-xl border border-[var(--border)] bg-white p-5 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.18)]">
            <h3 className="mb-4 font-semibold text-heading">Source Distribution</h3>
            <AnalyticsDonut sourceData={sourceData} />
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
              {sourceData.map((source) => (
                <div key={source.name} className="flex items-center gap-1.5 text-xs text-muted">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                  {source.name} ({source.value}%)
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={120} className="min-w-0 lg:col-span-2">
          <section className="min-w-0 rounded-xl border border-[var(--border)] bg-white p-5 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.18)]">
            <h3 className="mb-4 font-semibold text-heading">Deal Velocity (Avg. Days to Close)</h3>
            <MeasuredChart className="h-64 min-w-0">
              {({ width, height }) => (
                <LineChart width={width} height={height} data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.72)" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#667085" }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 12, fill: "#667085" }} stroke="#94A3B8" domain={[10, 20]} />
                  <Tooltip content={<VelocityTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="days"
                    stroke="hsl(172 50% 36%)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "hsl(172 50% 36%)" }}
                  />
                </LineChart>
              )}
            </MeasuredChart>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
