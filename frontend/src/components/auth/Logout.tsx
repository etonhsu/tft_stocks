import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/Authentication.tsx'; // Ensure the path is correct

export const LogoutButton: React.FC = () => {
    const navigate = useNavigate();
    const { setToken } = useAuth(); // Use the useAuth hook to get the setToken method

    const handleLogout = () => {
        localStorage.removeItem('token'); // Optionally you might remove this if token is managed solely through context
        localStorage.removeItem('dashboardData');
        setToken(null); // Update the global token state to null
        navigate('/');
    };

    return (
        <button style={{
            width: '100%',
            color: '#222',
            background: '#EAEAEA'
        }} onClick={handleLogout}>Logout</button>
    );
}
