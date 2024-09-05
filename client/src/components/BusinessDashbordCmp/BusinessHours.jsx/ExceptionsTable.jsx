import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";
import dayjs from "dayjs";

export default function ExceptionsTable({ business, setBusiness }) {
  const handleDelete = (date, startTime) => {
    setBusiness((prevBusiness) => ({
      ...prevBusiness,
      exceptionalClosures: prevBusiness.exceptionalClosures.filter(
        (closure) => closure.date !== date || closure.startTime !== startTime
      ),
    }));
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {business.exceptionalClosures.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {dayjs(row.date).format("MMMM DD, YYYY")}
              </TableCell>
              <TableCell>{dayjs(row.startTime).format("hh:mm A")}</TableCell>
              <TableCell>{dayjs(row.endTime).format("hh:mm A")}</TableCell>
              <TableCell align="right">
                <Tooltip title="Delete">
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(row.date, row.startTime)}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
