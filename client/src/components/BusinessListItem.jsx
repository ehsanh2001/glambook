import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

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
            <Typography gutterBottom variant="h5" component="div">
              {business.businessName}
            </Typography>
            {/* business address */}
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {business.address}
            </Typography>
            {/* business phone */}
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Phone: {business.phone}
            </Typography>
            <Divider />
            {/* first 3 services */}
            <List>
              {business.services.slice(0, 3).map((service, index) => (
                <div key={`${index}-${business.businessName}`}>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={7}>
                        <ListItemText primary={service.serviceName} />
                      </Grid>
                      <Grid item xs={3} sx={{ textAlign: "right" }}>
                        <ListItemText
                          primary={`$${service.price}`}
                          secondary={`${service.duration} min`}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <ListItemText>
                          <Button
                            variant="contained"
                            sx={{ marginLeft: "1rem" }}
                          >
                            Book
                          </Button>
                        </ListItemText>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
}
