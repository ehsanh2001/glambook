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
import ExceptionsTable from "./ExceptionsTable";
import dayjs from "dayjs";

export default function ExceptionalClosures({
  business,
  setBusiness,
  showMessageModal,
}) {
  const [date, setDate] = React.useState(null);
  const [wholeDay, setWholeDay] = React.useState(false);
  const [startTime, setStartTime] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);

  const handleWholeDayChange = (event) => {
    setWholeDay(event.target.checked);
    // if whole day is checked, set the values to 12:00 AM and 11:59 PM
    if (event.target.checked) {
      setStartTime(dayjs(new Date().setHours(0, 0, 0, 0)));
      setEndTime(dayjs(new Date().setHours(23, 59, 0, 0)));
    }
  };

  const validateData = () => {
    // check if values are valid
    if (!date || !startTime || !endTime) {
      return false;
    }
    //check if start time is before end time
    if (startTime >= endTime) {
      showMessageModal(
        "Invalid Data",
        "End time must be after start time",
        "error"
      );
      return false;
    }
    // check if the closure is already added
    // we just check for the date and start time
    if (
      business.exceptionalClosures.find(
        (closure) =>
          closure.date.getTime() === date.toDate().getTime() &&
          closure.startTime.getTime() === startTime.toDate().getTime()
      )
    ) {
      showMessageModal("Invalid Data", "Closure already exists", "error");
      return false;
    }
    return true;
  };

  const handleAddClosure = () => {
    if (!validateData()) {
      return;
    }
    // add the closure
    const newClosure = {
      date: date.toDate(),
      startTime: startTime.toDate(),
      endTime: endTime.toDate(),
    };
    setBusiness((prevBusiness) => ({
      ...prevBusiness,
      exceptionalClosures: [...prevBusiness.exceptionalClosures, newClosure],
    }));

    // reset the values
    setDate(null);
    setStartTime(null);
    setEndTime(null);
    setWholeDay(false);
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
          {/* Date Picker */}
          <Grid container justifyContent="flex-start" spacing={2}>
            <Grid item xs={12} sm={6} lg={3}>
              <DatePicker
                label="Closure Date"
                format="LL"
                value={date}
                onChange={(newValue) => setDate(newValue)}
              />
            </Grid>
            {/* Whole Day checkbox */}
            <Grid item xs={12} sm={6} lg={2}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={wholeDay}
                      onChange={(event) => handleWholeDayChange(event)}
                    />
                  }
                  label="Whole Day"
                />
              </FormGroup>
            </Grid>
            {/* Start Time */}
            <Grid item xs={12} sm={6} lg={2}>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                disabled={wholeDay}
              />
            </Grid>
            {/* End Time */}
            <Grid item xs={12} sm={6} lg={2}>
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                disabled={wholeDay}
              />
            </Grid>
            {/* Add Button */}
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
      {/* Closures List */}
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
        <legend>Closures List</legend>
        <ExceptionsTable business={business} setBusiness={setBusiness} />
      </Box>
    </>
  );
}
