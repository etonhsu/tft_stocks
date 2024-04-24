import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
    const [searchType, setSearchType] = useState('players'); // Default to searching players
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
    e.preventDefault();
    const searchQuery = query.toLowerCase(); // Convert to lowercase to match backend expectation
    const url = `http://localhost:8000/search/${searchType}/${encodeURIComponent(searchQuery)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('No matching data found.'); // Handle non-200 responses
            }
            return response.json();
        })
        .then(data => {
            // Redirect based on type, using the actual name returned from the search
            if (searchType === 'players') {
                navigate(`/players/${data.gameName}`); // Navigate using the game name returned from the server
            } else if (searchType === 'users') {
                navigate(`/users/${data.username}`); // Navigate using the username returned from the server
            }
        })
        .catch(error => {
            console.error('Search error:', error);
            alert(error.message); // Optionally inform the user about the error
        });
};

    return (
        <form onSubmit={handleSubmit}>
            <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                <option value="players">Players</option>
                <option value="users">Users</option>
            </select>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for players or users..."
            />
            <button type="submit">Search</button>
        </form>
    );
}

export default SearchBar;
