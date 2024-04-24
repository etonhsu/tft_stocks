import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Portfolio from '../components/Portfolio';
import RecentTransactions from '../components/RecentTransactions';

function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      } catch (err) {
        setError(err.message);
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
    <div>
      <h1>User: {user.username}</h1>
      {user.portfolio?.players && <Portfolio players={user.portfolio.players} />}
      {user.transactions && <RecentTransactions transactions={user.transactions} />}
    </div>
  );
}

export default UserProfile;
