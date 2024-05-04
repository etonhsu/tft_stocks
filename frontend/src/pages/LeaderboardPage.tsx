import { useEffect, useState } from 'react';
import { Leaderboard } from '../components/leaderboard/Leaderboard.tsx';
import { fetchLeaderboardData, LeaderboardEntry } from '../services/LeaderboardAPI';
import { MainContent } from "../containers/general/MainContent";
import {
    LeaderboardButtonContainer,
    NextButtonContainer,
    PrevButtonContainer
} from "../containers/leaderboard/LeaderboardContainer.tsx";
import styled from "styled-components";

export const StyledButton = styled.button`
    display: flex;
    align-items: center; /* Vertically center the children */
    justify-content: center; /* Aligns children (icon and text) to the start of the container */
    padding: 13px 15px;
    margin: 5px 0;
    font-weight: normal;
    font-size: 16px;
    background: #333; // Use the color from your design
    color: #EAEAEA;
    text-decoration: none;
    border: none; // Remove default button border
    border-radius: 4px;
    width: calc(100%);
    cursor: pointer; // Ensure it's recognizable as a clickable button

    svg {
        margin-right: 8px; /* Space between icon and text */
        transform: translateY(4px);
        height: 20px; /* Adjust height to match your design */
        width: 20px; /* Adjust width to maintain aspect ratio */
    }

    &:hover {
        background: #444; // Slightly lighter color on hover
        color: cornflowerblue;
    }

    &:active {
        background: #555; // An even lighter color for active or focus state
    }

    &:focus {
        outline: none; // Removes the outline to match NavLink behavior
    }
`;

export const LeaderboardPage = () => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [leadType, setLeadType] = useState('lp');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchLeaderboardData(leadType, page, 100);
                setEntries(data.entries);
                setIsLoading(false);
            } catch (error) {
                console.error('Fetch error:', error);
                setIsLoading(false);
                setError('An error occurred while fetching leaderboard data.');
            }
        };

        fetchData();
    }, [leadType, page]);

    const handleSortChange = (type: string) => {
        if (type !== leadType) {
            setLeadType(type);
            setPage(0); // Reset page to 0 when sort type changes
        }
    };

    if (isLoading) {return (<MainContent className="mainContentContainer">Loading...</MainContent>);}
    if (error) {return (<MainContent className="mainContentContainer">Error: No data available.</MainContent>);}

    return (
        <MainContent>
            <div>
                <h1>Leaderboard</h1>
                <Leaderboard entries={entries} type={leadType} onSortChange={handleSortChange} />
                <LeaderboardButtonContainer>
                    <PrevButtonContainer>
                        <StyledButton disabled={page === 0} onClick={() => setPage(page - 1)} className="buttonStyle">Previous</StyledButton>
                    </PrevButtonContainer>
                    <NextButtonContainer>
                        <StyledButton onClick={() => setPage(page + 1)} className="buttonStyle">Next</StyledButton>
                    </NextButtonContainer>
                </LeaderboardButtonContainer>
            </div>
        </MainContent>
    );
};
