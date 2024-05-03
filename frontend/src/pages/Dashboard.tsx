import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Portfolio, Player } from '../components/Portfolio';
import {Transaction} from "../components/RecentTransactions.tsx";
import {UserAccount} from "../components/UserAccount.tsx";
import axios from 'axios';
import {MainContent} from "../containers/General/MainContent.tsx";
import {AccountColumn, AccountDetailsContainer, AccountContainer} from "../containers/Dashboard/AccountContainer.tsx";
import {UserChart} from "../components/UserChart.tsx";
import {ChartContainer} from "../containers/MultiUse/ChartContainer.tsx";
import {PortfolioContainer} from "../containers/Dashboard/PortfolioContainer.tsx";
import {DashboardControls} from "../components/DashboardRefresh.tsx";
import {PerformersDetailsContainer} from "../containers/Dashboard/PerformersContainer.tsx";
import {TopPerformers} from "../components/TopPerformers.tsx";
import {Text} from "../containers/Dashboard/TextStyle.tsx";
import styled from "styled-components";

export interface UserSummary {
    username: string;
    portfolio: {
        players: { [key: string]: Player };
    };
    transactions: Transaction[];
    balance: number
    portfolio_history: PortfolioHistoryData[];
    one_day_change: number
    three_day_change: number
    rank: number
}

interface PortfolioHistoryData {
    value: number;
    date: Date; // Ensuring it's a Date object
}

const TextContainer = styled.div`
  display: flex;
  flex-direction: column; // Aligns children vertically
`;

export const Dashboard: React.FC = () => {
    const [userSummary, setUserSummary] = useState<UserSummary | null>(null);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

    const updateDashboardState = (newData: UserSummary) => {
        setUserSummary(newData);
        setLoading(false);  // Reset loading state
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage

            if (!token) {
                // No token found, redirect to login page or handle accordingly
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8000/dashboard', {
                    headers: {
                        Authorization: `Bearer ${token}` // Use the token for authorization
                    }
                });
                setUserSummary(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data: ', error);
                setLoading(false);

                // If the server responds with a 401 Unauthorized status, handle it
                if (axios.isAxiosError(error)) {
                    console.error('Axios error status:', error.response?.status);
                    // Now you can safely access the response property if it exists
                    if (error.response?.status === 401) {
                        navigate('/login');
                    }
                }
            }
        };

        fetchData();
    }, [navigate]);

    if (isLoading) {return (<MainContent className="mainContentContainer">Loading...</MainContent>);}
    if (!userSummary) {return (<MainContent className="mainContentContainer">Error: No data available.</MainContent>);}

    return (
        <MainContent>
            <TextContainer>
                <Text size="52px" weight="bold" color='#EAEAEA' padding='10px 5px 0 5px'>
                    {userSummary.username}
                </Text>
                <Text size="22px" weight="bold" color='#EAEAEA' padding='0 0 10px 20px'>
                  {userSummary.rank === 0 ? 'Rank n/a' : `Rank #${userSummary.rank}`}
                </Text>
            </TextContainer>
            <AccountContainer>
                <AccountColumn>
                    <AccountDetailsContainer label={"Overview"}>
                        <UserAccount userSummary={userSummary} />
                    </AccountDetailsContainer>
                    <PerformersDetailsContainer label={"Top Performers"}>
                        <TopPerformers/>
                    </PerformersDetailsContainer>
                </AccountColumn>
                <ChartContainer label={"Performance"}>
                    <UserChart portfolioHistory={userSummary.portfolio_history} />
                </ChartContainer>
            </AccountContainer>
            <PortfolioContainer label={'Portfolio'}>
                <Portfolio players={userSummary.portfolio.players} />
            </PortfolioContainer>
            <DashboardControls updateDashboard={updateDashboardState} />
        </MainContent>
    );
};

