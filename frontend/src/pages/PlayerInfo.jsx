import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PlayerInfo() {
  const { gameName } = useParams();  // Destructuring to get gameName from the route params
  const [playerData, setPlayerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/players/${gameName}`);
        const data = await response.json();
        if (response.ok) {
          setPlayerData(data);
        } else {
          throw new Error(data.error || 'Error fetching data');
        }
      } catch (err) {
        setError('Failed to load player data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [gameName]);

  // Check for loading or error state
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!playerData) return <p>No data available.</p>; // Handle case where no data is returned

  // Destructure data for easier access
  const { name, price} = playerData;

  // Conditional rendering based on data integrity
  if (!name || typeof price[price.length - 1] !== 'number') {
    console.error('Invalid props:', { name, price });
    return <p>Error: Data for player is incomplete or still loading...</p>;
  }

  return (
    <div>
      <h1>{playerData.name}</h1>
      <p>Current Price: {playerData.price[playerData.price.length - 1]}</p>
      <p>Date: {playerData.date[playerData.date.length - 1]}</p>
      <p>8 Hour Change: {playerData['8 Hour Change']}</p>
      <p>24 Hour Change: {playerData['24 Hour Change']}</p>
      <p>3 Day Change: {playerData['3 Day Change']}</p>
    </div>
  );
}

export default PlayerInfo;
