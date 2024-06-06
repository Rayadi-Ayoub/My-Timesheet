import { Modal, Button, TextInput, Select, Label } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";

const UpdateUserModal = ({ show, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: "",
    matricule: "",
    poste: "",
    departement: "",
    address: "",
    phone: "",
    email: "",
    employeeCost: 0,
    billingcost: 0,
    profilePicture: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        matricule: user.matricule || "",
        poste: user.poste || "",
        departement: user.departement || "",
        address: user.address || "",
        phone: user.phone || "",
        email: user.email || "",
        employeeCost: user.employeeCost || 0,
        billingcost: user.billingcost || 0,
        profilePicture: user.profilePicture || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.put(`/api/user/update/${user._id}`, formData);
      if (res.status === 200) {
        onUpdate(res.data);
        onClose();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Modal show={show} onClose={onClose} size="7xl">
      <Modal.Header>Update User</Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <TextInput
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="matricule">Matricule</Label>
            <TextInput
              id="matricule"
              name="matricule"
              value={formData.matricule}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="poste">Poste</Label>
            <Select
              id="poste"
              name="poste"
              value={formData.poste}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="controller">Controller</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="departement">Departement</Label>
            <TextInput
              id="departement"
              name="departement"
              value={formData.departement}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <TextInput
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <TextInput
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="employeeCost">Employee Cost</Label>
            <TextInput
              id="employeeCost"
              name="employeeCost"
              type="number"
              value={formData.employeeCost}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="billingcost">Billing Cost</Label>
            <TextInput
              id="billingcost"
              name="billingcost"
              type="number"
              value={formData.billingcost}
              onChange={handleChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Update</Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateUserModal;
