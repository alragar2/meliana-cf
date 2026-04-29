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
    loteria: false,
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
        return touchedFields[fieldName] && (!fieldValue || fieldValue === '' || (typeof fieldValue === 'string' && fieldValue.trim() === ''));
    };

    const isFieldValid = (fieldName, fieldValue) => {
        return touchedFields[fieldName] && fieldValue && fieldValue !== '' && (typeof fieldValue === 'string' ? fieldValue.trim() !== '' : true);
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
        if (e.target.tagName && e.target.tagName.toLowerCase() === 'select') {
            setTouchedFields(prev => ({ ...prev, [name]: true }));
        }
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
