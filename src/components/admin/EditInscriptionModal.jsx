import React, { useEffect } from 'react';
import { inscriptionService } from '../../firebase/inscriptionService';
import FormField from '../site/FormField';
import useInscriptionForm from '../../hooks/useInscriptionForm';

const EditInscriptionModal = ({ isVisible, onClose, inscription, onSave }) => {

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
    } = useInscriptionForm();

    useEffect(() => {
        if (inscription) {
            setFormData({
                nombreNino: inscription.nombreNino || '',
                apellidos: inscription.apellidos || '',
                fechaNacimiento: inscription.fechaNacimiento || '',
                direccion: inscription.direccion || '',
                poblacion: inscription.poblacion || '',
                dni: inscription.dni || '',
                cp: inscription.cp || '',
                telefono: inscription.telefono || '',
                nacionalidad: inscription.nacionalidad || '',
                lugarNacimiento: inscription.lugarNacimiento || '',
                sexo: inscription.sexo || '',
                hermanosEnClub: inscription.hermanosEnClub || false,
                loteria: inscription.loteria || false,
                
                nombrePadre: inscription.padre?.nombre || '',
                apellidosPadre: inscription.padre?.apellidos || '',
                telefonoPadre: inscription.padre?.telefono || '',
                correoPadre: inscription.padre?.email || '',
                dniPadre: inscription.padre?.dni || '',
                parentesco: inscription.padre?.parentesco || '',
    
                nombreBanco: inscription.banco?.nombre || '',
                iban: inscription.banco?.iban || '',
            });
        }
    }, [inscription, setFormData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inscription?.id) {
            alert("Error: No se encontró el ID de la inscripción.");
            return;
        }
        setIsSubmitting(true);

        try {
            // Asumimos que el servicio se encarga de la validación y estructuración de datos
            const result = await inscriptionService.updateInscription(inscription.id, formData);

            if (result.success) {
                alert('¡Datos actualizados correctamente!');
                if (onSave) {
                    // Idealmente, el servicio de actualización devuelve el objeto actualizado
                    onSave({ ...formData, id: inscription.id });
                }
                onClose();
            } else {
                alert('Error al actualizar: ' + result.message);
            }
        } catch (error) {
            console.error('Error al actualizar inscripción:', error);
            alert('Error inesperado al actualizar la inscripción. Por favor, inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isVisible || !inscription) return null;

    return (
        <div className="edit-modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                <form onSubmit={handleSubmit} className="registration-form">
                    <h3>Editando a: {inscription.nombreNino} {inscription.apellidos}</h3>

                    <div className="form-section">
                        <h4>Datos del Niño/a</h4>
                        <div className="form-row">
                            <FormField
                                label="Nombre *"
                                name="nombreNino"
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
                            <i className={isSubmitting ? "fas fa-spinner fa-spin" : "fas fa-save"}></i>
                            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-cancel"
                            disabled={isSubmitting}
                        >
                            <i className="fas fa-times"></i>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditInscriptionModal;