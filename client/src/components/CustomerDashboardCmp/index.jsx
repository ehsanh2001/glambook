import React from "react";
import Auth from "../../utils/auth";
import { Grid, Box, Button } from "@mui/material";
import axios from "axios";
import CustomerInfo from "./CustomerInfo";
import MessageModal from "../MessageModal";

const initCustomerData = {
  customerName: "",
  phone: "",
  address: "",
  location: { type: "Point", coordinates: [0, 0] },
};

export default function CustomerDashboardCmp() {
  const [customer, setCustomer] = React.useState(initCustomerData);
  // Modal message box data
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalMessage, setModalMessage] = React.useState("");
  const [modalColor, setModalColor] = React.useState("primary");
  const [showModal, setShowModal] = React.useState(false);

  // Function to show the message modal
  const showMessageModal = (title, message, color) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalColor(color);
    setShowModal(true);
  };

  // Fetch the customer data
  React.useEffect(() => {
    const customerId = Auth.getTokenData().user_id;
    axios
      .get(`/api/customer/${customerId}`, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` },
      })
      .then((response) => {
        if (response.data) {
          setCustomer(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // save customer data to the database
  const handleClickSaveChanges = () => {
    const customerId = Auth.getUser().id;
    axios
      .post(`/api/customer/${customerId}`, customer, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` },
      })
      .then((response) => {
        showMessageModal(
          "Success",
          "Customer data saved successfully",
          "success"
        );
      })
      .catch((error) => {
        console.error(error);
        showMessageModal("Error", "Failed to save customer data", "error");
      });
  };

  return (
    <>
      <h1>Customer Dashboard ({Auth.getUser().username})</h1>
      <Grid container>
        <Box
          component="fieldset"
          sx={{
            display: "flex",
            justifyContent: "center",
            border: "1px solid #ccc",
            paddingTop: 5,
            borderRadius: 2,
            width: "100%",
          }}
        >
          <legend>Information</legend>

          <Grid item container xs={12} sm={10} lg={8}>
            <Grid item xs={12}>
              <CustomerInfo customer={customer} setCustomer={setCustomer} />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 3 }}
                onClick={handleClickSaveChanges}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box
          component="fieldset"
          sx={{
            border: "1px solid #ccc",
            paddingTop: 5,
            borderRadius: 2,
            width: "100%",
          }}
        >
          <legend>Bookings</legend>
          <Grid item container xs={12}>
            <h1>Bookings</h1>
          </Grid>
        </Box>
        <Box
          component="fieldset"
          sx={{
            border: "1px solid #ccc",
            paddingTop: 5,
            borderRadius: 2,
            width: "100%",
          }}
        >
          <legend>Previous Bookings</legend>
          <Grid item container xs={12}>
            <h1>Previous Bookings</h1>
          </Grid>
        </Box>
      </Grid>
      <MessageModal
        showModal={showModal}
        setShowModal={setShowModal}
        title={modalTitle}
        message={modalMessage}
        color={modalColor}
      />
    </>
  );
}
