import React from "react";
import OptionsMenu from "./OptionsMenu";
import ServicesTable from "./ServicesTable";
import {
  Grid,
  TextField,
  IconButton,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import AddIcon from "@mui/icons-material/Add";

export default function ServicesForm({
  business,
  setBusiness,
  typeAndServices,
}) {
  const [servicesList, setServicesList] = React.useState([]);
  const [service, setService] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [duration, setDuration] = React.useState("");

  // set services based on business type
  React.useEffect(() => {
    if (business.businessType) {
      const serviceForType = typeAndServices
        .find((type) => type.businessType === business.businessType)
        .services.map((service) => service.serviceName);
      setServicesList(serviceForType);
    }
  }, [business.businessType]);

  const handleAddService = () => {
    // check if the fields are empty
    if (!service || !price || !duration) {
      return;
    }

    // check if the price is a number
    if (isNaN(price)) {
      return;
    }

    // check if the duration is an integer
    if (!Number.isInteger(Number(duration))) {
      console.log("duration is not an integer");
      return;
    }

    // check if the service already exists
    if (business.services.some((s) => s.serviceName === service)) {
      return;
    }

    // add the new service to the business
    const newService = {
      serviceName: service,
      price: price,
      duration: duration,
    };
    setBusiness((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));

    // clear the fields
    setService("");
    setPrice("");
    setDuration("");
  };

  return (
    <Grid container>
      {/* New service form */}
      <Box
        component="fieldset"
        sx={{
          border: "1px solid #ccc",
          paddingTop: 5,
          borderRadius: 2,
          width: "100%",
        }}
      >
        <legend>New Service</legend>
        <Grid container item xs={12}>
          {/* service name */}
          <Grid item xs={3}>
            <TextField
              id="serviceName"
              label="Service Name"
              variant="outlined"
              fullWidth
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
          </Grid>
          {/* services menu*/}
          <Grid item xs={1}>
            {/* if the businessType is selected show the menu otherwise just show a red menu icon */}
            {business.businessType ? (
              <OptionsMenu
                options={servicesList}
                handleSelectionChange={(service) => setService(service)}
              />
            ) : (
              // if the businessType is not selected show a tooltip
              <Tooltip title="Please select a business type first">
                <IconButton>
                  <ListIcon color="error" />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
          {/* price */}
          <Grid item xs={3}>
            <TextField
              id="price"
              label="Price"
              variant="outlined"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </Grid>
          {/* duration */}
          <Grid item sm={3}>
            <TextField
              id="duration"
              label="Duration"
              variant="outlined"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
            />
          </Grid>
          {/* Add button */}
          <Grid item xs={1}>
            <Tooltip title="Add Service">
              <IconButton onClick={handleAddService}>
                <AddIcon color="primary" fontSize="large" />
                <Typography color="primary">Add</Typography>
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>

      {/* List of services */}
      <Box
        component="fieldset"
        sx={{
          border: "1px solid #ccc",
          paddingTop: 5,
          borderRadius: 2,
          marginTop: 2,
          width: "100%",
        }}
      >
        <legend>Services</legend>
        <Grid item xs={12}>
          <ServicesTable business={business} setBusiness={setBusiness} />
        </Grid>
      </Box>
    </Grid>
  );
}
