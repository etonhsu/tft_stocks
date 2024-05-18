import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TransactionComponent } from '../components/transactions/TransactionComponent';
import { PlayerChart } from '../components/player/PlayerChart';
import { MainContent } from "../containers/general/MainContent";
import {
    DetailsAndTransactionColumn,
    FavoritesIconContainer,
    PlayerDetailsContainer,
    PlayerInfoContainer,
    PlayerNameContainer
} from "../containers/player/PlayerInfoContainer";
import { TransactionContainer } from "../containers/player/TransactionContainer";
import { formatCurrency } from "../utils/CurrencyFormatter";
import { FavoriteIcon } from "../components/player/FavoritesIcon";
import { formatDate } from "../utils/DateFormatter";
import styled from "styled-components";

export interface PlayerData {
    name: string;
    price: number[];
    date: string[];
    date_updated: Date;
    '8 Hour Change': number;
    '24 Hour Change': number;
    '3 Day Change': number;
    delist_date?: string;  // Optional delist_date
}

const DelistText = styled.div`
    margin-top: 53px;
    margin-left: 15px;
`;

const StyledLink = styled.a`
    text-decoration: none;
    color: #EAEAEA;
    font-weight: bold;
    padding: 8px;
    margin-top: 45px;
    margin-left: 15px;
    border-radius: 4px;
    background-color: #444;

    &:hover {
        color: cornflowerblue;
    }
`;

const ExternalLink = () => {
    return (
        <StyledLink href="http://tactics.tools" target="_blank" rel="noopener noreferrer">
            Visit Tactics Tools
        </StyledLink>
    );
};

export default ExternalLink;

export function PlayerInfo() {
    const { gameName } = useParams<{ gameName?: string }>();
    const [playerData, setPlayerData] = useState<PlayerData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

    const encodedGameName = encodeURIComponent(gameName || '');
    const url = `http://tactics.tools/player/na/${encodedGameName}`;

    const handleUserDataUpdate = () => {
        fetchPlayerData();
    };

    if (loading) {
        return (<MainContent className="mainContentContainer">Loading...</MainContent>);
    }
    if (error) {
        return (<MainContent className="mainContentContainer">Error: No data available.</MainContent>);
    }
    if (!playerData) {
        return <MainContent className="mainContentContainer">No data available.</MainContent>;
    }

    return (
        <MainContent>
            <PlayerNameContainer>
                <h1>{playerData.name}</h1>
                <FavoritesIconContainer>
                    <FavoriteIcon gameName={gameName} />
                </FavoritesIconContainer>
                <StyledLink href={url} target="_blank" rel="noopener noreferrer">
                    tactics.tools
                </StyledLink>
                {playerData.delist_date && (
                    <DelistText>
                        Delisted on {formatDate(new Date(playerData.delist_date))}
                    </DelistText>
                )}
            </PlayerNameContainer>
            <PlayerInfoContainer>
                <DetailsAndTransactionColumn>
                    <PlayerDetailsContainer label="Overview">
                        <p>Current Price: {playerData.price?.length ? formatCurrency(playerData.price[playerData.price.length - 1], 2) : 'N/A'}</p>
                        <p>Updated: {playerData.date_updated ? formatDate(playerData.date_updated) : 'N/A'}</p>
                        <p>8 Hour Change: {playerData['8 Hour Change'] !== undefined ? formatCurrency(playerData['8 Hour Change'], 1) : 'N/A'}</p>
                        <p>24 Hour Change: {playerData['24 Hour Change'] !== undefined ? formatCurrency(playerData['24 Hour Change'], 1) : 'N/A'}</p>
                        <p>3 Day Change: {playerData['3 Day Change'] !== undefined ? formatCurrency(playerData['3 Day Change'], 1) : 'N/A'}</p>
                    </PlayerDetailsContainer>
                    <TransactionContainer label={"Transaction"}>
                        {gameName && (
                            <TransactionComponent gameName={gameName} updateUserData={handleUserDataUpdate} />
                        )}
                    </TransactionContainer>
                </DetailsAndTransactionColumn>
                <PlayerChart playerData={playerData} />
            </PlayerInfoContainer>
        </MainContent>
    );
}
