import React, { useState } from "react";
import { Link } from "react-router-dom";
// import Auth from "../../utils/auth"; // Adjust the import as needed
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  Grid,
} from "@mui/material";

export default function SignupForm() {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
    role: "business-owner",
  });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted: ", formState);
    try {
      const response = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error("Username already exists. Please try again.");
      }

      const data = await response.json();
      //   Auth.login(data.token, data.user); // Assuming the response contains token and user info
      window.location.assign("/");
    } catch (e) {
      console.error("Error : ", e);
      setError(e.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Sign Up
              </Typography>

              <form onSubmit={handleFormSubmit}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Your username"
                  name="username"
                  type="text"
                  value={formState.username}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Password"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="select-role-label">
                    Select user type
                  </InputLabel>
                  <Select
                    labelId="select-role-label"
                    name="role"
                    value={formState.role}
                    onChange={handleChange}
                    label="Select user type"
                  >
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="owner">Business Owner</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Sign Up
                </Button>
              </form>

              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              <Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account? <Link to="/login">Log in</Link>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
