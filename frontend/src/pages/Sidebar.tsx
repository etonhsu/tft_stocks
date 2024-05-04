import {useAuth} from "../utils/Authentication.tsx";
import {ActionSection, NavSection, SidebarContainer} from "../containers/general/SidebarContainer.tsx";
import {StyledLink} from "../containers/general/SidebarLink.tsx";
import {DashboardIcon, FavoritesIcon, LeaderboardIcon, TransactionIcon} from "../assets/Icons.tsx";
import {LogoutButton} from "../components/auth/Logout.tsx";
import styled from "styled-components";
import {LoginButton} from "../components/auth/LoginButton.tsx";
import {RegisterButton} from "../components/auth/RegisterButton.tsx";
import {SettingsButton} from "../components/misc/SettingsButton.tsx";

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
                    <SettingsButton/>
                </>
                ) : (
                <>
                    <LoginButton/>
                    <RegisterButton/>
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