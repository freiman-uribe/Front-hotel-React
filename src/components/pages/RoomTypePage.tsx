import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../../config/axios";
import RoomTypeForm from "../organisms/RoomTypeForm";
import RoomTypeTable from "../organisms/RoomTypeTable";
import NavigationMenu from "../molecules/NavigationMenu";
import Typography from "../atoms/Typography";

const RoomTypePage: React.FC = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [editingRoomType, setEditingRoomType] = useState<any>(null);
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const fetchRoomTypes = async () => {
    try {
      const { data } = await Axios.get(`/tipo-habitaciones/${hotelId}`);
      setRoomTypes(data);
    } catch (error) {
      console.error("Error al obtener los tipos de habitación:", error);
    }
  };

  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editingRoomType) {
        await Axios.put(
          `/tipo-habitaciones/${hotelId}/actualizar/${editingRoomType.id}`,
          values
        );
      } else {
        await Axios.post(`/tipo-habitaciones/${hotelId}`, values);
        const response = await Axios.get(`/tipo-habitaciones/${hotelId}`);
        if (response.data.length === 1) {
          navigate(`/hotel/${hotelId}`);
        }
      }
      fetchRoomTypes();
      setEditingRoomType(null);
    } catch (error) {
      console.error("Error al guardar el tipo de habitación:", error);
    }
  };

  const handleEdit = (id: number) => {
    const roomType = roomTypes.find((rt: any) => rt.id === id);
    setEditingRoomType(roomType);
  };

  const handleCancelEdit = () => {
    setEditingRoomType(null); // Limpia el estado de edición
  };

  const handleDelete = async (id: number) => {
    try {
      await Axios.delete(`/tipo-habitaciones/${hotelId}/eliminar/${id}`);
      fetchRoomTypes();
    } catch (error) {
      console.error("Error al eliminar el tipo de habitación:", error);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  return (
    <>
      <NavigationMenu hotelId={hotelId} />
      <div className="container">
        <RoomTypeForm
          onSubmit={handleCreateOrUpdate}
          initialValues={editingRoomType || { nombre: "", acomodaciones: [] }}
          isEditing={!!editingRoomType}
          onCancel={handleCancelEdit} // Pasa la función para manejar "Cancelar"
        />
        <Typography variant="h5" sx={{ marginBottom: 5, color: "#ffff" }}>
          Tipos de Habitaciones
        </Typography>
        <RoomTypeTable
          data={roomTypes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default RoomTypePage;
