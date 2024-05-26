import React, { useState } from "react";
import { Menu } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid"; // You can also use react-icons if you prefer
import clsx from "clsx";

const FormatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const TaskCard = ({ task = {}, onDelete, onUpdate }) => {
  const {
    _id,
    nomPr,
    description,
    date_debut,
    date_fin,
    budget,
    pole,
    societe_concernes = [],
    employee = [],
    stage = "todo", // Default to "todo" if stage is undefined
  } = task;

  console.log("Rendering TaskCard with data:", task);
  console.log("Task stage:", stage);

  return (
    <div className="w-full h-fit bg-white dark:bg-gray-800 shadow-md p-4 rounded mt-4">
      <div className="w-full flex justify-between">
        <div className="flex flex-1 gap-1 items-center text-sm font-medium">
          <span className="text-blue-500 dark:text-blue-300 uppercase">
            {nomPr}
          </span>
        </div>
        <div className="flex items-center gap-2 relative">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600">
                <DotsVerticalIcon className="w-5 h-5" />
              </Menu.Button>
            </div>
            <Menu.Items className="absolute right-0 w-32 mt-2 origin-top-right bg-white dark:bg-gray-700 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onUpdate(task)}
                      className={clsx(
                        active
                          ? "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                          : "text-gray-700 dark:text-gray-300",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Update
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onDelete(_id)}
                      className={clsx(
                        active
                          ? "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                          : "text-gray-700 dark:text-gray-300",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <h4 className="text-black dark:text-white">{description}</h4>
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Date Debut: {FormatDate(date_debut)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Date Fin: {FormatDate(date_fin)}
        </p>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Budget: {budget}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Pole: {pole?.NomP}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Societe: {societe_concernes.map((s) => s.noms).join(", ")}
      </p>

      <span className="text-blue-500 dark:text-blue-300 uppercase mt-4 block">
        Users Concerned With Project:
      </span>
      <div className="flex flex-wrap items-center mt-2">
        {employee.map((emp) => (
          <div key={emp._id} className="flex items-center mr-4 mb-2">
            <img
              className="w-10 h-10 rounded-full mr-2"
              src={emp.profilePicture}
              alt={`Profile of ${emp.username}`}
            />
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