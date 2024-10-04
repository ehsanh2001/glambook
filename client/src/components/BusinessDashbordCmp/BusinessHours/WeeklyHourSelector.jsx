import React from "react";
import { FormControl, InputLabel, MenuItem, Select, Grid } from "@mui/material";
import ScheduleTable from "./ScheduleTable";

const hours = [
  "12:00 AM",
  "01:00 AM",
  "02:00 AM",
  "03:00 AM",
  "04:00 AM",
  "05:00 AM",
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM",
];

export default function WeeklyHourSelector({
  business,
  setBusiness,
  showMessageModal,
}) {
  const handleOpenningClosingHourChange = (openingTime, closingTime) => {
    const openingTimeIndex = hours.indexOf(openingTime);
    const closingTimeIndex = hours.indexOf(closingTime);
    if (openingTimeIndex >= closingTimeIndex) {
      showMessageModal(
        "Invalid Data",
        "Closing time must be after opening time",
        "error"
      );
      return;
    }
    const openingInterval = closingTimeIndex - openingTimeIndex;
    setBusiness((prev) => {
      return {
        ...prev,
        openingHours: {
          openingTime: openingTime,
          closingTime: closingTime,
          Monday: Array(openingInterval).fill(true), //  each entry is for a 1-hour interval,
          Tuesday: Array(openingInterval).fill(true), // and the array is for the whole day, from openingTime to closingTime
          Wednesday: Array(openingInterval).fill(true),
          Thursday: Array(openingInterval).fill(true),
          Friday: Array(openingInterval).fill(true),
          Saturday: Array(openingInterval).fill(true),
          Sunday: Array(openingInterval).fill(true),
        },
      };
    });
  };

  return (
    <>
      <Grid container spacing={2}>
        {/* openning time select */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Openning Hour</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={business.openingHours.openingTime}
              label="Opening Hour"
              onChange={(e) =>
                handleOpenningClosingHourChange(
                  e.target.value,
                  business.openingHours.closingTime
                )
              }
            >
              {hours.map((hour) => (
                <MenuItem key={hour} value={hour}>
                  {hour}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* closing time select */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Closing Hour</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={business.openingHours.closingTime}
              label="Opening Hour"
              onChange={(e) =>
                handleOpenningClosingHourChange(
                  business.openingHours.openingTime,
                  e.target.value
                )
              }
            >
              {hours.map((hour) => (
                <MenuItem key={hour} value={hour}>
                  {hour}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* weekly hour table */}
        <Grid item xs={12}>
          <ScheduleTable business={business} setBusiness={setBusiness} />
        </Grid>
      </Grid>
    </>
  );
}
