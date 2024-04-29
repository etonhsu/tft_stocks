import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {MainContent} from "../containers/General/MainContent.tsx";

export function Login() {
  const [username, setUsername] = useState<string>('');  // Specify string type for username
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {  // Type the event
    event.preventDefault();
    const formData = new URLSearchParams();
    formData.append('username', username);

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      if (response.ok) {
        const data = await response.json(); // Parse the JSON from the response
        localStorage.setItem('token', data.access_token); // Save the token to local storage or session storage as preferred
        navigate('/dashboard'); // Redirect to the profile page
      } else {
        throw new Error('Failed to log in');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {  // Proper type check for the error
        alert('Login failed: ' + error.message);
      } else {
        alert('Login failed: An unknown error occurred.');
      }
    }
  };

  return (
      <MainContent>
        <div>
          <form onSubmit={handleSubmit}>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}  // Specify the event type
                required
              />
            </label>
            <button type="submit">Login</button>
          </form>
        </div>
      </MainContent>
  );
}