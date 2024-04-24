/* eslint-disable react/prop-types */
import PlayerLink from './PlayerLink'

const Portfolio = ({ players }) => {
    // Check if players is defined and is an object containing keys
    if (!players || typeof players !== 'object' || Object.keys(players). length === 0) {
        return <p>No player data available or still loading...</p>;
    }

    const totalPortfolioValue = Object.values(players).reduce((total, player) => {
        return total + (player.shares * player.current_price); // Assuming you want the total value based on current prices
    }, 0);

    return (
        <div>
            <h3>Portfolio</h3>
            {Object.entries(players).map(([key, player]) => (
                <div key={key}>
                    <PlayerLink gameName={key}> {/* Wrap game name with PlayerLink */}
                        {key}
                    </PlayerLink>:
                    Shares: {player.shares},
                    Purchase Price: ${player.purchase_price.toFixed(2)},
                    Current Price: ${player.current_price.toFixed(2)}
                </div>
            ))}
            <h4>Total Portfolio Value: ${totalPortfolioValue.toFixed(2)}</h4>
        </div>
    );
};

export default Portfolio;
