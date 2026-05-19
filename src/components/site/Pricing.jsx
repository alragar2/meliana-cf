import React from 'react';

const Pricing = () => {
  const pricingPlans = [
    
    {
      id: 1,
      name: "Precio Escuela",
      price: 520,
      currency: "€",
      popular: false,
      buttonText: "Inscribirse",
      buttonLink: "#inscripcion"
    },
    {
      id: 2,
      name: "Femenino",
      price: 435,
      currency: "€",
      popular: false,
      buttonText: "Inscribirse",
      buttonLink: "#inscripcion"
    },
    {
      id: 3,
      name: "Juvenil Masculino",
      price: 470,
      currency: "€",
      popular: false,
      buttonText: "Inscribirse",
      buttonLink: "#inscripcion"
    },
    {
      id: 4,
      name: "Querubín",
      price: 225,
      currency: "€",
      popular: false,
      buttonText: "Inscribirse",
      buttonLink: "#inscripcion"
    }
  ];

  return (
    <section id="pricing" className="pricing section">
      <div className="container">
        <h2 className="text-center mb-6">Precios de la Escuela</h2>
        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && (
                <div className="popular-badge">
                  <i className="fas fa-star"></i>
                  Más Popular
                </div>
              )}
              <h3>{plan.name}</h3>
              <div className="price">
                {plan.currency}{plan.price}
                <span>{plan.period}</span>
              </div>
              {plan.cloth && <span className="cloth">{plan.cloth}</span>}
              <a href={plan.buttonLink} className="btn btn-primary">
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>
        
        <div className="pricing-discount">
          <div className="discount-card">
            <div className="discount-header">
              <i className="fas fa-bolt"></i>
              <h3>Inscríbete y descubre tu precio exacto</h3>
            </div>
            <div className="discount-content">
              <p>
                Estos son nuestros precios de referencia, pero al inscribirte podrás obtener el importe exacto según tu categoría y condiciones.
              </p>
              <p className="discount-note">
                <strong>¡No esperes más!</strong> Queremos ayudarte a conocer lo que vas a pagar con total claridad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
