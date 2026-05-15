import React from 'react';

const Hero = () => {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Más que un club, una familia</h1>
          <p>
            Formación ,competición y pasión por el fútbol. Un lugar donde crecer y
            desarrollarte junto a compañeros/as y entrenadores, en un espacio adaptado para 
            disfrutar y vivir el deporte.
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
          <img src="\images\melianacf-logo.png" alt="Meliana CF" loading="lazy" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
