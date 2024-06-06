import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import OnlyManagerPrivateRoute from "./components/OnlyManagerPrivateRoute";
import OnlyControllerPrivateRoute from "./components/OnlyControllerPrivateRoute";
import Reporting from "./pages/Reporting";
import DashPointings from "./components/DashPointings";
import DashUsers from "./components/DashUsers";
import DashProfile from "./components/DashProfile";
import Company from "./pages/Company";
import Pole from "./pages/Pole";
import DashboardComp from "./components/DashboardComp";
import Tasks from "./pages/Tasks";
import Charts from "./pages/Charts";
import TimeSheetTable from "./pages/TimeSheetTable";
import Pointing from "./pages/Pointing";
import Typetask from "./pages/Typetask";
import Task from "./pages/Task";
import AccessDenied from "./pages/AccessDenied";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route path="accessdenied" element={<AccessDenied />} />
            <Route index element={<DashboardComp />} />
            <Route path="profile" element={<DashProfile />} />
            <Route path="pointing" element={<DashPointings />} />
            <Route path="pointing/list" element={<DashPointings />} />
            <Route path="pointing/add" element={<Pointing />} />
            <Route path="tasks" element={<Tasks />} />
            <Route element={<OnlyAdminPrivateRoute />}>
              <Route path="users" element={<DashUsers />} />
              <Route path="pole" element={<Pole />} />
              <Route path="company" element={<Company />} />
              <Route path="task" element={<Task />} />
              <Route path="typetask" element={<Typetask />} />
            </Route>
            <Route element={<OnlyControllerPrivateRoute />}>
              <Route path="reporting" element={<Reporting />} />
              <Route path="charts" element={<Charts />} />
              <Route path="timesheettable" element={<TimeSheetTable />} />
            </Route>
          </Route>
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
