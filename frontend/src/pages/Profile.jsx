import { useEffect, useState } from 'react';
import UserInfo from '../components/UserInfo';
import RecentTransactions from '../components/RecentTransactions';
import Portfolio from '../components/Portfolio';

function Profile() {
  const [user, setUser] = useState(null);  // Initialize user as null for better clarity
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please login first.');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to load the profile: ' + error.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  // Ensuring each component has the necessary data to render properly
  return (
    <div>
      {user.username && user.balance && <UserInfo username={user.username} balance={user.balance} />}
      {user.portfolio?.players && <Portfolio players={user.portfolio.players} />}
      {user.transactions && <RecentTransactions transactions={user.transactions} />}
    </div>
  );
}

export default Profile;
