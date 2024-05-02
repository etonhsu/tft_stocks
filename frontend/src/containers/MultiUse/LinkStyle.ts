import styled from "styled-components";
import {PlayerLink} from "../../components/PlayerLink.tsx";

export const StyledPlayerLink = styled(PlayerLink)`
    color: cornflowerblue; // Example color
    text-decoration: none;

    &:hover {
        text-decoration: underline;
        color: #646cff; // Change color on hover
    }
`;