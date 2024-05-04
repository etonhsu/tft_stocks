import { useAuth } from '../../utils/Authentication.tsx';
import {StyledButton} from "../../containers/general/SidebarButton.tsx";

export const LoginButton = () => {
  const { isLoginModalOpen, setLoginModalOpen } = useAuth();

  const handleLogin = () => {
    // Toggle modal open/close based on current state
    setLoginModalOpen(!isLoginModalOpen);
  };

  return (
    <StyledButton onClick={handleLogin}>
      {isLoginModalOpen ? 'Login' : 'Login'}
    </StyledButton>
  );
};
