import { Dropdown, Navbar } from "flowbite-react"; // Assuming Container is imported for layout control
import { useState } from "react";
import { useLogout } from "../hooks/Auth/useLogout";

export default function Component() {
  // State to track whether the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const { logout } = useLogout();
  const user = localStorage.getItem("user");
  // Function to handle logout
  const handleLogout = async () => {
    // Call the logout hook
    await logout();
    // Set the state to false
    setIsLoggedIn(false);
  };

  return (
    <Navbar fluid className="navbar">
      <div className="nav-container">
        <div>
          <Navbar.Brand>
            <h1 className="navbar-brand text-white ml-6">E-Query</h1>
          </Navbar.Brand>
        </div>
        {user && (
          <div className="flex justify-between">
            <ul className="flex flex-row">
              <li>
                <Navbar.Link className="ml-4 text-white" href="/profile">
                  Profile
                </Navbar.Link>
              </li>
              <li>
                <Navbar.Link href="/getAllQuestion" className="text-white ml-6">
                  Questions
                </Navbar.Link>
              </li>

              <li>
                <Navbar.Link
                  className="ml-4 mr-4 text-white"
                  href="/getAllResources">
                  Resources
                </Navbar.Link>
              </li>
              <li>
                {/* <Dropdown
                  label="Profile"
                  inline={true}
                  className="text-white flex">
                  <Dropdown.Item className="py-1 px-2">
                    <Navbar.Link href="/profile">Profile</Navbar.Link>
                  </Dropdown.Item>
                  <Dropdown.Item className="py-1 px-2">
                    <Navbar.Link href="/profile/getQuestions">
                      My Questions
                    </Navbar.Link>
                  </Dropdown.Item>
                  <Dropdown.Item className="py-1 px-2">
                    <Navbar.Link href="/profile/getResources">
                      My Resouces
                    </Navbar.Link>
                  </Dropdown.Item>
                  <Dropdown.Item className="py-1 px-2">
                    <Navbar.Link href="/profile/getBookmark">
                      My BookMarks
                    </Navbar.Link>
                  </Dropdown.Item>
                </Dropdown> */}
              </li>
            </ul>
            <button
              className="bg-red-600 text-white px-4 py-2 ml-6  rounded-md"
              onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </Navbar>
  );
}
