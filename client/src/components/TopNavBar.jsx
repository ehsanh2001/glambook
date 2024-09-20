import { Grid, Stack } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";

export default function TopNavBar() {
  const [openLoginModal, setOpenLoginModal] = React.useState(false);
  const linkStyle = {
    color: "white",
    textDecoration: "none",
  };
  return (
    <>
      <Grid container item sx={{ marginTop: "1rem", marginLeft: "2rem" }}>
        <Grid item xs={2} sx={{ color: "white" }}>
          <Link to="/" style={linkStyle}>
            <h2>GlamBook</h2>
          </Link>
        </Grid>
        <Grid
          item
          container
          xs={9}
          sx={{ color: "white", justifyContent: "flex-end" }}
        >
          <Stack direction="row" spacing={2}>
            <Link to="/signup" style={linkStyle}>
              <h3>Signup</h3>
            </Link>
            <Link
              onClick={(e) => {
                e.preventDefault();
                setOpenLoginModal(true);
              }}
              style={linkStyle}
            >
              <h3>Login</h3>
            </Link>
          </Stack>
        </Grid>
      </Grid>
      <LoginModal
        open={openLoginModal}
        handleClose={() => setOpenLoginModal(false)}
      />
    </>
  );
}
