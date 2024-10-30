import { Box, Button, Grid } from "@mui/material";
import CustomerInfo from "./CustomerInfo";
export default function CustomerInfoBox({
  customer,
  setCustomer,
  handleClickSaveChanges,
}) {
  return (
    <Box
      component="fieldset"
      sx={{
        display: "flex",
        justifyContent: "center",
        border: "1px solid #ccc",
        paddingTop: 5,
        borderRadius: 2,
        width: "100%",
        marginBottom: 5,
      }}
    >
      <legend>
        <h2>Information</h2>
      </legend>

      <Grid item container xs={12} sm={10} lg={8}>
        <Grid item xs={12}>
          <CustomerInfo customer={customer} setCustomer={setCustomer} />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 3 }}
            onClick={handleClickSaveChanges}
          >
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
