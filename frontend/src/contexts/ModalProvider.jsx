import { createContext, useState } from "react";

export const ModalContext = createContext(null);

// Untuk berbagi state modal
export default function ModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("inputGulaDarah");
  const [selectedMakanan, setSelectedMakanan] = useState({});

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        toggleModal,
        modalType,
        setModalType,
        selectedMakanan,
        setSelectedMakanan,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
