import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Students from "../pages/Students.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Courses from "../pages/Courses.jsx";
import Attendance from "../pages/Attendance.jsx";
import Error from "../pages/Error.jsx";
import Login from "../pages/Login.jsx"; // Import Login page
import Navbar from "../components/Navbar.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx"; // Import private route guard

// Layout component that includes Navbar and renders children via Outlet
const Layout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Navbar />
      <div className="content" style={{ flex: 1, padding: "1rem" }}>
        <Outlet />
      </div>
    </div>
  );
};

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          
          {/* Protected route for /students */}
          <Route
            path="/students"
            element={
              <PrivateRoute>
                <Students />
              </PrivateRoute>
            }
          />

          <Route path="/attendance" element={<Attendance />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="*" element={<Error />} />
        </Route>

        {/* Login route outside Layout (no Navbar on login) */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
