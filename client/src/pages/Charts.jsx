import React, { useEffect, useState } from "react";
import Select from "react-select";
import moment from "moment";
import MyChart1 from "../pages/pointingByDep";
import MyNewChart from "../pages/MyNewChart";
export default function Charts() {
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [monthly, setMonthly] = useState({});
  const [selectedDep, setSelectedDep] = useState(null);
  const [dep, setDep] = useState([]);
  const [users, setUsers] = useState([]);
  const [depUsers, setDepUsers] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectKey, setSelectKey] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedYear2, setSelectedYear2] = useState(moment().year());
  const [newChartData, setNewChartData] = useState([]);
  const [startDate, setStartDate] = useState(new Date("2024-01-01"));
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const fetchDep = async () => {
      try {
        const res = await fetch("/api/user/getDepartements");
        const data = await res.json();
        if (res.ok) {
          const formattedDeps = data.departementList.map((dep) => ({
            value: dep,
            label: dep,
          }));
          setDep(formattedDeps);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchDep();

    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.userWithoutPassword);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUsers();

    fetchNewChartData();
  }, []);

  useEffect(() => {
    fetchNewChartData();
  }, [selectedUsers, startDate, endDate]);

  const fetchNewChartData = async () => {
    const selectedUserIds = selectedUsers.map((user) => user.value);
    try {
      const res = await fetch("/api/pointings/newchartdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          userIds: selectedUserIds,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setNewChartData(data);
      } else {
        console.error("Failed to fetch new chart data");
        setNewChartData([]);
      }
    } catch (error) {
      console.log(error.message);
      setNewChartData([]);
    }
  };

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

  const fetchMyPointing = async (selectedWeek) => {
    setSelectedWeek(selectedWeek.value);
    setLabels([]);
    const updatedMonthly = {};
    try {
      for (const e of depUsers) {
        const res = await fetch(`/api/pointings/user/${e._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ week: selectedWeek.value }),
        });
        const data = await res.json();
        if (res.ok) {
          updatedMonthly[e.username] =
            data.totalTimeDifferenceByWeek?.monthly[
              new Date().toISOString().slice(0, 7)
            ] || 0;
          setLabels((prevLabels) => [...prevLabels, e.username]);
        }
      }
      setMonthly(updatedMonthly);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleYearChange = (selectedYear) => {
    setSelectedYear(selectedYear.value);
  };

  const handleDepChange = (selectedDep) => {
    setSelectedDep(selectedDep.value);
    setSelectedWeek(null);
    setLabels([]);
    setSelectKey((prevKey) => prevKey + 1);
    const depUsers = users.filter((e) => e.departement === selectedDep.value);
    setDepUsers(depUsers);
  };

  const years = Array.from({ length: 5 }, (_, i) => ({
    value: moment().year() - i,
    label: `${moment().year() - i}`,
  }));

  return (
    <div className="p-3 md:mx-auto ">
      <div className="flex p-3">
        <div className="flex flex-col p-5 dark:bg-slate-800 gap-4 md:w-100 w-full rounded-md shadow-md">
          <h3 className="flex text-gray-500 text-md uppercase justify-center">
            NUMBER OF HOURS WORKED by DEPARTMENT
          </h3>
          <Select options={dep} onChange={handleDepChange} />
          <Select options={years} onChange={handleYearChange} />
          {selectedDep && (
            <Select
              key={selectKey}
              options={weeks}
              onChange={fetchMyPointing}
              value={weeks.find((week) => week.value === selectedWeek)}
              placeholder="Select a week"
            />
          )}
          <div className="flex justify-between">
            {monthly && (
              <div>
                {monthly && (
                  <MyChart1
                    data={monthly}
                    week={selectedWeek}
                    labels={labels}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex p-3">
        <div className="flex flex-col p-5 dark:bg-slate-800 gap-4 md:w-100 w-full rounded-md shadow-md">
          <h3 className="flex text-gray-500 text-md uppercase justify-center">
            USER WORK HOURS AND TASK PRICE PER COST
          </h3>
          <div>
            <MyNewChart data={newChartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
