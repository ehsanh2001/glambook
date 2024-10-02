import { Box, Button, Typography } from "@mui/material";
import dayjs from "dayjs";

export default function DisplaySelectedBooking({
  business,
  selectedService,
  selectedTime,
  selectedStaff,
  selectedDate,
  handleBooking,
}) {
  return (
    <>
      <Box
        sx={{
          marginTop: "2rem",
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid black",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
          Your Booking
        </Typography>
        <Typography>
          {selectedService.serviceName} ({selectedService.duration} min){" "}
        </Typography>
        <Typography>with {selectedStaff.staffName}</Typography>
        <Typography>
          on {selectedDate.format("ddd, MMM D, YYYY")} at{" "}
          {dayjs(business.openingHours.openingTime, "HH:mm A")
            .add(15 * selectedTime, "minute")
            .format("HH:mm")}
        </Typography>
        <Typography>for ${selectedService.price}</Typography>
        <Button
          variant="contained"
          sx={{ marginTop: "1rem" }}
          onClick={handleBooking}
        >
          Book
        </Button>
      </Box>
    </>
  );
}
