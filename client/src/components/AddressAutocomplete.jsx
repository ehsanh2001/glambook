import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";

const AddressAutocomplete = ({ address, setAddressLocation }) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [location, setLocation] = useState({ lat: null, lng: null });

  // Set inputValue to address when address changes
  useEffect(() => {
    if (address) {
      setInputValue(address);
    }
  }, [address]);

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
        const result = { lat: lat(), lng: lng() };
        setLocation(result);
      } else {
        console.error(
          "Geocode was not successful for the following reason:",
          status
        );
      }
    });
  };

  // Update location(lat,lng) when inputValue changes
  useEffect(() => {
    if (inputValue) {
      fetchLatLng(inputValue);
    }
  }, [inputValue]);

  // Update addressLocation when location changes
  useEffect(() => {
    setAddressLocation({
      address: inputValue,
      lat: location.lat,
      lng: location.lng,
    });
  }, [location]);

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
