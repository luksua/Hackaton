import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Badge, Button, Spinner, Carousel } from "react-bootstrap";
import PropertyCard from "./PropertyCard";
import PropertyContracts from "../Contracts/PropertiesContract";
import { propertyService } from "../../services/api";
import type { FeaturedProperty } from "../../types/properties";
import { useAuth } from "../../Hooks/UseAuth";

const FeaturedProperties: React.FC = () => {
  const [properties, setProperties] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated, isClient, isOwner } = useAuth();
  const navigate = useNavigate();

  // 🔄 Cargar propiedades según tipo de usuario
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = isOwner
          ? await propertyService.getPropertiesByOwner(user!.id)
          : await propertyService.getFeaturedProperties();

        setProperties(data);
      } catch (error) {
        console.error("Error cargando propiedades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [isOwner, user]);

  // 🧭 Redirecciones
  const handleViewAll = () => {
    if (!isAuthenticated) return navigate("/register");
    if (isClient) return navigate("/propiedades");
    if (isOwner) return navigate("/mis-propiedades");
  };

  const handleAddProperty = () => navigate("/propiedades/nueva");
  const handleEdit = (propertyId: number) => navigate(`/propiedades/${propertyId}/editar`);

  const handleDelete = async (propertyId: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta propiedad?")) return;
    try {
      await propertyService.deleteProperty(propertyId);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (error) {
      console.error("Error al eliminar propiedad:", error);
    }
  };

  // 🌀 Loading state
  if (loading) {
    return (
      <section className="featured-properties py-5 bg-light">
        <Container className="text-center">
          <Spinner animation="border" variant="primary" role="status" />
        </Container>
      </section>
    );
  }

  return (
    <section className="featured-properties py-5">
      <Container>
        {/* 🏷️ Encabezado */}
        <Row className="mb-5 text-center">
          <Col lg={8} className="mx-auto">
            <Badge bg="primary-custom" className="mb-3 px-3 py-2 rounded-pill">
              {isOwner ? "Tus Propiedades" : "Propiedades Destacadas"}
            </Badge>
            <h2 className="display-5 fw-bold mb-3">
              {isOwner ? "Gestiona tus Propiedades" : "Descubre Nuestras "}
              {!isOwner && <span className="text-primary-custom">Joyas Inmobiliarias</span>}
            </h2>
            <p className="lead text-muted">
              {isOwner
                ? "Administra tus propiedades, agrega nuevas oportunidades al mercado o edita tus publicaciones existentes."
                : "Explora nuestra selección exclusiva de propiedades premium cuidadosamente curadas para ofrecerte lo mejor del mercado."}
            </p>
          </Col>
        </Row>

        {/* 🧱 Propiedades */}
        {!isOwner ? (
          // 🌟 Carrusel solo para visitantes o clientes
          properties.length > 0 ? (
            <Carousel interval={4000} indicators={false} controls={false}>
              {Array.from({ length: Math.ceil(properties.length / 3) }).map((_, index) => (
                <Carousel.Item key={index}>
                  <Row className="g-4">
                    {properties
                      .slice(index * 3, index * 3 + 3)
                      .map((property) => (
                        <Col key={property.id} lg={4} md={6}>
                          <PropertyCard
                            property={property}
                            isOwner={isOwner}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        </Col>
                      ))}
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <Col className="text-center text-muted">
              No se encontraron propiedades destacadas.
            </Col>
          )
        ) : (
          // 👨‍💼 Vista del propietario
          <Row className="g-4">
            {properties.length > 0 ? (
              properties.map((property) => (
                <Col key={property.id} lg={4} md={6}>
                  <div className="mb-4">
                    <PropertyCard
                      property={property}
                      isOwner={isOwner}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />

                    {/* 🔹 Contratos del inmueble */}
                    <div className="mt-3 p-3 border rounded bg-light shadow-sm">
                      <PropertyContracts propertyId={property.id} />
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <Col className="text-center text-muted">
              </Col>
            )}
          </Row>
        )}

        {/* ⚙️ Acciones */}
        <Row className="mt-5">
          <Col className="text-center">
            {isOwner && (
              <Button
                variant="primary-custom"
                size="lg"
                className="rounded-pill px-4 me-3"
                onClick={handleAddProperty}
              >
                <i className="bi bi-plus-circle me-2"></i> Agregar Propiedad
              </Button>
            )}

            <Button
              variant="outline-primary-custom"
              size="lg"
              className="rounded-pill px-4"
              onClick={handleViewAll}
            >
              {isOwner ? "Ver Mis Propiedades" : "Ver Todas las Propiedades"}
              <i className="bi bi-arrow-right ms-2"></i>
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedProperties;
