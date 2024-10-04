import { Grid, Stack } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import Auth from "../utils/auth";

export default function TopNavBar() {
  const [openLoginModal, setOpenLoginModal] = React.useState(false);
  const [dashboardLink, setDashboardLink] = React.useState("/signup");

  // If user is logged in, set the dashboard link to the user's dashboard or business dashboard
  React.useEffect(() => {
    if (Auth.loggedIn()) {
      if (Auth.getUser().role === "owner")
        setDashboardLink(`/business-dashboard/${Auth.getUser().id}`);
      else if (Auth.getUser().role === "customer")
        setDashboardLink(`/customer-dashboard/${Auth.getUser().id}`);
      else if (Auth.getUser().role === "staff")
        setDashboardLink(`/staff-dashboard/${Auth.getUser().id}`);
    }
  });

  const linkStyle = {
    color: "white",
    textDecoration: "none",
  };

  const logout = (e) => {
    e.preventDefault();
    Auth.logout();
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
            {/* Signup/Dashboard Link */}
            {Auth.loggedIn() ? (
              <Link to={dashboardLink} style={linkStyle}>
                <h3>Dashboard</h3>
              </Link>
            ) : (
              <Link to="/signup" style={linkStyle}>
                <h3>Signup</h3>
              </Link>
            )}

            {/* Login/Logout Link */}
            {Auth.loggedIn() ? (
              <Link onClick={logout} style={linkStyle}>
                <h3>Logout</h3>
              </Link>
            ) : (
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setOpenLoginModal(true);
                }}
                style={linkStyle}
              >
                <h3>Login</h3>
              </Link>
            )}
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
