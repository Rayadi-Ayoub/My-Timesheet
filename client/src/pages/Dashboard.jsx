import { Outlet } from "react-router-dom";
import Dashsidebar from "../components/Dashsidebar";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-auto">
      <div className="md:w-56">
        {/* Sidebar */}
        <Dashsidebar />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
