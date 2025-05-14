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

const ListHotel = () => {
  const [data, setData] = useState([]);
  const [editingHotel, setEditingHotel] = useState<any>(null); // Estado para manejar la edición

  const gethotel = async () => {
    try {
      const response = await Axios.get("/hoteles");
      setData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (editingHotel) {
        await Axios.put(`/hoteles/actualizar/${editingHotel.id}`, values);
      } else {
        await Axios.post("/hoteles", values);
      }
      gethotel();
      setEditingHotel(null);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const handleEdit = (id: number) => {
    const hotel = data.find((h: any) => h.id === id);
    setEditingHotel(hotel);
  };

  const handleCancelEdit = () => {
    setEditingHotel(null);
  };

  const deleteHotel = async (hotelId: number) => {
    try {
      await Axios.delete(`/hoteles/eliminar/${hotelId}`);
      gethotel();
    } catch (error) {
      console.error("Error al eliminar el hotel:", error);
    }
  };

  useEffect(() => {
    gethotel();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / 10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <div style={{ marginBottom: "20px" }}>
        <Typography variant="h4" sx={{ marginBottom: 5, color: "#ffff" }}>
          {editingHotel ? "Editar Hotel" : "Registrar Hotel"}
        </Typography>
        <HotelForm
          onSubmit={handleFormSubmit}
          initialValues={editingHotel || undefined} // Pasa los valores iniciales si está en edición
          onCancel={handleCancelEdit} // Maneja la acción de cancelar
        />
      </div>

      <Typography variant="h4" sx={{ marginBottom: 5, color: "#ffff" }}>
        Lista de hoteles
      </Typography>
      {data.length > 0 ? (
        <Table
          columns={columns}
          data={data}
          onDelete={deleteHotel}
          onEdit={handleEdit} // Pasa la función de edición
          onPageChange={handlePageChange}
          currentPage={currentPage}
          totalPages={totalPages}
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
