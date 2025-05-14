import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../../config/axios";
import NavigationMenu from "../molecules/NavigationMenu";
import HotelInfo from "../molecules/HotelInfo";
import EditForm from "../organisms/EditForm";
import Typography from "../atoms/Typography";
import EditTable from "../organisms/EditTable";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Alert from "@mui/material/Alert";

const TABLE_HEADERS = ["Cantidad", "Tipo", "Acomodación"];

const EditHotel: React.FC = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<any>([]);
  const [habitaciones, setHabitaciones] = useState<any>([]);
  const [editingHabitacion, setEditingHabitacion] = useState<any>(null);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const fetchHotel = async () => {
    try {
      const { data } = await Axios.get(`/hoteles/${hotelId}`);
      const { data: habitaciones } = await Axios.get(
        `/habitaciones/${hotelId}`
      );
      const { data: roomTypes } = await Axios.get(
        `/tipo-habitaciones/${hotelId}`
      );
      setHotel(data);
      setHabitaciones(habitaciones);

      const totalHabitacionesCreadas = habitaciones.length;
      const isLimitReached =
        totalHabitacionesCreadas >= data.numero_de_habitaciones;
      setIsFormDisabled(isLimitReached);
      setShowAlert(isLimitReached);
      if (roomTypes.length === 0) {
        navigate(`/accommodations/${hotelId}`);
        return;
      }
    } catch (error) {
      console.error("Error al obtener el hotel:", error);
    }
  };

  useEffect(() => {
    fetchHotel();
  }, []);

  const handleFormSubmit = async (values: any) => {
    try {
      const data = {
        cantidad: values.cantidad,
        tipo: values.tipo_habitacion_id,
        acomodacion: values.acomodacion_id,
      };
      if (editingHabitacion) {
        await Axios.put(
          `/habitaciones/${hotelId}/actualizar/${editingHabitacion.id}`,
          data
        );
      } else {
        await Axios.post(`/habitaciones/${hotelId}`, data);
      }
      fetchHotel();
      setEditingHabitacion(null);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const handleEdit = (id: number) => {
    const habitacion = habitaciones.find((h: any) => h.id === id);
    setEditingHabitacion(habitacion);
  };

  const handleCancelEdit = () => {
    setEditingHabitacion(null); // Limpia el estado de edición
  };

  const deleteHabitacion = async (id: number) => {
    try {
      await Axios.delete(`/habitaciones/${hotelId}/eliminar/${id}`);
      fetchHotel();
    } catch (error) {
      console.error("Error al eliminar la habitación:", error);
    }
  };

  return (
    <>
      <NavigationMenu hotelId={hotelId} />
      <div className="container">
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
        {showAlert && (
          <Alert severity="warning" sx={{ marginBottom: 2 }}>
            Ya se ha alcanzado el número máximo de habitaciones permitidas para
            este hotel.
          </Alert>
        )}
        {hotel && (
          <>
            <Card
              sx={{
                maxWidth: 1200,
                marginBottom: 4,
                paddingTop: 5,
                paddingBottom: 5,
                paddingInline: 3,
                boxShadow: 8,
                backgroundColor: "#ffffffab",
              }}
            >
              <Typography variant="h5" sx={{ marginBottom: 5 }}>
                {editingHabitacion ? "Editar Habitación" : "Crear Habitación"}
              </Typography>
              <Grid container spacing={2}>
                <Grid
                  size={{ xs: 12, md: 6 }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  <HotelInfo hotel={hotel} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <EditForm
                    onSubmit={handleFormSubmit}
                    initialValues={editingHabitacion || undefined}
                    disabled={isFormDisabled}
                    onCancel={handleCancelEdit} // Pasa la función para manejar "Cancelar"
                  />
                </Grid>
              </Grid>
            </Card>

            <Typography variant="h5" sx={{ marginBottom: 5, color: "#ffff" }}>
              Habitaciones
            </Typography>
            {habitaciones.length > 0 ? (
              <EditTable
                columns={TABLE_HEADERS}
                data={habitaciones}
                onDelete={deleteHabitacion}
                onEdit={handleEdit}
              />
            ) : (
              <Typography variant="body1" color="gray">
                No hay habitaciones registradas
              </Typography>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default EditHotel;
