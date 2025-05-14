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

interface HotelFormValues {
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  numeroHabitaciones: number;
}

const ListHotel = () => {

    const [data, setData] = useState([]);

    const gethotel = async () => {
      try {
        const response = await Axios.get("/hoteles");
        setData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const deleteHotel = async (hotelId: number) => {
      try {
        await Axios.delete(`/hoteles/eliminar/${hotelId}`);
        gethotel();
      } catch (error) {
        console.error("Error al eliminar el hotel:", error);
      }
    };

    const handleFormSubmit = async (values: HotelFormValues) => {
      try {
        await Axios.post("/hoteles", values);
        gethotel();
      } catch (error) {
        console.error("Error al enviar los datos:", error);
      }
    };
      useEffect(() => {
        gethotel();
      }, []);

  return (
    <div className="container">
      <div style={{ marginBottom: "20px" }}>
        <Typography variant="h4" sx={{ marginBottom: 5, color: "#ffff" }}>
          Registrar de hotel
        </Typography>
        <HotelForm onSubmit={handleFormSubmit} />
      </div>

      <Typography variant="h4" sx={{ marginBottom: 5, color: "#ffff" }}>
        lista de hoteles
      </Typography>
      {data.length > 0 ? (
        <Table
          columns={columns}
          data={data}
          onDelete={deleteHotel}
          onEdit={(id: number) => console.log(`Edit hotel with ID: ${id}`)}
        />
      ) : (
        <Typography variant="body1" color="gray">
          No hay hoteles registrados
        </Typography>
      )}
    </div>
  );
}
export default ListHotel;

