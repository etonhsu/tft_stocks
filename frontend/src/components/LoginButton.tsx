import { useAuth } from '../utils/Authentication.tsx';
import {StyledButton} from "../containers/General/Sidebar Button.tsx";

export const LoginButton = () => {
  const { isModalOpen, setModalOpen } = useAuth();

  const handleLogin = () => {
    // Toggle modal open/close based on current state
    setModalOpen(!isModalOpen);
  };

  return (
    <StyledButton onClick={handleLogin}>
      {isModalOpen ? 'Login' : 'Login'}
    </StyledButton>
  );
};
