"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#4F7CFF", "#3CC7B2", "#8B7CFF", "#FFB547", "#FF6B8A", "#22C55E", "#F87171"];

type PipelineDistributionChartProps = {
  data: Array<{ stage: string; count: number; value: number }>;
};

export function PipelineDistributionChart({ data }: PipelineDistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="stage"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((item, index) => (
            <Cell key={item.stage} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, _name, payload) => [`${value} leads`, payload?.payload?.stage]}
          contentStyle={{ borderRadius: 12, borderColor: "#DCE3F0", boxShadow: "0 12px 28px -18px rgba(24,40,80,0.5)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

