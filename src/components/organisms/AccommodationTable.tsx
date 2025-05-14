import React from "react";
import Button from "../atoms/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

interface AccommodationTableProps {
  data: { id: number; nombre: string }[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const AccommodationTable: React.FC<AccommodationTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Nombre</StyledTableCell>
            <StyledTableCell>Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{row.nombre}</StyledTableCell>
              <StyledTableCell>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    label="Editar"
                    onClick={() => onEdit(row.id)}
                    color="success"
                  />
                  <Button
                    label="Eliminar"
                    onClick={() => onDelete(row.id)}
                    color="error"
                  />
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AccommodationTable;
