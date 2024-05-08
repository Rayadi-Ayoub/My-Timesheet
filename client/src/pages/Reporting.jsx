import { Table } from "flowbite-react";
import { useEffect, useState } from "react";

export default function Reporting() {
  const [pointings, setPointings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchallpointings();
  }, [page]);

  const fetchallpointings = async () => {
    const response = await fetch(`/api/getpointings?page=${page}&limit=10`);
    const data = await response.json();
    setPointings(Array.isArray(data.data) ? data.data : []);
    setTotalPages(data.totalPages);
  };

  const pages = [...Array(totalPages).keys()].map((n) => n + 1);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-10 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Table hoverable className="shadow-md">
        <Table.Head>
          <Table.HeadCell>Date created</Table.HeadCell>
          <Table.HeadCell>Username</Table.HeadCell>
          <Table.HeadCell>Company concerned</Table.HeadCell>
          <Table.HeadCell>Task completed</Table.HeadCell>
          <Table.HeadCell>Fixed price</Table.HeadCell>
          <Table.HeadCell>Number of hours workers</Table.HeadCell>
          <Table.HeadCell>Task price per hour</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {pointings.map((pointing) => (
            <Table.Row
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={pointing._id}
            >
              <Table.Cell>
                {pointings.createdAt &&
                  new Date(pointing.createdAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>{pointing.createdBy?.username}</Table.Cell>
              <Table.Cell>{pointing.societe?.noms}</Table.Cell>
              <Table.Cell>{pointing.tache?.nomtache}</Table.Cell>
              <Table.Cell>{pointing.tache?.prixforfitaire}dt</Table.Cell>
              <Table.Cell>{pointing.timeDifference}h</Table.Cell>
              <Table.Cell>{pointing.costPerHours}dt</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <nav aria-label="Page navigation example">
        <ul className="inline-flex -space-x-px text-base h-10">
          <li>
            <button
              onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
              disabled={page === 1}
              className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Previous
            </button>
          </li>
          {pages.map((pageNumber) => (
            <li key={pageNumber}>
              <button
                onClick={() => setPage(pageNumber)}
                className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 ${
                  page === pageNumber ? "text-blue-600 bg-blue-50" : ""
                } hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                {pageNumber}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() =>
                setPage((prevPage) => Math.min(prevPage + 1, totalPages))
              }
              disabled={page === totalPages}
              className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
