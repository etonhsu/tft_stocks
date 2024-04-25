import { useEffect, useState } from 'react';
import Leaderboard from '../components/Leaderboard';
import { fetchLeaderboardData } from '../services/leaderboardAPI';

const LeaderboardPage = () => {
    const [entries, setEntries] = useState([]);
    const [leadType, setLeadType] = useState('lp');  // Default type
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);  // State to manage current page

    const leaderboardTypes = [
        'portfolio', 'lp', 'delta_8h', 'delta_24h', 'delta_72h', 'neg_8h', 'neg_24h', 'neg_72h'
    ];

    useEffect(() => {
        setIsLoading(true);
        fetchLeaderboardData(leadType, page, 100)  // Pass the page to fetch function
            .then(data => {
                setEntries(data.entries);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setError(`Failed to load the leaderboard: ${error.message}`);
                setIsLoading(false);
            });
    }, [leadType, page]);  // Depend on leadType and page

    const handleLeaderboardChange = (type) => {
        setLeadType(type);
        setPage(0);  // Reset page to 0 when type changes
    };

    if (error) return <div>Error: {error}</div>;
    if (isLoading) return <div>Loading...</div>;

    return (
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
    );
};

export default LeaderboardPage;
