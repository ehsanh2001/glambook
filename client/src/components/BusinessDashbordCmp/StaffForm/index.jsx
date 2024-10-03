import React from "react";
import StaffTable from "./StaffTable";
import {
  Grid,
  TextField,
  IconButton,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function StaffForm({ business, setBusiness, showMessageModal }) {
  const [staffName, setStaffName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [retypePassword, setRetypePassword] = React.useState("");

  const handleAddStaff = () => {
    // check if the fields are empty
    if (!staffName || !password || !retypePassword) {
      return;
    }

    // check if the passwords match
    if (password !== retypePassword) {
      showMessageModal("Invalid Data", "Passwords don't match", "error");
      return;
    }

    // check if the staff already exists
    if (business.staff.some((s) => s.staffName === staffName)) {
      showMessageModal("Invalid Data", "Staff already exists", "error");
      return;
    }

    // add the new staff to the business
    setBusiness((prev) => ({
      ...prev,
      staff: [...prev.staff, { staffName: staffName, password: password }],
    }));

    // clear the fields
    setStaffName("");
    setPassword("");
    setRetypePassword("");
  };

  return (
    <Grid container>
      {/* New staff form */}
      <Box
        component="fieldset"
        sx={{
          border: "1px solid #ccc",
          paddingTop: 5,
          borderRadius: 2,
          width: "100%",
        }}
      >
        <legend>New Staff</legend>
        <Grid container item xs={12}>
          {/* staff name */}
          <Grid item xs={3}>
            <TextField
              id="staffName"
              label="Staff Name"
              variant="outlined"
              fullWidth
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
            />
          </Grid>
          {/* password */}
          <Grid item xs={3}>
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Grid>
          {/* re-type password */}
          <Grid item sm={3}>
            <TextField
              id="retypePassword"
              label="Re-type Password"
              variant="outlined"
              type="password"
              fullWidth
              value={retypePassword}
              onChange={(event) => setRetypePassword(event.target.value)}
            />
          </Grid>
          {/* Add button */}
          <Grid item xs={1}>
            <Tooltip title="Add Staff">
              <IconButton onClick={handleAddStaff}>
                <AddIcon color="primary" fontSize="large" />
                <Typography color="primary">Add</Typography>
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>

      {/* List of Staff */}
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
          <StaffTable business={business} setBusiness={setBusiness} />
        </Grid>
      </Box>
    </Grid>
  );
}
