import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Home from "./pages/Home.jsx";
import BusinessDashboard from "./pages/BusinessDashboard.jsx";
import loadGoogleAPI from "./utils/loadGoogleAPI.js";
import BusinessesByType from "./pages/BusinessesByType.jsx";
import Signup from "./pages/Signup.jsx";
import BusinessDerails from "./pages/BusinessDetails.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import Booking from "./pages/Booking";
import StaffDashboard from "./pages/StaffDashboard.jsx";
import Search from "./pages/Search.jsx";

loadGoogleAPI().catch((error) => {
  console.error(error);
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "business-dashboard/:userId",
        element: <BusinessDashboard />,
      },
      {
        path: "businesses-by-type/:businessType",
        element: <BusinessesByType />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "business-details/:businessId",
        element: <BusinessDerails />,
      },
      {
        path: "customer-dashboard/:userId",
        element: <CustomerDashboard />,
      },
      {
        path: "booking/:businessId/:serviceId",
        element: <Booking />,
      },
      {
        path: "staff-dashboard/:userId",
        element: <StaffDashboard />,
      },
      {
        path: "search-results/:searchQuery",
        element: <Search />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
