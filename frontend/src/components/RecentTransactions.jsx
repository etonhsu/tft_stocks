/* eslint-disable react/prop-types */


const RecentTransactions = ({ transactions }) => {
  if (!transactions || !Array.isArray(transactions)) {
    return <p>No transactions available or still loading...</p>;
  }

  return (
    <div>
      <h3>Recent Transactions</h3>
      <ul>
        {transactions.slice(0, 5).reverse().map((transaction, index) => (
          <li key={index}>
            Type: {transaction.type},
            Game: {transaction.gameName},
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