import * as React from "react";
import PropTypes from "prop-types";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import GeneralBusinessInfoForm from "./GeneralBusinessInfoForm";

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

const businessData = {
  businessName: "",
  phone: "",
  address: "",
  location: { lat: null, lng: null },
  businessImage: null,
  businessType: "",
  services: [],
};

export default function BusinessDashboardCmp() {
  const [tab, setTab] = React.useState(0);
  const [business, setBusiness] = React.useState(businessData);
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

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
      }}
    >
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
      <TabPanel value={tab} index={0}>
        <GeneralBusinessInfoForm
          business={business}
          setBusiness={setBusiness}
          typeAndServices={typeAndServices}
        />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={tab} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={tab} index={3}>
        Item Four
      </TabPanel>
    </Box>
  );
}
