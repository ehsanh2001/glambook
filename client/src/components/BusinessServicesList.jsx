import {
  List,
  ListItem,
  ListItemText,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function BusinessServicesList({ services, businessId }) {
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
                  <Link
                    to={`/booking/${businessId}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="contained" sx={{ marginLeft: "1rem" }}>
                      Book
                    </Button>
                  </Link>
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
