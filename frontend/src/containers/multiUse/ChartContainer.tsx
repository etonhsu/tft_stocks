import styled from "styled-components";
import {ReactNode} from "react";

interface ChartDetailsProps {
  label: string;
  children: ReactNode; // If you only expect elements, use ReactElement instead
}

const ChartDetailsWrapper = styled.div`
    position: relative; // This will allow you to absolutely position the label
    margin-top: 1%;
    margin-left: 3%;
    margin-right: 3%;
    flex: 1;  // Takes up all available space
`;

const ChartDetailsLabel = styled.span`
  position: absolute;
  top: -20px; // Adjust as necessary to move the label above the container
  left: 10px; // Adjust as necessary to align the label with the container's border
  background: #222; // Match the background of the site to cover the container's border
  padding: 0 5px;
  font-size: 24px; // Adjust as necessary
  color: #EAEAEA; // Label text color
`;

const ChartDetails = styled.div`
    flex: 1;  // Takes up all available space
    padding-top: 30px;
    padding-bottom: 20px;
    padding-right: 25px;
    background-color: #222; // Light background for the chart area
    display: flex;
    justify-content: flex-end; // Aligns the chart to the right
    align-items: center;
    border: 3px solid #666;
    border-radius: 10px;
    height: 439px;
`;

export const ChartContainer: React.FC<ChartDetailsProps> = ({ label, children }) => {
  return (
    <ChartDetailsWrapper>
      <ChartDetailsLabel>{label}</ChartDetailsLabel>
      <ChartDetails>{children}</ChartDetails>
    </ChartDetailsWrapper>
  );
};