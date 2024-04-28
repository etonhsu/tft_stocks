import React from 'react';
import { Link } from 'react-router-dom';

// Define an interface for the component's props
interface PlayerLinkProps {
    gameName: string;
}

export const PlayerLink: React.FC<PlayerLinkProps> = ({ gameName }) => (
    <Link to={`/players/${gameName}`}>{gameName}</Link>
);


