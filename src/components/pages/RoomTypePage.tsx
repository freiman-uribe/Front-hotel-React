import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../../config/axios";
import RoomTypeForm from "../organisms/RoomTypeForm";
import RoomTypeTable from "../organisms/RoomTypeTable";
import NavigationMenu from "../molecules/NavigationMenu";
import Typography from "../atoms/Typography";

interface Accommodation {
  id: number;
  nombre: string;
  pivot: {
    tipo_habitacion_id: number;
    acomodacion_id: number;
  };
}

interface RoomType {
  id: number;
  nombre: string;
  hotel_id: number;
  created_at: string;
  updated_at: string;
  acomodaciones: Accommodation[];
}

interface RoomTypeValues {
  id?: number;
  nombre: string;
  acomodaciones: number[];
}

const RoomTypePage: React.FC = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [editingRoomType, setEditingRoomType] = useState<RoomTypeValues | null>(
    null
  );
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const fetchRoomTypes = async () => {
    try {
      const { data } = await Axios.get<RoomType[]>(
        `/tipo-habitaciones/${hotelId}`
      );
      setRoomTypes(data);
    } catch (error) {
      console.error("Error al obtener los tipos de habitación:", error);
    }
  };

  const handleCreateOrUpdate = async (values: RoomTypeValues) => {
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
    const roomType = roomTypes.find((rt) => rt.id === id);
    if (roomType) {
      setEditingRoomType({
        id: roomType.id,
        nombre: roomType.nombre,
        acomodaciones: roomType.acomodaciones.map((a) => a.id),
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingRoomType(null);
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
          initialValues={
            editingRoomType
              ? {
                  ...editingRoomType,
                  acomodaciones: editingRoomType.acomodaciones.map((id) => ({ id })),
                }
              : { nombre: "", acomodaciones: [] }
          }
          isEditing={!!editingRoomType}
          onCancel={handleCancelEdit}
        />
        <Typography variant="h5" sx={{ marginBottom: 5, color: "#ffff" }}>
          Tipos de Habitaciones
        </Typography>
        <RoomTypeTable
          data={roomTypes.map((rt) => ({
            id: rt.id,
            nombre: rt.nombre,
            acomodaciones: rt.acomodaciones.map((a) => ({
              id: a.id,
              nombre: a.nombre,
            })),
          }))}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default RoomTypePage;
