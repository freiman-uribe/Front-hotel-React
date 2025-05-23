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
import Swal from "sweetalert2";

interface RoomTypeTableProps {
  data: {
    id: number;
    nombre: string;
    acomodaciones: { id: number; nombre: string }[];
  }[];
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

const RoomTypeTable: React.FC<RoomTypeTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {

  const handleDelete = (id: number) => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed && onDelete) {
          onDelete(id);
          Swal.fire("Eliminado", "El registro ha sido eliminado.", "success");
        }
      });
    };
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Nombre</StyledTableCell>
            <StyledTableCell>Acomodaciones</StyledTableCell>
            <StyledTableCell>Acciones</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{row.nombre}</StyledTableCell>
              <StyledTableCell>
                {Array.isArray(row.acomodaciones) &&
                row.acomodaciones.length > 0
                  ? row.acomodaciones.map((a) => a.nombre).join(", ")
                  : "Sin acomodaciones"}
              </StyledTableCell>
              <StyledTableCell>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    label="Editar"
                    onClick={() => onEdit(row.id)}
                    color="success"
                  />
                  <Button
                    label="Eliminar"
                    onClick={() => handleDelete(row.id)}
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

export default RoomTypeTable;
