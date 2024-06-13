import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "flowbite-react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes, FaEdit, FaInfoCircle } from "react-icons/fa";

import Loading from "../pages/loader";
import UpdateUserModal from "../components/UpdateUserModal";
import UserDetailsModal from "../components/UserDetailsModal";
import { getUserProfilePicture } from "../utils/profilePicture.utils";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.userWithoutPassword);
          if (data.userWithoutPassword.length < 8) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.poste === "admin") {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.userWithoutPassword]);
        if (data.userWithoutPassword.length < 8) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.filter((user) => user._id !== userIdToDelete));
        setShowDeleteModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(
      users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-10 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.poste === "admin" && users.length > 0 ? (
        <>
          <Table>
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Departement</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user) => (
                <Table.Row
                  key={user._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={getUserProfilePicture(user.profilePicture)}
                      alt={user.profilePicture}
                      className="w-8 h-8 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.departement}</Table.Cell>
                  <Table.Cell>
                    {user.poste === "admin" ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell className="flex space-x-2">
                    <Button
                      size="xs"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUpdateModal(true);
                      }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setUserIdToDelete(user._id);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      size="xs"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDetailsModal(true);
                      }}
                    >
                      <FaInfoCircle />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <Button onClick={handleShowMore} className="w-full mt-4">
              Show more
            </Button>
          )}
        </>
      ) : (
        <Loading />
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
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {selectedUser && (
        <UpdateUserModal
          show={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          user={selectedUser}
          onUpdate={handleUpdateUser}
        />
      )}
      {selectedUser && (
        <UserDetailsModal
          show={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          user={selectedUser}
          currentUser={currentUser} // Pass currentUser as a prop
        />
      )}
    </div>
  );
}
