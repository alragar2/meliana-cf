import { useState } from 'react';

const defaultInitialForm = {
    nombre: '',
    apellidos: '',
    cp: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
    lugarNacimiento: '',
    nacionalidad: '',
    poblacion: '',
    loteria: false,
    autorizacion: false,
    politicaPrivacidad: false,

    banco: {
        nombreBanco: '',
        iban: '',
    },

    padre: {
        nombre: '',
        apellidos: '',
        telefono: '',
        correo: '',
        dni: '',
        parentesco: '',
    },

    horarios: []
};

export default function useInscriptionForm(initialValues = {}) {
    const [formData, setFormData] = useState({ ...defaultInitialForm, ...initialValues });
    const [touchedFields, setTouchedFields] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFieldInvalid = (fieldName, fieldValue) => {
        if (fieldName === 'horarios') {
            return touchedFields[fieldName] && (!fieldValue || fieldValue.length === 0);
        }
        if (['categoria', 'demarcacion', 'talla', 'lateralidad'].includes(fieldName)) {
            return !fieldValue || fieldValue === '' || (typeof fieldValue === 'string' && fieldValue.trim() === '');
        }
        return touchedFields[fieldName] && (!fieldValue || fieldValue === '' || (typeof fieldValue === 'string' && fieldValue.trim() === ''));
    };

    const isFieldValid = (fieldName, fieldValue) => {
        if (fieldName === 'horarios') {
            return fieldValue && Array.isArray(fieldValue) && fieldValue.length > 0;
        }
        if (['categoria', 'demarcacion', 'talla', 'lateralidad'].includes(fieldName)) {
            return fieldValue && fieldValue !== '' && (typeof fieldValue === 'string' ? fieldValue.trim() !== '' : true);
        }
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

    const handleHorarioChange = (horarioId, isChecked) => {
        setFormData(prev => {
            const actuales = Array.isArray(prev.horarios) ? prev.horarios : [];
            const nuevosHorarios = isChecked ? [...actuales, horarioId] : actuales.filter(id => id !== horarioId);
            return { ...prev, horarios: nuevosHorarios };
        });

        setTouchedFields(prev => ({ ...prev, horarios: true }));
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
        handleHorarioChange,
        handleBlur,
        handleFocus,
        resetForm
    };
}
