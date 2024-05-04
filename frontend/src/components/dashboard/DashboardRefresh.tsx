// DashboardControls.js
import { useState } from 'react';
import {UserSummary} from "../../pages/Dashboard.tsx";
import axios from 'axios';
import {useNavigate} from "react-router-dom";

interface DashboardControlsProps {
    updateDashboard: (newData: UserSummary) => void;
}

export function DashboardControls({ updateDashboard }: DashboardControlsProps) {
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    const refreshDashboard = async () => {
        setLoading(true);
        setMessage('');
        const token = localStorage.getItem('token');

        if (!token) {
            // No token found, redirect to login page or handle accordingly
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/refresh_dashboard', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage('dashboard data updated successfully.');
            if (response.data) {
                updateDashboard(response.data as UserSummary); // Casting to UserSummary to ensure type safety
            }
        } catch (error) {
            console.error('Failed to update dashboard:', error);
            setMessage('Failed to update data. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div>
            <button onClick={refreshDashboard} disabled={isLoading} className="buttonStyle">
                {isLoading ? 'Updating...' : 'Update dashboard'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}

