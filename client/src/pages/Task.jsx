import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Spinner, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { IoMdAdd, IoIosAddCircle } from "react-icons/io";
import { Tabs } from "flowbite-react";
import { IoTimeOutline } from "react-icons/io5";
import { GrMoney } from "react-icons/gr";

function Task() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    prixType: "forfitaire",
    prixforfitaire: "",
    prixHoraire: "",
  });
  const [updateFormData, setUpdateFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typeTaches, setTypeTaches] = useState([]);
  const [selectedTypeTache, setSelectedTypeTache] = useState("");
  const [taches, setTaches] = useState([]);
  const [showModeld, setShowModeld] = useState(false);
  const [tacheId, setTacheId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTypeTacheToUpdate, setSelectedTypeTacheToUpdate] =
    useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTypeTaches();
    fetchTaches();
  }, []);

  const fetchTypeTaches = async () => {
    const response = await fetch(`/api/getAllTypeTaches`);
    const data = await response.json();
    setTypeTaches(data);
  };

  const fetchTaches = async () => {
    try {
      const res = await fetch(`/api/taches`);
      const data = await res.json();
      if (res.ok) {
        if (Array.isArray(data)) {
          setTaches(data);
        } else {
          console.error("Data.taches is not an array:", data);
          setTaches([]);
        }
      }
    } catch (error) {
      console.log("Error fetching taches:", error.message); // Log the error
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
      prixType:
        id === "prixforfitaire"
          ? "forfitaire"
          : id === "prixHoraire"
          ? "horraire"
          : prevFormData.prixType,
    }));
  };

  const handleUpdateChange = (e) => {
    setUpdateFormData({
      ...updateFormData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSelectChange = (e) => {
    setSelectedTypeTache(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nomtache || !selectedTypeTache || !formData.prixType) {
      setErrorMessage("Please fill out all fields.");
      setShowErrorModal(true);
      return;
    }

    if (
      (formData.prixType === "horraire" &&
        (!formData.prixHoraire || formData.prixHoraire < 0)) ||
      (formData.prixType === "forfitaire" &&
        (!formData.prixforfitaire || formData.prixforfitaire < 0))
    ) {
      setErrorMessage("Please fill out all fields.");
      setShowErrorModal(true);
      return;
    }

    const body = {
      nomtache: formData.nomtache,
      prixType: formData.prixType,
      prixforfitaire:
        formData.prixType === "forfitaire"
          ? parseFloat(formData.prixforfitaire)
          : 0,
      prixHoraire:
        formData.prixType === "horraire" ? parseFloat(formData.prixHoraire) : 0,
    };

    console.log("Submitting form with body:", body); // Log form data before submission

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(`/api/tacheWithTypeTache/${selectedTypeTache}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("API response:", data); // Log API response

      if (!res.ok) {
        setErrorMessage(data.message);
        setShowErrorModal(true);
      } else {
        fetchTaches();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error.message); // Log error
      setErrorMessage(error.message);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (
      !updateFormData.nomtache ||
      (updateFormData.prixType === "forfitaire" &&
        !updateFormData.prixforfitaire) ||
      (updateFormData.prixType === "horraire" && !updateFormData.prixHoraire) ||
      !selectedTypeTacheToUpdate
    ) {
      setErrorMessage("Please fill out all fields.");
      setShowErrorModal(true);
      return;
    }

    const body = {
      nomtache: updateFormData.nomtache,
      prixType: updateFormData.prixType,
      prixforfitaire:
        updateFormData.prixType === "forfitaire"
          ? parseFloat(updateFormData.prixforfitaire)
          : 0,
      prixHoraire:
        updateFormData.prixType === "horraire"
          ? parseFloat(updateFormData.prixHoraire)
          : 0,
    };

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(`/api/taches/${selectedTypeTacheToUpdate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message);
        setShowErrorModal(true);
      } else {
        fetchTaches();
        setShowUpdateModal(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTache = async (tacheId) => {
    try {
      const res = await fetch(`/api/taches/${tacheId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message);
        setShowErrorModal(true);
      } else {
        setShowModeld(false);
        fetchTaches();
      }
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorModal(true);
    }
  };

  const handleUpdateClick = (tache) => {
    setSelectedTypeTacheToUpdate(tache._id);
    setUpdateFormData({
      nomtache: tache.nomtache,
      prixforfitaire: tache.prixforfitaire,
      prixHoraire: tache.prixHoraire,
      prixType: tache.prixType,
    });
    setShowUpdateModal(true);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentTaches = taches.slice(0, indexOfLastItem);

  return (
    <div className="w-full p-4">
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          outline
          gradientDuoTone="purpleToPink"
          onClick={() => setShowModal(true)}
        >
          <IoMdAdd />
          Add Tache
        </Button>
      </div>
      <div className="table-auto overflow-x-scroll md:mx-auto p-10 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date created</Table.HeadCell>
            <Table.HeadCell>prixType</Table.HeadCell>
            <Table.HeadCell>Tache Name</Table.HeadCell>
            <Table.HeadCell>Prix</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          {currentTaches.map((tache) => (
            <Table.Body className="divide-y" key={tache._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(tache.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{tache.prixType}</Table.Cell>
                <Table.Cell>{tache.nomtache}</Table.Cell>
                <Table.Cell>
                  {tache.prixType === "forfitaire"
                    ? tache.prixforfitaire
                    : tache.prixHoraire}
                </Table.Cell>
                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModeld(true);
                      setTacheId(tache._id);
                    }}
                    className="font-medium text-red-500 hover:underline cursor-pointer p-3"
                  >
                    Delete
                  </span>
                  <span
                    onClick={() => handleUpdateClick(tache)}
                    className="font-medium text-blue-500 hover:underline cursor-pointer p-3"
                  >
                    Update
                  </span>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        {currentTaches.length < taches.length && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
              gradientDuoTone="purpleToPink"
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
                Are you sure you want to Add this Tache?
              </h3>

              <select
                value={selectedTypeTache}
                onChange={handleSelectChange}
                className="w-full px-3 py-3 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              >
                <option value="">Please select a Type Tache</option>
                {typeTaches.map((typeTache, index) => (
                  <option key={index} value={typeTache._id}>
                    {typeTache.typetache}
                  </option>
                ))}
              </select>

              <TextInput
                className="mt-3"
                type="text"
                id="nomtache"
                placeholder="Tache Name"
                onChange={handleChange}
              />

              <Tabs
                aria-label="Default tabs"
                style="underline"
                className="mt-2.5"
              >
                <Tabs.Item
                  active
                  title="Forfitaire"
                  icon={GrMoney}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      prixHoraire: 0,
                      prixType: "forfitaire",
                    });
                  }}
                >
                  <TextInput
                    className=""
                    type="number"
                    id="prixforfitaire"
                    placeholder="Prix Forfaitaire"
                    onChange={handleChange}
                    value={formData.prixforfitaire}
                  />
                </Tabs.Item>
                <Tabs.Item
                  title="Horaires"
                  icon={IoTimeOutline}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      prixforfitaire: 0,
                      prixType: "horraire",
                    });
                  }}
                >
                  <TextInput
                    className=""
                    type="number"
                    id="prixHoraire"
                    placeholder="Prix Horaire"
                    onChange={handleChange}
                    value={formData.prixHoraire}
                  />
                </Tabs.Item>
              </Tabs>

              <div className="flex justify-center gap-4 pt-10">
                <Button color="success" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    "Add Tache"
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
              Are you sure you want to delete this Tache?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDeleteTache(tacheId)}
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
                Update Tache
              </h3>
              <TextInput
                className="mt-3"
                type="text"
                id="nomtache"
                placeholder="Tache Name"
                onChange={handleUpdateChange}
                value={updateFormData.nomtache || ""}
              />
              {updateFormData.prixType === "forfitaire" && (
                <TextInput
                  className="mt-3"
                  type="number"
                  id="prixforfitaire"
                  placeholder="Prix Forfaitaire"
                  onChange={handleUpdateChange}
                  value={updateFormData.prixforfitaire || ""}
                />
              )}
              {updateFormData.prixType === "horraire" && (
                <TextInput
                  className="mt-3"
                  type="number"
                  id="prixHoraire"
                  placeholder="Prix Horaire"
                  onChange={handleUpdateChange}
                  value={updateFormData.prixHoraire || ""}
                />
              )}
              <div className="flex justify-center gap-4 pt-10">
                <Button color="success" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    "Update Tache"
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
      <Modal
        show={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center ">
            <HiOutlineExclamationCircle className="h-14 w-14 text-red-500 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg font-medium text-gray-500 dark:text-gray-400">
              Error
            </h3>
            <p className="text-sm text-red-500">{errorMessage}</p>
            <div className="mt-4">
              <Button color="gray" onClick={() => setShowErrorModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Task;
