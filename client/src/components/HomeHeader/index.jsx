import { Grid } from "@mui/material";
import "./HomeHeader.css";
import TopNavBar from "../TopNavBar";
import BusinessTypeNav from "../BusinessTypesNav";
import { React, useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../SearchBar";

export default function HomeHeader() {
  //  fetch business types from the server
  const [businessTypes, setBusinessTypes] = useState([]);
  useEffect(() => {
    axios.get("/api/typeAndServices").then((response) => {
      const types = response.data.map((type) => type.businessType);
      setBusinessTypes(types);
    });
  }, []);

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
          <SearchBar />
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
