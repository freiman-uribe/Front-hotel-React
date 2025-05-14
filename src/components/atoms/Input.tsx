import React from "react";
import TextField from "@mui/material/TextField";

interface InputProps {
  id: string;
  type: "text" | "number";
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  type,
  value,
  onChange,
  placeholder,
  label,
  disabled,
  error = false,
  helperText = "",
}) => (
  <div className="input-container">
    <TextField
      id={id}
      type={type}
      value={value}
      onChange={(e) =>
        onChange(type === "number" ? +e.target.value : e.target.value)
      }
      label={label}
      placeholder={placeholder}
      fullWidth
      margin="normal"
      disabled={disabled}
      error={error}
      helperText={helperText}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
      }}
    />
  </div>
);

export default Input;
