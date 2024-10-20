import * as React from "react";
import {
  TextField,
  Grid,
  Stack,
  Autocomplete,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageUploader from "./ImageUploader";
import AddressAutocomplete from "../../AddressAutocomplete";
import { useState, useCallback } from "react";
import GoogleMapModal from "../../GoogleMapModal";

export default function GeneralBusinessInfoForm({
  business,
  setBusiness,
  typeAndServices,
}) {
  const [showModal, setShowModal] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);

  // Init businessType
  React.useEffect(() => {
    if (typeAndServices.length > 0) {
      const types = typeAndServices.map(
        (typeAndService) => typeAndService.businessType
      );
      setBusinessTypes(types);
    }
  }, [typeAndServices]);

  // Handle Modal for Google Map
  const handleOpenModal = useCallback(() => setShowModal(true), []);
  const handleCloseModal = useCallback(() => setShowModal(false), []);

  const handleAddressChange = (newAddress) => {
    const newBusiness = {
      ...business,
      address: newAddress.address,
      location: {
        type: "Point",
        coordinates: [newAddress.lng, newAddress.lat],
      },
    };
    setBusiness(newBusiness);
  };

  const handleBusinessChange = (e) => {
    setBusiness({ ...business, [e.target.id]: e.target.value });
  };

  const handleImageChange = (image) => {
    setBusiness({ ...business, businessImageData: image, businessImage: null });
  };

  return (
    <Stack spacing={3}>
      {/* business image */}
      <ImageUploader
        imageFileName={business.businessImage}
        image={business.businessImageData}
        setImage={handleImageChange}
      />

      {/* business name */}
      <TextField
        id="businessName"
        label="Business Name"
        variant="standard"
        autoComplete="off"
        sx={{ marginBottom: 2, width: "60ch" }}
        value={business.businessName}
        onChange={handleBusinessChange}
      />

      {/* business phone */}
      <TextField
        id="phone"
        label="Phone Number"
        variant="standard"
        autoComplete="off"
        sx={{ marginBottom: 2, width: "60ch" }}
        value={business.phone}
        onChange={handleBusinessChange}
      />

      {/* business address */}
      <Grid container>
        <Grid item xs={11}>
          <AddressAutocomplete
            address={business.address}
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

      {/* business type */}
      <Autocomplete
        id="businessType"
        value={business.businessType || null}
        onChange={(event, newValue) => {
          setBusiness({ ...business, businessType: newValue });
        }}
        disablePortal
        options={businessTypes}
        renderInput={(params) => (
          <TextField {...params} label="Business Type" />
        )}
      />
    </Stack>
  );
}
