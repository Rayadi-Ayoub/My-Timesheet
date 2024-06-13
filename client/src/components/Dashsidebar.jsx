import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiOutlineUserGroup, HiUser } from "react-icons/hi";
import { FaListUl, FaTasks } from "react-icons/fa";
import { CiTimer } from "react-icons/ci";
import { GoArchive } from "react-icons/go";
import { BsBuilding } from "react-icons/bs";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { TbReport } from "react-icons/tb";
import { MdDashboard } from "react-icons/md";
import { CiPenpot } from "react-icons/ci";
import { FaHandDots, FaPen } from "react-icons/fa6";
import { BsTable } from "react-icons/bs";
import { SiSoundcharts } from "react-icons/si";

export default function Dashsidebar() {
  const [poleOpen, setPoleOpen] = useState(false);
  const [typeTaskOpen, setTypeTaskOpen] = useState(false);
  const [pointingOpen, setPointingOpen] = useState(false);
  const [reportingOpen, setReportingOpen] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

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
          <Sidebar.Item as={Link} to="/dashboard" icon={MdDashboard}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item
            as={Link}
            to="/dashboard/profile"
            icon={HiUser}
            label={
              currentUser.poste === "admin"
                ? "Admin"
                : currentUser.poste === "user"
                ? "User"
                : currentUser.poste === "manager"
                ? "Manager"
                : currentUser.poste === "controller"
                ? "Controller"
                : "Unknown"
            }
            labelColor="dark"
          >
            Profile
          </Sidebar.Item>
          {currentUser.poste === "admin" && (
            <Sidebar.Item
              as={Link}
              to="/dashboard/users"
              icon={HiOutlineUserGroup}
            >
              Users
            </Sidebar.Item>
          )}

          {currentUser.poste === "admin" && (
            <>
              <Sidebar.Item
                as={Link}
                to="/dashboard/pole"
                className="cursor-pointer"
                icon={GoArchive}
                onClick={() => setPoleOpen(!poleOpen)}
              >
                Pole
              </Sidebar.Item>
              {poleOpen && (
                <Sidebar.Item
                  as={Link}
                  to="/dashboard/company"
                  className="pl-6"
                  icon={BsBuilding}
                >
                  Company
                </Sidebar.Item>
              )}
            </>
          )}

          {currentUser.poste === "admin" && (
            <>
              <Sidebar.Item
                as={Link}
                to="/dashboard/typetask"
                className="cursor-pointer"
                icon={CiPenpot}
                onClick={() => setTypeTaskOpen(!typeTaskOpen)}
              >
                Type Task
              </Sidebar.Item>
              {typeTaskOpen && (
                <Sidebar.Item
                  as={Link}
                  to="/dashboard/task"
                  className="pl-6"
                  icon={FaPen}
                >
                  Task
                </Sidebar.Item>
              )}
            </>
          )}

          <Sidebar.Item as={Link} to="/dashboard/tasks" icon={FaTasks}>
            Tasks
          </Sidebar.Item>

          <Sidebar.Item
            className="cursor-pointer"
            icon={CiTimer}
            onClick={() => setPointingOpen(!pointingOpen)}
          >
            Pointing
          </Sidebar.Item>
          {pointingOpen && (
            <>
              <Sidebar.Item
                as={Link}
                to="/dashboard/pointing/add"
                className="pl-6"
                icon={FaPen}
              >
                Add
              </Sidebar.Item>
              <Sidebar.Item
                as={Link}
                to="/dashboard/pointing"
                className="pl-6"
                icon={FaListUl}
              >
                List
              </Sidebar.Item>
            </>
          )}

          {currentUser.poste === "controller" && (
            <>
              <Sidebar.Item
                as={Link}
                to="/dashboard/reporting"
                className="cursor-pointer"
                icon={TbReport}
                onClick={() => setReportingOpen(!reportingOpen)}
              >
                Reporting
              </Sidebar.Item>

              {reportingOpen && (
                <>
                  <Sidebar.Item
                    as={Link}
                    to="/dashboard/charts"
                    className="pl-6"
                    icon={SiSoundcharts}
                  >
                    Charts
                  </Sidebar.Item>
                  <Sidebar.Item
                    as={Link}
                    to="/dashboard/timesheettable"
                    className="pl-6"
                    icon={BsTable}
                  >
                    TimeSheetTable
                  </Sidebar.Item>
                </>
              )}
            </>
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
