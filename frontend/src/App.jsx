import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Login from './pages/Login';
import Profile from './pages/Profile.jsx';
import Dashboard from "./pages/Dashboard.jsx";
import PlayerInfo from './pages/PlayerInfo.jsx'

function App() {

  return (
    <Router>
      <div>
        <nav>
          <Link to="/dashboard">Dashboard</Link> |{" "}
          <Link to="/login">Login</Link> |{" "}
          <Link to="/profile">Profile</Link>
        </nav>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/players/:gameName" element={<PlayerInfo />} /> {/* Dynamic route for PlayerInfo */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

