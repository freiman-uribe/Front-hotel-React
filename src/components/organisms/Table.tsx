import React from "react";
import Button from "../atoms/Button";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

interface TableProps {
  data: {
    id: number;
    nombre: string;
    direccion: string;
    ciudad: string;
    nit: string;
    numero_de_habitaciones: number;
    created_at: string;
    updated_at: string;
    tipo_habitacions: string[];
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
  const navigate = useNavigate();

  return (
    <div className="table-container">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <StyledTableCell key={col}>{col}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.nombre}
                </StyledTableCell>
                <StyledTableCell>{row.direccion}</StyledTableCell>
                <StyledTableCell>{row.ciudad}</StyledTableCell>
                <StyledTableCell>{row.nit}</StyledTableCell>
                <StyledTableCell>{row.numero_de_habitaciones}</StyledTableCell>
                <StyledTableCell>
                  {new Date(row.created_at).toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell>
                  {new Date(row.updated_at).toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {onEdit && (
                      <Button
                        label="Editar"
                        onClick={() => onEdit(row.id)}
                        color="success"
                      />
                    )}
                    <Button
                      label="Ver Habitaciobnes"
                      onClick={() => navigate(`/hotel/${row.id}`)}
                      color="secondary"
                    />
                    {onDelete && (
                      <Button
                        label="Eliminar"
                        onClick={() => onDelete(row.id)}
                        color="error"
                      />
                    )}
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CustomTable;
