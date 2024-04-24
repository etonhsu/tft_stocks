import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Login from './pages/Login';
import Profile from './pages/Profile.jsx';
import Dashboard from "./pages/Dashboard.jsx";
import PlayerInfo from './pages/PlayerInfo.jsx';
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import SearchBar from "./components/SearchBar.jsx";
import UserProfile from "./pages/User.jsx";
import Register from "./pages/Register.jsx";
import LogoutButton from './components/Logout.jsx'; // Import LogoutButton

function App() {
    const token = localStorage.getItem('token'); // Get token from localStorage

    return (
        <Router>
            <div>
                <nav style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px'}}>
                    <div>
                        <Link to="/dashboard">Dashboard</Link> |{" "}
                        {token ? (
                            <>
                                <Link to="/profile">Profile</Link> |{" "}
                                <Link to="/leaderboard">Leaderboard</Link> |{" "}
                                <LogoutButton /> {/* Show Logout Button when logged in */}
                            </>
                        ) : (
                            <>
                                <Link to="/login">Login</Link> |{" "}
                                <Link to="/register">Register</Link>
                            </>
                        )}
                    </div>
                    <SearchBar />
                </nav>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/players/:gameName" element={<PlayerInfo />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/users/:username" element={<UserProfile />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
