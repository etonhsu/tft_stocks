import { useEffect, useState } from 'react';
import UserInfo from '../components/UserInfo';
import RecentTransactions from '../components/RecentTransactions';
import Portfolio from '../components/Portfolio';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []); // Effect runs only once on mount

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please login first.');
      return;
    }

    // Check if cached data is available and valid
    const cachedData = localStorage.getItem('profileData');
    const lastFetch = localStorage.getItem('lastFetchTime');
    const now = new Date();

    if (cachedData && lastFetch && (now.getTime() - parseInt(lastFetch) < 5 * 60 * 1000)) {
      setUser(JSON.parse(cachedData));
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
        // Cache data along with the current timestamp
        localStorage.setItem('profileData', JSON.stringify(data));
        localStorage.setItem('lastFetchTime', now.getTime().toString());
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load the profile: ' + error.message);
    }
  };

  const handleUpdateProfile = () => {
    console.log("Clearing cache and updating profile...");
    localStorage.removeItem('profileData'); // Remove cached data
    localStorage.removeItem('lastFetchTime'); // Remove the timestamp
    fetchData(); // Refetch the profile data
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <button onClick={handleUpdateProfile}>Update Profile</button>
      {user.username && user.password && user.balance && (
        <UserInfo username={user.username} password={user.password} balance={user.balance} />
      )}
      {user.portfolio?.players && (
        <Portfolio players={user.portfolio.players} />
      )}
      {user.transactions && (
        <RecentTransactions transactions={user.transactions} />
      )}
    </div>
  );
}

export default Profile;
