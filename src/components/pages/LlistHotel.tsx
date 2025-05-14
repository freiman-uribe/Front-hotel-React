import { useEffect, useState } from "react";
import Axios from "../../config/axios";
import HotelForm from "../organisms/HotelForm";
import Table from "../organisms/Table";
import Typography from "../atoms/Typography";

const columns = [
  "Nombre",
  "Dirección",
  "Ciudad",
  "NIT",
  "Número de Habitaciones",
  "Creado",
  "Actualizado",
  "Acciones",
];

interface Hotel {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  numero_de_habitaciones: number;
  created_at: string;
  updated_at: string;
  tipo_habitacions: string[];
}

interface HotelFormValues {
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  numero_de_habitaciones: number;
}

const ListHotel = () => {
  const [data, setData] = useState<Hotel[]>([]);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  const getHotels = async () => {
    try {
      const response = await Axios.get<Hotel[]>("/hoteles");
      setData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteHotel = async (hotelId: number) => {
    try {
      await Axios.delete(`/hoteles/eliminar/${hotelId}`);
      getHotels();
    } catch (error) {
      console.error("Error al eliminar el hotel:", error);
    }
  };

  const handleFormSubmit = async (values: HotelFormValues) => {
    try {
      if (editingHotel) {
        await Axios.put(`/hoteles/actualizar/${editingHotel.id}`, values);
      } else {
        await Axios.post("/hoteles", values);
      }
      getHotels();
      setEditingHotel(null); // Limpia el estado de edición después de guardar
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const handleEdit = (id: number) => {
    const hotel = data.find((h) => h.id === id) || null;
    setEditingHotel(hotel); // Establece el hotel en edición
  };

  const handleCancelEdit = () => {
    setEditingHotel(null); // Limpia el estado de edición
  };

  useEffect(() => {
    getHotels();
  }, []);

  return (
    <div className="container">
      <div style={{ marginBottom: "20px" }}>
        <Typography variant="h4" sx={{ marginBottom: 5, color: "#ffff" }}>
          {editingHotel ? "Editar Hotel" : "Registrar Hotel"}
        </Typography>
        <HotelForm
          onSubmit={handleFormSubmit}
          initialValues={
            editingHotel
              ? {
                  nombre: editingHotel.nombre,
                  direccion: editingHotel.direccion,
                  ciudad: editingHotel.ciudad,
                  nit: editingHotel.nit,
                  numero_de_habitaciones: editingHotel.numero_de_habitaciones.toString(),
                }
              : {
                  nombre: "",
                  direccion: "",
                  ciudad: "",
                  nit: "",
                  numero_de_habitaciones: "0",
                }
          }
          onCancel={handleCancelEdit} // Maneja la acción de cancelar
        />
      </div>

      <Typography variant="h4" sx={{ marginBottom: 5, color: "#ffff" }}>
        Lista de Hoteles
      </Typography>
      {data.length > 0 ? (
        <Table
          columns={columns}
          data={data}
          onDelete={deleteHotel}
          onEdit={handleEdit} // Pasa la función para manejar la edición
        />
      ) : (
        <Typography variant="body1" color="gray">
          No hay hoteles registrados
        </Typography>
      )}
    </div>
  );
};

export default ListHotel;
