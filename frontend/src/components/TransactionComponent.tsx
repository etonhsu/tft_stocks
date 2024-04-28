import React, { useState } from "react";
import styled from "styled-components";

const TransactionForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 10px 0;
`;

const TransactionSelect = styled.select`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TransactionInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TransactionButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #646cff;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #535bf2;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export interface UserData {
    gameName: string; // Example property
    price: number;
    shares: number; // Example property
    // Add other necessary properties
}

interface TransactionComponentProps {
    gameName: string; // Make gameName optional
    updateUserData: (data: UserData) => void; // Adjust the type of `data` according to what `updateUserData` expects
}

export const TransactionComponent: React.FC<TransactionComponentProps> = ({ gameName = '', updateUserData }) => {
    const [shares, setShares] = useState<number>(1);
    const [confirmTransaction, setConfirmTransaction] = useState<boolean>(false);
    const [transactionType, setTransactionType] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // const initiateTransaction = (type: string) => {
    //     setError('');
    //     setTransactionType(type);
    //     setConfirmTransaction(true);
    // };

    const handleTransaction = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8000/players/${gameName}/${transactionType}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ shares })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'Transaction failed');
            updateUserData(data);
            setConfirmTransaction(false);
            setError('');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
            setConfirmTransaction(false);
        } finally {
            setLoading(false);
        }
    };

    const renderError = () => {
        if (error) {
            return <p style={{ color: 'red' }}>{error}</p>;
        }
        return null;
    };

    if (!gameName) {
        return <div>Error: Game name is missing.</div>; // Handle case where gameName is not provided
    }

    if (confirmTransaction) {
        return (
            <div>
                <h3>Confirm Transaction</h3>
                <p>Are you sure you want to {transactionType} {shares} shares of {gameName}?</p>
                <button onClick={handleTransaction} disabled={loading}>Confirm</button>
                <button onClick={() => setConfirmTransaction(false)}>Cancel</button>
                {renderError()}
            </div>
        );
    }

    return (
    <TransactionForm onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="actionSelect">Action:</label>
      <TransactionSelect
        id="actionSelect"
        value={transactionType}
        onChange={(e) => setTransactionType(e.target.value)}
        disabled={loading}
      >
        <option value="">Select Action</option>
        <option value="buy">Buy</option>
        <option value="sell">Sell</option>
      </TransactionSelect>
      <label htmlFor="sharesInput">Quantity:</label>
      <TransactionInput
        id="sharesInput"
        type="number"
        value={shares}
        onChange={(e) => setShares(Number(e.target.value))}
        min="1"
        disabled={loading}
      />
      <TransactionButton onClick={handleTransaction} disabled={loading || !transactionType}>
        Execute
      </TransactionButton>
      {renderError()}
    </TransactionForm>
  );
};