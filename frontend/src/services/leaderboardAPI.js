const API_URL = 'http://localhost:8000/leaderboard';

export async function fetchLeaderboardData(leadType, limit = 100) {  // Default limit set to 100
  try {
    // Append the limit to the URL as a query parameter
    const url = `${API_URL}/${leadType}?limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
    throw error;  // Re-throw to handle it in the calling component
  }
}