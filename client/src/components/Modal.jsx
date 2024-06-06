import React from "react";
import { Modal as FlowbiteModal } from "flowbite-react";

const Modal = ({ showModal, setShowModal, children }) => {
  return (
    <FlowbiteModal show={showModal} onClose={() => setShowModal(false)}>
      <FlowbiteModal.Header>
        <h5 className="text-xl font-medium text-gray-900 dark:text-white">
          Unauthorized Access
        </h5>
      </FlowbiteModal.Header>
      <FlowbiteModal.Body>
        <div className="space-y-6">{children}</div>
      </FlowbiteModal.Body>
      <FlowbiteModal.Footer>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowModal(false)}
        >
          Close
        </button>
      </FlowbiteModal.Footer>
    </FlowbiteModal>
  );
};

export default Modal;
