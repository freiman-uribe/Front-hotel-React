import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Axios from "../../config/axios";
import AccommodationForm from "../organisms/AccommodationForm";
import AccommodationTable from "../organisms/AccommodationTable";
import NavigationMenu from "../molecules/NavigationMenu";
import Typography from "../atoms/Typography";

interface Accommodation {
  id: number;
  nombre: string;
  hotel_id: number;
  created_at: string;
  updated_at: string;
}

interface TipoHabitacion {
  id: number;
  nombre: string;
  capacidad: number;
}

const AccommodationPage: React.FC = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [editingAccommodation, setEditingAccommodation] =
    useState<Accommodation | null>(null);

  const fetchAccommodations = async () => {
    let hasError = false;
    try {
      const { data } = await Axios.get<Accommodation[]>(
        `/acomodaciones/${hotelId}`
      );
      if (data.length === 0) {
        hasError = false;
      }
      setAccommodations(data);
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
    }
  };

  const handleCreateOrUpdate = async (values: { nombre: string }) => {
    let tipoHabitaciones: TipoHabitacion[] = [];
    let hasError = false;
    try {
      if (editingAccommodation) {
        await Axios.put(
          `/acomodaciones/${hotelId}/actualizar/${editingAccommodation.id}`,
          { ...editingAccommodation, ...values }
        );
      } else {
        await Axios.post(`/acomodaciones/${hotelId}`, {
          nombre: values.nombre,
        });
        hasError = false;
      }
      const { data } = await Axios.get(`/tipo-habitaciones/${hotelId}`);
      if (data.length === 0) {
        tipoHabitaciones = data;
        hasError= false;
      }
      
      hasError = true;
      fetchAccommodations();
      setEditingAccommodation(null);
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
      if (!hasError && tipoHabitaciones.length === 0) {
        navigate(`/room-types/${hotelId}`);
      }
    }
  };

  const handleEdit = (id: number) => {
    const accommodation = accommodations.find((a) => a.id === id) || null;
    setEditingAccommodation(accommodation);
  };

  const handleCancelEdit = () => {
    setEditingAccommodation(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await Axios.delete(`/acomodaciones/${hotelId}/eliminar/${id}`);
      fetchAccommodations();
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

  useEffect(() => {
    fetchAccommodations();
  }, []);

  return (
    <>
      <NavigationMenu hotelId={hotelId} />
      <div className="container">
        <AccommodationForm
          onSubmit={handleCreateOrUpdate}
          initialValues={editingAccommodation || { nombre: "" }}
          onCancel={handleCancelEdit}
        />
        <Typography variant="h5" sx={{ marginBottom: 5, color: "#ffff" }}>
          Habitaciones
        </Typography>
        {accommodations.length > 0 ? (
          <AccommodationTable
            data={accommodations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <Typography variant="body1" color="gray">
            No hay acomodaciones registradas.
          </Typography>
        )}
      </div>
    </>
  );
};

export default AccommodationPage;
