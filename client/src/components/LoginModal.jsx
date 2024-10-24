import React, { useState, useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import Auth from "../utils/auth";

export default function LoginModal({ open, handleClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    // Perform login logic here
    try {
      const response = await axios.post("/api/user/login", {
        username: username,
        password: password,
      });

      // If the response is successful, extract the data
      const data = response.data;
      Auth.login(data.token, data.user);
      // Call the login function from the AuthContext
      login();

      clearForm();
      handleClose();
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleModalColse = () => {
    clearForm();
    handleClose();
  };

  const clearForm = () => {
    setUsername("");
    setPassword("");
    setError(null);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Username"
          type="text"
          fullWidth
          variant="outlined"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(null);
          }}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
        />
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalColse} color="primary">
          Cancel
        </Button>
        <Button onClick={handleLogin} color="primary">
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
