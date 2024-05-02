const API_URL: string = 'http://localhost:8000/leaderboard';

export interface LeaderboardEntry {
  gameName: string;
  lp: number; // League points
  delta_8h: number; // Change in 8 hours
  delta_24h: number; // Change in 24 hours
  delta_72h: number; // Change in 72 hours
  rank: number;
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalEntries: number;
}

export async function fetchLeaderboardData(leadType: string, page: number = 0, limit: number = 100): Promise<LeaderboardResponse> {
  const url: string = `${API_URL}/${leadType}?limit=${limit}&page=${page}`; // Use leadType to specify sorting by specific attribute
  try {
    const response: Response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // Transform the data if necessary, e.g., combine fields or adapt names
    return {
      entries: data.entries.map((entry: LeaderboardEntry) => ({
        gameName: entry.gameName,
        lp: entry.lp,
        delta_8h: entry.delta_8h,
        delta_24h: entry.delta_24h,
        delta_72h: entry.delta_72h,
        rank: entry.rank
      })),
      totalEntries: data.totalEntries
    };
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
    throw error;
  }
}
