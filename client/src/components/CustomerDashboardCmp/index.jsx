import React from "react";
import Auth from "../../utils/auth";
import { Grid, Box, Button } from "@mui/material";
import axios from "axios";
import CustomerInfo from "./CustomerInfo";
import MessageModal from "../MessageModal";
import BookingDetails from "./BookingDetails";

const initCustomerData = {
  customerName: "",
  phone: "",
  address: "",
  location: { type: "Point", coordinates: [0, 0] },
};

function selectCurrentBookings(bookings) {
  const now = new Date();

  const result = bookings.filter((booking) => {
    const bookingDate = new Date(booking.booking_datetime);
    return bookingDate >= now;
  });

  return result;
}

function selectPreviousBookings(bookings) {
  const now = new Date();

  const result = bookings.filter((booking) => {
    const bookingDate = new Date(booking.booking_datetime);
    return bookingDate < now;
  });

  return result;
}

export default function CustomerDashboardCmp() {
  const [customer, setCustomer] = React.useState(initCustomerData);
  // Modal message box data
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalMessage, setModalMessage] = React.useState("");
  const [modalColor, setModalColor] = React.useState("primary");
  const [showModal, setShowModal] = React.useState(false);
  const [currentBookings, setCurrentBookings] = React.useState([]);
  const [previousBookings, setPreviousBookings] = React.useState([]);
  const [refetch, setRefetch] = React.useState(false);

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

  // fetch the bookings
  React.useEffect(() => {
    if (!customer._id) {
      return;
    }
    const customerId = customer._id;
    axios
      .get(`/api/booking/customer/${customerId}`, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` },
      })
      .then((response) => {
        if (response.data) {
          setCurrentBookings(selectCurrentBookings(response.data));
          setPreviousBookings(selectPreviousBookings(response.data));
          setRefetch(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [customer, refetch]);

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

  // cancel the booking
  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axios.delete(`/api/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` },
      });
      if (response.status !== 204) {
        showMessageModal("Error", "Failed to cancel the booking", "error");
        return;
      }
      showMessageModal("Success", "Booking cancelled successfully", "success");
      setRefetch(true);
    } catch (error) {
      console.error(error);
      showMessageModal("Error", "Failed to cancel the booking", "error");
    }
  };

  // book again
  const handleBookAgain = (businessId, serviceId) => {
    window.location.href = `/booking/${businessId}/${serviceId}`;
  };

  return (
    <>
      <h1>Customer Dashboard ({Auth.getUser().username})</h1>
      <Grid container>
        <Grid container item xs={0} md={3}>
          {/* offset */}
        </Grid>
        <Grid container item xs={12} md={6}>
          <Box
            component="fieldset"
            sx={{
              display: "flex",
              justifyContent: "center",
              border: "1px solid #ccc",
              paddingTop: 5,
              borderRadius: 2,
              width: "100%",
              marginBottom: 5,
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
              marginBottom: 5,
            }}
          >
            <legend>Bookings</legend>
            <Grid item container xs={12}>
              {currentBookings.map((booking) => (
                <BookingDetails
                  key={booking.id}
                  booking={booking}
                  bookAgain={false}
                  actionHandler={() => handleCancelBooking(booking.id)}
                />
              ))}
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
              {previousBookings.map((booking) => (
                <BookingDetails
                  key={booking.id}
                  booking={booking}
                  bookAgain={true}
                  actionHandler={() =>
                    handleBookAgain(
                      booking.details.businessId,
                      booking.details.service._id
                    )
                  }
                />
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid container item xs={0} md={3}>
          {/* offset */}
        </Grid>
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
