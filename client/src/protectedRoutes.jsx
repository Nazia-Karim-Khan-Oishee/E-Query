import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    return <Outlet {...props} />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
