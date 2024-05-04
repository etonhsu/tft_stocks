import React from 'react';
import { Link } from 'react-router-dom';

// Define an interface for the component's props
interface PlayerLinkProps {
    gameName: string;
    className?: string;  // Optional className prop for styling
}

export const PlayerLink: React.FC<PlayerLinkProps> = ({ gameName, className }) => (
    <Link to={`/players/${gameName}`} className={className}>
        {gameName}
    </Link>
);


