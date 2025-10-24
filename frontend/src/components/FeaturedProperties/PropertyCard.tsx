import React, { useRef } from "react";
import { Card, Badge, Button, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { FeaturedProperty } from "../../types/properties";

interface PropertyCardProps {
  property: FeaturedProperty;
  isOwner?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isOwner,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const carouselRef = useRef<any>(null);


  // 🪙 Formatear precio
  const formatPrice = (price: number | null) =>
    price
      ? new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "USD",
      }).format(price)
      : "Consultar precio";

  // 🏞️ Imagen principal (fallback)
  const defaultImage =
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";

  const images = property.images?.length ? property.images : [defaultImage];

  // 🌀 Controlar carrusel en hover
  const handleMouseEnter = () => {
    const carousel = carouselRef.current as any;
    if (carousel?.cycle) carousel.cycle(); // iniciar rotación
  };

  const handleMouseLeave = () => {
    const carousel = carouselRef.current as any;
    if (carousel?.pause) carousel.pause(); // detener rotación
  };

  return (
    <Card
      className="property-card h-100 border-0 shadow-hover"
      style={{ cursor: "pointer" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 🖼️ Carrusel de imágenes */}
      <div className="property-image-container position-relative overflow-hidden">
        <Carousel
          ref={carouselRef}
          interval={2000}
          controls={false}
          indicators={false}
          pause="hover"
          fade
        >
          {images.map((img, i) => (
            <Carousel.Item key={i}>
              <Card.Img
                src={img}
                alt={`imagen-${i}`}
                className="property-image d-block w-100"
                style={{ height: "250px", objectFit: "cover" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        {/* ⭐ Badge destacado */}
        {property.is_featured && (
          <Badge
            bg="warning"
            text="dark"
            className="position-absolute top-0 start-0 m-3"
          >
            <i className="bi bi-star-fill me-1"></i> Destacado
          </Badge>
        )}

        {/* 🪄 Overlay con acciones */}
        <div className="property-overlay">
          <Button
            variant="primary-custom"
            className="rounded-pill"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/propiedad/${property.id}`);
            }}
          >
            Ver Detalles
          </Button>

          {isOwner && (
            <div className="mt-3 d-flex justify-content-between">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(property.id);
                }}
              >
                <i className="bi bi-pencil"></i> Editar
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(property.id);
                }}
              >
                <i className="bi bi-trash"></i> Eliminar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 📋 Contenido */}
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="property-price text-primary-custom fw-bold">
            {formatPrice(property.price)}
          </h5>
          {property.area && (
            <Badge bg="light" text="dark" className="fs-7">
              {property.area} m²
            </Badge>
          )}
        </div>

        <Card.Title className="h6 mb-3">
          {property.description
            ? property.description.length > 60
              ? `${property.description.substring(0, 60)}...`
              : property.description
            : "Propiedad sin descripción"}
        </Card.Title>

        <Card.Text className="text-muted small mb-3">
          <i className="bi bi-geo-alt-fill text-primary-custom me-2"></i>
          {property.address}, {property.city}
        </Card.Text>

        {/* 🛋️ Características */}
        <div className="property-features d-flex justify-content-between border-top pt-3">
          <div className="feature text-center">
            <i className="bi bi-door-closed-fill text-primary-custom d-block fs-5"></i>
            <small className="text-muted">{property.bedrooms || 0} hab.</small>
          </div>
          <div className="feature text-center">
            <i className="bi bi-droplet-fill text-primary-custom d-block fs-5"></i>
            <small className="text-muted">{property.bathrooms || 0} baños</small>
          </div>
          <div className="feature text-center">
            <i className="bi bi-arrows-fullscreen text-primary-custom d-block fs-5"></i>
            <small className="text-muted">
              {property.area ? `${property.area}m²` : "N/A"}
            </small>
          </div>
        </div>

        {/* 🧩 Extras */}
        {property.features?.length > 0 && (
          <div className="mt-3 pt-3 border-top">
            <div className="d-flex flex-wrap gap-1">
              {property.features.slice(0, 3).map((f, i) => (
                <Badge
                  key={i}
                  bg="outline-primary-custom"
                  text="primary-custom"
                  className="fs-7"
                >
                  {f}
                </Badge>
              ))}
              {property.features.length > 3 && (
                <Badge bg="light" text="muted" className="fs-7">
                  +{property.features.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PropertyCard;
