/* eslint-disable react/prop-types */
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function PlayerChart({ playerData }) {
  const chartData = React.useMemo(() => {
    if (!playerData || !playerData.date || !playerData.price) {
      return [];
    }

    // Filter for changes in league points and create chart-friendly data
    const filteredData = playerData.price
      .map((price, index) => ({
        date: new Date(playerData.date[index]).toLocaleDateString(),
        price
      }))
      .filter((_, index, array) => index === 0 || array[index].price !== array[index - 1].price);

    return filteredData;
  }, [playerData]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#82ca9d" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default PlayerChart;
