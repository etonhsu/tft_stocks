const API_URL: string = 'http://localhost:8000/leaderboard';

export interface LeaderboardEntry {
  // Define the structure of a single leaderboard entry
  // Adjust these properties according to the actual structure of the returned data
  gameName: string;
  value: number;
  rank: number;
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalEntries: number;
}

export async function fetchLeaderboardData(leadType: string, page: number = 0, limit: number = 100): Promise<LeaderboardResponse> {
  const url: string = `${API_URL}/${leadType}?limit=${limit}&page=${page}`;  // Append page to the query
  try {
    const response: Response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
    throw error;
  }
}
