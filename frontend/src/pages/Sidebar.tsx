import {useAuth} from "../utils/Authentication.tsx";
import {ActionSection, NavSection, SidebarContainer} from "../containers/General/SidebarContainer.tsx";
import {StyledLink} from "../containers/General/SidebarLink.tsx";
import {DashboardIcon, FavoritesIcon, LeaderboardIcon, SettingsIcon, TransactionIcon} from "../assets/Icons.tsx";
import {LogoutButton} from "../components/Logout.tsx";
import styled from "styled-components";
import {LoginButton} from "../components/LoginButton.tsx";

const TitleContainer = styled.div`
    width: 100%;
    position: relative;
    font-size: 32px;
    font-weight: bold;
    margin-top: 7%;
    margin-bottom: 12%;
`;

export function SidebarComponent() {
    const {token} = useAuth(); // Use useAuth to get the token

    return (
        <SidebarContainer>
            <NavSection>
                <TitleContainer>TFT Stocks</TitleContainer>
                {token ? (
                <>
                    <StyledLink to="/dashboard">
                        <DashboardIcon />Dashboard
                    </StyledLink>
                    <StyledLink to="/leaderboard">
                        <LeaderboardIcon />Leaderboard
                    </StyledLink>
                    <StyledLink to="/favorites">
                        <FavoritesIcon />Favorites
                    </StyledLink>
                    <StyledLink to="/transaction_history">
                        <TransactionIcon />Transactions
                    </StyledLink>
                    <StyledLink to="/transaction_history">
                        <SettingsIcon />Settings
                    </StyledLink>
                </>
                ) : (
                <>
                    <LoginButton/>
                    <StyledLink to="/register">Register</StyledLink>
                    <StyledLink to="/leaderboard">
                    <LeaderboardIcon />Leaderboard
                    </StyledLink>
                </>
                )}
            </NavSection>
            {token && (
                <ActionSection>
                    <LogoutButton/>
                </ActionSection>
            )}
        </SidebarContainer>
    );}