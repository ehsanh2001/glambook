import { useState, useEffect } from "react";
import axios from "axios";

// Custom hook to fetch available free times for a selected staff member on a specified date and service.
// Makes an API request to retrieve available booking times, the service details, and handles any errors.

const useFreeTimes = (
  businessId,
  selectedStaff,
  selectedDate,
  serviceId,
  setSelectedTime
) => {
  const [freeTimes, setFreeTimes] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedStaff || !selectedDate) return;

    const fetchFreeTimes = async () => {
      try {
        const response = await axios.post(`/api/booking/staff-freetime`, {
          business_id: businessId,
          date: selectedDate.toISOString(),
          service_id: serviceId,
          staff_id: selectedStaff._id,
        });

        if (response.status !== 200) {
          setError("Failed to fetch free times");
          return;
        }
        setFreeTimes(response.data.freeTimes);
        setSelectedTime(null);
        setSelectedService(response.data.service);
      } catch (err) {
        setError(err);
      }
    };
    fetchFreeTimes();
  }, [selectedStaff, selectedDate, businessId, serviceId]);

  return { freeTimes, selectedService, error };
};

export default useFreeTimes;
