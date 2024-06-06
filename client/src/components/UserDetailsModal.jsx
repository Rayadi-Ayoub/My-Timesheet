import { Modal, Button } from "flowbite-react";
import { getUserProfilePicture } from "../utils/profilePicture.utils";

const UserDetailsModal = ({ show, onClose, user, currentUser }) => {
  return (
    <Modal show={show} onClose={onClose} size="7xl">
      <Modal.Header>User Details</Modal.Header>
      <Modal.Body>
        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gray-200 p-4 flex items-center justify-center">
              <img
                src={getUserProfilePicture(user.profilePicture)}
                alt={user.username}
                className="w-32 h-32 object-cover bg-gray-500 rounded-full"
              />
            </div>
            <div className="p-4">
              <h2 className="text-2xl font-semibold text-center mb-4">
                {user.username}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700">
                    <strong>Matricule:</strong> {user.matricule}
                  </p>
                  <p className="text-gray-700">
                    <strong>Poste:</strong> {user.poste}
                  </p>
                  <p className="text-gray-700">
                    <strong>Departement:</strong> {user.departement}
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> {user.phone}
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> {user.address}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="text-gray-700">
                    <strong>Employee Cost:</strong> {user.employeeCost}
                  </p>
                  <p className="text-gray-700">
                    <strong>Billing Cost:</strong> {user.billingcost}
                  </p>
                  <p className="text-gray-700">
                    <strong>Hiring Date:</strong>{" "}
                    {new Date(user.hiringDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <strong>Admin:</strong>{" "}
                    {currentUser.poste === "admin" ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailsModal;
