import React from 'react';
import { UserLink } from './UserLink';
import { LeaderboardEntry } from '../services/LeaderboardAPI';
import { StyledPlayerLink } from "../containers/MultiUse/LinkStyle.ts";
import { StyledCell, StyledHeader, StyledRow, StyledTable } from "../containers/MultiUse/TableStyle.tsx";
import styled from "styled-components";
import {LeaderboardDownArrow, LeaderboardUpArrow} from "../assets/Icons.tsx";
import {formatCurrency} from "../utils/CurrencyFormatter.tsx";

interface LeaderboardProps {
    entries: LeaderboardEntry[];
    type: string;
    onSortChange: (sortType: string) => void;
}

const LeaderboardContainer = styled.div`
    position: relative; // This will allow you to absolutely position the label
    margin-left: 3%;
    margin-right: 5%;
    flex: 1;  // Takes up all available space
`;

const IconContainer = styled.div`
    position: relative; // This will allow you to absolutely position the label
    margin-left: 10px;
    margin-top: 1.5px;
    
`;

const DeltaHeader = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, type, onSortChange }) => {
    if (!entries || !Array.isArray(entries)) {
        console.log('Entries are not loaded or not an array:', entries);
        return <p>No leaderboard data available or still loading...</p>;
    }

    if (entries.length === 0) {
        return <p>No entries to display.</p>;
    }

    const handleHeaderClick = (attribute: string) => {
        if (attribute === 'lp') {
            onSortChange('lp');
            return;
        }
        // Build the base attribute name by removing any prefix
        const baseAttribute = attribute.replace('delta_', '').replace('neg_', '');
        // Determine the new attribute by checking the current prefix
        const newType = type.includes(`delta_${baseAttribute}`) ? `neg_${baseAttribute}` : `delta_${baseAttribute}`;
        onSortChange(newType);
    };

    const renderArrowIcon = (attribute: string) => {
        // Extract the base attribute by removing any prefix
        const baseAttribute = attribute.replace('delta_', '').replace('neg_', '');

        // Check the current type state to decide which icon to render
        const isNegative = type.includes(`neg_${baseAttribute}`);

        // Render the appropriate arrow icon based on whether the sort is negative
        return isNegative ? <LeaderboardUpArrow /> : <LeaderboardDownArrow />;
    };

    return (
        <div className="leaderboard">
            <LeaderboardContainer>
                <StyledTable>
                    <thead>
                        <tr>
                            <StyledHeader>Rank</StyledHeader>
                            <StyledHeader>Player</StyledHeader>
                            <StyledHeader onClick={() => handleHeaderClick('lp')}>
                                <DeltaHeader>
                                Price
                                    <IconContainer>
                                        <LeaderboardDownArrow/>
                                    </IconContainer>
                                </DeltaHeader>
                            </StyledHeader>
                            <StyledHeader onClick={() => handleHeaderClick('delta_8h')}>
                                <DeltaHeader>
                                8-Hour Change
                                    <IconContainer>
                                        {renderArrowIcon('8h')}
                                    </IconContainer>
                                </DeltaHeader>
                            </StyledHeader>
                            <StyledHeader onClick={() => handleHeaderClick('delta_24h')}>
                                <DeltaHeader>
                                1-Day Change
                                    <IconContainer>
                                        {renderArrowIcon('24h')}
                                    </IconContainer>
                                </DeltaHeader>
                            </StyledHeader>
                            <StyledHeader onClick={() => handleHeaderClick('delta_72h')}>
                                <DeltaHeader>
                                3-Day Change
                                    <IconContainer>
                                        {renderArrowIcon('72h')}
                                    </IconContainer>
                                </DeltaHeader>
                            </StyledHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, index) => (
                            <StyledRow key={index}>
                                <StyledCell>{entry.rank}</StyledCell>
                                <StyledCell>
                                    {type === 'portfolio' ? (
                                        <UserLink gameName={entry.gameName} />
                                    ) : (
                                        <StyledPlayerLink gameName={entry.gameName} />
                                    )}
                                </StyledCell>
                                <StyledCell>{formatCurrency(entry.lp, 2)}</StyledCell>
                                <StyledCell>{formatCurrency(entry.delta_8h, 1)}</StyledCell>
                                <StyledCell>{formatCurrency(entry.delta_24h, 1)}</StyledCell>
                                <StyledCell>{formatCurrency(entry.delta_72h, 1)}</StyledCell>
                            </StyledRow>
                        ))}
                    </tbody>
                </StyledTable>
            </LeaderboardContainer>
        </div>
    );
};
