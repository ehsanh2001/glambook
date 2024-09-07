import * as React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Box, Tabs, Tab, Typography, Grid, Button } from "@mui/material";
import GeneralBusinessInfoForm from "./GeneralBusinessInfoForm";
import ServicesForm from "./ServicesForm";
import StaffForm from "./StaffForm";
import BusinessHoursForm from "./BusinessHours.jsx";

const initBusinessData = {
  businessName: "",
  phone: "",
  address: "",
  location: { lat: null, lng: null }, // the business model uses location: { type: String, coordinates: [Number] }, but the google API returns location: { lat: Number, lng: Number } so we need to convert it
  businessImage: null,
  businessType: "",
  services: [], // { serviceName: "", price: "", duration: "" }
  staff: [], // { staffName: "", password: "" }
  openingHours: {
    openingTime: "08:00 AM",
    closingTime: "05:00 PM",
    Monday: Array(9).fill(true), //  each entry is for a 1-hour interval,
    Tuesday: Array(9).fill(true), // and the array is for the whole day, from openingTime to closingTime
    Wednesday: Array(9).fill(true),
    Thursday: Array(9).fill(true),
    Friday: Array(9).fill(true),
    Saturday: Array(9).fill(true),
    Sunday: Array(9).fill(true),
  },
  exceptionalClosures: [], // { date: Date, startTime: Date, endTime: Date }
};

function castBusinessDataToBusinessSchema(businessData, imageFileName) {
  const businessSchemaData = { ...businessData };

  // set the businessImage to the image file name
  businessSchemaData.businessImage = imageFileName;

  // set the location to the correct format
  businessSchemaData.location = {
    type: "Point",
    coordinates: [
      businessSchemaData.location.lng,
      businessSchemaData.location.lat,
    ],
  };

  // staff working hours are the same for all staff and it is the same as the business opening hours
  const staffWorkingHours = {
    Monday: businessSchemaData.openingHours.Monday,
    Tuesday: businessSchemaData.openingHours.Tuesday,
    Wednesday: businessSchemaData.openingHours.Wednesday,
    Thursday: businessSchemaData.openingHours.Thursday,
    Friday: businessSchemaData.openingHours.Friday,
    Saturday: businessSchemaData.openingHours.Saturday,
    Sunday: businessSchemaData.openingHours.Sunday,
  };
  // set the staff working hours
  businessSchemaData.staff = businessData.staff.map((staff) => {
    return {
      staffName: staff.staffName,
      workingHours: staffWorkingHours,
    };
  });

  return businessSchemaData;
}

// Function to upload the file to the server
// It returns the file name if the upload is successful, otherwise it returns null
async function uploadFile(file) {
  // Create FormData object and append the file
  const formData = new FormData();
  formData.append("file", file); // 'file' is the key to access on the server

  try {
    const response = await axios.post("/api/image/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set the content type for file upload
      },
    });

    // return the file name
    return response.data.filename;
  } catch (error) {
    // Handle error
    console.error(error);
    return null;
  }
}

export default function BusinessDashboardCmp() {
  const [tab, setTab] = React.useState(0);
  const [business, setBusiness] = React.useState(initBusinessData);
  const [typeAndServices, setTypeAndServices] = React.useState([]);

  // fetch type and services data
  React.useEffect(() => {
    fetch("/api/typeAndServices")
      .then((res) => res.json())
      .then((data) => {
        setTypeAndServices(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSaveBusinessChanges = async () => {
    // upload the business image
    let imageFileName = null;
    if (business.businessImage) {
      imageFileName = await uploadFile(business.businessImage);
      if (!imageFileName) {
        alert("Failed to upload the image");
        return;
      }
    }

    // cast the business data to the business schema
    const businessSchemaData = castBusinessDataToBusinessSchema(
      business,
      imageFileName
    );
    // save the business data
    try {
      const response = await axios.post("/api/business", businessSchemaData);
      alert("Business data saved successfully");
    } catch (error) {
      alert("Failed to save the business data");
      console.log(error);
    }
  };

  return (
    <Grid container>
      {/* Tabs */}
      <Grid item xs={12} sm={2}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tab}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          <Tab label="General" {...a11yProps(0)} />
          <Tab label="Services" {...a11yProps(1)} />
          <Tab label="Staff" {...a11yProps(2)} />
          <Tab label="Hours" {...a11yProps(3)} />
        </Tabs>
      </Grid>
      {/* TabPanels */}
      <Grid item xs={12} sm={10}>
        <TabPanel value={tab} index={0}>
          <GeneralBusinessInfoForm
            business={business}
            setBusiness={setBusiness}
            typeAndServices={typeAndServices}
          />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <ServicesForm
            business={business}
            setBusiness={setBusiness}
            typeAndServices={typeAndServices}
          />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <StaffForm business={business} setBusiness={setBusiness} />
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <BusinessHoursForm business={business} setBusiness={setBusiness} />
        </TabPanel>
      </Grid>
      <Grid container item xs={12} justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveBusinessChanges}
          sx={{ mt: 2, mr: 3 }}
        >
          Save Businesss Changes
        </Button>
      </Grid>
    </Grid>
  );
}

// Code form MUI documentation for Tabs and TabPanel
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography variant="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
// End of code from MUI documentation
