/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

const UserLink = ({ gameName }) => (
    <Link to={`/users/${gameName}`}>{gameName}</Link>
);

export default UserLink