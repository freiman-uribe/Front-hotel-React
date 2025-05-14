import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Axios from "../../config/axios";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import SelectAtom from "../atoms/Select";

interface EditFormProps {
  onSubmit: (values: {
    cantidad: string;
    tipo_habitacion_id: string | number;
    acomodacion_id: string | number;
  }) => void;
  initialValues?: {
    cantidad: string;
    tipo_habitacion_id: string | number;
    acomodacion_id: string | number;
  };
  disabled?: boolean;
  onCancel?: () => void;
}

const EditForm: React.FC<EditFormProps> = ({
  onSubmit,
  initialValues = { cantidad: "", tipo_habitacion_id: "", acomodacion_id: "" },
  disabled = false,
  onCancel,
}) => {
  const { hotelId } = useParams();
  const [roomTypes, setRoomTypes] = useState([]);
  const [accommodationOptions, setAccommodationOptions] = useState([]);

  const fetchRoomTypes = async () => {
    try {
      const { data } = await Axios.get(`/tipo-habitaciones/${hotelId}`);
      setRoomTypes(data);
    } catch (error) {
      console.error("Error al obtener los tipos de habitación:", error);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, [hotelId]);

  const handleRoomTypeChange = (selectedRoomTypeId: string | number) => {
    const selectedRoomType = roomTypes.find(
      (roomType: any) => roomType.id === selectedRoomTypeId
    );
    if (selectedRoomType) {
      const accommodations = selectedRoomType.acomodaciones.map(
        (acomodacion: any) => ({
          value: acomodacion.id,
          label: acomodacion.nombre,
        })
      );
      setAccommodationOptions(accommodations);
    } else {
      setAccommodationOptions([]);
    }
  };

  useEffect(() => {
    if (initialValues.tipo_habitacion_id) {
      handleRoomTypeChange(initialValues.tipo_habitacion_id);
    }
  }, [initialValues.tipo_habitacion_id, roomTypes]);

  const handleCancel = () => {
    formik.resetForm();
    if (onCancel) onCancel();
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      cantidad: Yup.number()
        .required("La cantidad es obligatoria")
        .min(1, "Debe ser al menos 1"),
      tipo_habitacion_id: Yup.string().required(
        "El tipo de habitación es obligatorio"
      ),
      acomodacion_id: Yup.string().required("La acomodación es obligatoria"),
    }),
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values);
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-group">
        <Input
          id="cantidad"
          label="Cantidad"
          type="text"
          value={formik.values.cantidad}
          onChange={(value) => formik.setFieldValue("cantidad", value)}
          placeholder="Cantidad"
          disabled={disabled}
        />
        {formik.touched.cantidad && formik.errors.cantidad && (
          <span className="error-message">{formik.errors.cantidad}</span>
        )}
      </div>

      <div className="form-group">
        <SelectAtom
          label="Tipo de Habitación"
          options={roomTypes.map((rt: any) => ({
            value: rt.id,
            label: rt.nombre,
          }))}
          value={formik.values.tipo_habitacion_id}
          onChange={(value) => {
            formik.setFieldValue("tipo_habitacion_id", value);
            handleRoomTypeChange(value);
          }}
          disabled={disabled || roomTypes.length === 0}
        />
        {formik.touched.tipo_habitacion_id &&
          formik.errors.tipo_habitacion_id && (
            <span className="error-message">
              {formik.errors.tipo_habitacion_id}
            </span>
          )}
      </div>

      <div className="form-group">
        <SelectAtom
          label="Acomodación"
          options={accommodationOptions}
          value={formik.values.acomodacion_id}
          onChange={(value) => formik.setFieldValue("acomodacion_id", value)}
          disabled={disabled || accommodationOptions.length === 0}
        />
        {formik.touched.acomodacion_id && formik.errors.acomodacion_id && (
          <span className="error-message">{formik.errors.acomodacion_id}</span>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <Button
          label="Cancelar"
          onClick={handleCancel} // Llama a la función handleCancel
          color="error"
        />
        <Button
          label="Guardar"
          onClick={formik.submitForm}
          disabled={formik.isSubmitting || disabled}
        />
      </div>
    </form>
  );
};

export default EditForm;
