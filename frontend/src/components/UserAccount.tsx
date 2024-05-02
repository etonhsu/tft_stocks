import React from 'react';
import {UserSummary} from "../pages/Dashboard.tsx";
import {Player} from "./Portfolio.tsx";
import styled from "styled-components";
import {formatCurrency} from "../utils/CurrencyFormatter.tsx";

interface UserAccountProps {
    userSummary: UserSummary;
}

const ChangesLabelContainer = styled.div`
    display: flex;
    justify-content: space-between; // Adjusts the spacing between children elements
    align-items: center; // Aligns items vertically
    padding-right: 55px;
    padding-top: 0;
`;

const ChangesContainer = styled.div`
    display: flex;
    justify-content: space-between; // Adjusts the spacing between children elements
    align-items: center; // Aligns items vertically
    padding-right: 52px;
    padding-top: 0;
`;

const BalancePortfolioLabelContainer = styled.div`
    display: flex;
    justify-content: space-between; // Adjusts the spacing between children elements
    align-items: center; // Aligns items vertically
    padding-right: 90px;
    padding-top: 0;
`;

const BalancePortfolioContainer = styled.div`
    display: flex;
    justify-content: space-between; // Adjusts the spacing between children elements
    align-items: center; // Aligns items vertically
    padding-right: 52px;
    padding-top: 0;
`;

const ValueLabel = styled.p`
    margin-top: 15px; // Reduces the space below the paragraph
    margin-bottom: 0;
    font-size: 14px; // Set the size as needed
    color: #EAEAEA;
`;

const AccountValue = styled.h2`
    margin: 0; // Reduces the space above the heading
    font-size: 40px; // Increase font size as needed
    color: #EAEAEA;
`;

const ChangeValue = styled.h2`
    // Reduces the space above the heading
    margin: 0;
    font-size: 20px; // Increase font size as needed
    color: #EAEAEA;

`;


export const UserAccount: React.FC<UserAccountProps> = ({ userSummary }) => {
    const calculateTotalPortfolioValue = (players: { [key: string]: Player }): number => {
        return Object.values(players).reduce((total, player) => {
            return total + (player.shares * player.current_price);
        }, 0);
    };

    const balance = userSummary.balance
    const portfolioTotal = calculateTotalPortfolioValue(userSummary.portfolio.players);
    const accountTotal = userSummary.balance + portfolioTotal;
    const change24Hours = userSummary.one_day_change;
    const change3Days = userSummary.three_day_change;


    return (
        <div>
            <ValueLabel>Account Value: </ValueLabel>
            <AccountValue>{formatCurrency(accountTotal, 2)}</AccountValue>
            <ChangesLabelContainer>
                <ValueLabel>1-Day Change:</ValueLabel>
                <ValueLabel>3-Day Change:</ValueLabel>
            </ChangesLabelContainer>
            <ChangesContainer>
                <ChangeValue>{formatCurrency(change24Hours, 1)}</ChangeValue>
                <ChangeValue>{formatCurrency(change3Days, 1)}</ChangeValue>
            </ChangesContainer>
            <BalancePortfolioLabelContainer>
                <ValueLabel>Balance:</ValueLabel>
                <ValueLabel>Portfolio:</ValueLabel>
            </BalancePortfolioLabelContainer>
            <BalancePortfolioContainer>
                <ChangeValue>{formatCurrency(balance, 2)}</ChangeValue>
                <ChangeValue>{formatCurrency(portfolioTotal, 2)}</ChangeValue>
            </BalancePortfolioContainer>
        </div>
    );
};

