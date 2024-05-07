import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RecentTransactions, Transaction } from "../components/transactions/RecentTransactions.tsx";
import {MainContent} from "../containers/general/MainContent.tsx";

// TransactionPage component
export const TransactionPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Transaction[]>(`${backendUrl}/transaction_history`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.data) {
                    setTransactions(response.data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 401) {
                        navigate('/login');
                    }
                }
                setError('Failed to fetch transactions');
                setLoading(false);
            }
        };

        fetchData();
    }, [backendUrl, navigate]);

    if (isLoading) {return (<MainContent className="mainContentContainer">Loading...</MainContent>);}
    if (error) {return (<MainContent className="mainContentContainer">Error: No data available.</MainContent>);}

    return (
        <MainContent>
            <h1>Transaction History</h1>
            <RecentTransactions transactions={transactions} maxEntries={20} />
        </MainContent>
    );
};

