import React from "react";
import { Grid, TextField, Button, Stack, InputAdornment } from "@mui/material";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import GoogleMapModal from "./GoogleMapModal";

export default function SearchBar() {
  const [showGoogleMapModal, setShowGoogleMapModal] = React.useState(false);
  const [address, setAddress] = React.useState({ address: "", location: {} });
  const [searchQuery, setSearchQuery] = React.useState("");
  // Handle Modal for Google Map
  const handleOpenModal = () => setShowGoogleMapModal(true);
  const handleCloseModal = React.useCallback(
    () => setShowGoogleMapModal(false),
    []
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddressChange = (newAddress) => {
    setAddress({
      address: newAddress.address,
      location: {
        type: "Point",
        coordinates: [newAddress.lng, newAddress.lat],
      },
    });
  };

  const styles = {
    middleText: {
      textAlign: "center",
      fontSize: "1.4em",
      fontWeight: "400",
      marginBottom: "20px",
      color: "white",
    },
  };
  return (
    <>
      <Grid item container>
        <Grid item xs={0} sm={3} />
        <Grid item container xs={12} sm={6} justifyContent="center">
          <Grid item xs={12} sx={styles.middleText}>
            Discover and book beauty & wellness professionals near you
          </Grid>

          {/* search form */}
          <Grid item xs={12}>
            <Stack direction="row">
              <TextField
                variant="outlined"
                placeholder="Search Services or Business"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search"
                size="small"
                sx={{
                  width: "60%",
                  marginTop: "1rem",
                  input: { color: "white" },
                }}
              />

              {/* Location */}
              <TextField
                variant="outlined"
                placeholder="Where"
                value={address?.address || ""}
                onChange={handleAddressChange}
                onClick={handleOpenModal}
                onKeyDown={(event) =>
                  event.key !== "Tab" ? handleOpenModal() : null
                }
                aria-label="Location"
                size="small"
                sx={{
                  width: "40%",
                  marginTop: "1rem",
                  input: { color: "white" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AddLocationAltIcon sx={{ color: "white" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ marginTop: "1rem", marginLeft: "1rem" }}
              >
                Search
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Grid item xs={0} sm={3} />
      </Grid>
      {/* google map  modal dialog */}
      <GoogleMapModal
        show={showGoogleMapModal}
        handleClose={handleCloseModal}
        setLocation={handleAddressChange}
        name="address"
      />
    </>
  );
}
