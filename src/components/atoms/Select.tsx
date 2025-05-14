import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

interface SelectProps {
  options: { value: string | number; label: string }[];
  value: string | number | (string | number)[];
  onChange: (value: string | number | (string | number)[]) => void;
  label: string;
  disabled?: boolean;
  multiple?: boolean;
}

const SelectAtom: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  disabled = false,
  multiple = false,
}) => (
  <FormControl fullWidth margin="normal" disabled={disabled}>
    <InputLabel>{label}</InputLabel>
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label={label}
      multiple={multiple}
      renderValue={(selected) =>
        multiple && Array.isArray(selected)
          ? selected
              .map((val) => options.find((o) => o.value === val)?.label)
              .join(", ")
          : options.find((o) => o.value === selected)?.label
      }
      sx={{
        textAlign: "left", // Alinea el texto seleccionado a la izquierda
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {multiple && (
            <Checkbox
              checked={Array.isArray(value) && value.includes(option.value)}
            />
          )}
          {multiple ? <ListItemText primary={option.label} /> : option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default SelectAtom;
