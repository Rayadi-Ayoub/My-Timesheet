import React from "react";
import { MdGridView } from "react-icons/md";
import { FaList } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Loading from "./loader";

const TABS = [
  { title: " Board View ", icon: <MdGridView /> },
  { title: " List View ", icon: <FaList /> },
];

const PROJECT_TYPE = {
  todo: "bg-blue-600",
  "in-progress": "bg-yellow-600",
  completed: "bg-green-600",
};

function Project() {
  const params = useParams();

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const status = params?.status || "";
  return loading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full ">
      <div className="flex items-center justify-between mb-4">
        {/* <Title title={status ? `${status} Project` : "Project"} />
        {!status && (
          <Button
            label="Create Project"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white"
          />
        )} */}
      </div>
    </div>
  );
}

export default Project;
