import { Box, Grid } from "@mui/material";
import BookingDetails from "./BookingDetails";

export default function PrevBookingsBox({ previousBookings, handleBookAgain }) {
  return (
    <Box
      component="fieldset"
      sx={{
        backgroundColor: "#e9e9e9",
        border: "1px solid #ccc",
        paddingTop: 5,
        borderRadius: 2,
        width: "100%",
      }}
    >
      <legend>
        <h2>Previous Bookings</h2>
      </legend>
      <Grid item container xs={12}>
        {previousBookings.map((booking) => (
          <BookingDetails
            key={booking.id}
            booking={booking}
            bookAgain={true}
            actionHandler={() =>
              handleBookAgain(
                booking.details.businessId,
                booking.details.service._id
              )
            }
          />
        ))}
      </Grid>
    </Box>
  );
}
