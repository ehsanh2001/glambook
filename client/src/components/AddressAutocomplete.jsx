import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";

const AddressAutocomplete = () => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [location, setLocation] = useState({ lat: null, lng: null });

  // Fetch address predictions from Google Places API
  useEffect(() => {
    if (inputValue === "") {
      setOptions([]);
      return;
    }

    const autocompleteService =
      new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions(
      { input: inputValue },
      (predictions, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setOptions(predictions.map((prediction) => prediction.description));
        }
      }
    );
  }, [inputValue]);

  // Fetch place details including lat and lng
  const fetchLatLng = (address) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        const { lat, lng } = results[0].geometry.location;
        setLocation({ lat: lat(), lng: lng() });
      } else {
        console.error(
          "Geocode was not successful for the following reason:",
          status
        );
      }
    });
  };

  // Update lat/lng when inputValue changes
  useEffect(() => {
    if (inputValue) {
      fetchLatLng(inputValue);
    }
  }, [inputValue]);

  return (
    <div>
      <Autocomplete
        freeSolo
        options={options}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        renderInput={(params) => (
          <TextField {...params} label="Enter address" variant="standard" />
        )}
      />
    </div>
  );
};

export default AddressAutocomplete;
