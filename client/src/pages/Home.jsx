import { Link } from "react-router-dom";
import HomeHeader from "../components/HomeHeader";
import BusinessList from "../components/BusinessList";
import React from "react";
import axios from "axios";
import Box from "@mui/material/Box";

export default function Home() {
  const [businesses, setBusinesses] = React.useState([]);
  // get the businesses from the server
  React.useEffect(() => {
    axios.get("/api/business").then((response) => {
      setBusinesses(response.data);
    });
  }, []);
  return (
    <>
      <HomeHeader />
      <Link to="/business-dashboard">Business Dashboard</Link>
      <Box sx={{ marginTop: "5rem" }}>
        <BusinessList businesses={businesses} />
      </Box>
    </>
  );
}
