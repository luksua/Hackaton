import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Button, Badge, Collapse } from "react-bootstrap";
import { propertyService } from "../services/api";
import type { Property } from "../types/properties";
import { useAuth } from "../Hooks/UseAuth";
import { Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PropertyContracts from "./Contracts/PropertiesContract";

const OwnerPropertiesList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user, isAuthenticated, isOwner } = useAuth();
  const navigate = useNavigate();

  const BASE_URL = "http://127.0.0.1:8000/storage/";

  const [openPropertyId, setOpenPropertyId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await propertyService.getPropertiesByOwner(user?.id ?? 0, page);
        setProperties(res.data);
        setTotalPages(res.last_page);
      } catch (error) {
        console.error("Error cargando propiedades:", error);
        setError("Error al cargar las propiedades. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isOwner && user) fetchProperties();
  }, [isAuthenticated, isOwner, user, page]);

  const formatPrice = (price: number | null) =>
    price
      ? new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(price)
      : "Consultar precio";

  const handleAddProperty = () => navigate("/propiedades/nueva");

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Cargando tus propiedades...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (properties.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2 className="fw-bold mb-4">Mis Inmuebles</h2>
        <Button variant="warning" onClick={handleAddProperty} className="mb-4 text-white fw-semibold">
          + Agregar Nuevo Inmueble
        </Button>
        <Alert variant="info" className="shadow-sm">
          <strong>No tienes propiedades registradas.</strong>
          <p className="mt-2 mb-0 text-muted">
            Agrega una nueva propiedad desde el panel de propietario.
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <section className="owner-properties py-5">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-nowrap">
          <div className="col-md-6">
            <h2 className="fw-bold">Mis Inmuebles</h2>
          </div>
          <div className="col-md-6 text-end">
            <Button variant="warning" className="text-white fw-semibold" onClick={handleAddProperty}>
              + Agregar Nuevo Inmueble
            </Button>
          </div>
        </div>

        <Row className="g-4">
          {properties.map((property) => (
            <Col key={property.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="position-relative">
                  {property.images && property.images.length > 0 ? (
                    <Carousel
                      interval={5000}
                      controls={property.images.length > 1}
                      indicators={false}
                      fade={false}
                      pause="hover"
                      className="rounded-top-4"
                    >
                      {property.images.map((img, index) => (
                        <Carousel.Item key={index}>
                          <img
                            src={`${BASE_URL}${img.image_url}`}
                            alt={`Propiedad ${property.id} - Imagen ${index + 1}`}
                            className="d-block w-100"
                            style={{
                              height: "200px",
                              objectFit: "cover",
                            }}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    <img
                      src="/images/no-image.png"
                      alt="Sin imagen"
                      className="d-block w-100 rounded-top-4"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                </div>

                <Card.Body className="bg-light rounded-bottom-4">
                  <Card.Title className="fw-semibold text-dark mb-1 text-truncate">
                    {property.description || "Propiedad sin descripción"}
                  </Card.Title>
                  <Card.Text className="text-muted small mb-3">
                    {property.address}, {property.city}
                  </Card.Text>

                  {/* Estado */}
                  <div className="mb-3">
                    <Badge
                      bg={
                        property.listing_status === "available"
                          ? "success"
                          : property.listing_status === "rented"
                            ? "warning"
                            : "secondary"
                      }
                      text={property.listing_status === "rented" ? "dark" : undefined}
                      className="px-3 py-2 rounded-pill"
                    >
                      {property.listing_status === "available"
                        ? "Disponible"
                        : property.listing_status === "rented"
                          ? "Arrendado"
                          : "Inactivo"}
                    </Badge>
                  </div>

                  {/* Botones de acción */}
                  <div className="d-flex justify-content-between">
                    <Button variant="outline-success" size="sm">
                      Ver
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      Actualizar
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      Eliminar
                    </Button>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-dark">
                      {formatPrice(property.price)}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        setOpenPropertyId(
                          openPropertyId === property.id ? null : property.id
                        )
                      }
                    >
                      {openPropertyId === property.id
                        ? "Ocultar Contratos"
                        : "Ver Contratos"}
                    </button>
                  </div>

                  {/* 👇 Contratos asociados (colapsables) */}
                  <Collapse in={openPropertyId === property.id}>
                    <div>
                      <PropertyContracts propertyId={property.id} />
                    </div>
                  </Collapse>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>
                    Anterior
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${page === i + 1 ? "active" : ""}`}
                  >
                    <button className="page-link" onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </Container>
    </section>
  );
};

export default OwnerPropertiesList;
