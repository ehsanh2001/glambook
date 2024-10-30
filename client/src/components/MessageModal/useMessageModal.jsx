import { useState } from "react";

export default function useMessageModal() {
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalColor, setModalColor] = useState("primary");
  const [showModal, setShowModal] = useState(false);

  // Function to show the message modal
  const showMessageModal = (title, message, color) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalColor(color);
    setShowModal(true);
  };

  return {
    modalTitle,
    modalMessage,
    modalColor,
    showModal,
    setShowModal,
    showMessageModal,
  };
}
