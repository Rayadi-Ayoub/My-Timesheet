import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Tabs } from "flowbite-react";

function TimeSheetTable() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [weeklyData, setWeeklyData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [societes, setSocietes] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchSocietes();
  }, []);

  useEffect(() => {
    if (selectedUser && startDate && endDate) {
      fetchWeeklyData();
    }
  }, [selectedUser, startDate, endDate]);

  const fetchSocietes = async () => {
    try {
      const response = await axios.get("/api/societes");
      setSocietes(response.data);
    } catch (error) {
      console.error("Error fetching societes:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchWeeklyData = async () => {
    if (!startDate || !endDate || !selectedUser) {
      console.error(
        "Missing required fields: startDate, endDate, or selectedUser"
      );
      return;
    }

    try {
      const response = await axios.post("/api/pointings/weeklyhoursbysociete", {
        startDate,
        endDate,
        userIds: [selectedUser],
      });
      console.log("Weekly Data:", response.data); // Log the data to see its structure
      setWeeklyData(response.data);
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    }
  };

  const renderTable = (dataKey, label) => {
    const weeks = Object.keys(weeklyData);
    const societeNames = new Set();

    weeks.forEach((week) => {
      Object.keys(weeklyData[week]).forEach((societeName) => {
        societeNames.add(societeName);
      });
    });

    const headers = weeks.map((week) => {
      const startOfWeek = moment(week, "YYYY-WW")
        .startOf("isoWeek")
        .format("DD-MMM-YY");
      const endOfWeek = moment(week, "YYYY-WW")
        .endOf("isoWeek")
        .format("DD-MMM-YY");
      return (
        <th
          key={week}
          className="border border-gray-300 p-2 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
        >
          {startOfWeek} - {endOfWeek}
          <br />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Week {week.split("-")[1]}
          </span>
        </th>
      );
    });

    const rows = Array.from(societeNames).map((societeName) => (
      <tr
        key={societeName}
        className="hover:bg-gray-100 dark:hover:bg-gray-600"
      >
        <td className="border border-gray-300 p-2 dark:border-gray-600 dark:text-gray-300">
          {societeName}
        </td>
        {weeks.map((week) => (
          <td
            key={week + societeName}
            className="border border-gray-300 p-2 dark:border-gray-600 dark:text-gray-300"
          >
            {(weeklyData[week][societeName]?.[dataKey] || 0).toFixed(2)}
          </td>
        ))}
      </tr>
    ));

    return (
      <>
        <h3 className="text-lg font-semibold mb-2 dark:text-gray-300">
          {label}
        </h3>
        <table className="min-w-full border border-gray-300 dark:border-gray-600 mt-4">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                Company
              </th>
              {headers}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </>
    );
  };

  return (
    <div className="p-5">
      <div className="mb-4 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <label className="flex-1 text-gray-700 dark:text-gray-300">
          Select User
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="block w-full mt-1 border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </label>
        <label className="flex-1 text-gray-700 dark:text-gray-300">
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="block w-full mt-1 border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          />
        </label>
        <label className="flex-1 text-gray-700 dark:text-gray-300">
          End Date
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="block w-full mt-1 border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          />
        </label>
      </div>
      <Tabs aria-label="TimeSheet Tables">
        <Tabs.Item title="Hours">
          <div className="overflow-x-auto">{renderTable("hours", "Hours")}</div>
        </Tabs.Item>
        <Tabs.Item title="Flat-rate billing by task type">
          <div className="overflow-x-auto">
            {renderTable("forfitaire", "Flat-rate billing by task type")}
          </div>
        </Tabs.Item>
        <Tabs.Item title="Hourly billing">
          <div className="overflow-x-auto">
            {renderTable(
              "horraire",
              "Hourly billing (time spent at resource rate)"
            )}
          </div>
        </Tabs.Item>
        <Tabs.Item title="Billing Earned">
          <div className="overflow-x-auto">
            {renderTable("costearned", "Billing Earned")}
          </div>
        </Tabs.Item>
        <Tabs.Item title="Total billing">
          <div className="overflow-x-auto">
            {renderTable("total", "Total billing")}
          </div>
        </Tabs.Item>
      </Tabs>
    </div>
  );
}

export default TimeSheetTable;
