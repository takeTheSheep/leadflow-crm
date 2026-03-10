"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type LeadVolumeChartProps = {
  data: Array<{ date: string; leads: number }>;
};

export function LeadVolumeChart({ data }: LeadVolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 12, right: 16, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="leadVolumeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F7CFF" stopOpacity={0.44} />
            <stop offset="100%" stopColor="#4F7CFF" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="rgba(125,137,163,0.25)" />
        <XAxis dataKey="date" tick={{ fill: "#7D89A3", fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: "#7D89A3", fontSize: 11 }} tickLine={false} axisLine={false} width={34} />
        <Tooltip
          cursor={{ stroke: "rgba(79,124,255,0.25)", strokeWidth: 1 }}
          contentStyle={{ borderRadius: 12, borderColor: "#DCE3F0", boxShadow: "0 12px 28px -18px rgba(24,40,80,0.5)" }}
        />
        <Area type="monotone" dataKey="leads" stroke="#315EFB" fill="url(#leadVolumeFill)" strokeWidth={2.5} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

