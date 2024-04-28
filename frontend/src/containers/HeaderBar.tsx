import styled from 'styled-components';

export const HeaderBar = styled.header`
  width: 100%;
  height: 80px; /* Example height */
  background-color: #333; /* Example background color */
    padding-left: 130px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: fixed; /* Fix it to the top */
  top: 0; /* No space from the top */
    border-bottom: 1px solid #444;
  z-index: 90; /* Ensure it's above other content */
`;


