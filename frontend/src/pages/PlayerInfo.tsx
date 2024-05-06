import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {TransactionComponent} from '../components/transactions/TransactionComponent.tsx';
import {PlayerChart} from '../components/player/PlayerChart.tsx';
import {MainContent} from "../containers/general/MainContent.tsx";
import {ChartContainer} from "../containers/multiUse/ChartContainer.tsx";
import {
    DetailsAndTransactionColumn, FavoritesIconContainer,
    PlayerDetailsContainer,
    PlayerInfoContainer, PlayerNameContainer
} from "../containers/player/PlayerInfoContainer.tsx";
import {TransactionContainer} from "../containers/player/TransactionContainer.tsx";
import {formatCurrency} from "../utils/CurrencyFormatter.tsx";
import {FavoriteIcon} from "../components/player/FavoritesIcon.tsx";
import {formatDate} from "../utils/DateFormatter.tsx";

// Assuming you have a type definition for the player data from the backend
export interface PlayerData {
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
  const backendUrl = process.env.REACT_APP_BACKEND_URL;


  useEffect(() => {
    if (gameName) {
      fetchPlayerData();
    }
  }, [gameName]);

  const fetchPlayerData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${backendUrl}/players/${gameName}`);
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

  const handleUserDataUpdate = () => {
    fetchPlayerData(); // Simply re-fetch player data for now
  };

  if (loading) {return (<MainContent className="mainContentContainer">Loading...</MainContent>);}
  if (error) {return (<MainContent className="mainContentContainer">Error: No data available.</MainContent>);}
  if (!playerData) return <MainContent className="mainContentContainer">No data available.</MainContent>;

  return (
      <MainContent>
          <PlayerNameContainer>
            <h1>{playerData.name}</h1>
              <FavoritesIconContainer>
                  <FavoriteIcon gameName={gameName}/>
              </FavoritesIconContainer>
          </PlayerNameContainer>
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

