import { useState, useEffect } from "react";
import axios from "axios";

// Custom React hook to fetch and manage business details based on a given business ID.
// The hook fetches data from the `/api/business/{businessId}` endpoint using Axios.
// It updates the `business` state with the fetched data or handles errors.
// If the business has staff members, the first one is automatically selected using `setSelectedStaff`.
// If no staff is found, an error message is set, and the staff selection is cleared.
// The hook is refreshed when the `businessId` or `refreshTrigger` values change.
const useBusinessDetails = (businessId, refreshTrigger, setSelectedStaff) => {
  const [business, setBusiness] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      const response = await axios.get(`/api/business/${businessId}`);

      if (response.status === 200) {
        setBusiness(response.data);
        if (response.data?.staff?.length > 0) {
          setSelectedStaff(response.data.staff[0]);
        } else {
          setError("No staff found for this business");
          setSelectedStaff(null);
        }
      } else {
        setBusiness(null);
        setSelectedStaff(null);
        setError(response.data.message);
      }
    };

    fetchBusinessDetails();
  }, [businessId, refreshTrigger]);

  return { business, error };
};

export default useBusinessDetails;
