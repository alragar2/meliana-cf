import React, { useState } from 'react';
import InscriptionForm from './InscriptionForm';
import ConfirmationPage from './ConfirmationPage';

const Registration = () => {
  const [inscriptionStep, setInscriptionStep] = useState('closed'); // 'closed', 'form', 'confirmation'
  const [submittedData, setSubmittedData] = useState(null);

  const handleRegistrationClick = () => {
    setInscriptionStep(inscriptionStep === 'closed' ? 'form' : 'closed');
  };

  const handleCloseForm = () => {
    setInscriptionStep('closed');
  };

  const handleFormSuccess = (formData) => {
    setSubmittedData(formData);
    setInscriptionStep('confirmation');
  };

  const handleConfirmationEnd = () => {
    setInscriptionStep('closed');
    alert('¡Proceso completado! Gracias por tu inscripción. Nos pondremos en contacto contigo pronto.');
  };

  return (
    <section id="inscripcion" className="registration">
      <div className="container">
        <h2 className="section-title">¡Inscríbete Ya!</h2>
        <div className="registration-content">
          <p>Aprovecha tu oportunidad y completa el formulario para formar parte de nuestro club. Para formalizar la inscripción como jugador/a del Meliana C.F, la inscripción deberá ser rellenada antes del 01 de JULIO</p>
          <button 
            onClick={handleRegistrationClick} 
            className="btn-registration"
          >
            <i className="fas fa-edit"></i>
            {inscriptionStep !== 'closed' ? 'Cerrar Proceso' : 'Formulario de Inscripción'}
          </button>
          
          {inscriptionStep === 'form' && (
            <InscriptionForm 
              isVisible={true} 
              onClose={handleCloseForm}
              onSuccess={handleFormSuccess}
            />
          )}

          {inscriptionStep === 'confirmation' && (
            <ConfirmationPage onConfirm={handleConfirmationEnd} inscriptionData={submittedData} />
          )}
          
          <p className="registration-note">
            Tras completar el formulario, la inscripción podrá abonarse mediante el número de cuenta indicado hasta el 30 de julio. Finalizado el plazo, el club procederá al cobro de la cuota correspondiente (120€). 
          </p>
        </div>
      </div>
    </section>
  );
};

export default Registration;
