import React from 'react';
import {
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Tooltip, Area, TooltipProps
} from '../../../node_modules/recharts';

interface PlayerData {
  date: string[];
  price: number[];
}

interface PlayerChartProps {
  playerData: PlayerData;
}



const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
};

// Define a custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length && typeof payload[0].value === 'number') {
    return (
        <div style={{
            backgroundColor: '#333',
            boxShadow: '0 2px 4px 0 #555',
            padding: '0px 10px',
            textAlign: 'center', // Centers text horizontally
            display: 'flex',
            flexDirection: 'column', // Stack children vertically
            justifyContent: 'center', // Centers content vertically in the container
            fontSize: '16px' // Optional, adjust font size for better readability
          }}>
          <p>
            <strong>Price: ${payload[0].value.toFixed(2)}</strong><br/>
            {formatDate(new Date(label as string))}
          </p>
        </div>
    );
  }

  return null;
};

export const PlayerChart: React.FC<PlayerChartProps> = ({playerData}) => {
  const chartData = React.useMemo(() => {
    return playerData.price.map((price, index) => ({
      date: new Date(playerData.date[index]),
      price
    })).filter((_, index, array) => index === 0 || array[index].price !== array[index - 1].price);
  }, [playerData]);

  const minY = Math.min(...chartData.map(d => d.price));
  const maxY = Math.max(...chartData.map(d => d.price));
  const padding = 0.2 * (maxY - minY);
  const paddedMinY = minY - padding;
  const paddedMaxY = maxY + padding;
  const paddedRange = paddedMaxY - paddedMinY;
  const step = paddedRange / 2;
  const ticks = [paddedMinY + (step/ 2), paddedMinY + step, paddedMaxY - (step/ 2)];

  const lineColor = chartData.length > 1 && chartData[0].price < chartData[chartData.length - 1].price ? '#82ca9d' : '#f44336';

  const formatTicks = (tick: number): string => {
    return (Math.round(tick / 10) * 10).toString();
  };

  const tickStyle = {
      fontSize: '14px', // Adjust the font size as needed
      fill: '#777'     // Adjust the font color as needed
    };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="10%" stopColor={lineColor} stopOpacity={0.5}/>
            <stop offset="95%" stopColor={lineColor} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatDate} tick={tickStyle}/>
        <YAxis
            domain={[minY - padding, maxY + padding]}
            tickFormatter={formatTicks}
            tick={tickStyle}
            ticks={ticks}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="price" stroke={lineColor} fillOpacity={1} fill="url(#colorPrice)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
