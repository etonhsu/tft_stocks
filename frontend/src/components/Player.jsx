/* eslint-disable react/prop-types */

const Player = ({ name, shares, price }) => {
    if (!name || typeof shares !== 'number' || typeof price !== 'number') {
        console.error('Invalid props:', { name, shares, price });
        return <p>Error: Data for player is incomplete or still loading...</p>;
    }

  const totalValue = shares * price; // Calculate the total value here since it's not passed

  return (
    <div>
      <h3>{name}</h3>
      <p>Shares: {shares}</p>
      <p>Price per Share: ${price.toFixed(2)}</p>
      <p>Total Value: ${totalValue.toFixed(2)}</p>
    </div>
  );
};

export default Player;