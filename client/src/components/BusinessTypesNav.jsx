import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function NavigationBar({
  businessTypes,
  currentBusinessType = "All",
}) {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            overflowX: "auto",
            whiteSpace: "nowrap",
            width: "100%",
            // Ensure that the Box container does not shrink
            minWidth: "100%",
            "&::-webkit-scrollbar": {
              display: "none", // Optionally hide scrollbar on WebKit browsers
            },
          }}
        >
          {businessTypes.map((type, index) => (
            <Link
              key={index}
              to={`/businesses-by-type/${type}`}
              style={{
                display: "inline-block",
                padding: "10px 20px",
                textDecoration: "none",
                color: "white",
                borderBottom:
                  type === currentBusinessType ? "2px solid white" : "none",
              }}
            >
              <Typography variant="body1">{type}</Typography>
            </Link>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
