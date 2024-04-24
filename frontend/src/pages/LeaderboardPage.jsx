import { useEffect, useState } from 'react';
import Leaderboard from '../components/Leaderboard';
import { fetchLeaderboardData } from '../services/leaderboardAPI';

const LeaderboardPage = () => {
    const [entries, setEntries] = useState([]);
    const [leadType, setLeadType] = useState('lp'); // Default type
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Define valid leaderboard types
    const leaderboardTypes = [
        'portfolio', 'lp', 'delta_8h', 'delta_24h', 'delta_72h', 'neg_8h', 'neg_24h', 'neg_72h'
    ];

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchLeaderboardData(leadType, 100); // Fetching 100 entries
                setEntries(data.entries);
            } catch (error) {
                console.error('Fetch error:', error);
                setError(`Failed to load the leaderboard: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [leadType]); // Effect depends on leadType

    const handleLeaderboardChange = (type) => {
        setLeadType(type); // Update the leaderboard type
    };

    if (error) return <div>Error: {error}</div>;
    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Leaderboard</h1>
            {/* Render buttons to switch leaderboard types */}
            <div>
                {leaderboardTypes.map((type) => (
                    <button key={type} onClick={() => handleLeaderboardChange(type)}>
                        {type.toUpperCase()}
                    </button>
                ))}
            </div>
            <Leaderboard entries={entries} />
        </div>
    );
};

export default LeaderboardPage;
