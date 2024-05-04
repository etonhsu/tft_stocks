import React from 'react';
import { useAuth } from '../../utils/Authentication.tsx';
import {StyledButton} from "../../containers/general/SidebarButton.tsx";
import {SettingsIcon} from "../../assets/Icons.tsx";
import styled from "styled-components";

const IconContainer = styled.div`
    margin-bottom: 1px;
    margin-left: 2px;
`;


export const SettingsButton: React.FC = () => {
  const { isSettingsModalOpen, setSettingsModalOpen, token } = useAuth();

  if (!token) return null; // Only show the button if the user is logged in

  return (
    <StyledButton onClick={() => setSettingsModalOpen(!isSettingsModalOpen)}>
        <IconContainer>
            <SettingsIcon/>
        </IconContainer>
        {isSettingsModalOpen ? 'Settings' : 'Settings'}
    </StyledButton>
  );
};