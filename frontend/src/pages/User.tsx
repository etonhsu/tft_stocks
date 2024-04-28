import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Portfolio, Player} from '../components/Portfolio';
import {RecentTransactions, Transaction} from '../components/RecentTransactions';
import {MainContent} from "../containers/MainContent.tsx";

// Define interfaces for the expected data structures
interface User {
  username: string;
  portfolio?: {
    players: { [key: string]: Player; }; // Define the Player type based on your data structure
  };
  transactions: Transaction[]; // Define the Transaction type based on your data structure
}


const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>(); // Specify the type for useParams
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`http://localhost:8000/users/${username}`);
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          throw new Error(data.detail || 'Failed to fetch user data');
        }
      } catch (error) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [username]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data available.</div>;

  return (
      <MainContent>
        <div>
          <h1>User: {user.username}</h1>
          {user.portfolio?.players && <Portfolio players={user.portfolio.players} />}
          {user.transactions && <RecentTransactions transactions={user.transactions} maxEntries={20} />}
        </div>
      </MainContent>
  );
}

export default UserProfile;
