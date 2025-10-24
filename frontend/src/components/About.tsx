import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

const About: React.FC = () => {
  const features = [
    {
      title: "Sostenibilidad",
      description: "Comprometidos con el desarrollo sostenible y prácticas eco-amigables"
    },
    {
      title: "Innovación",
      description: "Tecnología de punta para una experiencia inmobiliaria única"
    },
    {
      title: "Confianza",
      description: "15 años construyendo relaciones basadas en la transparencia"
    }
  ];

  return (
    <section className="about-section py-5 bg-light">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-5 mb-lg-0">
            <div className="about-content">
              <Badge bg="primary-custom" className="mb-3 px-3 py-2 rounded-pill">
                Sobre Nosotros
              </Badge>
              <h2 className="display-5 fw-bold mb-4">
                Transformando <span className="text-primary-custom">Sueños</span> en Realidades
              </h2>
              <p className="lead text-muted mb-4">
                En Nova Habitat, combinamos innovación, sostenibilidad y expertise para 
                crear espacios que inspiran y comunidades que perduran.
              </p>
              
              <div className="about-features mb-4">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item d-flex align-items-center mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">{feature.title}</h6>
                      <p className="text-muted small mb-0">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <Row className="stats-row text-center">
                <Col xs={4}>
                  <div className="stat">
                    <h4 className="text-primary-custom fw-bold">15+</h4>
                    <small className="text-muted">Años</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="stat">
                    <h4 className="text-primary-custom fw-bold">500+</h4>
                    <small className="text-muted">Proyectos</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="stat">
                    <h4 className="text-primary-custom fw-bold">10K+</h4>
                    <small className="text-muted">Clientes</small>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          <Col lg={6}>
            <div className="about-visual">
              <div className="image-stack position-relative">
                <img 
                  src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Equipo Nova Habitat"
                  className="img-fluid rounded-3 shadow-lg main-image"
                />
                <div className="floating-card card border-0 shadow-lg position-absolute top-0 start-0">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center">
                      <div className="icon-wrapper bg-primary-custom rounded-circle p-2 me-3">
                        <i className="bi bi-trophy-fill text-white"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">Premio Excelencia 2023</h6>
                        <small className="text-muted">Mejor Inmobiliaria</small>
                      </div>
                    </div>
                  </Card.Body>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;