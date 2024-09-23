import BusinessDashboardCmp from "../components/BusinessDashbordCmp";
import React from "react";
import Auth from "../utils/auth";
export default function BusinessDashboard() {
  if (!Auth.loggedIn()) {
    window.location = "/login";
  }

  return (
    <>
      <h1>Business Dashboard ({Auth.getUser().username})</h1>
      <BusinessDashboardCmp />
    </>
  );
}
