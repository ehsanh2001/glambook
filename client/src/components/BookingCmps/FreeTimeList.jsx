import React from "react";
import { Box, Chip } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default function FreeTimeList({
  freetime,
  startTime,
  selectedTime,
  setSelectedTime,
}) {
  if (!freetime) {
    return <Box>No time available</Box>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        gap: 2, // space between images
      }}
    >
      {freetime.map(
        (time, index) =>
          time && (
            <Chip
              key={index}
              label={dayjs(startTime, "HH:mm A")
                .add(15 * index, "minute")
                .format("HH:mm")}
              onClick={() => setSelectedTime(index)}
              sx={{
                backgroundColor: index === selectedTime ? "lightblue" : "",
              }}
            />
          )
      )}
    </Box>
  );
}
