import {PlayerLink} from './PlayerLink.tsx'

export interface Player {
    shares: number;
    purchase_price: number;
    current_price: number;
}


interface PortfolioProps {
    players: { [key: string]: Player };
}

export const Portfolio: React.FC<PortfolioProps> = ({ players }) => {
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
                    <PlayerLink gameName={key} />
                    <span>{': '}
                        Shares: {player.shares}, Purchase Price: ${player.purchase_price.toFixed(2)}, Current Price: ${player.current_price.toFixed(2)}
                    </span>
                </div>
            ))}
            <h4>Total Portfolio Value: ${totalPortfolioValue.toFixed(2)}</h4>
        </div>
    );
};

