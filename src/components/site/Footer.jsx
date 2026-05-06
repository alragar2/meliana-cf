import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Meliana CF</h3>
            <p>Formando futbolistas del futuro con pasión y excelencia.</p>
            <div className="social-links">
              <a href="https://www.instagram.com/melianacf/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://www.facebook.com/melianacf?locale=es_ES" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li><a href="#hero">Inicio</a></li>
              <li><a href="#inscripcion">Inscripción</a></li>
              <li><a href="#about">Sobre Nosotros</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contacto</h3>
            <p><i className="fas fa-map-marker-alt"></i> Meliana, Valencia</p>
            <p><i className="fas fa-envelope"></i> info@melianacf.com</p>
            <p><i className="fas fa-phone"></i> +34 628 536 290</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Meliana CF. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
