const API_URL = 'http://localhost:8000/leaderboard';

export async function fetchLeaderboardData(leadType, page = 0, limit = 100) {
  const url = `${API_URL}/${leadType}?limit=${limit}&page=${page}`;  // Append page to the query
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
    throw error;
  }
}