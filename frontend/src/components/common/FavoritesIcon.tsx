import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../utils/Authentication.tsx';
import { ClickedFavoritesIcon, FavoritesIcon } from "../../assets/Icons.tsx";
import styled from "styled-components";

export const FavoriteButton = styled.button`
    background-color: #222;
    padding: 0;
    border: none;  // Ensure there's no border by default

    &:hover {
        border: none;  // Explicitly remove border on hover
      
    }
`;

export const FavoriteIcon: React.FC<{ gameName?: string }> = ({ gameName }) => {
  const [isFavorited, setIsFavorited] = useState<boolean | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchFavoriteStatus() {
      if (!gameName || !token) {
        setIsFavorited(null);  // Indicates an indeterminate state, not necessarily false.
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8000/favorite_status/${gameName}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Use the token for authorization
                    }
                });
        setIsFavorited(response.data);
      } catch (error) {
        console.error("Error fetching favorite status:", error);
        setIsFavorited(null);  // Maintain an indeterminate state on error.
      }
    }

    fetchFavoriteStatus();
  }, [gameName, token]);  // Dependency array ensures re-fetching on gameName or token change.

  const toggleFavorite = async () => {
    if (isFavorited === null || !token) return;
    try {
      const response = await axios.post<boolean>(
        'http://localhost:8000/toggle_favorites',
        { gameName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFavorited(response.data);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  // Optional: handle null state visually
  if (isFavorited === null) {
    return <FavoriteButton disabled>Loading...</FavoriteButton>;
  }

  return (
    <FavoriteButton onClick={toggleFavorite}>
      {isFavorited ? <ClickedFavoritesIcon /> : <FavoritesIcon />}
    </FavoriteButton>
  );
};

