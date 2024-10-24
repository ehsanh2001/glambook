import React, { useState } from "react";
import { Link } from "react-router-dom";
import Auth from "../../utils/auth";
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
    retypePassword: "",
    role: "",
  });
  const [error, setError] = useState(null);

  // Update formState based on user input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });

    // Clear error message
    setError(null);
  };

  const checkPassword = () => {
    if (formState.password !== formState.retypePassword) {
      setError("Passwords do not match. Please try again.");
      return false;
    }
    return true;
  };

  // Validate form before submitting
  const validateForm = () => {
    // Check if the form has all the required fields
    if (!formState.username || !formState.password || !formState.role) {
      setError("Please fill in all fields.");
      return false;
    }

    if (!checkPassword()) {
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }
    // Submit form data to the server
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

      // If successful, log in the user and save the JWT token
      const data = await response.json();
      Auth.login(data.token, data.user);

      // Redirect to the dashboard based on the user role
      if (data.user.role === "owner") {
        window.location.assign(`/business-dashboard/${Auth.getUser().id}`);
      } else if (data.user.role === "customer") {
        window.location.assign(`/customer-dashboard/${Auth.getUser().id}`);
      }
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
                {/* username  */}
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
                {/* password */}
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
                {/* retype password */}
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Retype Password"
                  name="retypePassword"
                  type="password"
                  value={formState.retypePassword}
                  onChange={handleChange}
                  margin="normal"
                />
                {/* user role */}
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
                {/* submit */}
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
