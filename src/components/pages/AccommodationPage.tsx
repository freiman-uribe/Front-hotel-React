import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../../config/axios";
import AccommodationForm from "../organisms/AccommodationForm";
import AccommodationTable from "../organisms/AccommodationTable";
import NavigationMenu from "../molecules/NavigationMenu"; // Adjust the path as needed
import Typography from "../atoms/Typography";

const AccommodationPage: React.FC = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState([]);
  const [editingAccommodation, setEditingAccommodation] = useState<any>(null);

  const fetchAccommodations = async () => {
    try {
      const { data } = await Axios.get(`/acomodaciones/${hotelId}`);
      setAccommodations(data);
    } catch (error) {
      console.error("Error al obtener las acomodaciones:", error);
    }
  };

  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editingAccommodation) {
        await Axios.put(
          `/acomodaciones/${hotelId}/actualizar/${editingAccommodation.id}`,
          values
        );
      } else {
        await Axios.post(`/acomodaciones/${hotelId}`, values);
      }

      const response = await Axios.get(`/tipo-habitaciones/${hotelId}`);
      if (response.data.length === 0) {
        navigate(`/room-types/${hotelId}`); // Redirige si no hay tipos de habitación
      }
      fetchAccommodations();
      setEditingAccommodation(null);
    } catch (error) {
      console.error("Error al guardar la acomodación:", error);
    }
  };

  const handleEdit = (id: number) => {
    const accommodation = accommodations.find((a: any) => a.id === id);
    setEditingAccommodation(accommodation);
  };

  const handleCancelEdit = () => {
    setEditingAccommodation(null); // Limpia el estado de edición
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
          isEditing={!!editingAccommodation}
          onCancel={handleCancelEdit} // Pasa la función para manejar "Cancelar"
        />
        <Typography variant="h5" sx={{ marginBottom: 5, color: "#ffff" }}>
          Habitaciones
        </Typography>
        <AccommodationTable
          data={accommodations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default AccommodationPage;
