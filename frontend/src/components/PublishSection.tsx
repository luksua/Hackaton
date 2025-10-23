import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PublishSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="publish-section bg-primary-subtle py-5 text-center">
      <Container> 
        <Row className="justify-content-center align-items-center">
          <Col md={8}>
            <h4 className="fw-bold mb-2">¿Quieres Vender o Alquilar tu Propiedad?</h4>
            <p className="text-muted mb-3">
              Publica tu inmueble y llega a miles de compradores e inquilinos
              potenciales. Nuestro proceso es rápido, fácil y seguro.
            </p>
          </Col>
          <Col md={4}>
            <Button
              variant="success"
              className="fw-semibold rounded-pill px-4"
              onClick={() => navigate("/login")}
            >
              Publica tu Propiedad
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PublishSection;
