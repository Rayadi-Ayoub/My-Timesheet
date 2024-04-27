import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Dashsidebar from "../components/Dashsidebar";
import DashProfile from "../components/DashProfile";
import DashUsers from "../components/DashUsers";
import Pole from "../pages/Pole";
import Company from "../pages/Company";
import Project from "../pages/Project";
import Pointing from "../pages/Pointing";
import Tasks from "../pages/Tasks";

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

      {/* users... */}
      {tab === "users" && <DashUsers />}

      {/* pole... */}
      {tab === "pole" && <Pole />}

      {/* company... */}
      {tab === "company" && <Company />}

      {/* <project /> */}
      {tab === "project" && <Project />}

      {/* <Tasks /> */}
      {tab === "Tasks" && <Tasks />}

      {/* <pointing /> */}
      {tab === "pointing" && <Pointing />}
    </div>
  );
}
