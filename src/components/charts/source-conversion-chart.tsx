"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type SourceConversionChartProps = {
  data: Array<{ source: string; total: number; won: number; conversionRate: number }>;
};

export function SourceConversionChart({ data }: SourceConversionChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 12, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="rgba(125,137,163,0.25)" />
        <XAxis dataKey="source" tick={{ fill: "#7D89A3", fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: "#7D89A3", fontSize: 11 }} tickLine={false} axisLine={false} width={34} />
        <Tooltip
          contentStyle={{ borderRadius: 12, borderColor: "#DCE3F0", boxShadow: "0 12px 28px -18px rgba(24,40,80,0.5)" }}
        />
        <Bar dataKey="total" fill="#DCE8FF" radius={[8, 8, 0, 0]} />
        <Bar dataKey="won" fill="#3CC7B2" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

