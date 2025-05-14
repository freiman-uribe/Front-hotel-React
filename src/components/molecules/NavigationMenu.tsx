import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useLocation } from "react-router-dom";

interface NavigationMenuProps {
  hotelId?: string;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ hotelId }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
    handleMenuClose();
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#2c2c2d" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Gestión de Hoteles
          </Typography>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => handleNavigation(`/hotel/${hotelId}`)}
              disabled={location.pathname === `/hotel/${hotelId}`}
            >
              Hotel
            </MenuItem>
            <MenuItem
              onClick={() => handleNavigation(`/accommodations/${hotelId}`)}
              disabled={location.pathname === `/accommodations/${hotelId}`}
            >
              Gestionar Acomodaciones
            </MenuItem>
            <MenuItem
              onClick={() => handleNavigation(`/room-types/${hotelId}`)}
              disabled={location.pathname === `/room-types/${hotelId}`}
            >
              Tipos de Habitaciones
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 100,
          left: 16,
          color: "#ffff",
          backgroundColor: "#000000ab",
        }}
      >
      <ArrowBackIcon />
      </IconButton>
    </>
  );
};

export default NavigationMenu;
