import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Typography from "../atoms/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

interface AccommodationFormProps {
  onSubmit: (values: { nombre: string }) => void;
  initialValues?: { nombre: string };
  onCancel?: () => void;
}

const AccommodationForm: React.FC<AccommodationFormProps> = ({
  onSubmit,
  initialValues = { nombre: "" },
  onCancel,
}) => {
  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .required("El nombre es obligatorio")
      .min(2, "Debe tener al menos 2 caracteres"),
  });

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
          {formik.values.nombre ? "Editar Acomodación" : "Crear Acomodación"}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Input
            id="nombre"
            label="Nombre*"
            type="text"
            value={formik.values.nombre}
            onChange={(value) => formik.setFieldValue("nombre", value)}
            placeholder="Nombre de la acomodación"
            error={formik.touched.nombre && !!formik.errors.nombre}
            helperText={formik.touched.nombre ? formik.errors.nombre : ""}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <Button label="Cancelar" onClick={handleCancel} color="error" />
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

export default AccommodationForm;
