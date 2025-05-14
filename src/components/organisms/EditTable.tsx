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

interface TableProps {
  data: {
    id: number;
    cantidad: number;
    tipo_habitacion: {
      id: number;
      nombre: string;
      acomodaciones: { id: number; nombre: string }[];
    };
    acomodacion: {
      id: number;
      nombre: string;
    };
    created_at: string;
    updated_at: string;
  }[];
  columns: string[];
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
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

const CustomTable: React.FC<TableProps> = ({
  data,
  columns,
  onDelete,
  onEdit,
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
    <div className="table-container">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <StyledTableCell key={col}>{col}</StyledTableCell>
              ))}
              {onDelete || onEdit ? (
                <StyledTableCell>Acciones</StyledTableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.cantidad}
                </StyledTableCell>
                <StyledTableCell>
                  {row.tipo_habitacion?.nombre || "Sin tipo"}
                </StyledTableCell>
                <StyledTableCell>{row.acomodacion?.nombre}</StyledTableCell>
                {(onDelete || onEdit) && (
                  <StyledTableCell>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {onEdit && (
                        <Button
                          label="Editar"
                          onClick={() => onEdit(row.id)}
                          color="success"
                        />
                      )}
                      {onDelete && (
                        <Button
                          label="Eliminar"
                          onClick={() => handleDelete(row.id)}
                          color="error"
                        />
                      )}
                    </div>
                  </StyledTableCell>
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CustomTable;
