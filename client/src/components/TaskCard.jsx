import React from "react";
import { Menu } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { getUserProfilePicture } from "../utils/profilePicture.utils";

const FormatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const TASK_TYPE = {
  todo: "To Do",
  "in progress": "In Progress",
  completed: "Completed",
};

const TaskCard = ({
  task = {},
  onDelete,
  onUpdate,
  onUpdateStage,
  projectId,
}) => {
  const {
    _id,
    nomPr = "",
    description = "",
    date_debut = "",
    date_fin = "",
    pole = {},
    societe_concernes = [],
    employee = [],
    tache = "",
    stage = "todo", // Default to "todo" if stage is undefined
  } = task;

  const handleStageChange = (e) => {
    const newStage = e.target.value;
    onUpdateStage(projectId, _id, newStage);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-300">
          {nomPr}
        </h2>
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600">
            <DotsVerticalIcon className="w-5 h-5" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-gray-700 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onUpdate(task)}
                    className={`${
                      active
                        ? "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300"
                    } block px-4 py-2 text-sm`}
                  >
                    Update
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onDelete(_id)}
                    className={`${
                      active
                        ? "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300"
                    } block px-4 py-2 text-sm`}
                  >
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
      <p className="text-gray-800 dark:text-white mb-3">{description}</p>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Start Date: {FormatDate(date_debut)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          End Date: {FormatDate(date_fin)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Pole: {pole?.NomP || ""}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Societies: {societe_concernes.map((s) => s.noms).join(", ")}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 col-span-2">
          Task: {tache}
        </p>
      </div>
      <div className="mb-4">
        <label
          htmlFor={`taskStage-${_id}`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Task Stage
        </label>
        <div className="relative mt-1">
          <select
            id={`taskStage-${_id}`}
            value={stage}
            onChange={handleStageChange}
            className="block w-full appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md py-2 px-3 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.keys(TASK_TYPE).map((key) => (
              <option key={key} value={key}>
                {TASK_TYPE[key]}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
              <path d="M7 7l3-3 3 3M7 13l3 3 3-3" />
            </svg>
          </div>
        </div>
      </div>
      <h3 className="text-blue-600 dark:text-blue-300 uppercase text-sm mb-2">
        Users Involved:
      </h3>
      <div className="flex flex-wrap items-center">
        {employee.map((emp) => (
          <div key={emp._id} className="flex items-center mr-4 mb-4">
            {emp.profilePicture ? (
              <img
                className="w-10 h-10 rounded-full mr-2"
                src={getUserProfilePicture(emp.profilePicture)}
                alt={`Profile of ${emp.username}`}
              />
            ) : (
              <div className="w-10 h-10 rounded-full mr-2 bg-gray-300 flex items-center justify-center text-white">
                {emp.username.charAt(0)}
              </div>
            )}
            <div className="text-sm">
              <p className="text-gray-900 dark:text-white leading-none">
                {emp.username}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{emp.poste}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
