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
    margin-top: 5px;
    cursor: pointer; // Ensure it's recognizable as a clickable button

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
  message:  "Hey everyone, thank you for all the support these past few weeks! I know I haven't rolled out too many new features, " +
            "but I promise I've been working hard to keep making the site better. On that note, I have disabled a lot of the live update " +
            "functions on the site, so player prices and people's ranks will be disabled for the next couple of days while I work on rolling out " +
            "what I hope to be the live release version of the website. This version will fix a lot of the bugs we've had in this 'beta testing' period, as " +
            "well as add a few new features I think you all will enjoy! Finally, I want to thank those of you who have been here for this early period " +
            "and helped me by suggesting features or identifying bugs. Even those who just made an account to mess around with it a little, I'm eternally " +
            "grateful for the support all of you have shown me. The new version of the site is coming soon, and I hope you all enjoy it!",
  version: 7
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
