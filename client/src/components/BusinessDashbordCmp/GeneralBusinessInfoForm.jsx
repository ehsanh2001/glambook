import * as React from "react";
import { TextField, Grid, Stack, Button, IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageUploader from "./ImageUploader";
import AddressAutocomplete from "../AddressAutocomplete";
import { useState, useCallback } from "react";
import GoogleMapModal from "../GoogleMapModal";

export default function GeneralBusinessInfoForm({ business, setBusiness }) {
  const [showModal, setShowModal] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");
  // Handle Modal for Google Map
  const handleOpenModal = useCallback(() => setShowModal(true), []);
  const handleCloseModal = useCallback(() => setShowModal(false), []);

  const handleAddressChange = useCallback(
    (newAddress) => {
      setBusiness({
        ...business,
        address: newAddress.address,
        location: { lat: newAddress.lat, lng: newAddress.lng },
      });
    },
    [business.address]
  );

  const handleBusinessChange = (e) => {
    setBusiness({ ...business, [e.target.id]: e.target.value });
  };

  const handleImageChange = (image) => {
    setBusiness({ ...business, businessImage: image });
  };

  return (
    <Stack spacing={3}>
      <ImageUploader
        image={business.businessImage}
        setImage={handleImageChange}
      />
      <TextField
        id="businessName"
        label="Business Name"
        variant="standard"
        sx={{ marginBottom: 2, width: "60ch" }}
        value={business.businessName}
        onChange={handleBusinessChange}
      />
      <TextField
        id="phone"
        label="Phone Number"
        variant="standard"
        sx={{ marginBottom: 2, width: "60ch" }}
        value={business.phone}
        onChange={handleBusinessChange}
      />
      <Grid container>
        <Grid sm={11}>
          <AddressAutocomplete
            address={business.address}
            location={business.location}
            setAddressLocation={handleAddressChange}
          />
        </Grid>
        <Grid sm={1}>
          <IconButton
            sx={{ marginTop: "20px" }}
            variant="outlined"
            onClick={handleOpenModal}
          >
            <LocationOnIcon />
          </IconButton>
        </Grid>
      </Grid>
      <GoogleMapModal
        show={showModal}
        handleClose={handleCloseModal}
        setLocation={handleAddressChange}
        name="address"
      />
    </Stack>
  );
}
