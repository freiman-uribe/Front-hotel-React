import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

// Definición del esquema de validación
const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .required("El nombre es obligatorio"),
  direccion: Yup.string().required("La dirección es obligatoria"),
  ciudad: Yup.string().required("La ciudad es obligatoria"),
  nit: Yup.string()
    .required("El NIT es obligatorio")
    .matches(/^\d+$/, "El NIT solo puede contener números")
    .max(15, "El NIT no puede exceder 15 dígitos"),
  numero_de_habitaciones: Yup.number()
    .integer("Debe ser un número entero")
    .min(1, "Debe ser al menos 1")
    .max(100, "No puede exceder 100 habitaciones")
    .required("El número de habitaciones es obligatorio"),
});

const defaultInitialValues = {
  nombre: "",
  direccion: "",
  ciudad: "",
  nit: "",
  numero_de_habitaciones: "",
};

interface HotelFormProps {
  onSubmit: (values: any) => void;
  initialValues?: typeof defaultInitialValues;
  onCancel?: () => void; // Nueva prop para manejar la acción de cancelar
}

const HotelForm: React.FC<HotelFormProps> = ({
  onSubmit,
  initialValues = defaultInitialValues,
  onCancel,
}) => {
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values);
      resetForm();
    },
  });

  const handleCancel = () => {
    formik.resetForm(); // Resetea el formulario a los valores predeterminados
    if (onCancel) onCancel(); // Llama a la función onCancel si está definida
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {formik.values.nombre ? "Editar Hotel" : "Registrar Hotel"}
        </Typography>
        <form onSubmit={formik.handleSubmit} className="form-container">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Input
                id="nombre"
                label="Nombre"
                type="text"
                value={formik.values.nombre}
                onChange={(value) => formik.setFieldValue("nombre", value)}
                placeholder="Nombre"
              />
              {formik.touched.nombre && formik.errors.nombre && (
                <span className="error-message">{formik.errors.nombre}</span>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Input
                id="direccion"
                type="text"
                label="Dirección"
                value={formik.values.direccion}
                onChange={(value) => formik.setFieldValue("direccion", value)}
                placeholder="Dirección"
              />
              {formik.touched.direccion && formik.errors.direccion && (
                <span className="error-message">{formik.errors.direccion}</span>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Input
                id="ciudad"
                type="text"
                label="Ciudad"
                value={formik.values.ciudad}
                onChange={(value) => formik.setFieldValue("ciudad", value)}
                placeholder="Ciudad"
              />
              {formik.touched.ciudad && formik.errors.ciudad && (
                <span className="error-message">{formik.errors.ciudad}</span>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Input
                id="nit"
                type="number"
                label="NIT"
                value={formik.values.nit}
                onChange={(value) => formik.setFieldValue("nit", value)}
                placeholder="NIT"
              />
              {formik.touched.nit && formik.errors.nit && (
                <span className="error-message">{formik.errors.nit}</span>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Input
                id="numero_de_habitaciones"
                type="number"
                label="Número de Habitaciones"
                value={formik.values.numero_de_habitaciones}
                onChange={(value) =>
                  formik.setFieldValue("numero_de_habitaciones", value)
                }
                placeholder="Número de habitaciones"
              />
              {formik.touched.numero_de_habitaciones &&
                formik.errors.numero_de_habitaciones && (
                  <span className="error-message">
                    {formik.errors.numero_de_habitaciones}
                  </span>
                )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box
                sx={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
              >
                <Button
                  label="Cancelar"
                  onClick={handleCancel} // Llama a la función handleCancel
                  color="error"
                />
                <Button
                  label={formik.isSubmitting ? "Enviando..." : "Enviar"}
                  onClick={formik.submitForm}
                  disabled={formik.isSubmitting}
                />
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default HotelForm;
