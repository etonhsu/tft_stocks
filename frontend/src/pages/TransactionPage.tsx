import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RecentTransactions, Transaction } from "../components/RecentTransactions";

// TransactionPage component
export const TransactionPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Transaction[]>('http://localhost:8000/transaction_history', {
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
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Transaction History</h2>
            <RecentTransactions transactions={transactions} maxEntries={20} />
        </div>
    );
};

