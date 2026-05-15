import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <a href="#hero" className="logo-link">
              <img src="/images/melianacf-logo.png" alt="Meliana CF" className="logo" loading="lazy" />
              <h1 className="sr-only">Meliana CF - Escuela de Fútbol</h1>
              <span className="logo-text">Meliana CF</span>
            </a>
          </div>
          <ul className="nav-menu">
            <li><a href="#hero" className="nav-link">Inicio</a></li>
            <li><a href="#inscripcion" className="nav-link">Inscripción</a></li>
            <li><a href="#about" className="nav-link">Sobre nosotros</a></li>
          </ul>
          <div className="hamburger">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
