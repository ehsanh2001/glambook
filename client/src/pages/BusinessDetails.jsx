import { useParams } from "react-router-dom";
import React from "react";
import SmallHeader from "../components/SmallHeader";
import BusinessDetailsCmp from "../components/BusinessDetailsCmp";
import axios from "axios";

export default function BusinessDetails() {
  const { businessId } = useParams();
  const [business, setBusiness] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // fetch the business details from the server
  React.useEffect(() => {
    axios
      .get(`/api/business/${businessId}`)
      .then((response) => {
        setBusiness(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching business data:", error);
        setLoading(false); // Stop loading on error as well
      });
  }, [businessId]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading state
  }

  if (!business) {
    return <div>Business not found</div>; // Display a fallback if business is not available
  }

  return (
    <>
      <SmallHeader />
      <BusinessDetailsCmp business={business} />
    </>
  );
}
