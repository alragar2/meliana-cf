import React, { useState } from 'react';
import { inscriptionService } from '../../firebase/inscriptionService';
import { horariosDisponibles } from '../../utils/horariosConfig';
import FormField from './FormField';
import useInscriptionForm from '../../hooks/useInscriptionForm';

const InscriptionForm = ({ isVisible, onClose }) => {

    const {
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
    } = useInscriptionForm();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validar datos antes de enviar
            const validation = inscriptionService.validateInscriptionData(formData);

            if (!validation.isValid) {
                alert(validation.message);
                setIsSubmitting(false);
                return;
            }

            // Enviar datos a Firebase
            const result = await inscriptionService.createInscription(formData);

            if (result.success) {
                alert('¡Inscripción enviada correctamente! Nos pondremos en contacto contigo pronto.');

                // Reset form
                resetForm();

                // Cerrar el formulario
                onClose();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error al enviar inscripción:', error);
            alert('Error inesperado al enviar la inscripción. Por favor, inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className="registration-form-container">
            <form onSubmit={handleSubmit} className="registration-form">
                <h3>Formulario de Inscripción</h3>

                <div className="form-section">
                    <h4>Datos del Niño/a</h4>
                    <div className="form-row">
                        <FormField
                            label="Nombre *"
                            name="nombreNino"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                        <FormField
                            label="Apellidos *"
                            name="apellidos"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                    </div>

                    <div className="form-row">
                        <FormField
                            label="Dirección *"
                            name="direccion"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                        <FormField
                            label="Población *"
                            name="poblacion"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                    </div>

                    <div className="form-row">
                        <FormField
                            label="DNI/NIE *"
                            name="dni"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                        <FormField
                            label="Codigo Postal *"
                            name="cp"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                    </div>

                    <div className="form-row">
                        <FormField
                            label="Fecha de Nacimiento *"
                            name="fechaNacimiento"
                            type="date"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                        <FormField
                            label="Teléfono contacto *"
                            name="telefono"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                    </div>

                    <div className="form-row">
                        <FormField
                            label="Nacionalidad *"
                            name="nacionalidad"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                        <FormField
                            label="Lugar de Nacimiento *"
                            name="lugarNacimiento"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h4>Datos de los Padres/Tutores</h4>
                    <div className="form-row">
                        <FormField
                            label="Nombre *"
                            name="nombrePadre"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                        <FormField
                            label="Apellidos *"
                            name="apellidosPadre"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                    </div>

                    <div className="form-row">
                        <FormField
                            label="Teléfono *"
                            name="telefonoPadre"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                        <FormField
                            label="Correo electrónico *"
                            name="correoPadre"
                            type="email"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                    </div>

                    <div className="form-row">
                        <FormField
                            label="DNI/NIE *"
                            name="dniPadre"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                        <FormField
                            label="Parentesco *"
                            name="parentesco"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h4>Datos Bancarios y Lotería</h4>
                    <div className="form-row">
                        <FormField
                            label="Nombre de la entidad *"
                            name="nombreBanco"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                        <FormField
                            label="IBAN *"
                            name="iban"
                            type="text"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={isSubmitting}
                    >
                        <i className={isSubmitting ? "fas fa-spinner fa-spin" : "fas fa-paper-plane"}></i>
                        {isSubmitting ? 'Enviando...' : 'Enviar Inscripción'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-cancel"
                        disabled={isSubmitting}
                    >
                        <i className="fas fa-times"></i>
                        Cancelar
                    </button>
                </div>


            </form>
        </div>
    );
};

export default InscriptionForm;
