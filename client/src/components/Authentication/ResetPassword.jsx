import { useState } from "react";
import { useResetPassword } from "../../hooks/Auth/useResetPassword";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const { resetPassword, error, isLoading } = useResetPassword();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      window.location.href = "/enterToken";
    } catch (error) {
      console.error("Error occurred during password reset:", error);
    }
  };
  return (
    <div className="flex min-h-full flex-col justify-center mt-20 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-center text-4xl font-bold leading-9 tracking-tight text-green-700">
          EcoSync
        </h1>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Forgotten Password?
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <h5 className="mb-5 text-center font-semibold text-sm leading-6 tracking-tight text-red-600">
          Please enter your email to receive the password reset token.
        </h5>
        <form className="space-y-6" action="#" method="POST">
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
            </div>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn w-56 rounded-md px-3 py-1.4 text-sm font-semibold leading-6"
            >
              Send Reset Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
