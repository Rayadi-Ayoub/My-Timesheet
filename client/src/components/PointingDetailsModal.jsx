import React from "react";
import { Modal, Button } from "flowbite-react";
import PropTypes from "prop-types";

const PointingDetailsModal = ({ show, onClose, pointing }) => {
  return (
    <Modal show={show} onClose={onClose} size="md">
      <Modal.Header>Pointing Details</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <strong>Pole:</strong> {pointing.pole}
          </div>
          <div>
            <strong>Company:</strong> {pointing.societe}
          </div>
          <div>
            <strong>TypeTache:</strong> {pointing.typeTache}
          </div>
          <div>
            <strong>Tache:</strong> {pointing.tache}
          </div>
          <div>
            <strong>Time Start:</strong>{" "}
            {new Date(pointing.timeStart).toLocaleTimeString()}
          </div>
          <div>
            <strong>Time End:</strong>{" "}
            {new Date(pointing.timeEnd).toLocaleTimeString()}
          </div>
          <div>
            <strong>Comment:</strong> {pointing.comment}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

PointingDetailsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pointing: PropTypes.object.isRequired,
};

export default PointingDetailsModal;
