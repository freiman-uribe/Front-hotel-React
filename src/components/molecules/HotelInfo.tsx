import React from "react";
import Typography from "../atoms/Typography";
import Grid from "@mui/material/Grid";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import UpdateIcon from "@mui/icons-material/Update";

interface HotelInfoProps {
  hotel: {
    nombre: string;
    ciudad: string;
    direccion: string;
    nit: string;
    numero_de_habitaciones: number;
    created_at: string;
    updated_at: string;
  };
}

const HotelInfo: React.FC<HotelInfoProps> = ({ hotel }) => {

return (
  <div>
    <Typography variant="h5" textAlign="center">
      {hotel.nombre}
    </Typography>
    <Grid 
      container 
      spacing={2} 
      sx={{ 
      marginTop: 2, 
      marginInline: { xs: 2, sm: 15 } 
      }}
    >
      <Grid size={{ xs: 12 }}>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          <LocationCityIcon fontSize="small" sx={{ marginRight: 1 }} />
          <strong>Ciudad:</strong> {hotel.ciudad}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          <HomeIcon fontSize="small" sx={{ marginRight: 1 }} />
          <strong>Dirección:</strong> {hotel.direccion}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          <BusinessIcon fontSize="small" sx={{ marginRight: 1 }} />
          <strong>NIT:</strong> {hotel.nit}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          <MeetingRoomIcon fontSize="small" sx={{ marginRight: 1 }} />
          <strong>Número de Habitaciones:</strong>{" "}
          {hotel.numero_de_habitaciones}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          <CalendarTodayIcon fontSize="small" sx={{ marginRight: 1 }} />
          <strong>Creado:</strong>{" "}
          {new Date(hotel.created_at).toLocaleDateString()}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          <UpdateIcon fontSize="small" sx={{ marginRight: 1 }} />
          <strong>Actualizado:</strong>{" "}
          {new Date(hotel.updated_at).toLocaleDateString()}
        </Typography>
      </Grid>
    </Grid>
  </div>
);};

export default HotelInfo;
