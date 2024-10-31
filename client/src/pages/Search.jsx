import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SmallHeader from "../components/SmallHeader";
import SearchBar from "../components/SearchBar";
import BusinessList from "../components/BusinessList";
import { Box } from "@mui/material";

export default function Search() {
  const searchQuery = useParams().searchQuery;
  const [searchResults, setSearchResults] = React.useState([]);

  // get search results
  React.useEffect(() => {
    // get address from local storage
    const address = JSON.parse(localStorage.getItem("address"));

    // create query object
    let queryParams = {
      q: searchQuery,
    };
    if (address) {
      queryParams = {
        ...queryParams,
        lat: address.lat,
        lng: address.lng,
      };
    }
    const urlParams = new URLSearchParams(queryParams);
    // fetch search results
    try {
      const fetchSearchResults = async () => {
        const response = await axios.get(`/api/search?${urlParams}`);
        setSearchResults(response.data);
        console.log(response.data);
      };

      fetchSearchResults();
    } catch (error) {
      console.error(error);
    }
  }, [searchQuery]);

  return (
    <>
      <SmallHeader />
      <Box sx={{ backgroundColor: "#0000Af" }}>
        <SearchBar showTopText={false} />
      </Box>
      <Box sx={{ marginTop: "5rem" }}>
        <BusinessList businesses={searchResults} />
      </Box>
    </>
  );
}
