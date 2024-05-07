import React from 'react';
import {
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Tooltip, Area, TooltipProps
} from '../../../node_modules/recharts';
import {formatCurrency} from "../../utils/CurrencyFormatter.tsx";

interface PortfolioHistoryData {
  date: Date;
  value: number;
}

interface UserChartProps {
  portfolioHistory: PortfolioHistoryData[];
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
};


export const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length && typeof payload[0].value === 'number') {
    return (
      <div style={{
          backgroundColor: '#333',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          padding: '10px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          fontSize: '16px'
        }}>
        <p>
          <strong>Value: {formatCurrency(payload[0].value, 2)}</strong><br/>
          {formatDate(new Date(label as string))}
        </p>
      </div>
    );
  }

  return null;
};

export const UserChart: React.FC<UserChartProps> = ({ portfolioHistory }) => {
  // Prepare chart data with useMemo for performance optimization
  const chartData = React.useMemo(() => {
    return portfolioHistory.reduce((acc, curr, idx, src) => {
      if (idx === 0 || curr.value !== src[idx - 1].value) {
        acc.push({
          date: new Date(curr.date), // Convert string date to Date object
          value: curr.value
        });
      }
      return acc;
    }, [] as { date: Date, value: number }[]);
  }, [portfolioHistory]);

    const minY = Math.min(...chartData.map(d => d.value));
    const maxY = Math.max(...chartData.map(d => d.value));
    const padding = 0.2 * (maxY - minY);
    const paddedMinY = minY - padding;
    const paddedMaxY = maxY + padding;
    const paddedRange = paddedMaxY - paddedMinY;
    const step = paddedRange / 2;
    const ticks = [minY - padding + (step/2), minY - padding + step, maxY + padding - (step/2)];

    const lineColor = chartData.length > 1 && chartData[0].value < chartData[chartData.length - 1].value ? '#82ca9d' : '#f44336';

    const formatTicks = (tick: number): string => {
        return (Math.round(tick / 1000) * 1000).toString();
    };

    const tickStyle = {
      fontSize: '14px', // Adjust the font size as needed
      fill: '#777'     // Adjust the font color as needed
    };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="10%" stopColor={lineColor} stopOpacity={0.5}/>
            <stop offset="95%" stopColor={lineColor} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
            dataKey="date" tickFormatter={formatDate}
            tick={tickStyle}
        />
        <YAxis
            domain={[minY - padding, maxY + padding]}
            tickFormatter={formatTicks}
            tick={tickStyle}
            ticks={ticks}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="value" stroke={lineColor} fillOpacity={1} fill="url(#colorValue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};
