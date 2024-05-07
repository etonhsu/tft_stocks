import './App.css';
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Login = lazy(() => import('./pages/Login.tsx').then(module => ({ default: module.Login })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const PlayerInfo = lazy(() => import('./pages/PlayerInfo').then(module => ({ default: module.PlayerInfo })));
import { LeaderboardPage } from './pages/LeaderboardPage';
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));
const SearchBar = lazy(() => import('./components/common/SearchBar.tsx').then(module => ({ default: module.SearchBar })));
const UserProfile = lazy(() => import('./pages/User').then(module => ({ default: module.default })));  // Assuming UserProfile is a default export
const PortfolioPage = lazy(() => import('./pages/PortfolioPage').then(module => ({ default: module.PortfolioPage })));
const TransactionPage = lazy(() => import('./pages/TransactionPage').then(module => ({ default: module.TransactionPage })));

import {HeaderBar} from "./containers/general/HeaderBar.tsx";
import {MainContent} from "./containers/general/MainContent.tsx";
import {SidebarComponent} from "./pages/Sidebar.tsx";
import {AuthProvider} from "./utils/Authentication.tsx";
import {Favorites} from "./pages/Favorites.tsx";
import {Settings} from "./pages/Settings.tsx";
import {Slideshow} from "./components/homepage/Slideshow.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <SidebarComponent/>
                <div className="App">
                    <HeaderBar>
                        <SearchBar/>
                    </HeaderBar>
                    <MainContent> {/* Main content area */}
                        <Suspense fallback={<div>Loading...</div>}>
                            <Routes>
                                <Route path="/login" element={<Login/>}/>
                                <Route path="/dashboard" element={<Dashboard/>}/>
                                <Route path="/players/:gameName" element={<PlayerInfo/>}/>
                                <Route path="/leaderboard" element={<LeaderboardPage/>}/>
                                <Route path="/users/:username" element={<UserProfile/>}/>
                                <Route path="/register" element={<Register/>}/>
                                <Route path="/portfolio" element={<PortfolioPage/>}/>
                                <Route path="/transaction_history" element={<TransactionPage/>}/>
                                <Route path="/favorites" element={<Favorites/>}/>
                                <Route path="/" element={<Slideshow/>}/>
                            </Routes>
                        </Suspense>
                    </MainContent>
                </div>
                <Login/>
                <Register/>
                <Settings/>
            </Router>
        </AuthProvider>
    );
}

export default App;
