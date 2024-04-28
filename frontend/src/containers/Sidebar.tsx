import styled from "styled-components";

export const Sidebar = styled.nav`
    position: fixed;
    z-index: 100;
    min-width: 200px;
    height: 100vh;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    background: #333; // Use the color from your design
    border-right: 1px solid #444;
`;

export const NavSection = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const ActionSection = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-bottom: 10px;
    align-items: center;  // Align the logout button to the start
`;