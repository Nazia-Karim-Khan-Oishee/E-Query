import { Navbar } from "flowbite-react"; // Assuming Container is imported for layout control
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
        <div>
          <Navbar.Collapse>
            {user ? (
              <ul className="flex flex-row">
                <li>
                  <Navbar.Link href="/" className="text-white ml-6">
                    Products
                  </Navbar.Link>
                </li>
                <li>
                  <Navbar.Link className="ml-4 text-white" href="/profile">
                    Profile
                  </Navbar.Link>
                </li>
                <li>
                  <Navbar.Link className="ml-4 text-white" href="/addProduct">
                    Sell
                  </Navbar.Link>
                </li>
                <li>
                  <Navbar.Link className="ml-4 text-white" href="/messages">
                    Messages
                  </Navbar.Link>
                </li>
              </ul>
            ) : (
              <ul className="flex flex-row">
                <li>
                  <Navbar.Link href="/signup" className="text-white ml-6">
                    Signup
                  </Navbar.Link>
                </li>
                <li>
                  <Navbar.Link href="/login" className="text-white ml-6">
                    Login
                  </Navbar.Link>
                </li>
              </ul>
            )}
          </Navbar.Collapse>
        </div>
        {user && (
          <div>
            <button
              className="bg-red-600 text-white px-4 py-2 ml-6  rounded-md"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </Navbar>
  );
}
