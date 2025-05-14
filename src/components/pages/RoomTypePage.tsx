import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../../config/axios";
import RoomTypeForm from "../organisms/RoomTypeForm";
import Swal from "sweetalert2";
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
    let hasError = false;
    try {
      const { data } = await Axios.get<RoomType[]>(
        `/tipo-habitaciones/${hotelId}`
      );
      
      if (data.length === 0) {
        
        hasError = false;
        return;
      } 
      hasError = true;
      setRoomTypes(data);
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

  const handleCreateOrUpdate = async (values: RoomTypeValues) => {
    let hasError = false;
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
          hasError = false;
          return;
        }
      }
      hasError = true;
      fetchRoomTypes();
      setEditingRoomType(null);
    }  catch (error) {
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
                  acomodaciones: editingRoomType.acomodaciones.map((id) => ({
                    id,
                  })),
                }
              : { nombre: "", acomodaciones: [] }
          }
          isEditing={!!editingRoomType}
          onCancel={handleCancelEdit}
        />
        <Typography variant="h5" sx={{ marginBottom: 5, color: "#ffff" }}>
          Tipos de Habitaciones
        </Typography>

        {roomTypes.length > 0 ? (
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
        ) : (
          <Typography variant="body1" color="gray">
            No hay tipos de habitaciones disponibles.
          </Typography>
        )}
      </div>
    </>
  );
};

export default RoomTypePage;
