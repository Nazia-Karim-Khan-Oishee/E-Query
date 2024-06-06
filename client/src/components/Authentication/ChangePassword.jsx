// ChangePassword.js

import React, { useState } from "react";
import { useChangePassword } from "../../hooks/Auth/useChangePassword";
import AdminSideBar from "../Navigation/adminNavigation";
import StsNavigation from "../Navigation/stsNavigation";
import LandfillNavigation from "../Navigation/landfillNavigation";

const ChangePassword = () => {
  const userId = JSON.parse(localStorage.getItem("user")).userId;
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const role = JSON.parse(localStorage.getItem("user")).role;
  const { changePassword, error } = useChangePassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setMessage("Passwords do not match");
    }
    try {
      await changePassword(userId, password, newPassword);
      setMessage("Password changed successfully");
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="rounded px-8 pt-6 pb-8 mb-4 mt-20 w-96 lg:w-2/3 xl:w-1/2">
        <h2 className="text-4xl mb-4 font-semibold text-green-700">
          Change Password
        </h2>
        <hr />
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-14">
            <label
              className="block text-3xl font-semibold text-gray-700 text-sm mb-2"
              htmlFor="password"
            >
              Current Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full h-14 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              type="password"
              placeholder="Current Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className=" mb-4">
            <label
              className="block text-3xl text-gray-700 text-sm font-semibold mb-2"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full h-14 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-14">
            <label
              className="block text-3xl text-gray-700 text-sm font-semibold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full h-14 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="btn w-54 lg:w-72 xl:w-96 font-semibold py-2 px-4 rounded font-semibold py-2 px-4 rounded "
              type="submit"
            >
              Change Password
            </button>
          </div>
          <div>{error && <p className="text-red-500">{error}</p>}</div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
