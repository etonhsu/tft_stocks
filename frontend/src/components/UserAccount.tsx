import React from 'react';
import {UserSummary} from "../pages/Dashboard.tsx";
import {Player} from "./Portfolio.tsx";
import styled from "styled-components";

interface UserAccountProps {
    userSummary: UserSummary;
}

const ChangesLabelContainer = styled.div`
    display: flex;
    justify-content: space-between; // Adjusts the spacing between children elements
    align-items: center; // Aligns items vertically
    padding-right: 55px;
    padding-top: 0px;
`;

const ChangesContainer = styled.div`
    display: flex;
    justify-content: space-between; // Adjusts the spacing between children elements
    align-items: center; // Aligns items vertically
    padding-right: 69px;
    padding-top: 0px;
`;

const BalancePortfolioLabelContainer = styled.div`
    display: flex;
    justify-content: space-between; // Adjusts the spacing between children elements
    align-items: center; // Aligns items vertically
    padding-right: 90px;
    padding-top: 0px;
`;

const BalancePortfolioContainer = styled.div`
    display: flex;
    justify-content: space-between; // Adjusts the spacing between children elements
    align-items: center; // Aligns items vertically
    padding-right: 58px;
    padding-top: 0px;
`;

const ValueLabel = styled.p`
    margin-top: 15px; // Reduces the space below the paragraph
    margin-bottom: 0px;
    font-size: 14px; // Set the size as needed
`;

const AccountValue = styled.h2`
    margin: 0; // Reduces the space above the heading
    font-size: 40px; // Increase font size as needed
`;

const ChangeValue = styled.h2`
    margin: 0; // Reduces the space above the heading
    font-size: 20px; // Increase font size as needed
    
`;

const ValueText = styled.span<{isPositive: boolean}>`
    color: ${props => props.isPositive ? '#82ca9d' : '#f44336'};
`;

export const UserAccount: React.FC<UserAccountProps> = ({ userSummary }) => {
    const calculateTotalPortfolioValue = (players: { [key: string]: Player }): number => {
        return Object.values(players).reduce((total, player) => {
            return total + (player.shares * player.current_price);
        }, 0);
    };

    const changeOverDays = (days: number): number => {
        const millisecondsPerDay = 86400000; // Number of milliseconds in a day
        const currentDate = new Date();
        const pastDate = new Date(currentDate.getTime() - (millisecondsPerDay * days));
        const currentPortfolio = calculateTotalPortfolioValue(userSummary.portfolio.players) + userSummary.balance;
        let pastSnapshot = userSummary.portfolio_history.find(history => {
            const historyDate = new Date(history.date);
            return historyDate <= pastDate;
        });

        // If no snapshot is found for the exact period, use the oldest available snapshot
        if (!pastSnapshot && userSummary.portfolio_history.length > 0) {
            pastSnapshot = userSummary.portfolio_history[0]; // Assuming the array is sorted by date
        }

        return pastSnapshot ? currentPortfolio - pastSnapshot.value : 0; // Returns the change if a past snapshot exists
    };

    const formatCurrency = (value: number): JSX.Element => {
        const isPositive = value >= 0;
        const formattedValue = `${isPositive ? '+' : '-'}$${Math.abs(value).toFixed(2)}`;
        return <ValueText isPositive={isPositive}>{formattedValue}</ValueText>;
    };

    const balance = userSummary.balance
    const portfolioTotal = calculateTotalPortfolioValue(userSummary.portfolio.players);
    const accountTotal = userSummary.balance + portfolioTotal;

    const change24Hours = changeOverDays(1);
    const change3Days = changeOverDays(3);

    return (
        <div>
            <ValueLabel>Account Value: </ValueLabel>
            <AccountValue>${accountTotal.toFixed(2)}</AccountValue>
            <ChangesLabelContainer>
                <ValueLabel>1-Day Change:</ValueLabel>
                <ValueLabel>3-Day Change:</ValueLabel>
            </ChangesLabelContainer>
            <ChangesContainer>
                <ChangeValue>{formatCurrency(change24Hours)}</ChangeValue>
                <ChangeValue>{formatCurrency(change3Days)}</ChangeValue>
            </ChangesContainer>
            <BalancePortfolioLabelContainer>
                <ValueLabel>Balance:</ValueLabel>
                <ValueLabel>Portfolio:</ValueLabel>
            </BalancePortfolioLabelContainer>
            <BalancePortfolioContainer>
                <ChangeValue>${balance.toFixed(2)}</ChangeValue>
                <ChangeValue>${portfolioTotal.toFixed(2)}</ChangeValue>
            </BalancePortfolioContainer>
        </div>
    );
};

