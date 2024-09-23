import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Box, Tabs, Tab, Typography, Grid, Button } from "@mui/material";
import GeneralBusinessInfoForm from "./GeneralBusinessInfoForm";
import ServicesForm from "./ServicesForm";
import StaffForm from "./StaffForm";
import BusinessHoursForm from "./BusinessHours.jsx";
import MessageModal from "../MessageModal.jsx";
import Auth from "../../utils/auth";
import {
  initBusinessData,
  castBusinessDataToBusinessSchema,
  checkBusinessData,
} from "./businessLogic";

// Function to upload the file to the server
// It returns the file name if the upload is successful, otherwise it returns null
async function uploadFile(file) {
  // Create FormData object and append the file
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post("/api/image/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
    });

    return response.data.filename;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function BusinessDashboardCmp() {
  const [tab, setTab] = React.useState(0);
  const [business, setBusiness] = React.useState(initBusinessData);
  const [typeAndServices, setTypeAndServices] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  // if the business working hours are changed, the old working hours will be stored here
  // it will be used to restore the staff working hours if the staff already has a working hours
  const [oldOpenningHours, setOldOpenningHours] = React.useState(null);
  // Modal message box data
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalMessage, setModalMessage] = React.useState("");
  const [modalColor, setModalColor] = React.useState("primary");

  // Fetch the business data
  React.useEffect(() => {
    const ownerId = Auth.getUser().id;
    axios
      .get(`/api/business/${ownerId}`)
      .then((response) => {
        if (response.data) {
          setOldOpenningHours(response.data.openingHours);
          setBusiness(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Function to show the message modal
  const showMessageModal = (title, message, color) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalColor(color);
    setShowModal(true);
  };

  // fetch type and services data
  React.useEffect(() => {
    fetch("/api/typeAndServices")
      .then((res) => res.json())
      .then((data) => {
        setTypeAndServices(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSaveBusinessChanges = async () => {
    // check if the business data is valid
    const checkResult = checkBusinessData(business);
    if (checkResult !== "ok") {
      showMessageModal("Error", checkResult, "error");
      return;
    }
    // upload the business image
    let imageFileName = null;
    if (business.businessImageData) {
      imageFileName = await uploadFile(business.businessImageData);
      if (!imageFileName) {
        showMessageModal(
          "Error",
          "Failed to upload the business image",
          "error"
        );
        return;
      }
    }

    // cast the business data to the business schema
    const businessSchemaData = castBusinessDataToBusinessSchema(
      business,
      imageFileName,
      oldOpenningHours
    );
    // save the business data
    try {
      const response = await axios.post("/api/business", businessSchemaData, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` },
      });
      setBusiness(response.data);
      showMessageModal("Success", "Business data saved successfully", "green");
    } catch (error) {
      showMessageModal("Error", "Failed to save business data", "error");
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
          onChange={handleTabChange}
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
            showMessageModal={showMessageModal}
          />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <StaffForm
            business={business}
            setBusiness={setBusiness}
            showMessageModal={showMessageModal}
          />
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <BusinessHoursForm
            business={business}
            setBusiness={setBusiness}
            showMessageModal={showMessageModal}
          />
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
      <MessageModal
        showModal={showModal}
        setShowModal={setShowModal}
        title={modalTitle}
        message={modalMessage}
        color={modalColor}
      />
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
