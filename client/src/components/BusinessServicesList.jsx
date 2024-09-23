import {
  List,
  ListItem,
  ListItemText,
  Grid,
  Button,
  Divider,
} from "@mui/material";

export default function BusinessServicesList({ services }) {
  return (
    <List>
      {services.map((service, index) => (
        <div key={index}>
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
                  <Button variant="contained" sx={{ marginLeft: "1rem" }}>
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
  );
}
