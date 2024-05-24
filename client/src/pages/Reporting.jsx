import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx"; // Import XLSX dependency for Excel export
import MyChart from "../pages/MyChart";
import Select from 'react-select';
import moment from 'moment';

function Pagination({ page, totalPages, setPage }) {
  const generatePages = () => {
    const maxPagesToShow = 5;
    const halfMaxPages = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(page - halfMaxPages, 1);
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    // Adjust startPage if we are near the end
    if (endPage === totalPages) {
      startPage = Math.max(totalPages - maxPagesToShow + 1, 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const pages = generatePages();

  return (
    <nav
      className="flex justify-center p-4"
      aria-label="Page navigation example"
    >
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
  );
}

export default function Reporting() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pointings, setPointings] = useState([]);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [totalTimeDifferenceByWeek, setTotalTimeDifferenceByWeek] = useState(0);
  const [monthly, setmonthly] = useState({ monthly: 0, weekly: 0, daily: 0 });
  const [selectedDep, setSelectedDep] = useState(null);
  const [dep, setDep] = useState();
  useEffect(() => {
    const fetchDep = async () => {
      try {
        const res = await fetch('/api/user/getDepartements');
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          const formattedDeps = data.departementList.map(dep => ({
            value: dep,
            label: dep
          }));
          setDep(formattedDeps);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchDep();
  }, []);
  useEffect(() => {
    const newWeeks = Array.from({ length: 53 }, (_, i) => {
      const startOfWeek = moment().year(selectedYear).week(i + 1).startOf('week').format('YYYY-MM-DD');
      const endOfWeek = moment().year(selectedYear).week(i + 1).endOf('week').format('YYYY-MM-DD');
      return {
        value: `${selectedYear}-${i + 1}`,
        label: `Week ${i + 1} (${startOfWeek} - ${endOfWeek})`
      };
    });
    setWeeks(newWeeks);
  }, [selectedYear]);

  const fetchmypointing = async (selectedWeek) => {
    setSelectedWeek(selectedWeek.value);
    try {
        const res = await fetch(`/api/pointings/user/${currentUser?._id}`,{method: 'POST',headers: {
          'Content-Type': 'application/json',
        },body:JSON.stringify({week:selectedWeek.value})})
      const data = await res.json();
      if (res.ok) {
        setTotalTimeDifferenceByWeek(data.totalTimeDifferenceByWeek);
        setmonthly(data.monthly);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleYearChange = (selectedYear) => {
    setSelectedYear(selectedYear.value);
  };
  const handleDepChange = (selectedDep) => {
    setSelectedDep(selectedDep.value);
  };
  const years = Array.from({ length: 5 }, (_, i) => ({ value: moment().year() - i, label: `${moment().year() - i}` }));
  

  useEffect(() => {
    fetchallpointings();
  }, [page]);


  const fetchallpointings = async () => {
    const response = await fetch(`/api/getpointings?page=${page}&limit=10`);
    const data = await response.json();
    setPointings(data.pointings);
    setTotalPages(data.totalPages);
  };

  // Function to handle export to Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.table_to_book(
      document.getElementById("table-to-export")
    );
    XLSX.writeFile(wb, "pointings.xlsx");
  };

  return (
    <div>
      <div className="table-auto overflow-x-scroll md:mx-auto p-10 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        <Table hoverable className="shadow-md" id="table-to-export">
          <Table.Head>
            <Table.HeadCell>Date created</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Company concerned</Table.HeadCell>
            <Table.HeadCell>Task completed</Table.HeadCell>
            <Table.HeadCell>Comment</Table.HeadCell>
            <Table.HeadCell>Fixed price</Table.HeadCell>
            <Table.HeadCell>Number of hours workers</Table.HeadCell>
            <Table.HeadCell>Task price per hour</Table.HeadCell>
            <Table.HeadCell>Task price per cost</Table.HeadCell>
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
                <Table.Cell>{pointing.createdBy?.username}</Table.Cell>
                <Table.Cell>{pointing.societe?.noms}</Table.Cell>
                <Table.Cell>
                  {pointing.tache?.nomtache}
                  </Table.Cell>
                 
                  <Table.Cell>{pointing.comment}</Table.Cell>
                

                <Table.Cell>{pointing.tache?.prixforfitaire}dt</Table.Cell>
                <Table.Cell>{pointing.timeDifference}h</Table.Cell>
                <Table.Cell>{pointing.costPerHours}dt</Table.Cell>
                <Table.Cell>{pointing.costPerEmp}dt</Table.Cell>
                
              </Table.Row>
            ))}
        </Table.Body>
        </Table>
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
      <div className="flex p-4 justify-end mt-5">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export to Excel
        </button>
      </div>
      <div className=" flex p-3">
        <div className=" flex flex-col p-5 dark:bg-slate-800 gap-4 md:w-100 w-full rounded-md shadow-md">
          <h3 className=" flex text-gray-500 text-md uppercase justify-center">
            NUMBER OF HOURS WORKED
          </h3>
          <Select options={dep} onChange={handleDepChange} />
          <Select options={years} onChange={handleYearChange} />
          { selectedDep && <Select options={weeks} onChange={fetchmypointing} />}
      
          <div className="flex justify-between">
            {totalTimeDifferenceByWeek && (
              <MyChart data={totalTimeDifferenceByWeek} week={selectedWeek}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
