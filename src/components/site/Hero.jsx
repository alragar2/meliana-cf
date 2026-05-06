import React from 'react';

const Hero = () => {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Meliana CF</h1>
          <p>
            Descubre tu potencial en el fútbol con nuestra academia de élite. 
            Entrenamiento profesional, instalaciones de primera clase y un ambiente 
            donde los sueños se hacen realidad.
          </p>
          <div className="hero-buttons">
            <a href="#inscripcion" className="btn btn-primary btn-lg">
              Inscríbete Ahora
            </a>
            <a href="#about" className="btn btn-outline btn-lg">
              Sobre Nosotros
            </a>
          </div>
        </div>
        <div className="hero-image">
          <img src="\images\melianacf-logo.png" alt="Meliana CF" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
