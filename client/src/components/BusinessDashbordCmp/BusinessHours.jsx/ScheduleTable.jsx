import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const generateTimeArray = (start, end) => {
  const format = "hh:mm A";
  let startTime = dayjs(start, format);
  let endTime = dayjs(end, format);
  endTime = endTime.subtract(1, "hour");
  const timeArray = [];

  while (startTime.isBefore(endTime) || startTime.isSame(endTime)) {
    timeArray.push(startTime.format(format));
    startTime = startTime.add(1, "hour");
  }

  return timeArray;
};

export default function ScheduleTable({ business, setBusiness }) {
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [timeSlots, setTimeSlots] = useState([]);

  React.useEffect(() => {
    const openingTime = business.openingHours.openingTime;
    const closingTime = business.openingHours.closingTime;
    setTimeSlots(generateTimeArray(openingTime, closingTime));
  }, [business.openingHours]);

  const toggleCell = (day, index) => {
    const updatedOpeningHours = { ...business.openingHours };
    updatedOpeningHours[day][index] = !updatedOpeningHours[day][index];

    setBusiness((prevData) => ({
      ...prevData,
      openingHours: updatedOpeningHours,
    }));
  };

  const toggleRow = (day) => {
    const updatedOpeningHours = { ...business.openingHours };
    const allTrue = updatedOpeningHours[day].every((val) => val);
    updatedOpeningHours[day] = new Array(timeSlots.length).fill(!allTrue);
    setBusiness((prevData) => ({
      ...prevData,
      openingHours: updatedOpeningHours,
    }));
  };

  const toggleColumn = (index) => {
    const updatedOpeningHours = { ...business.openingHours };
    const allTrue = weekDays.every((day) => updatedOpeningHours[day][index]);
    weekDays.forEach((day) => {
      updatedOpeningHours[day][index] = !allTrue;
    });
    setBusiness((prevData) => ({
      ...prevData,
      openingHours: updatedOpeningHours,
    }));
  };

  const getRowHeaderVariant = (day) => {
    const allTrue = business.openingHours[day].every((val) => val);
    const allFalse = business.openingHours[day].every((val) => !val);
    return allTrue ? "success" : allFalse ? "error" : "warning";
  };

  const getColumnHeaderVariant = (index) => {
    const allTrue = weekDays.every((day) => business.openingHours[day][index]);
    const allFalse = weekDays.every(
      (day) => !business.openingHours[day][index]
    );
    return allTrue ? "success" : allFalse ? "error" : "warning";
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#f5f5f5",
                zIndex: 1,
              }}
            />
            {timeSlots.map((slot, index) => (
              <TableCell
                key={index}
                align="center"
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f5f5f5",
                  zIndex: 1,
                }}
              >
                <Button
                  variant={getColumnHeaderVariant(index)}
                  onClick={() => toggleColumn(index)}
                >
                  {slot}
                </Button>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {weekDays.map((day, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell
                component="th"
                scope="row"
                style={{
                  position: "sticky",
                  left: 0,
                  backgroundColor: "#f5f5f5",
                  zIndex: 1,
                }}
              >
                <Button
                  className="tabel"
                  color={getRowHeaderVariant(day)}
                  onClick={() => toggleRow(day)}
                >
                  {day}
                </Button>
              </TableCell>
              {timeSlots.map((_, colIndex) => (
                <TableCell key={colIndex} align="center">
                  <Button
                    className="tabel"
                    color={
                      business.openingHours[day][colIndex] ? "success" : "error"
                    }
                    onClick={() => toggleCell(day, colIndex)}
                  >
                    {business.openingHours[day][colIndex] ? (
                      <CheckIcon />
                    ) : (
                      <CloseIcon />
                    )}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
