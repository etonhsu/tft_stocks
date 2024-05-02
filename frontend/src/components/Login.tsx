import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainContent } from "../containers/General/MainContent.tsx";
import { useAuth } from '../utils/Authentication.tsx';
import styled from "styled-components";
import {ModalContent, ModalOverlay} from "./StyledComponents.tsx"; // Ensure the path is correct


const LoginBarContainer = styled.div`
    background: #333; // Dark background color
    border-radius: 20px; // Rounded corners
    display: flex;
    align-items: center;
  margin-bottom: 10px;
    padding: 5px 15px;
    height: 40px;
    width: 350px; // Max width of the search bar
  margin-top: 10px;
`;

const StyledInput = styled.input`
    flex: 1;
    border: none;
    background: transparent;
    color: #EAEAEA;
    font-family: 'Sen', sans-serif;
    &:focus {
        outline: none;
    }
`;

const LoginContainer = styled.div`
    padding: 25px;
    margin-left: 40px;
`;

const ButtonContainer = styled.div`
  width: 100%; // Take full width to center the button inside
  display: flex;
  justify-content: center; // Center the button horizontally
`;

export function Login() {
  const [username, setUsername] = useState<string>('');
  // const [password, setPassword] = useState<string>(''); // State for password
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const { setToken, isModalOpen, setModalOpen } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new URLSearchParams();
    formData.append('username', username);
    // formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token); // Optionally you might remove this if token is managed solely through context
        setToken(data.access_token); // Update the global token state
        setModalOpen(false);
        navigate('/dashboard');
      } else {
        throw new Error('Failed to log in');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        alert('Login failed: ' + error.message);
      } else {
        alert('Login failed: An unknown error occurred.');
      }
    }
    setLoading(false); // Stop loading regardless of the outcome
    setModalOpen(false); // Close modal on successful or failed login
  };

  if (!isModalOpen) return null;

  return (
      <MainContent>
        {isModalOpen && (
          <ModalOverlay onClick={() => setModalOpen(false)}> {/* Click on overlay to close modal */}
            <ModalContent onClick={e => e.stopPropagation()}> {/* Prevent clicks from closing modal */}
              <form onSubmit={handleSubmit}>
                <LoginContainer>
                  Username:
                  <LoginBarContainer>
                      <StyledInput
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter Username"
                          required
                      />
                  </LoginBarContainer>
                  Password:
                  <LoginBarContainer>
                    <StyledInput
                        type="password"
                        // value={password}
                        // onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                    />
                </LoginBarContainer>
                </LoginContainer>
                <ButtonContainer>
                  <button type="submit" disabled={loading} className="buttonStyle">
                    {loading ? 'Logging In...' : 'Login'}
                  </button>
                </ButtonContainer>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </MainContent>
  );
}
