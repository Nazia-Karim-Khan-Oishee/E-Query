import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  //   useEffect(() => {
  //     if (user) {
  //       navigate("/");
  //     }
  //   }, [user, navigate]);

  if (user) {
    return <Outlet {...props} />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
