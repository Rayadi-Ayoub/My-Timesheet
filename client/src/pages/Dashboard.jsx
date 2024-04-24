import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Dashsidebar from "../components/Dashsidebar";
import DashProfile from "../components/DashProfile";
import CreateUser from "./CreateUser";
import DashUsers from "../components/DashUsers";
import DashPole from "../components/DashPole";
import DashCompany from "../components/DashCompany";
export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* side bar */}
        <Dashsidebar />
      </div>
      {/* profile... */}
      {tab === "profile" && <DashProfile />}

      {tab === "create-user" && <CreateUser />}
      {/* users... */}
      {tab === "users" && <DashUsers />}

      {/* pole... */}
      {tab === "pole" && <DashPole />}

      {/* company... */}
      {tab === "company" && <DashCompany />}
    </div>
  );
}
