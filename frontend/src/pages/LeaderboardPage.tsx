import { useEffect, useState } from 'react';
import { Leaderboard } from '../components/Leaderboard';
import { fetchLeaderboardData, LeaderboardEntry } from '../services/LeaderboardAPI';
import { MainContent } from "../containers/General/MainContent";

export const LeaderboardPage = () => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [leadType, setLeadType] = useState('lp');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);

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
                setError('An error occurred while fetching leaderboard data.');
            }
        };

        fetchData();
    }, [leadType, page]);

    const handleSortChange = (type: string) => {
        if (type !== leadType) {
            setLeadType(type);
            setPage(0); // Reset page to 0 when sort type changes
        }
    };

    if (isLoading) {return (<MainContent className="mainContentContainer">Loading...</MainContent>);}
    if (error) {return (<MainContent className="mainContentContainer">Error: No data available.</MainContent>);}

    return (
        <MainContent>
            <div>
                <h1>Leaderboard</h1>
                <Leaderboard entries={entries} type={leadType} onSortChange={handleSortChange} />
                <div>
                    <button disabled={page === 0} onClick={() => setPage(page - 1)} className="buttonStyle">Previous</button>
                    <button onClick={() => setPage(page + 1)} className="buttonStyle">Next</button>
                </div>
            </div>
        </MainContent>
    );
};
