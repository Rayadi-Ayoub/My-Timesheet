import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

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

  const renderTable = () => {
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
          className="border border-gray-300 p-2 dark:border-gray-700 dark:text-gray-300"
        >
          {startOfWeek} - {endOfWeek}
          <br />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            semaine {week.split("-")[1]}
          </span>
        </th>
      );
    });

    const renderHoursTable = () => {
      const rows = Array.from(societeNames).map((societeName) => (
        <tr
          key={societeName}
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <td className="border border-gray-300 p-2 dark:border-gray-700 dark:text-gray-300">
            {societeName}
          </td>
          {weeks.map((week) => (
            <td
              key={week + societeName}
              className="border border-gray-300 p-2 dark:border-gray-700 dark:text-gray-300"
            >
              {(weeklyData[week][societeName]?.hours || 0).toFixed(2)} hrs
            </td>
          ))}
        </tr>
      ));

      return (
        <>
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-300">
            Heures
          </h3>
          <table className="min-w-full border border-gray-300 dark:border-gray-700">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 dark:border-gray-700">
                  Societe
                </th>
                {headers}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </>
      );
    };

    const renderForfitaireTable = () => {
      const forfitaireRows = Array.from(societeNames).map((societeName) => (
        <tr
          key={societeName}
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <td className="border border-gray-300 p-2 dark:border-gray-700 dark:text-gray-300">
            {societeName}
          </td>
          {weeks.map((week) => (
            <td
              key={week + societeName}
              className="border border-gray-300 p-2 dark:border-gray-700 dark:text-gray-300"
            >
              {(weeklyData[week][societeName]?.forfitaire || 0).toFixed(2)}
            </td>
          ))}
        </tr>
      ));

      return (
        <>
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-300">
            Facturation forfaitaire par nature de tache
          </h3>
          <table className="min-w-full border border-gray-300 dark:border-gray-700 mt-4">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 dark:border-gray-700">
                  Societe
                </th>
                {headers}
              </tr>
            </thead>
            <tbody>{forfitaireRows}</tbody>
          </table>
        </>
      );
    };

    const renderHorraireTable = () => {
      const horraireRows = Array.from(societeNames).map((societeName) => (
        <tr
          key={societeName}
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <td className="border border-gray-300 p-2 dark:border-gray-700 dark:text-gray-300">
            {societeName}
          </td>
          {weeks.map((week) => (
            <td
              key={week + societeName}
              className="border border-gray-300 p-2 dark:border-gray-700 dark:text-gray-300"
            >
              {(weeklyData[week][societeName]?.horraire || 0).toFixed(2)}
            </td>
          ))}
        </tr>
      ));

      return (
        <>
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-300">
            Facturation sur base horaire (temps passé taux de la ressources)
          </h3>
          <table className="min-w-full border border-gray-300 dark:border-gray-700 mt-4">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 dark:border-gray-700">
                  Societe
                </th>
                {headers}
              </tr>
            </thead>
            <tbody>{horraireRows}</tbody>
          </table>
        </>
      );
    };

    const renderTotalTable = () => {
      const totalRows = Array.from(societeNames).map((societeName) => (
        <tr
          key={societeName}
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <td className="border border-gray-300 p-2 dark:border-gray-700 dark:text-gray-300">
            {societeName}
          </td>
          {weeks.map((week) => (
            <td
              key={week + societeName}
              className="border border-gray-300 p-2 dark:border-gray-700 dark:text-gray-300"
            >
              {(
                (weeklyData[week][societeName]?.forfitaire || 0) +
                (weeklyData[week][societeName]?.horraire || 0)
              ).toFixed(2)}
            </td>
          ))}
        </tr>
      ));

      return (
        <>
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-300">
            Facturation totale
          </h3>
          <table className="min-w-full border border-gray-300 dark:border-gray-700 mt-4">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 dark:border-gray-700">
                  Societe
                </th>
                {headers}
              </tr>
            </thead>
            <tbody>{totalRows}</tbody>
          </table>
        </>
      );
    };

    const renderCostearnedTable = () => {
      const costearnedRows = Array.from(societeNames).map((societeName) => (
        <tr
          key={societeName}
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <td className="border border-gray-300 p-2 dark:border-gray-700 dark:text-gray-300">
            {societeName}
          </td>
          {weeks.map((week) => (
            <td
              key={week + societeName}
              className="border border-gray-300 p-2 dark:border-gray-700 dark:text-gray-300"
            >
              {(weeklyData[week][societeName]?.costearned || 0).toFixed(2)}
            </td>
          ))}
        </tr>
      ));

      return (
        <>
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-300">
            Cost Earned
          </h3>
          <table className="min-w-full border border-gray-300 dark:border-gray-700 mt-4">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 dark:border-gray-700">
                  Societe
                </th>
                {headers}
              </tr>
            </thead>
            <tbody>{costearnedRows}</tbody>
          </table>
        </>
      );
    };

    return (
      <>
        {renderHoursTable()}
        {renderForfitaireTable()}
        {renderHorraireTable()}
        {renderTotalTable()}
        {renderCostearnedTable()}
      </>
    );
  };

  return (
    <div className="p-5">
      <div className="mb-4">
        <label className="block mb-2 text-gray-700 dark:text-gray-300">
          Select User
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="block w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </label>
        <label className="block mb-2 text-gray-700 dark:text-gray-300">
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="block w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          />
        </label>
        <label className="block mb-2 text-gray-700 dark:text-gray-300">
          End Date
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="block w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          />
        </label>
      </div>
      <div className="overflow-x-auto">{renderTable()}</div>
    </div>
  );
}

export default TimeSheetTable;
