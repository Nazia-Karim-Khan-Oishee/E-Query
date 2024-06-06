import { useState, useEffect } from "react";
import { useEnterToken } from "../../hooks/Auth/useEnterToken";

const EnterToken = () => {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const { enterToken, error, isLoading } = useEnterToken();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  useEffect(() => {
    if (password === confirmPassword && confirmPassword !== "") {
      setPasswordMatchError("Passwords Match!");
    } else {
      setPasswordMatchError("Passwords do not match.");
    }
  }, [password, confirmPassword]);
  useEffect(() => {
    setPasswordMatchError("");
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password === confirmPassword) {
        await enterToken(token, password);
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Error occurred during password reset:", err);
    }
  };

  return (
    <div className="flex min-h-full flex-col mt-14 justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-center text-4xl font-bold leading-9 tracking-tight text-green-700">
          EcoSync
        </h1>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reset Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <h5 className="mb-5 text-center font-semibold text-sm leading-6 tracking-tight text-red-600">
          Enter the token and a new password.
        </h5>
        <form className="space-y-6" onSubmit={handleSubmit} method="POST">
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="token"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Token
              </label>
            </div>
            <div className="mt-2 mb-5">
              <input
                id="token"
                name="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter the token you received in your email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2 mb-5">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a new password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
            </div>
            <div className="mt-2 mb-5">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              {passwordMatchError && (
                <p className="text-red-500">{passwordMatchError}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="btn w-56 py-2 px-4 border border-transparent text-sm font-medium rounded-md"
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};
export default EnterToken;
