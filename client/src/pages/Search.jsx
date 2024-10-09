import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Search() {
  const searchQuery = useParams().searchQuery;
  const [searchResults, setSearchResults] = React.useState([]);

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
        log: address.lng,
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
  }, []);

  return (
    <div>
      <h1>Search Results for {searchQuery}</h1>
    </div>
  );
}
