import React from "react";
import { useParams } from "react-router-dom";

export default function Search() {
  const searchQuery = useParams().searchQuery;
  return (
    <div>
      <h1>Search Results for {searchQuery}</h1>
    </div>
  );
}
