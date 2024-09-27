import * as React from "react";
import {
  TextField,
  Grid,
  Stack,
  Autocomplete,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddressAutocomplete from "../AddressAutocomplete";
import { useState, useCallback } from "react";
import GoogleMapModal from "../GoogleMapModal";

export default function CustomerInfo({ customer, setCustomer }) {
  const [showModal, setShowModal] = useState(false);

  // Handle Modal for Google Map
  const handleOpenModal = useCallback(() => setShowModal(true), []);
  const handleCloseModal = useCallback(() => setShowModal(false), []);

  const handleAddressChange = (newAddress) => {
    const newCustomer = {
      ...customer,
      address: newAddress.address,
      location: {
        type: "Point",
        coordinates: [newAddress.lng, newAddress.lat],
      },
    };
    setCustomer(newCustomer);
  };

  const handleCustomerChange = (e) => {
    setCustomer({ ...customer, [e.target.id]: e.target.value });
  };

  return (
    <Grid container>
      {/*  name */}
      <Grid item xs={10} md={6}>
        <TextField
          id="customerName"
          label="Name"
          variant="standard"
          autoComplete="off"
          sx={{ marginBottom: 2, width: "100%" }}
          value={customer.customerName}
          onChange={handleCustomerChange}
        />
      </Grid>
      {/* place holder Grid to make sure name and phone are in 2 rows when md={6} */}
      <Grid item xs={10}></Grid>
      <Grid item xs={10} md={6}>
        {/* phone */}
        <TextField
          id="phone"
          label="Phone Number"
          variant="standard"
          autoComplete="off"
          sx={{ marginBottom: 2, width: "100%" }}
          value={customer.phone}
          onChange={handleCustomerChange}
        />
      </Grid>

      {/* address */}
      <Grid item container>
        <Grid item xs={10} md={6}>
          <AddressAutocomplete
            address={customer.address}
            setAddressLocation={handleAddressChange}
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton
            sx={{ marginTop: "20px" }}
            variant="outlined"
            onClick={handleOpenModal}
          >
            <LocationOnIcon />
          </IconButton>
        </Grid>
      </Grid>

      {/* google map  modal dialog */}
      <GoogleMapModal
        show={showModal}
        handleClose={handleCloseModal}
        setLocation={handleAddressChange}
        name="address"
      />
    </Grid>
  );
}
