import React from "react";
// import Icon from "./Icon";
import Button from "@mui/material/Button";

interface ButtonProps {
  label: string;
  onClick: () => void;
  icon?: string;
  disabled?: boolean;
  className?: string;
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
}

const ButtonAtom: React.FC<ButtonProps> = ({
  label,
  onClick,
  icon,
  disabled,
  className,
  color,
}) => (
  <Button
    variant="contained"
    onClick={onClick}
    className={className}
    color={color}
    disabled={disabled}
  >
    {icon && "<Icon name={icon} />"}
    {label}
  </Button>
);

export default ButtonAtom;
