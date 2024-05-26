import React from "react";
import { Table, Button } from "flowbite-react";
import clsx from "clsx";

const TASK_TYPE = {
  "in progress": "bg-yellow-500",
  completed: "bg-green-500",
  todo: "bg-red-500",
};

function ListView({ projects, onDelete, onUpdate }) {
  return (
    <div className="overflow-x-auto p-4">
      <Table>
        <Table.Head>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Project Name</Table.HeadCell>
          <Table.HeadCell>Created At</Table.HeadCell>
          <Table.HeadCell>Budget</Table.HeadCell>
          <Table.HeadCell>Employees</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {projects.map((project) => (
            <Table.Row
              key={project._id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell>
                <div
                  className={clsx(
                    "w-4 h-4 rounded-full mr-2",
                    TASK_TYPE[project.stage]
                  )}
                ></div>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {project.nomPr}
              </Table.Cell>
              <Table.Cell>
                {new Date(project.createdAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>{project.budget}</Table.Cell>
              <Table.Cell>
                <div className="flex">
                  {project.employee.map((emp) => (
                    <img
                      key={emp._id}
                      src={emp.profilePicture || "default_image_url.jpg"} // Replace with a default image URL if needed
                      alt={emp.username}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  ))}
                </div>
              </Table.Cell>
              <Table.Cell className="flex space-x-2">
                <Button
                  size="xs"
                  onClick={() => onUpdate(project)}
                  className="mr-2"
                >
                  Update
                </Button>
                <Button
                  size="xs"
                  color="red"
                  onClick={() => onDelete(project._id)}
                >
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default ListView;
