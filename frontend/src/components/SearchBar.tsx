import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SearchBar: React.FC = () => {
  const [search, setSearch] = useState({
    query: "",
    location: "",
    propertyType: "",
    operationType: "",
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Evita cualquier intento de submit del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Evita que ENTER haga submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // True si hay al menos un filtro no vacío (ignorando espacios)
  const hasFilters = [
    search.query,
    search.location,
    search.propertyType,
    search.operationType,
  ].some((v) => (v || "").trim() !== "");

  const goToMap = () => {
    // Si no hay filtros, NO redirige
    if (!hasFilters) return;

    const query = search.query.trim();
    const location = search.location.trim();
    const propertyType = search.propertyType.trim();
    const operationType = search.operationType.trim();

    const searchParams: Record<string, string> = {};
    if (query) searchParams.query = query;
    if (location) searchParams.location = location;
    if (propertyType) searchParams.propertyType = propertyType;
    if (operationType) searchParams.operationType = operationType;

    navigate({
      pathname: "/mapa",
      search: `?${new URLSearchParams(searchParams).toString()}`,
    });
  };

  return (
    <section
      className="search-bar bg-white shadow p-3 rounded-4 mx-auto mt-n4 mb-5 w-75"
      style={{ maxWidth: "2200px" }}
    >
      <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate>
        <Row className="g-2">
          <Col md={5}>
            <Form.Control
              type="text"
              placeholder="¿Qué buscas? Casa, apartamento..."
              name="query"
              value={search.query}
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="text"
              placeholder="Ubicación"
              name="location"
              value={search.location}
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <Form.Select
              name="propertyType"
              value={search.propertyType}
              onChange={handleChange}
            >
              <option value="">Tipo de propiedad</option>
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Local">Local</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              name="operationType"
              value={search.operationType}
              onChange={handleChange}
            >
              <option value="">Operación</option>
              <option value="Arriendo">Arriendo</option>
              <option value="Venta">Venta</option>
            </Form.Select>
          </Col>
          <Col md={1} className="d-grid">
            <Button
              type="button"                 // No es submit
              variant="outline-success"
              size="sm"
              onClick={goToMap}
              disabled={!hasFilters}        // Deshabilita si no hay filtros
              title={!hasFilters ? "Ingresa al menos un filtro para continuar" : ""}
            >
              Ver
            </Button>
          </Col>
        </Row>
      </Form>
    </section>
  );
};

export default SearchBar;