import React from "react";
import { Typography as MuiTypography } from "@mui/material";

interface TypographyProps {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "body1" | "body2";
  children: React.ReactNode;
  color?: string;
  textAlign?: "left" | "center" | "right";
  sx?: object;
}

const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  color,
  textAlign,
  sx,
  ...props
}) => (
  <MuiTypography variant={variant} color={color} sx={{ textAlign, ...sx }} {...props}>
    {children}
  </MuiTypography>
);

export default Typography;
