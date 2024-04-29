import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { PreviewModal } from "./Modal";


const TransactionForm = styled.form`
  display: flex;
  flex-direction: column; // Change from row to column
  align-items: stretch; // Ensures inputs take full width
  gap: 10px;
  margin: 10px 0;
`;

const FieldWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
`;

const TransactionSelect = styled.select`
    padding: 10px;
    padding-left: 4px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 206px;
    
`;

const TransactionInput = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 200px;
    justify-content: end;
`;

const TransactionButton = styled.button`
    padding: 10px 20px;
    border: none;
    background-color: #646cff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    width: 150px;
    align-items: center;

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
    const [shares, setShares] = useState<string>('0');
    const [price, setPrice] = useState<number>(0)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [transactionType, setTransactionType] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchPrice = async () => {
            if (gameName) {
                try {
                    const response = await fetch(`http://localhost:8000/players/${gameName}/`);
                    const data = await response.json();
                    if (response.ok) {
                        setPrice(data.price[data.price.length - 1]);  // Assuming the endpoint sends back an object with a price field
                    } else {
                        throw new Error(data.detail || 'Failed to fetch price data');
                    }
                } catch (error) {
                    setError('Failed to fetch price');
                }
            }
        };

        fetchPrice();
    }, [gameName]);

    const handleTransaction = async () => {
        setIsModalOpen(false);
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
            setError('');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };


    const handleSharesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Replace the initial 0 when the user starts typing, or if they explicitly type 0
        const sharesValue = (value === '0' || value.startsWith('0')) ? value.slice(1) : value;

        // If the input is not just a minus sign (from pressing the decrement button), update the state
        if (sharesValue !== '-') {
            setShares(sharesValue);
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

    // Open the modal with transaction preview
    const handlePreview = () => {
        if (transactionType && shares !== '0') {
          setIsModalOpen(true);
        }
    };

    return (
        <>
            <TransactionForm onSubmit={(e) => e.preventDefault()}>
                <FieldWrapper>
                    <label htmlFor="actionSelect">Action:</label>
                    <TransactionSelect
                        id="actionSelect"
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Select</option>
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                    </TransactionSelect>
                </FieldWrapper>
                <FieldWrapper>
                <label htmlFor="sharesInput">Quantity:</label>
                    <TransactionInput
                        id="sharesInput"
                        type="number"
                        value={shares}
                        onChange={handleSharesInputChange}
                        min="0"
                        disabled={loading}/>
                    </FieldWrapper>
                    <TransactionButton onClick={handlePreview} disabled={loading || !transactionType || shares === '0'}>
                        Preview
                    </TransactionButton>
                {renderError()}
            </TransactionForm>
            <PreviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transactionType={transactionType}
                price={price}
                shares={Number(shares)}
                gameName={gameName}
                onConfirm={handleTransaction}
            />
        </>
  );
};