import React from 'react';
import styled from "styled-components";
import {PortfolioLeaderboardEntry} from "../../services/LeaderboardAPI.ts";
import {StyledUserLink} from "../../containers/multiUse/LinkStyle.ts";
import { ClickStyledHeader, StyledCell, StyledHeader, StyledRow, StyledTable } from "../../containers/multiUse/TableStyle.tsx";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {formatCurrency} from "../../utils/CurrencyFormatter.tsx";

interface PortfolioLeaderboardProps {
    entries: PortfolioLeaderboardEntry[];
    type: string;
    onSortChange: (sortType: string) => void;
}

const PortfolioLeaderboardContainer = styled.div`
    position: relative;
    margin-left: 3%;
    margin-right: 5%;
    flex: 1;
`;

const IconContainer = styled.div`
    position: relative;
    margin-left: 10px;
    margin-top: 1.5px;
`;

const DeltaHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const PortfolioLeaderboard: React.FC<PortfolioLeaderboardProps> = ({ entries, type, onSortChange }) => {
    if (!entries || !Array.isArray(entries)) {
        console.log('Entries are not loaded or not an array:', entries);
        return <p>No portfolio data available or still loading...</p>;
    }

    if (entries.length === 0) {
        return <p>No portfolio entries to display.</p>;
    }

    const handleHeaderClick = (attribute: string) => {
        onSortChange(attribute);
    };

    const renderArrowIcon = (attribute: string) => {
        if (type === attribute) {
            return <FaSortUp />;
        } else if (`neg_${type}` === attribute) {
            return <FaSortDown />;
        }
        return <FaSort />;
    };

    return (
        <div className="portfolio-leaderboard">
            <PortfolioLeaderboardContainer>
                <StyledTable>
                    <thead>
                        <tr>
                            <StyledHeader>Rank</StyledHeader>
                            <StyledHeader>Username</StyledHeader>
                            <ClickStyledHeader onClick={() => handleHeaderClick('value')}>
                                <DeltaHeader>
                                    Value
                                    <IconContainer>
                                        {renderArrowIcon(type)}
                                    </IconContainer>
                                </DeltaHeader>
                            </ClickStyledHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, index) => (
                            <StyledRow key={index}>
                                <StyledCell>{entry.rank}</StyledCell>
                                <StyledCell>
                                    <StyledUserLink gameName={entry.username} />
                                </StyledCell>
                                <StyledCell>{formatCurrency(entry.value, 2)}</StyledCell>
                            </StyledRow>
                        ))}
                    </tbody>
                </StyledTable>
            </PortfolioLeaderboardContainer>
        </div>
    );
};
