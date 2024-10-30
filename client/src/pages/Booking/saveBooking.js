import axios from "axios";
import dayjs from "dayjs";
import Auth from "../../utils/auth";

/**
 * Save a booking for a customer, ensuring the user is logged in and has the "customer" role.
 * The function calculates the booking date and time, then sends the booking details to the server.
 * If the booking is successfully saved, it shows a success modal and redirects to the customer's dashboard.
 * If there are errors, it displays an appropriate error modal.
 **/
export default function saveBooking(
  showMessageModal,
  business,
  selectedTime,
  selectedDate,
  businessId,
  serviceId,
  selectedStaff,
  setRefetch
) {
  return async () => {
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
      const userId = Auth.getUser().id;

      // save booking
      const response = await axios.post(
        `/api/booking`,
        {
          business: businessId,
          service: serviceId,
          staff: selectedStaff._id,
          user: userId,
          booking_datetime: bookingDateTime,
        },
        {
          headers: {
            Authorization: `Bearer ${Auth.getToken()}`,
          },
        }
      );

      if (response.status !== 201) {
        showMessageModal("Server Error", "Failed to save booking", "error");
        return;
      }

      showMessageModal("Success", "Booking saved successfully", "success");
      setRefetch(true);
      // go to dashboard
      window.location.href = `/customer-dashboard/${userId}`;
    } catch (error) {
      console.error("error", error);
      showMessageModal("Error", "Failed to save booking", "error");
    }
  };
}
