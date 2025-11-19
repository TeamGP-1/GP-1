import { Outlet, Navigate } from "react-router";
import Navbar from "../components/Navbar";

export default function BaseLayout() {
  if (!localStorage.getItem("access_token")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
