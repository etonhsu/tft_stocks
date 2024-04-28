import {PlayerLink} from "./PlayerLink.tsx";

// Define the structure of a transaction object
export interface Transaction {
    type: string;
    gameName: string;
    shares: number;
    price: number;
    transaction_date: string; // Assuming transaction_date is a string of date
}

// Define the props for the RecentTransactions component
interface RecentTransactionsProps {
    transactions: Transaction[];
    maxEntries: number
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, maxEntries }) => {
  if (!transactions || !Array.isArray(transactions)) {
    return <p>No transactions available or still loading...</p>;
  }

  // Create a copy of the transactions array and reverse it
  const reversedTransactions = [...transactions].reverse().slice(0,maxEntries);

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
