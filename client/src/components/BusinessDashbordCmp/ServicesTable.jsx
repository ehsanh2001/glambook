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

export default function BasicTable({ business, setBusiness }) {
  const handleDelete = (serviceName) => {
    setBusiness((prev) => ({
      ...prev,
      services: prev.services.filter(
        (service) => service.serviceName !== serviceName
      ),
    }));
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Service</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Duration(min)</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {business.services.map((row) => (
            <TableRow
              key={row.serviceName}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.serviceName}
              </TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{row.duration}</TableCell>
              <TableCell align="right">
                <Tooltip title="Delete">
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(row.serviceName)}
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
