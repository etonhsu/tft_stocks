import React, {useState} from 'react';

import {ModalContent, ModalOverlay} from "../../containers/multiUse/StyledComponents.tsx";
import {NotificationIcon, NotificationIcon2} from "../../assets/Icons.tsx";
import styled from "styled-components";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
}

export const StyledButton = styled.button`
    display: flex;
    align-items: center; /* Vertically center the children */
    justify-content: center; /* Aligns children (icon and text) to the start of the container */
    font-weight: normal;
    font-size: 16px;
    background: #333; // Use the color from your design
    color: #EAEAEA;
    text-decoration: none;
    border: none; // Remove default button border
    border-radius: 4px;
    width: 65px;
    cursor: pointer; // Ensure it's recognizable as a clickable button
    margin-right: 310px;

    svg {
        height: 25px; /* Adjust height to match your design */
        width: 25px; /* Adjust width to maintain aspect ratio */
    }

    &:hover {
        background: #444; // Slightly lighter color on hover
        color: cornflowerblue;
    }

    &:active {
        background: #555; // An even lighter color for active or focus state
    }

    &:focus {
        outline: none; // Removes the outline to match NavLink behavior
    }
`;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, text }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
          <p>{text}<br/><br/>- 2 Brain Cell</p>
        <button onClick={onClose}>Close</button>
      </ModalContent>
    </ModalOverlay>
  );
};

const currentNotification = {
  message:  "There will be a pricing model change sometime later today. " +
            "This change is meant to increase the value of lp gained above 1000, but will slightly decrease the majority of players' valuations. " +
            "If your total account value decreases during this change, you will be credited with extra balance to make up the difference. " +
            "I will be releasing a detailed breakdown of the pricing model in an FAQComponent section along with the rollout.",
  version: 1
};

export const ButtonWithModal: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [notificationAcknowledged, setNotificationAcknowledged] = useState(() => {
    const lastSeenVersion = parseInt(localStorage.getItem('lastSeenNotificationVersion') || '0', 10);
    return lastSeenVersion >= currentNotification.version;
  });

  const handleOpenModal = () => {
    setModalOpen(true);
    setNotificationAcknowledged(true);
    localStorage.setItem('lastSeenNotificationVersion', currentNotification.version.toString());
  };
  const handleCloseModal = () => setModalOpen(false);

  return (
    <>
        <div> {/* Container with specific width */}
            <StyledButton onClick={handleOpenModal}>
                {notificationAcknowledged ? <NotificationIcon /> : <NotificationIcon2 />}
            </StyledButton>
        </div>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}
               text={currentNotification.message}
        />
    </>
  );
};
