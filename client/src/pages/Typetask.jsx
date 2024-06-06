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

function TypeTache() {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateFormData, setUpdateFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typeTaches, setTypeTaches] = useState([]);
  const [typeTacheIdToDelete, setTypeTacheIdToDelete] = useState(null);
  const [typeTacheIdToUpdate, setTypeTacheIdToUpdate] = useState(null);
  const [showModeld, setShowModeld] = useState(false);

  useEffect(() => {
    fetchTypeTaches();
  }, []);

  const fetchTypeTaches = async () => {
    try {
      const response = await fetch(`/api/getAllTypeTaches`);
      const data = await response.json();
      setTypeTaches(data);
    } catch (error) {
      setErrorMessage("Failed to fetch TypeTaches");
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

    if (!formData.typetache) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/addtypetache", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.message);
      } else {
        fetchTypeTaches();
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

    if (!updateFormData.typetache) {
      return setErrorMessage("Please fill out all fields.");
    }

    if (!typeTacheIdToUpdate) {
      return setErrorMessage("TypeTache ID is required.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(`/api/typetaches/${typeTacheIdToUpdate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateFormData),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.message);
      } else {
        fetchTypeTaches();
        setShowUpdateModal(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTypeTache = async () => {
    try {
      const res = await fetch(`/api/typetaches/${typeTacheIdToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.message);
      } else {
        fetchTypeTaches();
        setShowModeld(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleUpdateClick = (typeTache) => {
    setTypeTacheIdToUpdate(typeTache._id);
    setUpdateFormData({
      typetache: typeTache.typetache,
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
          Add Type Tache
        </Button>
      </div>

      <div className="table-auto overflow-x-scroll md:mx-auto p-10 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date created</Table.HeadCell>
            <Table.HeadCell>Type Tache Name</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          {typeTaches.map((typeTache) => (
            <Table.Body className="divide-y" key={typeTache._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(typeTache.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{typeTache.typetache}</Table.Cell>
                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModeld(true);
                      setTypeTacheIdToDelete(typeTache._id);
                    }}
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                  >
                    Delete
                  </span>
                  <span
                    onClick={() => handleUpdateClick(typeTache)}
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
                Are you sure you want to Add this Type Tache?
              </h3>
              <TextInput
                className="p-1"
                type="text"
                id="typetache"
                placeholder="Type Tache Name"
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
                    "Add Type Tache"
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
                Are you sure you want to update this Type Tache?
              </h3>
              <TextInput
                className="p-1"
                type="text"
                id="typetache"
                placeholder="Type Tache Name"
                value={updateFormData.typetache || ""}
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
                    "Update Type Tache"
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
              Are you sure you want to delete this Type Tache?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteTypeTache}>
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

export default TypeTache;
