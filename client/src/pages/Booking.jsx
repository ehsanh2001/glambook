import SmallHeader from "../components/SmallHeader";
import { useParams } from "react-router-dom";
import React from "react";
import axios from "axios";
import { Grid, Alert } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import GeneralInfo from "../components/BookingCmps/GeneralInfo";
import StaffList from "../components/BookingCmps/StaffList";
import FreeTimeList from "../components/BookingCmps/FreeTimeList";
import DisplaySelectedBooking from "../components/BookingCmps/DisplaySelectedBooking";
import Auth from "../utils/auth";
import MessageModal from "../components/MessageModal";
import { AuthContext } from "../utils/AuthContext";

export default function Booking() {
  const { businessId } = useParams();
  const { serviceId } = useParams();

  const [business, setBusiness] = React.useState(null);
  const [freeTimes, setFreeTimes] = React.useState(null);
  const [selectedTime, setSelectedTime] = React.useState(null);
  const [selectedStaff, setSelectedStaff] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(dayjs(new Date()));
  const [selectedService, setSelectedService] = React.useState(null);
  const [showAlert, setShowAlert] = React.useState(false);
  const [refetch, setRefetch] = React.useState(false);
  const { isLoggedIn } = React.useContext(AuthContext);
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

  // Check if the user is logged in and is a customer
  React.useEffect(() => {
    if (!Auth.loggedIn() || Auth.getTokenData().role !== "customer") {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [isLoggedIn]);

  // Fetch business details
  React.useEffect(() => {
    axios
      .get(`/api/business/${businessId}`)
      .then((response) => {
        setBusiness(response.data);
        setSelectedStaff(response.data.staff[0]);
        setRefetch(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [businessId, refetch]);

  // Fetch free times for selected staff
  React.useEffect(() => {
    if (!selectedStaff || !selectedDate) {
      return;
    }

    axios
      .post(`/api/booking/staff-freetime`, {
        business_id: businessId,
        date: selectedDate.toISOString(),
        service_id: serviceId,
        staff_id: selectedStaff._id,
      })
      .then((response) => {
        setFreeTimes(response.data.freeTimes);
        setSelectedTime(null);
        setSelectedService(response.data.service);
      });
  }, [selectedStaff, selectedDate]);

  // save booking
  const saveBooking = async () => {
    try {
      // if user is not a customer
      if (!Auth.loggedIn() || Auth.getTokenData().role !== "customer") {
        showMessageModal("Error", "You should login as a customer", "error");
        return;
      }
      // calculate booking date time
      const time = dayjs(business.openingHours.openingTime, "HH:mm A").add(
        15 * selectedTime,
        "minute"
      );
      let bookingDateTime = new Date(selectedDate);
      bookingDateTime.setHours(time.hour());
      bookingDateTime.setMinutes(time.minute());

      // get customer id
      const customerId = Auth.getUser().id;

      // save booking
      const response = await axios.post(`/api/booking`, {
        business: businessId,
        service: serviceId,
        staff: selectedStaff._id,
        customer: customerId,
        booking_datetime: bookingDateTime,
      });
      if (response.status !== 201) {
        showMessageModal("Server Error", "Failed to save booking", "error");
        return;
      }

      showMessageModal("Success", "Booking saved successfully", "success");
      setRefetch(true);
      // go to dashboard
      window.location.href = `/customer-dashboard/${customerId}`;
    } catch (error) {
      console.error(error);
      showMessageModal("Error", "Failed to save booking", "error");
    }
  };

  if (!business || !freeTimes) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {showAlert && (
        <Alert severity="error">
          You should login as a customer to book an appointment
        </Alert>
      )}
      <SmallHeader />
      <Grid container>
        <Grid item xs={0} md={3}>
          {/* offset */}
        </Grid>

        <Grid item container xs={12} md={6}>
          {/* general booking data */}
          <Grid item xs={12}>
            <GeneralInfo
              business={business}
              selectedService={selectedService}
            />
          </Grid>
          {/* staff selection list */}
          <Grid item xs={12}>
            <StaffList
              staff={business.staff}
              selectedStaff={selectedStaff}
              setSelectedStaff={setSelectedStaff}
            />
          </Grid>
          {/* date selection */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={selectedDate ? dayjs(selectedDate) : dayjs(new Date())}
                disablePast={true}
                onChange={(date) => setSelectedDate(date)}
              />
            </LocalizationProvider>
          </Grid>
          {/* time selection */}
          <Grid item xs={12}>
            <FreeTimeList
              freetime={freeTimes}
              startTime={business.openingHours.openingTime}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
          </Grid>
          {/* show the seleccted booking */}
          <Grid item xs={12}>
            <DisplaySelectedBooking
              business={business}
              selectedService={selectedService}
              selectedTime={selectedTime}
              selectedStaff={selectedStaff}
              selectedDate={selectedDate}
              handleBooking={saveBooking}
            />
          </Grid>
        </Grid>
        <Grid item xs={0} md={3}>
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
