import styled from "styled-components";
import {useState} from "react";
import {PlayerLink} from "./PlayerLink.tsx";

export interface Player {
    shares: number;
    purchase_price: number;
    current_price: number;
}

interface PortfolioProps {
    players: { [key: string]: Player };
}

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledHeader = styled.th`
    background-color: #222;
    padding: 20px 10px 10px;

    border: 1px solid #cccccc;
    text-align: left;
`;

const StyledRow = styled.tr`
  background-color: #222
`;

const StyledCell = styled.td`
  padding: 8px;
  border: 1px solid #666;
  text-align: left;
    align-items: flex-start;
`;

const ValueCell = styled.div`
  display: flex;
  align-items: flex-start;
`;

const IndentedLine = styled.div`
  padding-left: 8px; // Adjust this value to control the indentation
`;

const StyledLink = styled.a`
  color: cornflowerblue;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const formatCurrency = (value: number) => {
    const sign = value >= 0 ? '+' : '-';
    const color = value >= 0 ? '#82ca9d' : '#f44336';
    return <span style={{ color }}>{sign}${Math.abs(value).toFixed(2)}</span>;
};

export const Portfolio: React.FC<PortfolioProps> = ({ players }) => {
    const [sortKey, setSortKey] = useState<string>('name');
    const [isAscending, setIsAscending] = useState<boolean>(true);

    // Check if players is defined and is an object containing keys
    if (!players || typeof players !== 'object' || Object.keys(players). length === 0) {
        return <p>No player data available or still loading...</p>;
    }

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setIsAscending(!isAscending); // Toggle sort direction
        } else {
            setSortKey(key);
            setIsAscending(true); // Default to ascending when changing sort criteria
        }
    };

  // Function to sort data
  const sortedPlayers = Object.entries(players).sort(([name1, player1], [name2, player2]) => {
        let value1, value2;
        switch (sortKey) {
            case 'gain_loss':
                value1 = (player1.current_price - player1.purchase_price) * player1.shares;
                value2 = (player2.current_price - player2.purchase_price) * player2.shares;
                break;
            case 'total_value':
                value1 = player1.current_price * player1.shares;
                value2 = player2.current_price * player2.shares;
                break;
            case 'name':
            default:
                value1 = name1;
                value2 = name2;
                break;
        }

        if (value1 < value2) return isAscending ? -1 : 1;
        if (value1 > value2) return isAscending ? 1 : -1;
        return 0;
    });

  return (
    <StyledTable>
      <thead>
          <tr>
              <StyledHeader onClick={() => handleSort('name')}>Name</StyledHeader>
              <StyledHeader onClick={() => handleSort('shares')}>Shares</StyledHeader>
              <StyledHeader onClick={() => handleSort('purchase_price')}>Purchase Price</StyledHeader>
              <StyledHeader onClick={() => handleSort('current_price')}>Current Price</StyledHeader>
              <StyledHeader onClick={() => handleSort('gain_loss')}>Gain/Loss</StyledHeader>
              <StyledHeader onClick={() => handleSort('total_value')}>Total Value</StyledHeader>
          </tr>
      </thead>
        <tbody>
        {sortedPlayers.map(([name, player]) => (
            <StyledRow key={name}>
                <StyledCell>
                    <StyledLink>
                        <PlayerLink gameName={name}/>
                    </StyledLink>
                </StyledCell>
                <StyledCell>{player.shares}</StyledCell>
                <StyledCell>${player.purchase_price.toFixed(2)}</StyledCell>
                <StyledCell>${player.current_price.toFixed(2)}</StyledCell>
                <StyledCell>{formatCurrency(player.current_price - player.purchase_price)}</StyledCell>
                <StyledCell>
                <ValueCell>
                      {formatCurrency(player.current_price * player.shares)}
                      <IndentedLine>
                          ({formatCurrency((player.current_price - player.purchase_price) * player.shares)})
                      </IndentedLine>
                  </ValueCell>
            </StyledCell>
          </StyledRow>
        ))}
      </tbody>
    </StyledTable>
  );
};

