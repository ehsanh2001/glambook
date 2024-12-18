import React from "react";
import { Grid, TextField, Button, Stack, InputAdornment } from "@mui/material";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import GoogleMapModal from "./GoogleMapModal";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ showTopText = true }) {
  const [showGoogleMapModal, setShowGoogleMapModal] = React.useState(false);
  const [address, setAddress] = React.useState({ address: "", location: {} });
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigate = useNavigate();

  // Handle Modal for Google Map
  const handleOpenModal = () => setShowGoogleMapModal(true);
  const handleCloseModal = () => setShowGoogleMapModal(false);

  // load the address from local storage
  React.useEffect(() => {
    const address = JSON.parse(localStorage.getItem("address"));
    if (address) {
      setAddress(address);
    }
  }, []);

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

    // stote the address in local storage
    localStorage.setItem("address", JSON.stringify(newAddress));
  };

  const handleSearchClicked = (event) => {
    console.log("search clicked", searchQuery, address);
    if (searchQuery.trim()) {
      // Navigate to the search endpoint
      navigate(`/search-results/${encodeURIComponent(searchQuery.trim())}`);
    }
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
          {/* top text */}
          {showTopText && (
            <Grid item xs={12} sx={styles.middleText}>
              Find the best beauty & wellness services in your area
            </Grid>
          )}

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
                onClick={handleSearchClicked}
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
