import * as React from "react";
import { TextField, Grid, Stack, Button } from "@mui/material";
import ImageUploader from "./ImageUploader";
import AddressAutocomplete from "../AddressAutocomplete";
import { useState, useCallback } from "react";
import GoogleMapModal from "../GoogleMapModal";

export default function GeneralBusinessInfoForm() {
  const [showModal, setShowModal] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");
  // Handle Modal for Google Map
  const handleOpenModal = useCallback(() => setShowModal(true), []);
  const handleCloseModal = useCallback(() => setShowModal(false), []);
  const handleAddressChange = useCallback((newAddress) => {
    setAddress(newAddress.address);
    setLocation({ lat: newAddress.lat, lng: newAddress.lng });
  }, []);

  return (
    <Stack spacing={3}>
      <ImageUploader />
      <TextField
        id="businessName"
        label="Business Name"
        variant="standard"
        sx={{ marginBottom: 2, width: "60ch" }}
      />
      <TextField
        id="phone"
        label="Phone Number"
        variant="standard"
        sx={{ marginBottom: 2, width: "60ch" }}
      />
      <AddressAutocomplete />
      <Button variant="outlined" onClick={handleOpenModal}>
        Map
      </Button>
      <GoogleMapModal
        show={showModal}
        handleClose={handleCloseModal}
        setLocation={handleAddressChange}
        name="address"
      />
    </Stack>
  );
}
