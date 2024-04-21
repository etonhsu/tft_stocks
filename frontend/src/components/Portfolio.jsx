/* eslint-disable react/prop-types */
import Player from './Player'; // Ensure this import is correct

const Portfolio = ({ players }) => {
    // Check if players is defined and is an object containing keys
    if (!players || typeof players !== 'object' || Object.keys(players).length === 0) {
        return <p>No player data available or still loading...</p>;
    }

    const totalPortfolioValue = Object.values(players).reduce((total, player) => {
        return total + (player.shares * player.price);
    }, 0);

    return (
        <div>
            <h3>Portfolio</h3>
            {Object.entries(players).map(([key, player]) => (
                <Player
                    key={key}
                    name={key}
                    shares={player.shares}
                    price={player.price}
                />
            ))}
            <h4>Total Portfolio Value: ${totalPortfolioValue.toFixed(2)}</h4>
        </div>
    );
};

export default Portfolio;
