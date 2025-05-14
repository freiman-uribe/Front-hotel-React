import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../../config/axios";
import AccommodationForm from "../organisms/AccommodationForm";
import AccommodationTable from "../organisms/AccommodationTable";
import NavigationMenu from "../molecules/NavigationMenu"; // Adjust the path as needed
import Typography from "../atoms/Typography";

interface Accommodation {
  id: number;
  nombre: string;
  hotel_id: number;
  created_at: string;
  updated_at: string;
}

const AccommodationPage: React.FC = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [editingAccommodation, setEditingAccommodation] =
    useState<Accommodation | null>(null);

  const fetchAccommodations = async () => {
    try {
      const { data } = await Axios.get<Accommodation[]>(
        `/acomodaciones/${hotelId}`
      );
      setAccommodations(data);
    } catch (error) {
      console.error("Error al obtener las acomodaciones:", error);
    }
  };

  const handleCreateOrUpdate = async (values: { nombre: string }) => {
    try {
      if (editingAccommodation) {
        await Axios.put(
          `/acomodaciones/${hotelId}/actualizar/${editingAccommodation.id}`,
          { ...editingAccommodation, ...values }
        );
      } else {
        await Axios.post(`/acomodaciones/${hotelId}`, { nombre: values.nombre });
      }

      const response = await Axios.get(`/tipo-habitaciones/${hotelId}`);
      if (response.data.length === 0) {
        navigate(`/room-types/${hotelId}`);
      }
      fetchAccommodations();
      setEditingAccommodation(null);
    } catch (error) {
      console.error("Error al guardar la acomodación:", error);
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
      console.error("Error al eliminar la acomodación:", error);
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
