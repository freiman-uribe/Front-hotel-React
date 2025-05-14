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
  onSubmit: (values: typeof defaultInitialValues) => void;
  initialValues?: typeof defaultInitialValues;
  onCancel?: () => void;
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
    formik.resetForm();
    if (onCancel) onCancel();
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
                label="Nombre*"
                type="text"
                value={formik.values.nombre}
                onChange={(value) => formik.setFieldValue("nombre", value)}
                placeholder="Nombre"
                error={formik.touched.nombre && !!formik.errors.nombre}
                helperText={formik.touched.nombre ? formik.errors.nombre : ""}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Input
                id="direccion"
                type="text"
                label="Dirección*"
                value={formik.values.direccion}
                onChange={(value) => formik.setFieldValue("direccion", value)}
                placeholder="Dirección"
                error={formik.touched.direccion && !!formik.errors.direccion}
                helperText={
                  formik.touched.direccion ? formik.errors.direccion : ""
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Input
                id="ciudad"
                type="text"
                label="Ciudad*"
                value={formik.values.ciudad}
                onChange={(value) => formik.setFieldValue("ciudad", value)}
                placeholder="Ciudad"
                error={formik.touched.ciudad && !!formik.errors.ciudad}
                helperText={formik.touched.ciudad ? formik.errors.ciudad : ""}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Input
                id="nit"
                type="number"
                label="NIT*"
                value={formik.values.nit}
                onChange={(value) => formik.setFieldValue("nit", value)}
                placeholder="NIT"
                error={formik.touched.nit && !!formik.errors.nit}
                helperText={formik.touched.nit ? formik.errors.nit : ""}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Input
                id="numero_de_habitaciones"
                type="number"
                label="Número de Habitaciones*"
                value={formik.values.numero_de_habitaciones}
                onChange={(value) =>
                  formik.setFieldValue("numero_de_habitaciones", value)
                }
                placeholder="Número de habitaciones"
                error={
                  formik.touched.numero_de_habitaciones &&
                  !!formik.errors.numero_de_habitaciones
                }
                helperText={
                  formik.touched.numero_de_habitaciones
                    ? formik.errors.numero_de_habitaciones
                    : ""
                }
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box
                sx={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
              >
                <Button label="Cancelar" onClick={handleCancel} color="error" />
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
