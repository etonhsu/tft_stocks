/* eslint-disable react/prop-types */
import PlayerLink from './PlayerLink';
import UserLink from './UserLink'; // Import the UserLink component

const Leaderboard = ({ entries, type }) => {
    if (!entries || !Array.isArray(entries)) {
        console.log('Entries are not loaded or not an array:', entries);
        return <p>No leaderboard data available or still loading...</p>;
    }

    if (entries.length === 0) {
        return <p>No entries to display.</p>;
    }

    return (
        <div className="leaderboard">
            <h2>Leaderboard</h2>
            <ul>
                {entries.map((entry, index) => (
                    <li key={index}>
                        <span>{entry.rank}. </span>
                        {type === 'portfolio' ? (
                            <UserLink gameName={entry.gameName} /> // Use UserLink for portfolio type
                        ) : (
                            <PlayerLink gameName={entry.gameName} /> // Use PlayerLink otherwise
                        )}
                        <span> - <strong>{entry.value}</strong></span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
