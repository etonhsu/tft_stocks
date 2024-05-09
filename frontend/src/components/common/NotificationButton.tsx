import React, {useState} from 'react';
import {StyledButton} from "../../pages/LeaderboardPage.tsx";
import {ModalContent, ModalOverlay} from "../../containers/multiUse/StyledComponents.tsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
}

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

export const ButtonWithModal: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <>
        <div style={{width: '150px', margin: '30px'}}> {/* Container with specific width */}
            <StyledButton onClick={handleOpenModal}>Notification</StyledButton>
        </div>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}
               text="The account reset and GM+ players rollout is complete, happy trading!"
        />
    </>
  );
};
