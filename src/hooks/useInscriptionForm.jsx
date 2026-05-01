import { useState } from 'react';

const defaultInitialForm = {
    nombreNino: '',
    apellidos: '',
    direccion: '',
    poblacion: '',
    dni: '',
    cp: '',
    fechaNacimiento: '',
    telefono: '',
    nacionalidad: '',
    lugarNacimiento: '',
    sexo: '',
    loteria: false,
    beneficios: false,
    hermanosEnClub: false,
    // Datos de los Padres/Tutores
    nombrePadre: '',
    apellidosPadre: '',
    telefonoPadre: '',
    correoPadre: '',
    dniPadre: '',
    parentesco: '',
    // Datos Bancarios
    nombreBanco: '',
    iban: ''
};

export default function useInscriptionForm(initialValues = {}) {
    const [formData, setFormData] = useState({ ...defaultInitialForm, ...initialValues });
    const [touchedFields, setTouchedFields] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFieldInvalid = (fieldName, fieldValue) => {
        // Para campos requeridos, verificar si está vacío
        const requiredFields = ['sexo']; // Agregar otros campos requeridos aquí
        if (requiredFields.includes(fieldName)) {
            return touchedFields[fieldName] && (!fieldValue || fieldValue === '' || (typeof fieldValue === 'string' && fieldValue.trim() === ''));
        }
        return false;
    };

    const isFieldValid = (fieldName, fieldValue) => {
        const requiredFields = ['sexo'];
        if (requiredFields.includes(fieldName)) {
            return touchedFields[fieldName] && fieldValue && fieldValue !== '' && (typeof fieldValue === 'string' ? fieldValue.trim() !== '' : true);
        }
        return false;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        setTouchedFields(prev => ({
            ...prev,
            [name]: true
        }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouchedFields(prev => ({ ...prev, [name]: true }));
    };

    const handleFocus = (e) => {
        const { name } = e.target;
        // No marcar automáticamente como touched para selects
        // Solo para otros tipos de input si es necesario
    };

    const resetForm = () => {
        setFormData({ ...defaultInitialForm });
        setTouchedFields({});
    };

    return {
        formData,
        setFormData,
        touchedFields,
        isSubmitting,
        setIsSubmitting,
        isFieldInvalid,
        isFieldValid,
        handleInputChange,
        handleBlur,
        handleFocus,
        resetForm
    };
}
