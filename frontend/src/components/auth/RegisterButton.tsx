// RegisterButton.tsx
import React from 'react';
import { useAuth } from '../../utils/Authentication.tsx';
import { StyledButton } from '../../containers/general/SidebarButton.tsx';  // Make sure the path is correct

export const RegisterButton: React.FC = () => {
    const { isRegisterModalOpen, setRegisterModalOpen } = useAuth();

    const handleRegisterClick = () => {
        setRegisterModalOpen(!isRegisterModalOpen);
    };

    return (
        <StyledButton onClick={handleRegisterClick}>
            {isRegisterModalOpen ? 'Register' : 'Register'}
        </StyledButton>
    );
};
