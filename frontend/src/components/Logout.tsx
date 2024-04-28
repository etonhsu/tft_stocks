import { useNavigate } from 'react-router-dom';

export const LogoutButton: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('dashboardData');
        navigate('/login');
    };

    return (
        <button style = {{
            width: '100%'
        }} onClick={handleLogout}>Logout</button>

    );
}

