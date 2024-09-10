import { Link } from "react-router-dom";
import HomeHeader from "../components/HomeHeader";

export default function Home() {
  return (
    <>
      <HomeHeader />
      <Link to="/business-dashboard">Business Dashboard</Link>
    </>
  );
}
