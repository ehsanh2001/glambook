import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  Grid,
  FormControlLabel,
  FormGroup,
  Checkbox,
  IconButton,
  Typography,
  Tooltip,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function ExceptionalClosures({ business, setBusiness }) {
  const handleAddClosure = () => {
    console.log("Add Closure");
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          <legend>New Closure Date/Time</legend>
          <Grid container justifyContent="flex-start" spacing={2}>
            <Grid item xs={12} sm={6} lg={3}>
              <DatePicker
                label="Closure Date"
                sx={{ margin: "0px", padding: "0px" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Whole Day"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={6} lg={2}>
              <TimePicker label="Start Time" />
            </Grid>
            <Grid item xs={12} sm={6} lg={2}>
              <TimePicker label="End Time" />
            </Grid>
            <Grid item xs={2}>
              <Tooltip title="Add Service">
                <IconButton onClick={handleAddClosure}>
                  <AddIcon color="primary" fontSize="large" />
                  <Typography color="primary">Add</Typography>
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
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
        <legend>Closure Date/Time List</legend>
      </Box>
    </>
  );
}
