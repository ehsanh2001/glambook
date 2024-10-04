import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Box, Tabs, Tab, Typography, Grid, Button } from "@mui/material";
import MessageModal from "../MessageModal.jsx";
import Auth from "../../utils/auth";
import StaffGeneralInfoForm from "./StaffGeneralInfoForm.jsx";

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

export default function StaffDashboardCmp() {
  const [tab, setTab] = React.useState(0);
  const [staff, setStaff] = React.useState(null);

  // Modal message box data
  const [showModal, setShowModal] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalMessage, setModalMessage] = React.useState("");
  const [modalColor, setModalColor] = React.useState("primary");

  // Fetch the staff data
  React.useEffect(() => {
    const staffId = Auth.getUser().id;
    axios
      .get(`/api/staff/${staffId}`, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` },
      })
      .then((response) => {
        if (response.data) {
          setStaff(response.data.staff);
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

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  if (!staff) {
    return <div>Loading...</div>;
  }
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
          <Tab label="Appointments" {...a11yProps(1)} />
          <Tab label="Hours" {...a11yProps(2)} />
        </Tabs>
      </Grid>
      {/* TabPanels */}
      <Grid item xs={12} sm={10}>
        <TabPanel value={tab} index={0}>
          <StaffGeneralInfoForm staff={staff} setStaff={setStaff} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <h1>Schedule</h1>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <h1>hours</h1>
        </TabPanel>
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
