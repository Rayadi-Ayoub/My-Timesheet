import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Textarea } from "flowbite-react";
import CreatableSelect from "react-select/creatable";
import { Toaster, toast } from "sonner";

const AddTaskModal = ({ showModal, setShowModal, createTask }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [poles, setPoles] = useState([]);
  const [selectedPole, setSelectedPole] = useState("");
  const [societes, setSocietes] = useState([]);
  const [selectedSociete, setSelectedSociete] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [taskStage, setTaskStage] = useState("todo");
  const [tache, setTache] = useState(""); // New state for tache

  useEffect(() => {
    fetchPoles();
    fetchUsers();
  }, []);

  const usersOptions = users.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const colorStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data }) => ({ ...styles, color: data.color }),
    multiValue: (styles, { data }) => ({
      ...styles,
      backgroundColor: data.color,
      color: "#fff",
    }),
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: "#101010",
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: "#b30000",
      cursor: "pointer",
      ":hover": {
        color: "#ff3333",
      },
    }),
  };

  const handleUserSelect = (selectedOptions) => {
    const selectedUserIds = selectedOptions.map((option) => option.value);
    setSelectedUsers(selectedUserIds);
  };

  const handleSubmit = () => {
    const taskData = {
      nomPr: taskName,
      description: taskDescription,
      date_debut: startDate,
      date_fin: endDate,
      budget: budget,
      pole: selectedPole,
      societe_concernes: [selectedSociete],
      createdAt: new Date().toISOString(),
      tache: tache,
      employee: selectedUsers,
      stage: taskStage,
    };
    console.log("Task Data:", taskData);
    createTask(taskData);
    setShowModal(false);
    toast.success("Project created successfully!");
    resetForm();
  };

  const resetForm = () => {
    setTaskName("");
    setTaskDescription("");
    setStartDate("");
    setEndDate("");
    setBudget("");
    setSelectedPole("");
    setSelectedSociete("");
    setSelectedUsers([]);
    setTaskStage("todo");
    setTache("");
  };

  const fetchPoles = async () => {
    const response = await fetch(`/api/poles`);
    const data = await response.json();
    setPoles(data);
  };

  const fetchSocietes = async (poleId) => {
    const response = await fetch(`/api/getSocietesByPole/${poleId}`);
    const data = await response.json();
    setSocietes(data);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/user/getusers`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.userWithoutPassword);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handlePoleChange = (e) => {
    const poleId = e.target.value;
    setSelectedPole(poleId);
    if (poleId) {
      fetchSocietes(poleId);
    } else {
      setSocietes([]);
    }
  };

  return (
    <>
      <Toaster richColors />
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Add New Project</Modal.Header>
        <Modal.Body className="space-y-6">
          <div>
            <label
              htmlFor="taskName"
              className="block text-sm font-medium text-gray-700"
            >
              Project Name
            </label>
            <TextInput
              id="taskName"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label
              htmlFor="taskDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Project Description
            </label>
            <Textarea
              id="taskDescription"
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label
              htmlFor="users"
              className="block text-sm font-medium text-gray-700"
            >
              Users
            </label>
            <CreatableSelect
              id="users"
              options={usersOptions}
              onChange={handleUserSelect}
              isMulti
              styles={colorStyles}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <TextInput
              id="startDate"
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <TextInput
              id="endDate"
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label
              htmlFor="pole"
              className="block text-sm font-medium text-gray-700"
            >
              Pole
            </label>
            <select
              id="pole"
              value={selectedPole}
              onChange={handlePoleChange}
              className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Please select a pole</option>
              {Array.isArray(poles) &&
                poles.map((pole) => (
                  <option key={pole._id} value={pole._id}>
                    {pole.NomP}
                  </option>
                ))}
            </select>
          </div>
          {selectedPole && (
            <div>
              <label
                htmlFor="societe"
                className="block text-sm font-medium text-gray-700"
              >
                Company
              </label>
              <select
                id="societe"
                value={selectedSociete}
                onChange={(e) => setSelectedSociete(e.target.value)}
                className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Please select a Company</option>
                {Array.isArray(societes) &&
                  societes.map((societe) => (
                    <option key={societe._id} value={societe._id}>
                      {societe.noms}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-medium text-gray-700"
            >
              Budget
            </label>
            <TextInput
              id="budget"
              type="number"
              placeholder="Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label
              htmlFor="tache"
              className="block text-sm font-medium text-gray-700"
            >
              Task
            </label>
            <Textarea
              id="tache"
              placeholder="Task"
              value={tache}
              onChange={(e) => setTache(e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label
              htmlFor="taskStage"
              className="block text-sm font-medium text-gray-700"
            >
              Task Stage
            </label>
            <select
              id="taskStage"
              value={taskStage}
              onChange={(e) => setTaskStage(e.target.value)}
              className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todo">To Do</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer className="space-x-2">
          <Button onClick={handleSubmit}>Add Project</Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddTaskModal;
