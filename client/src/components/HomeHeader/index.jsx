import { Grid } from "@mui/material";
import "./HomeHeader.css";
import TopNavBar from "../TopNavBar";
import BusinessTypeNav from "../BusinessTypesNav";
import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "../SearchBar";

export default function HomeHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  //  fetch business types from the server
  const [businessTypes, setBusinessTypes] = useState([]);
  useEffect(() => {
    axios.get("/api/typeAndServices").then((response) => {
      const types = response.data.map((type) => type.businessType);
      setBusinessTypes(types);
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-results/${searchQuery.trim()}`); // Navigate to the search endpoint
    }
  };

  return (
    <>
      <Grid container className="video-background">
        {/* background video */}
        <video autoPlay muted loop>
          <source src="./videos/horizontal_.webm" type="video/webm" />
          Your browser does not support HTML5 video.
        </video>
        {/* dark overlay */}
        <div className="overlay"></div>
        {/* top nav-bar */}
        <Grid item xs={12}>
          <TopNavBar />
        </Grid>

        {/* Search box */}
        <Grid item xs={12}>
          <SearchBar
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            handleSearchSubmit={handleSearchSubmit}
          />
        </Grid>

        {/* <Business Types nav-bar /> */}
        <Grid item xs={12}>
          <div className="home-navbar">
            <BusinessTypeNav businessTypes={businessTypes} />
          </div>
        </Grid>
      </Grid>
    </>
  );
}
