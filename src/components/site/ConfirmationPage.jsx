import React, { useState } from 'react';
import { calcularCategoria } from '../../utils/categories';

const ConfirmationPage = ({ onConfirm, inscriptionData }) => {
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPhotos, setAcceptPhotos] = useState(false);

    const canConfirm = acceptTerms && acceptPhotos;

    const handleConfirm = () => {
        if (canConfirm) {
            // Calcular la categoría
            const categoria = calcularCategoria(inscriptionData.fechaNacimiento, inscriptionData.sexo);

            // Determinar el nombre base del PDF
            let pdfBase = 'INSCRIPCIÓN';
            if (categoria === 'FEMENINO INFANTIL' || categoria === 'FEMENINO CADETE') pdfBase = 'INSCRIPCIÓN_FEMENINO';
            else if (categoria === 'QUERUBÍN') pdfBase = 'INSCRIPCIÓN_QUERUBINES';
            else if (categoria === 'JUVENIL' && inscriptionData.sexo === 'masculino') pdfBase = 'INSCRIPCIÓN_JUVENILES';

            // Determinar sufijos para hermanos y lotería
            const h = inscriptionData.hermanosEnClub ? 'CON' : 'SIN';
            const l = inscriptionData.loteria ? 'CON' : 'SIN';
            const pdfName = `${pdfBase}_${h}_H_${l}_L`;

            // Descargar el PDF
            const pdfUrl = `/PDFs/${pdfName}.pdf`;
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `${pdfName}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Aquí podrías hacer una llamada final para guardar estas aceptaciones si fuera necesario
            // Por ejemplo: inscriptionService.updateAuthorizations(inscriptionData.id, { acceptTerms, acceptPhotos });
            onConfirm();
        }
    };

    return (
        <div className="registration-form-container confirmation-page">
            <div className="registration-form">
                <h3>¡Un último paso, {inscriptionData?.nombreNino}!</h3>
                <p>Por favor, lee y acepta las siguientes condiciones para finalizar tu pre-inscripción.</p>

                <div className="form-section">
                    <h4><i className="fas fa-exclamation-triangle"></i> Reserva de Plaza</h4>
                    <p>La inscripción no garantiza la reserva de plaza, ya que esta dependerá de criterios deportivos y del número de plazas disponibles por categoría.</p>
                </div>

                <div className="form-section">
                    <h4><i className="fas fa-tshirt"></i> Equipación Deportiva</h4>
                    <p>El importe de la inscripción no incluye el pack deportivo que todo jugador del club debe tener. Su compra es obligatoria tras la confirmación de la plaza por parte del club. El coste es de <strong>150€</strong> y se adquiere en Sports Bayarri.</p>
                </div>

                <div className="form-section">
                    <h4><i className="fas fa-camera"></i> Autorización de Imagen y Datos</h4>
                    <p>Se solicita autorización para el uso y publicación de fotografías, imágenes y datos personales en las plataformas oficiales del club (web, redes sociales, etc.) con fines informativos y de promoción de las actividades del Meliana CF.</p>
                </div>

                <div className="form-section">
                    <h4><i className="fas fa-file-contract"></i> Admisión en la Escuela</h4>
                    <p>Para ser admitido en la Escuela de Fútbol, el jugador deberá estar al corriente de pago en cuotas y lotería de campañas anteriores</p>
                </div>

                <div className="form-section">
                    <h4><i className="fas fa-user-times"></i> Baja federativa</h4>
                    <p>Ante la solicitud de la baja federativa, el jugador deberá abonar las cuotas pendientes del coste total de la escuela. De lo contrario el club no está obligado a facilitar dicha baja.</p>
                </div>

                <div className="form-section">
                    <div className="form-row single-column">
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={acceptPhotos}
                                    onChange={() => setAcceptPhotos(!acceptPhotos)}
                                />
                                Autorizo el uso y publicación de fotografías, imágenes y datos personales según lo descrito.
                            </label>
                        </div>
                    </div>
                    <div className="form-row single-column">
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={() => setAcceptTerms(!acceptTerms)}
                                />
                                He leído y acepto todos los términos y condiciones de la pre-inscripción.
                            </label>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        onClick={handleConfirm}
                        disabled={!canConfirm}
                        className="btn-submit"
                    >
                        <i className="fas fa-check-circle"></i>
                        Finalizar Inscripción
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;