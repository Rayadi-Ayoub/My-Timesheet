import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";

export default function MyNewChart() {
  const [startDate, setStartDate] = useState(new Date("2024-01-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newChartData, setNewChartData] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchNewChartData();
  }, [selectedUsers, startDate, endDate]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/user/getusers");
      const data = await res.json();
      console.log("Fetched user data:", data);
      if (res.ok) {
        setUsers(data.userWithoutPassword);
      } else {
        console.error("Failed to fetch users");
        setUsers([]);
      }
    } catch (error) {
      console.log(error.message);
      setUsers([]);
    }
  };

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

  const chartData =
    newChartData && Array.isArray(newChartData) ? newChartData : [];

  const labels = chartData.map((item) => item.societe);
  const hoursWorked = chartData.map((item) => item.hoursWorked || 0);
  const costEarned = chartData.map((item) => item.costEarned || 0);
  const prixHoraire = chartData.map((item) => item.prixHoraire || 0);
  const prixforfitaire = chartData.map((item) => item.prixforfitaire || 0);

  const data = {
    labels: labels,
    datasets: [
      {
        type: "bar",
        label: "Hours Worked",
        data: hoursWorked,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "Cost Earned",
        data: costEarned,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        type: "line",
        label: "Prix Horaire",
        data: prixHoraire,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        fill: false,
      },
      {
        type: "line",
        label: "Prix Forfitaire",
        data: prixforfitaire,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const userList = Array.isArray(users)
    ? users.map((user) => ({
        value: user._id,
        label: user.username,
      }))
    : [];

  console.log("User list options:", userList);

  return (
    <div>
      <div className="p-5">
        <h3 className="text-gray-500 text-md uppercase">Filter Data</h3>
        <div className="flex gap-4">
          <div>
            <label className="block text-gray-700">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              className="border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Select Users</label>
            <Select
              options={userList}
              isMulti
              onChange={setSelectedUsers}
              className="border p-2 rounded"
            />
          </div>
        </div>
      </div>
      <Bar data={data} />
    </div>
  );
}
