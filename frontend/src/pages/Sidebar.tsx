import {useAuth} from "../utils/Authentication.tsx";
import {ActionSection, NavSection, SidebarContainer} from "../containers/general/SidebarContainer.tsx";
import {StyledLink} from "../containers/general/SidebarLink.tsx";
import {DashboardIcon, FavoritesIcon, LeaderboardIcon, Logo, TransactionIcon} from "../assets/Icons.tsx";
import {LogoutButton} from "../components/auth/Logout.tsx";
import styled from "styled-components";
import {LoginButton} from "../components/auth/LoginButton.tsx";
import {RegisterButton} from "../components/auth/RegisterButton.tsx";
import {SettingsButton} from "../components/sidebar/SettingsButton.tsx";

const TitleContainer = styled.div`
    width: 100%;
    position: relative;
    font-size: 2vw;
    font-weight: bold;
    margin-top: 2vh;
    margin-bottom: 12%;
`;

const LogoContainer = styled.div`
    margin-top: 3.6vh;
    margin-right: 10px;
`;

const TitleLogo = styled.div`
    display: flex;
    flex-direction: row;
`;


export function SidebarComponent() {
    const {token} = useAuth(); // Use useAuth to get the token

    return (
        <SidebarContainer>
            <NavSection>
                <TitleLogo>
                    <LogoContainer><Logo/></LogoContainer>
                    <TitleContainer>TFT Stocks</TitleContainer>
                </TitleLogo>
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