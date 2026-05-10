import React, { useState } from 'react';
import { inscriptionService } from '../../firebase/inscriptionService';
import { horariosDisponibles } from '../../utils/horariosConfig';
import FormField from './FormField';
import useInscriptionForm from '../../hooks/useInscriptionForm';

const InscriptionForm = ({ isVisible, onClose, onSuccess }) => {

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
        resetForm,
        totalAPagar
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
                // Notificar al componente padre que fue exitoso
                onSuccess(formData);
                resetForm();
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
                        <p>El descuento se realizará en la inscripción 50€ por jugador (Querubínes y solo entrenamiento no entran en el descuento)</p>
                    </div>

                    <div className="form-row single-column">
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
                    <p>Si activa la casilla, acepta participar en la lotería de Navidad y se le entregarán 50 papeletas. La no participación en la lotería implica el pago de los beneficios al club (50€)</p></div>

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
                            as="select"
                            formData={formData}
                            touchedFields={touchedFields}
                            isFieldInvalid={isFieldInvalid}
                            isFieldValid={isFieldValid}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        >
                            <option value="">Seleccionar</option>
                            <option value="Padre">Padre</option>
                            <option value="Madre">Madre</option>
                            <option value="Tutor">Tutor</option>
                        </FormField>
                    </div>
                </div>

                <div className="form-section">
                    <h4>Datos Bancarios</h4>
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

                <div className="form-section">
                    <h4><i className="fas fa-users"></i> Cuenta del Meliana CF</h4>
                    <p><strong>Titular:</strong> Meliana C.F.</p>
                    <p><strong>Banco:</strong> Caixa Popular Coop. V.</p>
                    <p><strong>IBAN:</strong> ES83 3159 0017 7120 2678 1829</p>
                    <p><strong>NO SE ADMITEN PAGOS EN METÁLICO</strong></p>
                    
                </div>

                {totalAPagar > 0 && (
                    <div className="form-section total-preview" style={{ textAlign: 'center', backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                        <h4>Total a pagar</h4>
                        <p className="total-amount" style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#1a73e8', margin: '0.5rem 0' }}>{totalAPagar}€</p>
                        <small>Este importe es una estimación. El total final se confirmará al procesar la inscripción.</small>
                    </div>
                )}

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
