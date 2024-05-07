import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
export default function Reporting() {
  const [pointing, setPointing] = useState([]);

  useEffect(() => {
    fetchallpointings();
  }, []);

  const fetchallpointings = async () => {
    const response = await fetch("/api/getpointings");
    const data = await response.json();
    setPointing(data);
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-10 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <>
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
          {pointing.map((pointing) => (
            <Table.Body className="divide-y" key={pointing._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(pointing.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{pointing.username}</Table.Cell>
                <Table.Cell>{pointing.noms}</Table.Cell>
                <Table.Cell>{pointing.nomtache}</Table.Cell>
                <Table.Cell>{pointing.prixforfitaire}dt</Table.Cell>
                <Table.Cell>{pointing.timeDifference}h</Table.Cell>
                <Table.Cell>{pointing.pricePerHour}dt</Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      </>
    </div>
  );
}
