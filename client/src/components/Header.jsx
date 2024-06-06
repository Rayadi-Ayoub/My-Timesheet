import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { getUserProfilePicture } from "../utils/profilePicture.utils";

function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

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
    <Navbar className="border-b-2">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link
          to="/"
          className="flex items-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <img src="/image.png" alt="Logo" className="h-10 w-15" />
          <span className="px-2 py-1 dark:text-white">Timesheet</span>
        </Link>

        <div className="flex items-center">
          <form className="hidden lg:block">
            <TextInput
              type="text"
              placeholder="Search..."
              icon={AiOutlineSearch}
              className="hidden lg:inline"
            />
          </form>
          <Button className="lg:hidden w-12 h-10" color="gray" pill>
            <AiOutlineSearch />
          </Button>
        </div>

        <div className="flex items-center gap-2 md:order-2">
          <Button
            className="w-12 h-10 hidden sm:inline"
            color="gray"
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? <FaSun /> : <FaMoon />}
          </Button>
          {currentUser || currentUser?.profilePicture ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="user"
                  img={getUserProfilePicture(currentUser.profilePicture)}
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to={"/dashboard/profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handlesignout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
          )}
          <Navbar.Toggle />
        </div>

        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/About"} as={"div"}>
            <Link to="/About">About</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default Header;
