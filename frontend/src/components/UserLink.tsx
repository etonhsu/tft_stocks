import React from 'react';
import { Link } from 'react-router-dom';

// Define the structure for the component's props
interface UserLinkProps {
    gameName: string;  // Ensuring gameName is always a string
}

export const UserLink: React.FC<UserLinkProps> = ({ gameName }) => (
    <Link to={`/users/${gameName}`}>{gameName}</Link>
);

