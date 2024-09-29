import SmallHeader from "../components/SmallHeader";
import { useParams } from "react-router-dom";

export default function Booking() {
  const { businessId } = useParams();
  return (
    <>
      <SmallHeader />
      <div>Booking page {businessId}</div>
    </>
  );
}
