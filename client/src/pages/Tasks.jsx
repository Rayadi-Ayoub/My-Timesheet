import React, { useState, useEffect } from "react";
import Loading from "./loader";
import Title from "../components/Title";
import { Button } from "flowbite-react";
import { IoMdAdd } from "react-icons/io";
import { MdViewModule } from "react-icons/md";
import { FaList } from "react-icons/fa";
import { Tab } from "@headlessui/react";
import Tabs from "../components/Tabs";
import BoardView from "../components/BoardView";
import AddTaskModal from "../components/AddTaskModal";
import UpdateTaskModal from "../components/UpdateTaskModal ";
import ListView from "../components/ListView";
import { useSelector } from "react-redux";
import Modal from "../components/Modal";

const TABS = [
  { title: "Board View", icon: <MdViewModule /> },
  { title: "List View", icon: <FaList /> },
];

const Tasks = () => {
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (currentUser && selected === 1 && currentUser.poste !== "manager") {
      setShowUnauthorizedModal(true);
    } else {
      setShowUnauthorizedModal(false);
    }
  }, [currentUser, selected]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/getProjects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTasks(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await fetch("/api/createProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      fetchProjects();
      // setTasks([...tasks, data]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateTask = async (id, updatedTaskData) => {
    try {
      const response = await fetch(`/api/updateProject/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTaskData),
      });
      const data = await response.json();
      fetchProjects();
      // setTasks(tasks.map((task) => (task._id === id ? data.data : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const updateTaskStage = async (projectId, taskId, newStage) => {
    try {
      console.log("Sending request to update task stage:", {
        projectId,
        taskId,
        stage: newStage,
      });

      const response = await fetch(`/api/updateTaskStage`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, taskId, stage: newStage }),
      });
      const data = await response.json();

      if (response.ok) {
        setTasks(
          tasks.map((task) =>
            task._id === taskId ? { ...task, stage: newStage } : task
          )
        );
        console.log("Task stage updated successfully in frontend");
      } else {
        console.error("Error updating task stage:", data.message);
      }
    } catch (error) {
      console.error("Error updating task stage:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`/api/deleteProject/${id}`, {
        method: "DELETE",
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateClick = (task) => {
    setCurrentTask(task);
    setShowUpdateModal(true);
  };

  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <div className="flex justify-center items-center">
        <Loading />
      </div>
    </div>
  ) : (
    <div className="w-full h-screen dark:bg-gray-900 dark:text-white overflow-y-auto">
      <div className="flex items-center justify-between mb-4 p-2">
        <Title title="Welcome" />
        <div className="p-4">
          {currentUser && currentUser.poste === "manager" && (
            <Button
              className="dark:bg-gray-700 dark:hover:bg-gray-600"
              outline
              gradientDuoTone="purpleToPink"
              onClick={() => setShowAddModal(true)}
            >
              <IoMdAdd className="text-lg" /> Add Project
            </Button>
          )}
        </div>
      </div>
      <div>
        <Tabs tabs={TABS} setSelected={setSelected}>
          <Tab.Panels>
            {selected === 0 && (
              <div>
                <BoardView
                  tasks={tasks}
                  onDelete={deleteTask}
                  onUpdate={handleUpdateClick}
                  onUpdateStage={updateTaskStage}
                />
              </div>
            )}
            {selected === 1 && (
              <div>
                {currentUser && currentUser.poste === "manager" ? (
                  <ListView
                    projects={tasks}
                    onDelete={deleteTask}
                    onUpdate={handleUpdateClick}
                    onUpdateStage={updateTaskStage}
                  />
                ) : null}
              </div>
            )}
          </Tab.Panels>
        </Tabs>
      </div>
      {currentUser && currentUser.poste === "manager" && (
        <>
          <AddTaskModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            createTask={createTask}
          />
          {currentTask && (
            <UpdateTaskModal
              showModal={showUpdateModal}
              setShowModal={setShowUpdateModal}
              updateTask={updateTask}
              taskData={currentTask}
            />
          )}
        </>
      )}
      <Modal
        showModal={showUnauthorizedModal}
        setShowModal={setShowUnauthorizedModal}
      >
        <div className="p-4">You are not allowed to access this page</div>
      </Modal>
    </div>
  );
};

export default Tasks;
