import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Axios from "../../config/axios";
import Input from "../atoms/Input";
import { useParams } from "react-router-dom";
import Button from "../atoms/Button";
import SelectAtom from "../atoms/Select";
import Typography from "../atoms/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { colors } from "@mui/material";

interface RoomTypeFormProps {
  onSubmit: (values: any) => void;
  initialValues?: { nombre: string; acomodaciones: number[] };
  isEditing?: boolean;
  onCancel?: () => void;
}

const RoomTypeForm: React.FC<RoomTypeFormProps> = ({
  onSubmit,
  initialValues = { nombre: "", acomodaciones: [] },
  isEditing = false,
  onCancel,
}) => {
  const { hotelId: id } = useParams();
  const [accommodations, setAccommodations] = useState([]);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const { data } = await Axios.get(`/acomodaciones/${id}`);
        setAccommodations(data);
      } catch (error) {
        console.error("Error al obtener las acomodaciones:", error);
      }
    };
    fetchAccommodations();
  }, [id]);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .required("El nombre es obligatorio")
      .min(2, "Debe tener al menos 2 caracteres"),
    acomodaciones: Yup.array()
      .of(Yup.number())
      .required("Debe seleccionar al menos una acomodación"),
  });

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      acomodaciones: initialValues.acomodaciones.map((a: any) => a.id),
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values); // Llama a la función onSubmit
      resetForm(); // Resetea el formulario después de guardar
    },
  });

  const handleCancel = () => {
    formik.resetForm(); // Resetea el formulario
    if (onCancel) onCancel(); // Llama a la función onCancel si está definida
  };

  return (
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
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 5 }}>
          {isEditing ? "Editar Tipo de Habitación" : "Crear Tipo de Habitación"}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Input
            id="nombre"
            label="Nombre"
            type="text"
            value={formik.values.nombre}
            onChange={(value) => formik.setFieldValue("nombre", value)}
            placeholder="Nombre del tipo de habitación"
          />
          {formik.touched.nombre && formik.errors.nombre && (
            <span className="error-message">{formik.errors.nombre}</span>
          )}
          <SelectAtom
            label="Acomodaciones"
            options={accommodations.map((a: any) => ({
              value: a.id,
              label: a.nombre,
            }))}
            value={formik.values.acomodaciones}
            onChange={(value) => formik.setFieldValue("acomodaciones", value)}
            multiple
          />
          {formik.touched.acomodaciones && formik.errors.acomodaciones && (
            <span className="error-message">{formik.errors.acomodaciones}</span>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <Button
              label="Cancelar"
              onClick={handleCancel} // Llama a la función handleCancel
              color="error"
            />
            <Button
              label="Enviar"
              onClick={formik.submitForm}
              disabled={formik.isSubmitting}
            />
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoomTypeForm;
