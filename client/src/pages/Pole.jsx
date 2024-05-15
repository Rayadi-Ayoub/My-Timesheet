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
import { FaCheck, FaTimes } from "react-icons/fa";

function Pole() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, seterrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [poles, setPoles] = useState([]);
  const [poleIdToDelete, setPoleIdToDelete] = useState(null);


  useEffect(() => {
    fetchPoles();
  }, []);

  const fetchPoles = async () => {
    const response = await fetch(`/api/poles`);
    const data = await response.json();
    setPoles(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.NomP || !formData.location) {
      return seterrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      seterrorMessage(null);
      const res = await fetch("/api/Addpole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        seterrorMessage(data.message);
      }
      setLoading(false);
      setShowModal(false);
    } catch (error) {
      seterrorMessage(error.message);
      setLoading(false);
    }
  };
  const handleDeletePole = async (poleId) => {
    try {
      setLoading(true);
      seterrorMessage(null);
      const res = await fetch(`/api/deletePole/${poleId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!data.hasOwnProperty("success")) {
        throw new Error("Unexpected server response");
      }
      if (data.success === false) {
        seterrorMessage(data.message);
      } else {
        // If the deletion was successful, remove the pole from the local state
        setPoles(poles.filter((pole) => pole._id !== poleId));
      }
      setLoading(false);
    } catch (error) {
      seterrorMessage(error.message);
      setLoading(false);
    }
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
            <Table.HeadCell>Pole Name</Table.HeadCell>
            <Table.HeadCell>Pole Image</Table.HeadCell>
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
                    className="w-10 h-10 object-cover bg-gray-500  rounded-full"
                  />
                </Table.Cell>
                <Table.Cell>{pole.NomP}</Table.Cell>

                <Table.Cell>{pole.location}</Table.Cell>
                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setPoleIdToDelete(pole._id);
                    }}
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                  >
                    Delete
                  </span>
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setPoleIdToDelete(pole._id);
                    }}
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
                className="p-1 "
                type="text"
                id="NomP"
                placeholder="Nom Pole"
                onChange={handleChange}
              />

              <TextInput
                className="p-1 "
                type="text"
                id="location"
                placeholder="location"
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
                    " Add Pole"
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
      

      {errorMessage && (
        <Alert className="mt-5" color="failure">
          {errorMessage}
        </Alert>
      )}
    </div>
  );
}

export default Pole;
