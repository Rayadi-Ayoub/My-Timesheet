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
// import DashUsers from "./components/DashUsers";
// import DashProfile from "./components/DashProfile";
// import Project from "./components/Project";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/dashboard?tab=project" element={<Project />} />
          <Route path="/dashboard?tab=users" element={<DashUsers />} />
          <Route path="/dashboard?tab=profile" element={<DashProfile />} />
          <Route path="/dashboard?tab=profile" element={<DashProfile />} /> */}
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
