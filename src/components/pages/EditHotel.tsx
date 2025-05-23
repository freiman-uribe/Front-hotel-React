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
import Alert from "@mui/material/Alert";
import Swal from "sweetalert2";

const TABLE_HEADERS = ["Cantidad", "Tipo", "Acomodación"];

interface Accommodation {
  id: number;
  nombre: string;
}

interface RoomType {
  id: number;
  nombre: string;
  hotel_id: number;
  created_at: string;
  updated_at: string;
  acomodaciones: {
    id: number;
    nombre: string;
    pivot: {
      tipo_habitacion_id: number;
      acomodacion_id: number;
    };
  }[];
}

interface Habitacion {
  id: number;
  cantidad: number;
  tipo_habitacion_id: number;
  hotel_id: number;
  acomodacion_id: number;
  created_at: string;
  updated_at: string;
  tipo_habitacion: RoomType;
  acomodacion: Accommodation;
}

interface Hotel {
  id: number;
  nombre: string;
  ciudad: string;
  direccion: string;
  nit: string;
  numero_de_habitaciones: number;
  created_at: string;
  updated_at: string;
}

const EditHotel: React.FC = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [editingHabitacion, setEditingHabitacion] = useState<Habitacion | null>(
    null
  );
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const fetchHotel = async () => {
    let roomTypes: RoomType[] = [];
    let hasError = false;
    try {
      const { data: hotelData } = await Axios.get<Hotel>(`/hoteles/${hotelId}`);
      const { data: habitaciones } = await Axios.get<Habitacion[]>(
        `/habitaciones/${hotelId}`
      );
      const { data } = await Axios.get<RoomType[]>(
        `/tipo-habitaciones/${hotelId}`
      );

      if(data.length === 0) {
        roomTypes = data;
        hasError = false;
      }
      
      hasError = true;
      setHotel(hotelData);
      setHabitaciones(habitaciones);

      const totalHabitacionesCreadas = habitaciones.length;
      const isLimitReached =
        totalHabitacionesCreadas >= hotelData.numero_de_habitaciones;
      setIsFormDisabled(isLimitReached);
      setShowAlert(isLimitReached);
    } catch (error) {
        if (!hasError) return;
        const err = error as { status?: number; message?: string };
        if (err.status === 404) {
          Swal.fire({
            icon: "warning",
            title: "No encontrado",
            text: err.message || "El recurso solicitado no existe.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.message || "Ocurrió un error al cargar los datos.",
          });
        }
    } finally {
      console.log('🚀 ~ fetchHotel ~ roomTypes:', roomTypes)
      if (!hasError && roomTypes.length === 0) {
        navigate(`/accommodations/${hotelId}`);
      }
    }
  };

  useEffect(() => {
    fetchHotel();
  }, []);

  const handleFormSubmit = async (values: {
    cantidad: string | number;
    tipo_habitacion_id: string | number;
    acomodacion_id: string | number;
  }) => {
    try {
      const data = {
        cantidad: Number(values.cantidad),
        tipo: Number(values.tipo_habitacion_id),
        acomodacion: Number(values.acomodacion_id),
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
      const err = error as { status?: number; message?: string };
      if (err.status === 404) {
        Swal.fire({
          icon: "warning",
          title: "No encontrado",
          text: err.message || "Ocurrió un error al cargar los datos.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Ocurrió un error al cargar los datos.",
        });
      }
    }
  };

  const handleEdit = (id: number) => {
    const habitacion = habitaciones.find((h) => h.id === id) || null;
    setEditingHabitacion(habitacion);
  };

  const handleCancelEdit = () => {
    setEditingHabitacion(null);
  };

  const deleteHabitacion = async (id: number) => {
    try {
      await Axios.delete(`/habitaciones/${hotelId}/eliminar/${id}`);
      fetchHotel();
    } catch (error) {
      const err = error as { status?: number; message?: string };
      if (err.status === 404) {
        Swal.fire({
          icon: "warning",
          title: "No encontrado",
          text: err.message || "El recurso solicitado no existe.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Ocurrió un error al eliminar los datos.",
        });
      }
    }
  };

  return (
    <>
      <NavigationMenu hotelId={hotelId} />
      <div className="container">
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
                    initialValues={
                      editingHabitacion
                        ? {
                            cantidad: editingHabitacion.cantidad.toString(),
                            tipo_habitacion_id:
                              editingHabitacion.tipo_habitacion_id,
                            acomodacion_id: editingHabitacion.acomodacion_id,
                          }
                        : undefined
                    }
                    disabled={isFormDisabled}
                    onCancel={handleCancelEdit}
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
