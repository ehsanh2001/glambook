import { IconButton, Menu, MenuItem } from "@mui/material";
import ListIcon from "@mui/icons-material/List";

import React from "react";

export default function OptionsMenu({ options, handleSelectionChange }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <ListIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {options.map((service, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleSelectionChange(service);
              handleClose();
            }}
          >
            {service}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
