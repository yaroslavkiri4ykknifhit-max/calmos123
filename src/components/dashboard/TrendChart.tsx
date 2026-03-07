import { useEffect, useState } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrendChartProps {
  title: string;
  description?: string;
  data: { date: string; value: number }[];
  dataKey: string;
  color: string;
  gradientId: string;
}

export default function TrendChart({

  title,
  description = 'Last 30 days',
  data,
  dataKey,
  color,
  gradientId,
}: TrendChartProps) {
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;
  return (
    <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-5 lg:p-6">
      <div className="mb-3 sm:mb-5">
        <h3 className="text-[14px] sm:text-[15px] font-semibold text-[var(--tx)]">{title}</h3>
        <p className="text-[12px] sm:text-[13px] text-[var(--tx3)] mt-0.5 sm:mt-1">{description}</p>
      </div>
      <div className="h-[150px] sm:h-[170px] lg:h-[180px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: 'var(--tx3)' }}
              tickFormatter={(val: string) => {
                const d = new Date(val);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
              interval={Math.floor(data.length / 4)}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: 'var(--tx3)' }}
              domain={[0, 'auto']}
              width={24}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg)',
                border: '1px solid var(--bd2)',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'var(--tx)',
                boxShadow: '0 8px 32px var(--tooltip-sh)',
                padding: '8px 12px',
              }}
              labelFormatter={(label) => {
                const d = new Date(String(label));
                return d.toLocaleDateString('en', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
              }}
              formatter={(value: unknown) => [String(value), dataKey]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{
                r: 3.5,
                fill: color,
                strokeWidth: 2,
                stroke: 'var(--card)',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
