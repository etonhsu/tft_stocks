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
               text="Hello everyone, thank you all so much for using the site, I really appreciate all the support in helping me test out the features.
                    I am about to implement an update in an hour (6pm PDT) that will limit all buying and selling of players to those who are Grandmaster and above.
                    I realize that will wipe out a lot of people's portfolios, so I will be instituting a hard reset of everyone's balance back to 100k, and portfolio back to empty.
                    This will help a lot with the balance of the market, so we don't get a repeat of Pockygom's 2 trillion account balance. I'm sorry for those of you who were already
                    invested into your portfolio, and thank you for bearing with me while I get the site features improved."
        />
    </>
  );
};
