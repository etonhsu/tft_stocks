import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Portfolio, Player } from '../components/Portfolio';
import {RecentTransactions, Transaction} from "../components/RecentTransactions.tsx";
import axios from 'axios';
import {MainContent} from "../containers/MainContent.tsx";

interface UserSummary {
    username: string;
    portfolio: {
        players: { [key: string]: Player };
    };
    transactions: Transaction[];
    balance: number
}

export const Dashboard: React.FC = () => {
    const [userSummary, setUserSummary] = useState<UserSummary | null>(null);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!userSummary) {
        return <div>Error: No data available.</div>;
    }

    return (
        <MainContent>
            <div>
                <h2>Welcome, {userSummary.username}</h2>
                <Portfolio players={userSummary.portfolio.players} />
                <h2>Balance: {userSummary.balance}</h2>
                <RecentTransactions transactions={userSummary.transactions} maxEntries={5} />
            </div>
        </MainContent>
    );
};

