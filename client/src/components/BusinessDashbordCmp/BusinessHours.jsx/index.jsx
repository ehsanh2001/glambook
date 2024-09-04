import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import WeeklyHourSelector from "./WeeklyHourSelector";
import ClosingDateTime from "./ClosingDateTime";

export default function BusinessHours({ business, setBusiness }) {
  return (
    <div>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="business-hours-content"
          id="business-hours-header"
        >
          <Typography variant="h6" gutterBottom>
            Weekly Business Hours
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <WeeklyHourSelector business={business} setBusiness={setBusiness} />
        </AccordionDetails>
        <AccordionActions>
          <Button>Cancel</Button>
          <Button>Agree</Button>
        </AccordionActions>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="exception-closing-dates-content"
          id="panel2-header"
        >
          <Typography variant="h6" gutterBottom>
            Closing Dates/Time
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ClosingDateTime business={business} setBusiness={setBusiness} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
