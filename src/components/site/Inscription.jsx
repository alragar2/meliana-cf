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
          <p>Complete el formulario de inscripción y asegure la plaza de su hijo/a en nuestra academia.</p>
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
            Tras completar el formulario, realice el pago según las instrucciones para confirmar la plaza.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Registration;
