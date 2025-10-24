import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

const SearchBar: React.FC = () => {
  return (
    <section className="search-bar bg-white shadow p-3 rounded-4 mx-auto mt-n4 mb-5 w-75" style={{ maxWidth: "2200px" }}>
      <Form>
        <Row className="g-2">
          <Col md={5}>
            <Form.Control
              type="text"
              placeholder="¿Qué buscas? Casa, apartamento..."
            />
          </Col>
          <Col md={2}>
             <Form.Control
              type="text"
              placeholder="Ubicación"
            />
          </Col>
          <Col md={2}>
            <Form.Select>
              <option>Tipo de propiedad</option>
              <option>Casa</option>
              <option>Apartamento</option>
              <option>Local</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select>
              <option>Operación</option>
              <option>Arriendo</option>
              <option>Venta</option>
            </Form.Select>
          </Col>
          <Col md={1} className="d-grid">
            <Button variant="success" className="fw-semibold">
              <span>Ver </span> 
              <i className="bi bi-geo-alt"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </section>
  );
};

export default SearchBar;
