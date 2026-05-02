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

                    <div className="form-row single-column">
                        <div className="form-group">
                            <label htmlFor="sexo">Sexo *</label>
                            <select
                                id="sexo"
                                name="sexo"
                                value={formData.sexo}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                onFocus={handleFocus}
                                className={`
                                    ${touchedFields.sexo ? 'touched' : ''} 
                                    ${isFieldInvalid('sexo', formData.sexo) ? 'invalid' : ''} 
                                    ${isFieldValid('sexo', formData.sexo) ? 'valid' : ''}
                                `.trim()}
                            >
                                <option value="">Seleccionar</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                            </select>
                            {isFieldInvalid('sexo', formData.sexo) && <span className="error-message">Este campo es obligatorio</span>}
                        </div>
                    </div>

                    <div className="form-row single-column">
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="hermanosEnClub"
                                    checked={formData.hermanosEnClub}
                                    onChange={handleInputChange}
                                />
                                ¿Tiene hermanos en el club?
                            </label>
                        </div>
                    </div>

                    <div className="form-row checkbox-row">
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="loteria"
                                    checked={formData.loteria}
                                    onChange={handleInputChange}
                                />
                                ¿Quiere participar en la lotería de Navidad?
                            </label>
                        </div>
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
                        <div className="form-row single-column">
                        <div className="form-group">
                            <label htmlFor="parentesco">Parentesco *</label>
                            <select
                                id="parentesco"
                                name="parentesco"
                                value={formData.parentesco}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                onFocus={handleFocus}
                                className={`
                                    ${touchedFields.parentesco ? 'touched' : ''} 
                                    ${isFieldInvalid('parentesco', formData.parentesco) ? 'invalid' : ''} 
                                    ${isFieldValid('parentesco', formData.parentesco) ? 'valid' : ''}
                                `.trim()}
                            >
                                <option value="">Seleccionar</option>
                                <option value="padre">Padre</option>
                                <option value="madre">Madre</option>
                                <option value="tutor">Tutor</option>
                            </select>
                            {isFieldInvalid('parentesco', formData.parentesco) && <span className="error-message">Este campo es obligatorio</span>}
                        </div>
                    </div>
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
