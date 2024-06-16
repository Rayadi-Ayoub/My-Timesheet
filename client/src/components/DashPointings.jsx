import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "flowbite-react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaEdit, FaInfoCircle } from "react-icons/fa";

import UpdatePointingModal from "./UpdatePointingModal";
import PointingDetailsModal from "./PointingDetailsModal";

export default function DashPointings() {
  const { currentUser } = useSelector((state) => state.user);
  const [pointings, setPointings] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pointingIdToDelete, setPointingIdToDelete] = useState("");
  const [selectedPointing, setSelectedPointing] = useState(null);

  useEffect(() => {
    fetchPointings();
  }, [currentUser._id, showAll]);

  const fetchPointings = async () => {
    try {
      const res = await fetch(`/api/getpointings?showAll=${showAll}`);
      const data = await res.json();
      if (res.ok) {
        setPointings(data.pointings);
      } else {
        setPointings([]); // Clear pointings if none found
        console.log(data.message);
      }
    } catch (error) {
      setPointings([]); // Clear pointings if an error occurs
      console.log(error.message);
    }
  };

  const handleDeletePointing = async () => {
    try {
      const res = await fetch(`/api/pointings/${pointingIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setPointings(
          pointings.filter((pointing) => pointing._id !== pointingIdToDelete)
        );
        setShowDeleteModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdatePointing = (updatedPointing) => {
    fetchPointings();
  };

  const changeShowAll = async () => {
    setShowAll((prevShowAll) => !prevShowAll);
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-10 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {(currentUser.poste === "manager" || currentUser.poste === "admin") && (
        <div className="flex items-center space-x-2 p-2 rounded-md cursor-pointer">
          <input
            type="checkbox"
            id="toggleAllPointings"
            checked={showAll}
            onChange={changeShowAll}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="toggleAllPointings"
            className="text-gray-900 dark:text-gray-300"
          >
            Show All Pointings
          </label>
        </div>
      )}
      {pointings.length > 0 ? (
        <Table>
          <Table.Head>
            <Table.HeadCell>created by</Table.HeadCell>
            <Table.HeadCell>Pole</Table.HeadCell>
            <Table.HeadCell>Company</Table.HeadCell>
            <Table.HeadCell>TypeTache</Table.HeadCell>
            <Table.HeadCell>Tache</Table.HeadCell>
            <Table.HeadCell>Time Start</Table.HeadCell>
            <Table.HeadCell>Time End</Table.HeadCell>
            <Table.HeadCell>Comment</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {pointings.map((pointing) => (
              <Table.Row
                key={pointing?._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>
                  {pointing?.createdBy?.username ?? "Unknown"}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {pointing?.pole?.NomP}
                </Table.Cell>
                <Table.Cell>{pointing?.societe?.noms}</Table.Cell>
                <Table.Cell>{pointing?.typeTache?.typetache}</Table.Cell>
                <Table.Cell>{pointing?.tache?.nomtache}</Table.Cell>
                <Table.Cell>{pointing?.timeStart + "h"}</Table.Cell>
                <Table.Cell>{pointing?.timeEnd + "h"}</Table.Cell>
                <Table.Cell>{pointing?.comment}</Table.Cell>
                <Table.Cell className="flex space-x-2">
                  <Button
                    size="xs"
                    onClick={() => {
                      setShowUpdateModal(true);
                      setSelectedPointing(pointing);
                    }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    size="xs"
                    color="red"
                    onClick={() => {
                      setShowDeleteModal(true);
                      setPointingIdToDelete(pointing._id);
                    }}
                  >
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className="text-center font-bold">No Pointings Found!</div>
      )}

      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this pointing?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePointing}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {selectedPointing && (
        <UpdatePointingModal
          show={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          pointing={selectedPointing}
          onUpdate={handleUpdatePointing}
        />
      )}
      {selectedPointing && (
        <PointingDetailsModal
          show={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          pointing={selectedPointing}
        />
      )}
    </div>
  );
}
