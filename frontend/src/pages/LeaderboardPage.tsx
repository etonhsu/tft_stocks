import { useEffect, useState } from 'react';
import { Leaderboard } from '../components/Leaderboard';
import { fetchLeaderboardData, LeaderboardEntry } from '../services/LeaderboardAPI';
import axios from 'axios'
import {MainContent} from "../containers/MainContent.tsx";

export const LeaderboardPage = () => {
    const [entries, setEntries] = useState([] as LeaderboardEntry[]);
    const [leadType, setLeadType] = useState('lp');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);

    const leaderboardTypes = [
        'portfolio', 'lp', 'delta_8h', 'delta_24h', 'delta_72h', 'neg_8h', 'neg_24h', 'neg_72h'
    ];

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

                if (axios.isAxiosError(error)) {
                    console.error('Axios error status:', error.response?.status);
                    // Now you can safely access the response property if it exists
                    if (error.response?.status === 401) {
                        // Handle 401 Unauthorized error by redirecting to login page or performing any other action
                        // For example:
                        setError('Unauthorized access. Please login.'); // Set an error message to display
                    } else {
                        // Handle other errors accordingly
                        setError('An error occurred while fetching leaderboard data.'); // Set an error message to display
                    }
                } else {
                    // Handle other types of errors
                    setError('An unexpected error occurred.'); // Set an error message to display
                }
            }
        };

        fetchData();
    }, [leadType, page]);

    const handleLeaderboardChange = (type: string) => {
        setLeadType(type);
        setPage(0);
    };

    if (error) return <div>Error: {error}</div>;
    if (isLoading) return <div>Loading...</div>;

    return (
        <MainContent>
            <div>
                <h1>Leaderboard</h1>
                <div>
                    {leaderboardTypes.map((type) => (
                        <button key={type} onClick={() => handleLeaderboardChange(type)}>
                            {type.toUpperCase()}
                        </button>
                    ))}
                    <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                    <button onClick={() => setPage(page + 1)}>Next</button>
                </div>
                <Leaderboard entries={entries} type={leadType} />
            </div>
        </MainContent>
    );
};

