/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

const PlayerLink = ({ gameName }) => (
    <Link to={`/players/${gameName}`}>{gameName}</Link>
);

export default PlayerLink