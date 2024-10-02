import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import ImageName from "../ImageName";

export default function BookingDetails({ booking, bookAgain, actionHandler }) {
  const imageSrc = `/api/image/${booking.details.businessImage}`;

  return (
    <Card sx={{ my: 4, width: "90%", mx: "auto", height: "auto" }}>
      <Grid container>
        <Grid item md={4}>
          <CardMedia
            component="img"
            image={imageSrc}
            alt={booking.details.businessName}
            sx={{ height: "30vh", objectFit: "contain" }}
          />
        </Grid>
        <Grid item md={8}>
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              sx={{ marginBottom: "1rem" }}
              gutterBottom
            >
              {booking.details.service.serviceName} -{" "}
              {booking.details.service.duration} min - $
              {booking.details.service.price}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Date: </strong>{" "}
              {dayjs(booking.booking_datetime).format("ddd MMM D, YYYY")}
              <strong> at </strong>
              {dayjs(booking.booking_datetime).format("hh:mm A")}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Address: </strong>
              {booking.details.businessName} - {booking.details.address}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Phone: </strong> {booking.details.phone}
            </Typography>

            <Typography sx={{ fontWeight: "bold" }} gutterBottom>
              With
            </Typography>
            <ImageName
              image={booking.details.staffImage}
              name={booking.details.staffName}
              align="start"
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <CardActions>
                <Button variant="outlined" size="small" onClick={actionHandler}>
                  {bookAgain ? "Book Again" : "Cancle"}
                </Button>
              </CardActions>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
}
