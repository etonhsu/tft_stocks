/* eslint-disable react/prop-types */
import PlayerLink from "./PlayerLink.jsx";

const RecentTransactions = ({ transactions }) => {
  if (!transactions || !Array.isArray(transactions)) {
    return <p>No transactions available or still loading...</p>;
  }

  // Create a copy of the transactions array and reverse it
  const reversedTransactions = [...transactions].reverse().slice(0,5);

  return (
    <div>
      <h3>Recent Transactions</h3>
      <ul>
        {reversedTransactions.map((transaction, index) => (
          <li key={index}>
            Type: {transaction.type},
            Name: <PlayerLink gameName={transaction.gameName} />,
            Shares: {transaction.shares},
            Price: ${transaction.price.toFixed(2)},
            Date: {new Date(transaction.transaction_date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
