import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import WeeklyHourSelector from "./WeeklyHourSelector";
import ExceptionalClosures from "./ExceptionalClosures";

export default function BusinessHours({
  business,
  setBusiness,
  showMessageModal,
}) {
  const [tab, setTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Weekly Hours" {...a11yProps(0)} />
          <Tab label="Exceptional Closures" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tab} index={0}>
        <WeeklyHourSelector
          business={business}
          setBusiness={setBusiness}
          showMessageModal={showMessageModal}
        />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={1}>
        <ExceptionalClosures
          business={business}
          setBusiness={setBusiness}
          showMessageModal={showMessageModal}
        />
      </CustomTabPanel>
    </Box>
  );
}

// Code from MUI documentation for Tabs and TabPanel
// Custom TabPanel component
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
