import * as React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import BusinessServicesList from "./BusinessServicesList";

export default function BusinessListItem({ business }) {
  const imageFileName = business.businessImage;

  return (
    <Card
      sx={{
        marginBottom: "2rem",
        boxShadow: "none",
        border: "none",
      }}
    >
      <Grid container>
        {/* image */}
        <Grid
          item
          xs={12}
          sm={5}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-end" },
          }}
        >
          <CardMedia
            component="img"
            image={`/api/image/${imageFileName}`}
            title={business.businessName}
            sx={{
              maxWidth: "400px", // Make the image fill the width of the grid item
              height: "auto", // Maintain aspect ratio
              maxHeight: "300px", // Limit the maximum height
              objectFit: "contain", // Prevent the image from being cropped
            }}
          />
        </Grid>
        {/* business information */}
        <Grid item xs={12} sm={6}>
          <CardContent>
            {/* business name */}
            <Link
              to={`/business-details/${business._id}`}
              style={{ textDecoration: "none" }}
            >
              <Typography gutterBottom variant="h5" component="div">
                {business.businessName}
              </Typography>
            </Link>
            {/* business address */}
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {business.address}
            </Typography>
            {/* business distance */}
            {business.distanceInKilometers && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {business.distanceInKilometers} km
              </Typography>
            )}
            {/* business phone */}
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Phone: {business.phone}
            </Typography>
            <Divider />
            {/* first 3 services */}
            <BusinessServicesList
              services={business.services.slice(0, 3)}
              businessId={business._id}
            />
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
}
