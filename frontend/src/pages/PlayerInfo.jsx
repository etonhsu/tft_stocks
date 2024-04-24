import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TransactionComponent from '../components/TransactionComponent'; // Ensure this is correctly imported

function PlayerInfo() {
  const { gameName } = useParams();
  const [playerData, setPlayerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlayerData();
  }, [gameName]);

  const fetchPlayerData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/players/${gameName}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error fetching player data');
      }
      setPlayerData(data);
    } catch (err) {
      setError('Failed to load player data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserDataUpdate = (updatedData) => {
    // This can be modified depending on what data you expect to update
    fetchPlayerData(); // Simply re-fetch player data for now
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!playerData) return <p>No data available.</p>;

  return (
    <div>
      <h1>{playerData.name}</h1>
      <p>Current Price: {playerData.price[playerData.price.length - 1]}</p>
      <p>Date: {playerData.date[playerData.date.length - 1]}</p>
      <p>8 Hour Change: {playerData['8 Hour Change']}</p>
      <p>24 Hour Change: {playerData['24 Hour Change']}</p>
      <p>3 Day Change: {playerData['3 Day Change']}</p>
      {/* Transaction component with props */}
      <TransactionComponent gameName={gameName} updateUserData={handleUserDataUpdate} />
    </div>
  );
}

export default PlayerInfo;
