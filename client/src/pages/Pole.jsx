import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  TextInput,
  Spinner,
  Alert,
  Table,
} from "flowbite-react";
import { IoMdAdd } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function Pole() {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateFormData, setUpdateFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [poles, setPoles] = useState([]);
  const [poleIdToDelete, setPoleIdToDelete] = useState(null);
  const [poleIdToUpdate, setPoleIdToUpdate] = useState(null);
  const [showModeld, setShowModeld] = useState(false);

  useEffect(() => {
    fetchPoles();
  }, []);

  const fetchPoles = async () => {
    try {
      const response = await fetch(`/api/poles`);
      const data = await response.json();
      setPoles(data);
    } catch (error) {
      setErrorMessage("Failed to fetch poles");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleUpdateChange = (e) => {
    setUpdateFormData({
      ...updateFormData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.NomP || !formData.location) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/Addpole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setErrorMessage(data.message);
      } else {
        fetchPoles();
        setShowModal(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!updateFormData.NomP || !updateFormData.location) {
      return setErrorMessage("Please fill out all fields.");
    }

    if (!poleIdToUpdate) {
      return setErrorMessage("Pole ID is required.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(`/api/updatePole/${poleIdToUpdate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateFormData),
      });

      const data = await res.json();
      if (data.success === false) {
        setErrorMessage(data.message);
      } else {
        fetchPoles();
        setShowUpdateModal(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePole = async () => {
    try {
      const res = await fetch(`/api/Deletepole/${poleIdToDelete}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        setErrorMessage(data.message);
      } else {
        fetchPoles();
        setShowModeld(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleUpdateClick = (pole) => {
    setPoleIdToUpdate(pole._id);
    setUpdateFormData({
      NomP: pole.NomP,
      location: pole.location,
      imagepole: pole.imagepole,
    });
    setShowUpdateModal(true);
  };

  return (
    <div className="w-full p-4">
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          outline
          gradientDuoTone="purpleToPink"
          onClick={() => setShowModal(true)}
        >
          <IoMdAdd />
          Add Pole
        </Button>
      </div>

      <div className="table-auto overflow-x-scroll md:mx-auto p-10 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date created</Table.HeadCell>
            <Table.HeadCell>Pole Image</Table.HeadCell>
            <Table.HeadCell>Pole Name</Table.HeadCell>
            <Table.HeadCell>Location</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          {poles.map((pole) => (
            <Table.Body className="divide-y" key={pole._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(pole.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <img
                    src={pole.imagepole}
                    alt={pole.NomP}
                    className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                  />
                </Table.Cell>
                <Table.Cell>{pole.NomP}</Table.Cell>
                <Table.Cell>{pole.location}</Table.Cell>
                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModeld(true);
                      setPoleIdToDelete(pole._id);
                    }}
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                  >
                    Delete
                  </span>
                  <span
                    onClick={() => handleUpdateClick(pole)}
                    className="font-medium text-blue-500 hover:underline cursor-pointer p-3"
                  >
                    Update
                  </span>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="text-center">
              <IoIosAddCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sure you want to Add this Pole?
              </h3>
              <TextInput
                className="p-1"
                type="text"
                id="NomP"
                placeholder="Nom Pole"
                onChange={handleChange}
              />

              <TextInput
                className="p-1"
                type="text"
                id="location"
                placeholder="location"
                onChange={handleChange}
              />

              <div className="flex justify-center gap-4 pt-10">
                <Button color="success" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    "Add Pole"
                  )}
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleUpdateSubmit}>
            <div className="text-center">
              <IoIosAddCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sure you want to update this Pole?
              </h3>
              <TextInput
                className="p-1"
                type="text"
                id="NomP"
                placeholder="Nom Pole"
                value={updateFormData.NomP || ""}
                onChange={handleUpdateChange}
              />

              <TextInput
                className="p-1"
                type="text"
                id="location"
                placeholder="location"
                value={updateFormData.location || ""}
                onChange={handleUpdateChange}
              />

              <div className="flex justify-center gap-4 pt-10">
                <Button color="success" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    "Update Pole"
                  )}
                </Button>
                <Button color="gray" onClick={() => setShowUpdateModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModeld}
        onClose={() => setShowModeld(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this pole?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePole}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModeld(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {errorMessage && (
        <Alert className="mt-5" color="failure">
          {errorMessage}
        </Alert>
      )}
    </div>
  );
}

export default Pole;
