// import Toolbar from "../Toolbar";
// import BusinessTypeNav from "../BusinessTypeNav";
import { Button, TextField, Stack, Modal } from "@mui/material";
// import HomeSearch from "../HomeSearch";
import "./HomeHeader.css";
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomeHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery.trim()}`); // Navigate to the search endpoint
    }
  };

  return (
    <header className="video-background">
      <video autoPlay muted loop>
        <source src="./videos/horizontal_.webm" type="video/webm" />
        Your browser does not support HTML5 video.
      </video>
      <div className="overlay">
        {" "}
        {/* Dark overlay */}
        {/* <Toolbar /> */}
      </div>
      <div className="middle-text">
        Discover and book beauty & wellness professionals near you
        <form
          className="d-flex justify-content-center m-4"
          onSubmit={handleSearchSubmit}
        >
          <TextField
            variant="outlined"
            placeholder="Search Services or Business"
            value={searchQuery} // Controlled input value
            onChange={handleSearchChange} // Update state on input change
            className="me-3 small-search-bar"
            aria-label="Search"
            size="small"
          />
          <Button variant="contained" color="primary" type="submit">
            Search
          </Button>
        </form>
      </div>
      {/* <HomeSearch /> */}
      <div className="home-navbar">
        {/* <BusinessTypeNav types={["All", "Barbershop", "Hair Salon"]} /> */}
      </div>
    </header>
  );
};

export default HomeHeader;
