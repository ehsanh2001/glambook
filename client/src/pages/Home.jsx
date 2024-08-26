import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1>GlamBook Home Page</h1>
      <Link to="/business-dashboard">Business Dashboard</Link>
    </>
  );
}
