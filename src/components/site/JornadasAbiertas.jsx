import React from 'react';

const JornadasAbiertas = () => {
  // URL del formulario de Google Forms - cambiar por el enlace correcto
  const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSddy1vPfsOWAfDZuDJ4TqeauRZKovioAYHFNaEULL_W0qW_wA/viewform?usp=publish-editor';

  const handleRedirect = () => {
    window.open(googleFormURL, '_blank');
  };

  const features = [
    {
      icon: 'fas fa-futbol',
      title: 'Sesiones Gratuitas',
      description: 'Participa en entrenamientos sin costo'
    },
    {
      icon: 'fas fa-users',
      title: 'Todas las Categorías',
      description: 'Actividades para todas las edades'
    },
    {
      icon: 'fas fa-trophy',
      title: 'Experiencia Meliana CF',
      description: 'Conoce nuestro proyecto deportivo'
    }
  ];

  return (
    <section id="jornadas-abiertas" className="jornadas-abiertas">
      <div className="container">
        <div className="jornadas-content">
          <h2 className="section-title">Jornadas Abiertas</h2>
          

          <div className="jornadas-cta">
            <p className="jornadas-cta-text">
              ¡Vive la experiencia Meliana CF! Participa en nuestras jornadas abiertas 
              de final de temporada. Una excelente oportunidad para conocer a nuestros 
              entrenadores, entrenar con nosotros y disfrutar del fútbol en familia.
            </p>

            <button 
              className="btn-inscripcion-jornadas"
              onClick={handleRedirect}
              title="Ir al formulario de apuntarse a jornadas abiertas"
            >
              <i className="fas fa-external-link-alt"></i>
              Apuntarse a Jornadas Abiertas
            </button>

            <p className="jornadas-disclaimer">
              Botas de fútbol obligatorias y preferiblemente camiseta roja.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JornadasAbiertas;
