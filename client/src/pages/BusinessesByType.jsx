import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import BusinessByTypeHeader from "../components/BusinessByTypeHeader";
import BusinessList from "../components/BusinessList";
import React from "react";
import axios from "axios";
import Box from "@mui/material/Box";

export default function BusinessesByType() {
  const { businessType } = useParams();
  const [businesses, setBusinesses] = React.useState([]);

  // get the businesses from the server
  React.useEffect(() => {
    axios.get(`/api/business/type/${businessType}`).then((response) => {
      setBusinesses(response.data);
      console.log(response.data);
    });
  }, [businessType]);

  return (
    <>
      <BusinessByTypeHeader currentType={businessType} />
      <Link to="/business-dashboard">Business Dashboard</Link>
      <Box sx={{ marginTop: "5rem" }}>
        <BusinessList businesses={businesses} />
      </Box>
    </>
  );
}
