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
            <p><i className="fas fa-envelope"></i> <a href="mailto:documentacionmelianacf@gmail.com">documentacionmelianacf@gmail.com</a></p>
            <p><i className="fas fa-phone"></i> <a href="tel:+34675616652">675 61 66 52</a></p>
            <p><i className="fas fa-phone"></i> <a href="tel:+34675446007">675 44 60 07</a></p>
            <p><i className="fas fa-phone"></i> <a href="tel:+34678987146">678 98 71 46</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Meliana CF. Todos los derechos reservados.</p>
          <p>
            Desarrollado por <a href="https://nubix.vercel.app/" target="_blank" rel="noopener noreferrer">Nubix</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
