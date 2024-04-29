import styled from "styled-components";

export const MainContent = styled.div`
    margin-left: 7%; // Ensure this is the same width as your sidebar
    flex: 1; // Takes the remaining space in a flex container
    padding-top: 35px;
    padding-left: 35px;
    overflow-y: auto; // Allows for scrolling within the main content area
    background-color: #222; // Background color for the main content
`;