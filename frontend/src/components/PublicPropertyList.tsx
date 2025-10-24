import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Alert,
    Button,
    Form,
    Carousel,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { propertyService } from "../services/api";
import type { Property } from "../types/properties";

const PublicPropertiesList: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const BASE_URL = "http://127.0.0.1:8000/storage/";

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [filters, setFilters] = useState({
        city: "",
        category_id: "",
        transaction_type: "",
        price_min: "",
        price_max: "",
    });

    const navigate = useNavigate();

    // ✅ Obtener propiedades con filtros + paginación
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const res = await propertyService.getAllProperties(page, filters);
                setProperties(res.data);
                setTotalPages(res.last_page);
            } catch (error) {
                console.error("Error cargando propiedades:", error);
                setError("Error al cargar las propiedades.");
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, [page, filters]);

    const formatPrice = (price: number | null) =>
        price
            ? new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0,
            }).format(price)
            : "Consultar precio";

    // Diccionarios de traducción
    const statusTranslations: Record<string, string> = {
        available: "Disponible",
        reserved: "Reservada",
        rented: "Arrendada",
        sold: "Vendida",
        inactive: "Inactiva",
    };

    const transactionTypeTranslations: Record<string, string> = {
        rent: "En arriendo",
        sale: "En venta",
    };

    // Helper: decide si el click proviene de un elemento interactivo
    const shouldIgnoreActivation = (target: EventTarget | null) => {
        if (!(target instanceof Element)) return false;
        // ignore if clicking on buttons, links, form controls, carousel controls/indicators, or any element with data-bs-target attrs
        const interactiveSelectors = [
            "button",
            "a",
            "input",
            "select",
            "textarea",
            ".carousel-control-prev",
            ".carousel-control-next",
            ".carousel-indicators",
            "[data-bs-target]",
            "[data-bs-slide]",
            ".carousel .carousel-indicators li",
        ];
        return interactiveSelectors.some((sel) => !!target.closest(sel));
    };

    // Activation (click or keyboard)
    const activateProperty = (propertyId: number, e?: React.MouseEvent | React.KeyboardEvent) => {
        // if event provided and originates from an interactive sub-element -> don't navigate
        const evtTarget = e ? (e.target as EventTarget) : null;
        if (evtTarget && shouldIgnoreActivation(evtTarget)) return;

        // If mouse event with ctrl/cmd or middle click -> open new tab
        if (e && "ctrlKey" in e && ((e as React.MouseEvent).ctrlKey || (e as React.MouseEvent).metaKey)) {
            window.open(`/properties/${propertyId}`, "_blank", "noopener");
            return;
        }

        // Otherwise use SPA navigation
        navigate(`/properties/${propertyId}`);
    };

    const onCardKeyDown = (propertyId: number, e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            activateProperty(propertyId, e);
        }
    };

    // UI de carga / error / sin resultados
    if (loading)
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Cargando propiedades...</p>
            </Container>
        );

    if (error)
        return (
            <Container className="py-5 text-center">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );

    if (properties.length === 0)
        return (
            <Container className="py-5 text-center">
                <Alert variant="info">
                    <strong>No hay propiedades disponibles en este momento.</strong>
                    <p className="mt-2 mb-0 text-muted">
                        Vuelve pronto para ver nuevas publicaciones.
                    </p>
                </Alert>
            </Container>
        );

    return (
        <section className="properties-gallery" style={{ minHeight: "100vh", paddingTop: "50px" }}>
            <Container>
                {/* Filtros */}
                <Form className="mb-4 bg-light p-3 rounded shadow-sm">
                    <Row className="g-3 align-items-end">
                        <Col md={2}>
                            <Form.Label className="fw-semibold small text-muted">
                                Ciudad
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ej: Medellín"
                                value={filters.city}
                                onChange={(e) =>
                                    setFilters({ ...filters, city: e.target.value })
                                }
                            />
                        </Col>

                        <Col md={2}>
                            <Form.Label className="fw-semibold small text-muted">
                                Transacción
                            </Form.Label>
                            <Form.Select
                                value={filters.transaction_type}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        transaction_type: e.target.value,
                                    })
                                }
                            >
                                <option value="">Todas</option>
                                <option value="rent">Arriendo</option>
                                <option value="sale">Venta</option>
                            </Form.Select>
                        </Col>

                        <Col md={2}>
                            <Form.Label className="fw-semibold small text-muted">
                                Categoría
                            </Form.Label>
                            <Form.Select
                                value={filters.category_id}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        category_id: e.target.value,
                                    })
                                }
                            >
                                <option value="">Todas</option>
                                <option value="1">Casa</option>
                                <option value="2">Apartamento</option>
                                <option value="3">Local</option>
                            </Form.Select>
                        </Col>

                        <Col md={2}>
                            <Form.Label className="fw-semibold small text-muted">
                                Precio mín.
                            </Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Desde"
                                value={filters.price_min}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        price_min: e.target.value,
                                    })
                                }
                            />
                        </Col>

                        <Col md={2}>
                            <Form.Label className="fw-semibold small text-muted">
                                Precio máx.
                            </Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Hasta"
                                value={filters.price_max}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        price_max: e.target.value,
                                    })
                                }
                            />
                        </Col>

                        <Col md={2} className="text-end">
                            <Button
                                variant="outline-secondary"
                                onClick={() =>
                                    setFilters({
                                        city: "",
                                        category_id: "",
                                        transaction_type: "",
                                        price_min: "",
                                        price_max: "",
                                    })
                                }
                            >
                                Limpiar
                            </Button>
                        </Col>
                    </Row>
                </Form>

                {/* Propiedades */}
                <Row className="g-4">
                    {properties.map((property) => (
                        <Col key={property.id} xs={12} sm={6} md={4} lg={3}>
                            {/* Make the whole card keyboard-accessible and clickable */}
                            <Card
                                as="article"
                                role="button"
                                tabIndex={0}
                                className="property-airbnb-card h-100 border-0 shadow-sm clickable-card"
                                onClick={(e: React.MouseEvent) => activateProperty(property.id, e)}
                                onKeyDown={(e: React.KeyboardEvent) => onCardKeyDown(property.id, e)}
                            >
                                <div className="position-relative">
                                    {property.images && property.images.length > 0 ? (
                                        <Carousel
                                            interval={4500}
                                            controls={property.images.length > 1}
                                            indicators={property.images.length > 1}
                                            pause="hover"
                                            fade={false}
                                            className="rounded-4 overflow-hidden"
                                        >
                                            {property.images.map((img, index) => (
                                                <Carousel.Item key={index}>
                                                    <img
                                                        src={`${BASE_URL}${img.image_url}`}
                                                        alt={`Propiedad ${property.id} - Imagen ${index + 1}`}
                                                        className="d-block w-100"
                                                        style={{
                                                            height: "220px",
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
                                            className="d-block w-100 rounded-4"
                                            style={{ height: "220px", objectFit: "cover" }}
                                        />
                                    )}
                                </div>

                                <Card.Body>
                                    <Card.Title className="fw-semibold mb-1 text-truncate">
                                        {property.description || "Propiedad sin descripción"}
                                    </Card.Title>

                                    <Card.Text className="text-muted small mb-2">
                                        {property.city} - {property.address}
                                    </Card.Text>

                                    <div className="mb-2">
                                        {/* Estado */}
                                        {property.listing_status && (
                                            <span
                                                className={`badge ${property.listing_status === "available"
                                                        ? "bg-success"
                                                        : property.listing_status === "reserved"
                                                            ? "bg-info text-dark"
                                                            : property.listing_status === "rented"
                                                                ? "bg-warning text-dark"
                                                                : property.listing_status === "sold"
                                                                    ? "bg-danger"
                                                                    : "bg-secondary"
                                                    }`}
                                            >
                                                {statusTranslations[property.listing_status] ||
                                                    "Sin estado"}
                                            </span>
                                        )}

                                        {/* Tipo de transacción */}
                                        {property.transaction_type && (
                                            <span
                                                className={`badge ${property.transaction_type === "rent"
                                                        ? "bg-warning text-dark"
                                                        : "bg-info text-dark"
                                                    } ms-2`}
                                            >
                                                {transactionTypeTranslations[property.transaction_type]}
                                            </span>
                                        )}
                                    </div>

                                    <div className="fw-bold text-dark fs-6">
                                        {formatPrice(property.price)}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* 📄 Paginación */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination">
                                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(page - 1)}
                                    >
                                        &lt;
                                    </button>
                                </li>

                                {Array.from({ length: totalPages }, (_, i) => (
                                    <li
                                        key={i}
                                        className={`page-item ${page === i + 1 ? "active" : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => setPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}

                                <li
                                    className={`page-item ${page === totalPages ? "disabled" : ""
                                        }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(page + 1)}
                                    >
                                        &gt;
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

export default PublicPropertiesList;