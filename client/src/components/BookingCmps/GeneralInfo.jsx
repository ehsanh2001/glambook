import { Box, Typography } from "@mui/material";

export default function GeneralInfo({ business, selectedService }) {
  return (
    <>
      <Box sx={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <Typography variant="h4">{business.businessName}</Typography>
        <Typography variant="h6">{business.address}</Typography>
        <Typography variant="h6">Phone: {business.phone}</Typography>
        <Typography variant="p">
          Please Select the Staff, Date and Time for your (
          {selectedService.serviceName}) appointment
        </Typography>
      </Box>
    </>
  );
}
