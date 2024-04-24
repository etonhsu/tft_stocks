// src/components/LogoutButton.jsx
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the token and cached dashboard data
        localStorage.removeItem('token');
        localStorage.removeItem('dashboardData');  // Clear cached dashboard data
        navigate('/login'); // Redirect user to login page
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

export default LogoutButton;
