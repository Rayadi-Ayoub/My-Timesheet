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

function Company() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, seterrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [poles, setPoles] = useState([]);
  const [selectedPole, setSelectedPole] = useState("");
  const [societes, setSocietes] = useState([]);
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
  const handleSelectChange = (e) => {
    setSelectedPole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.noms || !selectedPole) {
      return seterrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      seterrorMessage(null);
      const res = await fetch(`/api/addSociete/${selectedPole}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, poleId: selectedPole }),
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
          {societes.map((societe) => (
            <Table.Body className="divide-y" key={societe._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(societe.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{societe.noms}</Table.Cell>
                <Table.Cell>
                  <span
                    // onClick={() => {
                    //   setShowModal(true);
                    //   setPoleIdToDelete(pole._id);
                    // }}
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                  >
                    Delete
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

      {errorMessage && (
        <Alert className="mt-5" color="failure">
          {errorMessage}
        </Alert>
      )}
    </div>
  );
}

export default Company;
