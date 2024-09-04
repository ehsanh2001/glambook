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
  const handleDelete = (staffName) => {
    setBusiness((prev) => ({
      ...prev,
      staff: prev.staff.filter((st) => st.staffName !== staffName),
    }));
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="staff table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {business.staff.map((row) => (
            <TableRow
              key={row.staffName}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.staffName}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Delete">
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(row.staffName)}
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
