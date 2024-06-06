import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  HiArrowNarrowUp,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
  HiOutlineClock,
} from "react-icons/hi";
import { RxPinTop } from "react-icons/rx";
import MyChart from "../pages/MyChart";
import Select from "react-select";
import moment from "moment";

function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTimeDifferenceByWeek, setTotalTimeDifferenceByWeek] = useState(0);
  const [monthly, setmonthly] = useState({ monthly: 0, weekly: 0, daily: 0 });
  const [totalSocietes, setTotalSocietes] = useState(0);
  const [societeLastMonth, setSocietelastMonth] = useState(0);
  const [usersLastMonth, setUsersLastMonth] = useState([]);
  const [mostSelectedSociete, setMostSelectedSociete] = useState([]);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedWeek, setSelectedWeek] = useState(
    `${moment().year()}-${moment().week()}`
  );
  const [weeks, setWeeks] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
      fetchSociete();
      fetchmypointing({ value: selectedWeek });
      fetchmostSelectedSociete();
    }
  }, [currentUser]);

  useEffect(() => {
    const newWeeks = Array.from({ length: 53 }, (_, i) => {
      const startOfWeek = moment()
        .year(selectedYear)
        .week(i + 1)
        .startOf("week")
        .format("YYYY-MM-DD");
      const endOfWeek = moment()
        .year(selectedYear)
        .week(i + 1)
        .endOf("week")
        .format("YYYY-MM-DD");
      return {
        value: `${selectedYear}-${i + 1}`,
        label: `Week ${i + 1} (${startOfWeek} - ${endOfWeek})`,
      };
    });
    setWeeks(newWeeks);
  }, [selectedYear]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/user/getusers?limit=5`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        setTotalUsers(data.totalUsers);
        setUsersLastMonth(data.usersLastMonth);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchmostSelectedSociete = async () => {
    try {
      const res = await fetch(`/api/most-selected-societe`);
      const data = await res.json();
      if (res.ok) {
        setMostSelectedSociete(data.mostSelectedSociete);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchSociete = async () => {
    try {
      const res = await fetch(`/api/societes`);
      const data = await res.json();
      if (res.ok) {
        console.log(data);
        setTotalSocietes(data.totalSocietes);
        setSocietelastMonth(data.SocieteLastMonth);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchmypointing = async (selectedWeek) => {
    setSelectedWeek(selectedWeek?.value);
    if (!selectedWeek) return;

    try {
      const res = await fetch(`/api/pointings/user/${currentUser?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ week: selectedWeek.value }),
      });
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

  const years = Array.from({ length: 5 }, (_, i) => ({
    value: moment().year() - i,
    label: `${moment().year() - i}`,
  }));

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {usersLastMonth}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Societes
              </h3>
              <p className="text-2xl">{totalSocietes}</p>
            </div>
            <HiOutlineOfficeBuilding className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {societeLastMonth}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-4 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Most Active Company
              </h3>
              <p className="text-2xl p-4 ">{mostSelectedSociete}</p>
            </div>
            <RxPinTop className="bg-cyan-400 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Number of hours worked
              </h3>
              <p className="text-2xl ">
                {totalTimeDifferenceByWeek &&
                  totalTimeDifferenceByWeek.monthly &&
                  totalTimeDifferenceByWeek.monthly[
                    new Date().toISOString().slice(0, 7)
                  ]}
                <span className="p-2">Hours</span>
              </p>
            </div>
            <HiOutlineClock className="bg-blue-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {totalTimeDifferenceByWeek &&
                totalTimeDifferenceByWeek.monthly &&
                totalTimeDifferenceByWeek.monthly[
                  new Date().toISOString().slice(0, 7)
                ]}{" "}
            </span>
          </div>
        </div>
      </div>
      <div className="flex p-3">
        <div className="flex flex-col p-5 dark:bg-slate-800 gap-4 md:w-100 w-full rounded-md shadow-md">
          <h3 className="flex text-gray-500 text-md uppercase justify-center">
            NUMBER OF HOURS WORKED
          </h3>
          <Select
            className="text-sm font-bold text-gray-700 dark:text-gray-200"
            options={years}
            onChange={handleYearChange}
          />
          <Select
            className="text-sm font-bold text-gray-700 dark:text-gray-200"
            options={weeks}
            onChange={fetchmypointing}
          />

          <div className="flex justify-between">
            {totalTimeDifferenceByWeek && (
              <MyChart data={totalTimeDifferenceByWeek} week={selectedWeek} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardComp;
