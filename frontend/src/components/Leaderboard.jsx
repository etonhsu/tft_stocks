/* eslint-disable react/prop-types */
import PlayerLink from './PlayerLink'

const Leaderboard = ({ entries }) => {
    if (!entries || !Array.isArray(entries)) {
        console.log('Entries are not loaded or not an array:', entries);
        return <p>No leaderboard data available or still loading...</p>;
    }

    return (
        <div className="leaderboard">
            <h2>Leaderboard</h2>
            <ul>
                {entries.map((entry, index) => (
                    <li key={index}>
                        <span>{entry.rank}. </span>
                        <PlayerLink gameName={entry.gameName} />
                        <span> - <strong>{entry.value}</strong></span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;