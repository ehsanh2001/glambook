import { Grid, TextField, Button, Stack, InputAdornment } from "@mui/material";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

export default function SearchBar({
  searchQuery,
  handleSearchChange,
  address,
  handleAddressChange,
}) {
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
              <TextField
                variant="outlined"
                placeholder="Where"
                value={address}
                onChange={handleAddressChange}
                aria-label="Location"
                size="small"
                sx={{
                  width: "40%",
                  marginTop: "1rem",
                  input: { color: "white" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AddLocationAltIcon />
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
    </>
  );
}
