import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  Box,
} from "@mui/material";
import BusinessServicesList from "./BusinessServicesList";

export default function BusinessDetailsCmp({ business }) {
  const imageSrc = `/api/image/${business.businessImage}`;

  return (
    <Card sx={{ my: 4, width: "90%", mx: "auto", height: "auto" }}>
      <Grid container>
        <Grid item md={4}>
          <CardMedia
            component="img"
            image={imageSrc}
            alt={business.businessName}
            sx={{ height: "30vh", objectFit: "cover" }}
          />
        </Grid>
        <Grid item md={8}>
          <CardContent>
            <Typography variant="h5" component="div">
              {business.businessName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({business.businessType})
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Address: </strong> {business.address}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Phone: </strong> {business.phone}
            </Typography>

            <Typography variant="h6" gutterBottom>
              <strong>Services</strong>
            </Typography>

            <BusinessServicesList services={business.services} />

            <Typography variant="h6" gutterBottom>
              <strong>Staff</strong>
            </Typography>
            <List>
              {business.staff.map((st, index) => (
                <ListItem key={`staff-${index}`}>
                  <ListItemText primary={st.staffName} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
}
