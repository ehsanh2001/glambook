import React from "react";
import { Box, Avatar, Typography } from "@mui/material";

export default function StaffList({ staff, selectedStaff, setSelectedStaff }) {
  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        gap: 2, // space between images
      }}
    >
      {staff.map((stf, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column", // Stack image and name vertically
            alignItems: "center", // Center image and name
          }}
          onClick={() => setSelectedStaff(stf)}
        >
          <Avatar
            src={
              stf.staffImageFileName
                ? `/api/image/${stf.staffImageFileName}`
                : ""
            }
            alt={stf.staffName}
            sx={{
              width: 100, // adjust size
              height: 100,
              borderRadius: "50%", // circular border
              border: stf._id === selectedStaff._id ? "4px solid blue" : "",
            }}
          />
          <Typography
            variant="body2"
            sx={{
              marginTop: 1,
              color: stf._id === selectedStaff._id ? "blue" : "black",
            }} // add space between image and name
          >
            {stf.staffName}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
