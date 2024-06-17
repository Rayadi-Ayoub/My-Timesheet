import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import ExcelJS from 'exceljs';
import Pagination from "./Pagination"; // Ensure this is moved to its own file

export default function Reporting() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pointings, setPointings] = useState([]);

  useEffect(() => {
    fetchAllPointings();
  }, [page]);

  const fetchAllPointings = async () => {
    try {
      const response = await fetch(
        `/api/getpointings?page=${page}&limit=10&reporting=true`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setPointings(data.pointings || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch pointings:", error);
      setPointings([]);
      setTotalPages(0);
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pointings');

    // Add headers
    worksheet.columns = [
      { header: 'Date created', key: 'createdAt', width: 20 },
      { header: 'Username', key: 'username', width: 20 },
      { header: 'Company concerned', key: 'company', width: 20 },
      { header: 'Task completed', key: 'task', width: 20 },
      { header: 'Comment', key: 'comment', width: 20 },
      { header: 'Horaire / Forfitaire', key: 'priceType', width: 20 },
      { header: 'Number of hours worked', key: 'hoursWorked', width: 20 },
      { header: 'Task Price', key: 'taskPrice', width: 20 },
      { header: 'Employee Cost', key: 'employeeCost', width: 20 },
      { header: 'Cost Earned', key: 'costEarned', width: 20 },
    ];

    // Add rows
    pointings.forEach(pointing => {
      worksheet.addRow({
        createdAt: pointing.createdAt && new Date(pointing.createdAt).toLocaleDateString(),
        username: pointing.createdBy?.username || "Unknown",
        company: pointing.societe?.noms || "Unknown",
        task: pointing.tache?.nomtache,
        comment: pointing.comment,
        priceType: pointing.tache?.prixType === "horraire"
          ? `${pointing.tache.prixHoraire}dt`
          : `${pointing.tache.prixforfitaire}dt`,
        hoursWorked: `${pointing.timeDifference}h`,
        taskPrice: `${pointing.costTask}dt`,
        employeeCost: `${pointing.costEmp}dt`,
        costEarned: `${pointing.costEarned}dt`
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pointings.xlsx";
    link.click();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full overflow-x-auto">
        {pointings.length === 0 ? (
          <div className="flex justify-center items-center h-full text-center text-gray-500 dark:text-gray-300">
            You don't have any data in your base.
          </div>
        ) : (
          <>
            <Table hoverable className="w-full" id="table-to-export">
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
        <div className="flex p-4 justify-end mt-2 w-full">
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
