import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Textarea } from "flowbite-react";
import CreatableSelect from "react-select/creatable";
import { Toaster, toast } from "sonner";

const UpdateTaskModal = ({ showModal, setShowModal, updateTask, taskData }) => {
  const [taskName, setTaskName] = useState(taskData.nomPr || "");
  const [taskDescription, setTaskDescription] = useState(
    taskData.description || ""
  );
  const [startDate, setStartDate] = useState(taskData.date_debut || "");
  const [endDate, setEndDate] = useState(taskData.date_fin || "");
  const [budget, setBudget] = useState(taskData.budget || "");
  const [poles, setPoles] = useState([]);
  const [selectedPole, setSelectedPole] = useState(taskData.pole || "");
  const [societes, setSocietes] = useState([]);
  const [selectedSociete, setSelectedSociete] = useState(
    taskData.societe_concernes ? taskData.societe_concernes[0] : ""
  );
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(taskData.employee || []);
  const [taskStage, setTaskStage] = useState(taskData.stage || "todo");

  useEffect(() => {
    fetchPoles();
    fetchUsers();
    if (taskData.pole) {
      fetchSocietes(taskData.pole);
    }
  }, [taskData]);

  const usersOptions = users.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const colorStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return { ...styles, color: data.color };
    },
    multiValue: (styles, { data }) => {
      return {
        ...styles,
        backgroundColor: data.color,
        color: "#fff",
      };
    },
    multiValueLabel: (styles, { data }) => {
      return {
        ...styles,
        color: "#101010",
      };
    },
    multiValueRemove: (styles, { data }) => {
      return {
        ...styles,
        color: "#b30000",
        cursor: "pointer",
        ":hover": {
          color: "#ff3333",
        },
      };
    },
  };

  const handleUserSelect = (selectedOptions, actionMeta) => {
    const selectedUserIds = selectedOptions.map((option) => option.value);
    setSelectedUsers(selectedUserIds);
  };

  const handleSubmit = () => {
    const updatedTaskData = {
      nomPr: taskName,
      description: taskDescription,
      date_debut: startDate,
      date_fin: endDate,
      budget: budget,
      pole: selectedPole,
      societe_concernes: [selectedSociete],
      taches: [],
      employee: selectedUsers,
      stage: taskStage,
    };
    console.log("Updated Task Data:", updatedTaskData); // Add this line
    updateTask(taskData._id, updatedTaskData);
    setShowModal(false);
    toast.success("Project updated successfully!");
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
    const response = await fetch(`/api/user/getusers`);
    const data = await response.json();
    setUsers(data.userWithoutPassword);
  };

  const handleChange = (e) => {
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
        <Modal.Header>Update Project</Modal.Header>
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
              value={usersOptions.filter((user) =>
                selectedUsers.includes(user.value)
              )}
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
              onChange={handleChange}
              className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Please select a pole</option>
              {poles.map((pole, index) => (
                <option key={index} value={pole._id}>
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
                  societes.map((societe, index) => (
                    <option key={index} value={societe._id}>
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
          <Button onClick={handleSubmit}>Update Project</Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateTaskModal;
