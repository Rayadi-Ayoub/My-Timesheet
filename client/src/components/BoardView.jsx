import React from "react";
import TaskCard from "./TaskCard";
import clsx from "clsx";

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const BoardView = ({ tasks, onDelete, onUpdate, onUpdateStage }) => {
  const tasksByStage = {
    todo: tasks.filter((task) => task.stage === "todo"),
    inProgress: tasks.filter((task) => task.stage === "in progress"),
    completed: tasks.filter((task) => task.stage === "completed"),
  };

  return (
    <div className="w-full grid p-2 grid-cols-1 sm:grid-cols-3 gap-4 2xl:gap-10 dark:bg-gray-900 overflow-y-auto">
      <div>
        <div className="flex items-center mb-4">
          <div
            className={clsx("w-4 h-4 rounded-full mr-2", TASK_TYPE["todo"])}
          ></div>
          <h2 className="text-lg font-semibold">To Do</h2>
        </div>
        {tasksByStage.todo.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onUpdateStage={onUpdateStage}
            projectId={task._id}
          />
        ))}
      </div>
      <div>
        <div className="flex items-center mb-4">
          <div
            className={clsx(
              "w-4 h-4 rounded-full mr-2",
              TASK_TYPE["in progress"]
            )}
          ></div>
          <h2 className="text-lg font-semibold">In Progress</h2>
        </div>
        {tasksByStage.inProgress.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onUpdateStage={onUpdateStage}
            projectId={task._id}
          />
        ))}
      </div>
      <div>
        <div className="flex items-center mb-4">
          <div
            className={clsx(
              "w-4 h-4 rounded-full mr-2",
              TASK_TYPE["completed"]
            )}
          ></div>
          <h2 className="text-lg font-semibold">Completed</h2>
        </div>
        {tasksByStage.completed.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onUpdateStage={onUpdateStage}
            projectId={task._id}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardView;
