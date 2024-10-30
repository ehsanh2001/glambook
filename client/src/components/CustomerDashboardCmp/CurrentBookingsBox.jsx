import { Box, Grid } from "@mui/material";
import BookingDetails from "./BookingDetails";

export default function CurrentBookingsBox({
  currentBookings,
  handleCancelBooking,
}) {
  return (
    <Box
      component="fieldset"
      sx={{
        border: "1px solid #ccc",
        paddingTop: 5,
        borderRadius: 2,
        width: "100%",
        marginBottom: 5,
      }}
    >
      <legend>
        <h2>Bookings</h2>
      </legend>
      <Grid item container xs={12}>
        {currentBookings.map((booking) => (
          <BookingDetails
            key={booking.id}
            booking={booking}
            bookAgain={false}
            actionHandler={() => handleCancelBooking(booking.id)}
          />
        ))}
      </Grid>
    </Box>
  );
}
