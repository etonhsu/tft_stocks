/* eslint-disable react/prop-types */
import { useState } from "react";

const TransactionComponent = ({ gameName, updateUserData }) => {
    const [shares, setShares] = useState(1);
    const [confirmTransaction, setConfirmTransaction] = useState(false);
    const [transactionType, setTransactionType] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const initiateTransaction = (type) => {
        setError('');  // Clear previous errors
        setTransactionType(type);
        setConfirmTransaction(true);  // Set to true to show confirmation dialog
    };

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
            updateUserData(data); // Update user data on successful transaction
            setConfirmTransaction(false);  // Reset confirmation
            setError('');
        } catch (error) {
            setError(error.message);
            setConfirmTransaction(false);  // Optionally close the confirmation if needed
        } finally {
            setLoading(false);
        }
    };

    // Optionally move this outside if you want the error to persist outside the confirmation dialog
    const renderError = () => {
        if (error) {
            return <p style={{ color: 'red' }}>{error}</p>;
        }
        return null;
    };

    if (confirmTransaction) {
        // Render confirmation dialogue
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
        <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="sharesInput">Shares:</label>
            <input
                id="sharesInput"
                type="number"
                value={shares}
                onChange={(e) => setShares(Number(e.target.value))}
                min="1"
            />
            <button onClick={() => initiateTransaction('buy')} disabled={loading}>Buy</button>
            <button onClick={() => initiateTransaction('sell')} disabled={loading}>Sell</button>
            {renderError()}
        </form>
    );
};

export default TransactionComponent;
