import React from "react";
import Auth from "../../utils/auth";
import { Grid, Box, Button } from "@mui/material";
import axios from "axios";
import MessageModal from "../MessageModal";
import useMessageModal from "../MessageModal/useMessageModal";
import CustomerInfoBox from "./CustomerInfoBox";
import CurrentBookingsBox from "./CurrentBookingsBox";
import PrevBookingsBox from "./PrevBookingsBox";

// Initial customer data
// without it the TextFields show their title and text on top of each other
const initCustomerData = {
  customerName: "",
  phone: "",
  address: "",
  location: { type: "Point", coordinates: [0, 0] },
};

// Select the current bookings of the customer from the list of bookings
function selectCurrentBookings(bookings) {
  const now = new Date();

  const result = bookings.filter((booking) => {
    const bookingDate = new Date(booking.booking_datetime);
    return bookingDate >= now;
  });

  return result;
}

// Select the 'num' previous bookings of the customer from the list of bookings
function selectPreviousBookings(bookings, num) {
  const now = new Date();

  const result = bookings.splice(0, num).filter((booking) => {
    const bookingDate = new Date(booking.booking_datetime);
    return bookingDate < now;
  });

  return result;
}

export default function CustomerDashboardCmp() {
  const [customer, setCustomer] = React.useState(initCustomerData);
  const [currentBookings, setCurrentBookings] = React.useState([]);
  const [previousBookings, setPreviousBookings] = React.useState([]);
  const [refetch, setRefetch] = React.useState(false);

  // Message modal setup
  const {
    modalTitle,
    modalMessage,
    modalColor,
    showModal,
    setShowModal,
    showMessageModal,
  } = useMessageModal();

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

  // fetch the bookings data
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
          setPreviousBookings(selectPreviousBookings(response.data, 5));
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

  // book again the service
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
          <CustomerInfoBox
            customer={customer}
            setCustomer={setCustomer}
            handleClickSaveChanges={handleClickSaveChanges}
          />
          <CurrentBookingsBox
            currentBookings={currentBookings}
            handleCancelBooking={handleCancelBooking}
          />
          <PrevBookingsBox
            previousBookings={previousBookings}
            handleBookAgain={handleBookAgain}
          />
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
