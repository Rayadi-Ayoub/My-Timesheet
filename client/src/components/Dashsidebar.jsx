import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiOutlineUserGroup, HiUser } from "react-icons/hi";
import { FaTasks, FaProjectDiagram } from "react-icons/fa";
import { CiTimer } from "react-icons/ci";
import { GoArchive } from "react-icons/go";
import { BsBuilding } from "react-icons/bs";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function Dashsidebar() {
  const location = useLocation();
  const [tab, setTab] = useState();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handlesignout = async () => {
    const res = await fetch("/api/user/signout", {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(data.message);
    } else {
      dispatch(signoutSuccess());
    }

    try {
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              profile
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item active={tab === "users"} icon={HiOutlineUserGroup}>
                users
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=pole">
              <Sidebar.Item active={tab === "pole"} icon={GoArchive}>
                pole
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=company">
              <Sidebar.Item active={tab === "company"} icon={BsBuilding}>
                company
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=project">
              <Sidebar.Item active={tab === "project"} icon={FaProjectDiagram}>
                project
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=Tasks">
              <Sidebar.Item active={tab === "Tasks"} icon={FaTasks}>
                Tasks
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=pointing">
              <Sidebar.Item active={tab === "pointing"} icon={CiTimer}>
                pointing
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handlesignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
