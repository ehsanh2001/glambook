import BusinessTypesNav from "./BusinessTypesNav";
import { useState, useEffect } from "react";
import axios from "axios";

export default function BusinessByTypeHeader({ currentType }) {
  //  fetch business types from the server
  const [businessTypes, setBusinessTypes] = useState([]);
  useEffect(() => {
    axios.get("/api/typeAndServices").then((response) => {
      const types = response.data.map((type) => type.businessType);
      setBusinessTypes(types);
    });
  }, []);

  return (
    <header>
      <div style={{ backgroundColor: "darkblue" }}>
        <BusinessTypesNav
          businessTypes={businessTypes}
          currentBusinessType={currentType}
        />
      </div>
    </header>
  );
}
