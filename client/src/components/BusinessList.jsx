import BusinessListItem from "./BusinessListItem.jsx";

export default function BusinessList({ businesses }) {
  return (
    <div>
      {businesses.map((business, index) => (
        <BusinessListItem key={index} business={business} />
      ))}
    </div>
  );
}
