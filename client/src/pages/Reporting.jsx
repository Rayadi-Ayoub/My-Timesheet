import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Pagination from "./Pagination"; // Move the Pagination component to its own file

export default function Reporting() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pointings, setPointings] = useState([]);

  useEffect(() => {
    fetchAllPointings();
  }, [page]);

  const fetchAllPointings = async () => {
    const response = await fetch(
      `/api/getpointings?page=${page}&limit=10&reporting=true`
    );
    const data = await response.json();
    setPointings(data.pointings);
    setTotalPages(data.totalPages);
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.table_to_book(
      document.getElementById("table-to-export")
    );
    XLSX.writeFile(wb, "pointings.xlsx");
  };

  return (
    <div className="flex flex-col items-center p-10">
      <div className="table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {pointings.length === 0 ? (
          <div className="flex justify-center items-center h-full text-center text-gray-500 dark:text-gray-300">
            You don't have any data in your base.
          </div>
        ) : (
          <>
            <Table hoverable className="shadow-md" id="table-to-export">
              <Table.Head>
                <Table.HeadCell>Date created</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Company concerned</Table.HeadCell>
                <Table.HeadCell>Task completed</Table.HeadCell>
                <Table.HeadCell>Comment</Table.HeadCell>
                <Table.HeadCell>Horaire / Forfitaire</Table.HeadCell>
                <Table.HeadCell>Number of hours worked</Table.HeadCell>
                <Table.HeadCell>Task Price</Table.HeadCell>

                <Table.HeadCell>Employee Cost</Table.HeadCell>
                <Table.HeadCell>Cost Earned</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {Array.isArray(pointings) &&
                  pointings.map((pointing) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={pointing._id}
                    >
                      <Table.Cell>
                        {pointing.createdAt &&
                          new Date(pointing.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        {pointing.createdBy?.username || "Unknown"}
                      </Table.Cell>
                      <Table.Cell>
                        {pointing.societe?.noms || "Unknown"}
                      </Table.Cell>
                      <Table.Cell>{pointing.tache?.nomtache}</Table.Cell>
                      <Table.Cell>{pointing.comment}</Table.Cell>
                      <Table.Cell>
                        {pointing.tache?.prixType === "horraire"
                          ? `${pointing.tache.prixHoraire}dt`
                          : `${pointing.tache.prixforfitaire}dt`}
                      </Table.Cell>
                      <Table.Cell>{pointing.timeDifference}h</Table.Cell>
                      <Table.Cell>{pointing.costTask}dt</Table.Cell>

                      <Table.Cell>{pointing.costEmp}dt</Table.Cell>
                      <Table.Cell>{pointing.costEarned}dt</Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </>
        )}
      </div>
      {pointings.length > 0 && (
        <div className="flex p-4 justify-end mt-5 w-full">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Export to Excel
          </button>
        </div>
      )}
    </div>
  );
}
