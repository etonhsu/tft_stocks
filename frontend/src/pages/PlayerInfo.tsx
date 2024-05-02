import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {TransactionComponent} from '../components/TransactionComponent';
import {PlayerChart} from '../components/PlayerChart';
import {MainContent} from "../containers/General/MainContent.tsx";
import {ChartContainer} from "../containers/MultiUse/ChartContainer.tsx";
import {
    DetailsAndTransactionColumn,
    PlayerDetailsContainer,
    PlayerInfoContainer
} from "../containers/Player/PlayerInfoContainer.tsx";
import {TransactionContainer} from "../containers/Player/TransactionContainer.tsx";
import {formatCurrency} from "../utils/CurrencyFormatter.tsx";

// Assuming you have a type definition for the player data from the backend
interface PlayerData {
  name: string;
  price: number[];
  date: string[];
  '8 Hour Change': number;  // Optional because not all datasets might have this
  '24 Hour Change': number; // Optional
  '3 Day Change': number;   // Optional
}

export function PlayerInfo() {
  const { gameName } = useParams<{ gameName?: string }>();
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');


  useEffect(() => {
    if (gameName) {
      fetchPlayerData();
    }
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
      setError('Failed to load player data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleUserDataUpdate = () => {
    fetchPlayerData(); // Simply re-fetch player data for now
  };

  if (loading) {return (<MainContent className="mainContentContainer">Loading...</MainContent>);}
  if (error) {return (<MainContent className="mainContentContainer">Error: No data available.</MainContent>);}
  if (!playerData) return <MainContent className="mainContentContainer">No data available.</MainContent>;

  return (
      <MainContent>
          <h1>{playerData.name}</h1>
          <PlayerInfoContainer>
              <DetailsAndTransactionColumn>
                  <PlayerDetailsContainer label="Overview">
                      <p>Current Price: ${(playerData.price[playerData.price.length - 1]).toFixed(2)}</p>
                      <p>Updated: {formatDate(playerData.date[playerData.date.length - 1])}</p>
                      <p>8 Hour Change: {formatCurrency(playerData['8 Hour Change'], 1)}</p>
                      <p>24 Hour Change: {formatCurrency(playerData['24 Hour Change'], 1)}</p>
                      <p>3 Day Change: {formatCurrency(playerData['3 Day Change'], 1)}</p>
                  </PlayerDetailsContainer>
                  <TransactionContainer label={"Transaction"}>
                      {gameName && (
                          <TransactionComponent gameName={gameName} updateUserData={handleUserDataUpdate}/>
                      )}
                  </TransactionContainer>
              </DetailsAndTransactionColumn>
              <ChartContainer label={"Performance"}>
                  <PlayerChart playerData={playerData}/>
              </ChartContainer>
          </PlayerInfoContainer>

      </MainContent>
  );
}

