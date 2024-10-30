import SmallHeader from "../../components/SmallHeader";
import { useParams } from "react-router-dom";
import React from "react";
import axios from "axios";
import { Grid, Alert } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import GeneralInfo from "../../components/BookingCmps/GeneralInfo";
import StaffList from "../../components/BookingCmps/StaffList";
import FreeTimeList from "../../components/BookingCmps/FreeTimeList";
import DisplaySelectedBooking from "../../components/BookingCmps/DisplaySelectedBooking";
import Auth from "../../utils/auth";
import MessageModal from "../../components/MessageModal";
import { AuthContext } from "../../utils/AuthContext";
import useBusinessDetails from "./useBusinessDetails";
import useFreeTimes from "./useFreeTimes";
import saveBooking from "./saveBooking";

export default function Booking() {
  const { businessId } = useParams();
  const { serviceId } = useParams();

  const [selectedTime, setSelectedTime] = React.useState(null);
  const [selectedStaff, setSelectedStaff] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(dayjs(new Date()));
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
  // If not, show an alert
  React.useEffect(() => {
    if (!Auth.loggedIn() || Auth.getTokenData().role !== "customer") {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [isLoggedIn]);

  // Fetch business details
  const { business, error: businessError } = useBusinessDetails(
    businessId,
    refetch,
    setSelectedStaff
  );
  // Fetch free times for selected staff
  const {
    freeTimes,
    selectedService,
    error: freeTimesError,
  } = useFreeTimes(
    businessId,
    selectedStaff,
    selectedDate,
    serviceId,
    setSelectedTime
  );

  // save booking
  const handleSaveBooking = saveBooking(
    showMessageModal,
    business,
    selectedTime,
    selectedDate,
    businessId,
    serviceId,
    selectedStaff,
    setRefetch
  );

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
              handleBooking={handleSaveBooking}
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
