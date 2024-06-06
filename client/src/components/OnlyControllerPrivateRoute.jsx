import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function OnlyControllerPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser &&
    (currentUser.poste === "controller" || currentUser.poste === "admin") ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard/AccessDenied" />
  );
}
