import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  TextInput,
  Spinner,
  Alert,
  Table,
} from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";

function Company() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateFormData, setUpdateFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [poles, setPoles] = useState([]);
  const [selectedPole, setSelectedPole] = useState("");
  const [societes, setSocietes] = useState([]);
  const [showModeld, setShowModeld] = useState(false);
  const [societeId, setSocieteId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPoleToUpdate, setSelectedPoleToUpdate] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPoles();
    fetchSociete();
  }, []);

  const fetchPoles = async () => {
    const response = await fetch(`/api/poles`);
    const data = await response.json();
    setPoles(data);
  };

  const fetchSociete = async () => {
    try {
      const res = await fetch(`/api/societes`);
      const data = await res.json();
      if (res.ok) {
        // Check if data.societes is an array before setting the state
        if (Array.isArray(data.societes)) {
          setSocietes(data.societes);
        } else {
          console.error("Data.societes is not an array:", data.societes);
          setSocietes([]);
        }
      }
    } catch (error) {
      console.log(error.message);
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

  const handleSelectChange = (e) => {
    setSelectedPole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.noms || !selectedPole) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(`/api/addSociete/${selectedPole}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, poleId: selectedPole }),
      });

      const data = await res.json();
      if (data.success === false) {
        setErrorMessage(data.message);
      } else {
        fetchSociete();
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

    if (!updateFormData.noms || !selectedPoleToUpdate) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(`/api/updateSociete/${selectedPoleToUpdate}`, {
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
        fetchSociete();
        setShowUpdateModal(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSociete = async (societeId) => {
    try {
      const res = await fetch(`/api/deleteSociete/${societeId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setErrorMessage(data.message);
      } else {
        setShowModeld(false);
        fetchSociete();
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleUpdateClick = (pole) => {
    setSelectedPoleToUpdate(pole._id);
    setUpdateFormData({ noms: pole.noms });
    setShowUpdateModal(true);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentSocietes = societes.slice(0, indexOfLastItem);

  return (
    <div className="w-full p-4">
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          outline
          gradientDuoTone="purpleToPink"
          onClick={() => setShowModal(true)}
        >
          <IoMdAdd />
          Add Company
        </Button>
      </div>
      <div className="table-auto overflow-x-scroll md:mx-auto p-10 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date created</Table.HeadCell>
            <Table.HeadCell>Societe Name</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          {currentSocietes.map((societe) => (
            <Table.Body className="divide-y" key={societe._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(societe.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{societe.noms}</Table.Cell>
                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModeld(true);
                      setSocieteId(societe._id);
                    }}
                    className="font-medium text-red-500 hover:underline cursor-pointer p-3"
                  >
                    Delete
                  </span>
                  <span
                    onClick={() => handleUpdateClick(societe)}
                    className="font-medium text-blue-500 hover:underline cursor-pointer p-3"
                  >
                    Update
                  </span>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        {societes.length > indexOfLastItem && (
          <div className="flex justify-center mt-4">
            <Button
              outline
              gradientDuoTone="purpleToPink"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Show More
            </Button>
          </div>
        )}
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
                Are you sure you want to Add this Company?
              </h3>

              <select
                value={selectedPole}
                onChange={handleSelectChange}
                className="w-full px-3 py-3 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              >
                <option value="">Please select a pole</option>
                {poles.map((pole, index) => (
                  <option key={index} value={pole._id}>
                    {pole.NomP}
                  </option>
                ))}
              </select>

              <TextInput
                className=" mt-3 "
                type="text"
                id="noms"
                placeholder="Nom société"
                onChange={handleChange}
              />

              <div className="flex justify-center gap-4 pt-10 ">
                <Button color="success" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    " Add Company"
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
              Are you sure you want to delete this Societe ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDeleteSociete(societeId)}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModeld(false)}>
                No, cancel
              </Button>
            </div>
          </div>
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
                Update Company
              </h3>
              <TextInput
                className=" mt-3 "
                type="text"
                id="noms"
                placeholder="Nom société"
                onChange={handleUpdateChange}
                value={updateFormData.noms || ""}
              />
              <div className="flex justify-center gap-4 pt-10 ">
                <Button color="success" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    " Update Company"
                  )}
                </Button>
                <Button color="gray" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
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

export default Company;
