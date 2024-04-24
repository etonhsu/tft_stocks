import { useEffect, useState } from "react";
import { fetchLeaderboardData } from "../services/leaderboardAPI";
import Portfolio from "../components/Portfolio";
import RecentTransactions from "../components/RecentTransactions";
import Leaderboard from "../components/Leaderboard";

function Dashboard() {
    const [userSummary, setUserSummary] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [portfolio, setPortfolio] = useState({});
    const [leaderboardEntries, setLeaderboardEntries] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem('token');

    const fetchData = async () => {
        setIsLoading(true);
        console.log("Starting data fetch...");

        const cachedData = localStorage.getItem('dashboardData');
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            const now = new Date();
            if (now.getTime() - parsedData.timestamp < 300000) {
                console.log("Using cached data...");
                setUserSummary(parsedData.userSummary);
                setRecentTransactions(parsedData.recentTransactions);
                setPortfolio(parsedData.portfolio);
                setLeaderboardEntries(parsedData.leaderboardEntries);
                setIsLoading(false);
                return;
            }
        }

        if (!token) {
            setError('No token found, please login first.');
            setIsLoading(false);
            return;
        }

        try {
            console.log("Fetching new dashboard data...");
            const dashboardResponse = await fetch('http://localhost:8000/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!dashboardResponse.ok) throw new Error('Failed to fetch dashboard data');

            const dashboardData = await dashboardResponse.json();
            console.log("Dashboard Data:", dashboardData);
            setUserSummary(dashboardData.user_summary);
            setRecentTransactions(dashboardData.recent_transactions);
            setPortfolio(dashboardData.user_summary.portfolio);

            const leaderboardData = await fetchLeaderboardData('lp', 5);
            setLeaderboardEntries(leaderboardData.entries);

            const dataToCache = {
                timestamp: new Date().getTime(),
                userSummary: dashboardData.user_summary,
                recentTransactions: dashboardData.recent_transactions,
                portfolio: dashboardData.user_summary.portfolio,
                leaderboardEntries: leaderboardData.entries
            };
            localStorage.setItem('dashboardData', JSON.stringify(dataToCache));
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Failed to load the dashboard: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]); // Effect depends on token

    const handleUpdate = () => {
        console.log("Clearing cache and updating data...");
        localStorage.removeItem('dashboardData');
        fetchData();
    };

    if (error) return <div>Error: {error}</div>;
    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleUpdate}>Update Data</button>
            {userSummary && (
                <>
                    <div>User Summary: {userSummary.username}</div>
                    <Portfolio players={portfolio.players} />
                    <RecentTransactions transactions={recentTransactions} />
                </>
            )}
            <Leaderboard entries={leaderboardEntries} />
        </div>
    );
}

export default Dashboard;
