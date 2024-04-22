import { useEffect, useState } from 'react';
import UserInfo from '../components/UserInfo';
import RecentTransactions from '../components/RecentTransactions';
import Portfolio from '../components/Portfolio';
import Leaderboard from '../components/Leaderboard';  // Assuming you've created this component

function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found, please login first.');
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setDashboardData(data);
                } else {
                    throw new Error('Failed to fetch dashboard data');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                setError('Failed to load the dashboard: ' + error.message);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!dashboardData) {
        return <div>Loading...</div>;
    }

    // Render components with necessary data
    return (
        <div>
            <h1>Dashboard for {dashboardData.user_summary.username}</h1>
            <Portfolio players={dashboardData.user_summary.portfolio.players} />
            <RecentTransactions transactions={dashboardData.recent_transactions} />
            <Leaderboard entries={dashboardData.top_leaderboard_entries} />
        </div>
    );
}

export default Dashboard;
