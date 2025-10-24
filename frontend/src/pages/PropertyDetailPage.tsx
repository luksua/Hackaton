/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import PropertyGallery from "../components/PropertyGallery";
import MapComponent from "../components/PropertyMap";
import { propertyService } from "../services/api";

type Property = {
    id: number;
    owner_id?: number | null;
    category_id?: number | null;
    transaction_type?: string | null;
    address?: string | null;
    city?: string | null;
    area?: number | null;
    price?: number | null | string;
    latitude?: number | null;
    longitude?: number | null;
    description?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    garage?: string | number | null;
    images?: { image_url?: string }[] | null;
    [key: string]: any;
};

const txLabel = (val?: string | null) => {
    if (!val) return null;
    const v = String(val).toLowerCase();
    if (v === "sale" || v === "venta") return { text: "En venta", variant: "sale" };
    if (v === "rent" || v === "alquiler") return { text: "En alquiler", variant: "rent" };
    return { text: String(val), variant: "neutral" };
};

const PropertyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const mountedRef = useRef(true);

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!id) {
            setError("ID de propiedad no proporcionado.");
            setLoading(false);
            return;
        }

        const fetchProperty = async () => {
            try {
                setLoading(true);
                setError(null);

                // Usa tu método existente getPropertyById (ajusta si el nombre es distinto)
                const res = await propertyService.getPropertyById(Number(id));
                if (!mountedRef.current) return;
                setProperty(res as any);
            } catch (err: any) {
                console.error(err);
                if (!mountedRef.current) return;
                setError("No se pudo cargar la propiedad. Intenta más tarde.");
            } finally {
                if (mountedRef.current) setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    // const handleEdit = () => {
    //     if (!property) return;
    //     navigate(`/properties/${property.id}/edit`);
    // };

    const handleBack = () => {
        navigate(-1);
    };

    const handleSchedule = () => {
        if (!property) return;
        navigate(`/contact?property_id=${property.id}`);
    };

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return (
            <Container className="py-4">
                <Alert variant="danger">{error}</Alert>
                <Button variant="secondary" onClick={handleBack}>
                    Volver
                </Button>
            </Container>
        );
    }

    if (!property) {
        return (
            <Container className="py-4">
                <Alert variant="warning">No se encontró la propiedad.</Alert>
                <Button variant="secondary" onClick={handleBack}>
                    Volver
                </Button>
            </Container>
        );
    }

    const baseStorage = (import.meta.env.VITE_API_URL as string) ? (import.meta.env.VITE_API_URL as string).replace(/\/api\/?$/, "") : "http://127.0.0.1:8000";
    const images = Array.isArray(property.images)
        ? property.images.map((i) => {
            const img = i?.image_url ?? "";
            if (!img) return "";
            if (img.startsWith("http://") || img.startsWith("https://")) return img;
            return `${baseStorage}/storage/${img}`;
        })
        : [];

    const center: [number, number] =
        property.longitude !== undefined && property.latitude !== undefined && property.longitude !== null && property.latitude !== null
            ? [Number(property.longitude), Number(property.latitude)]
            : [-74.2973, 4.5709];

    const tx = txLabel(property.transaction_type);

    return (
        <Container className="py-4 property-detail">
            {/* Hero gallery */}
            <Row>
                <Col>
                    <div className="hero-gallery-wrapper mb-3">
                        <PropertyGallery images={images} height={420} />
                    </div>
                </Col>
            </Row>

            {/* Title row: left title/subtitle, right schedule button */}
            <Row className="align-items-center mb-3">
                <Col md={9}>
                    <h2 className="property-title mb-1">{property.address ?? "Propiedad sin título"}</h2>
                    <div className="d-flex align-items-center gap-2 property-sub">
                        <div className="text-muted">
                            {property.city ?? ""} {property.city && property.address ? "· " : ""} {property.address ?? ""}
                        </div>
                        {/* Transaction badge next to subtitle */}
                        {tx ? (
                            <div className={`tx-badge tx-badge-${tx.variant}`} title={tx.text} style={{ marginLeft: 8 }}>
                                {tx.text}
                            </div>
                        ) : null}
                    </div>
                </Col>
                <Col md={3} className="text-md-end mt-3 mt-md-0">
                    <Button variant="success" onClick={handleSchedule} className="btn-schedule">
                        Contactar con el Propietario
                    </Button>
                </Col>
            </Row>

            {/* Stats cards */}
            <Row className="mb-4 stats-row gx-3">
                <Col xs={6} md={3}>
                    <div className="stat-card">
                        <div className="stat-icon">🛏</div>
                        <div className="stat-label">Habitaciones</div>
                        <div className="stat-value">{property.bedrooms ?? "-"}</div>
                    </div>
                </Col>
                <Col xs={6} md={3}>
                    <div className="stat-card">
                        <div className="stat-icon">🛁</div>
                        <div className="stat-label">Baños</div>
                        <div className="stat-value">{property.bathrooms ?? "-"}</div>
                    </div>
                </Col>
                <Col xs={6} md={3}>
                    <div className="stat-card">
                        <div className="stat-icon">📐</div>
                        <div className="stat-label">Superficie</div>
                        <div className="stat-value">{property.area ? `${property.area} m²` : "-"}</div>
                    </div>
                </Col>
                <Col xs={6} md={3}>
                    <div className="stat-card">
                        <div className="stat-icon">🚗</div>
                        <div className="stat-label">Garaje</div>
                        <div className="stat-value">{property.garage ?? "-"}</div>
                    </div>
                </Col>
            </Row>

            {/* Description */}
            <Row className="mb-4">
                <Col md={12}>
                    <h5>Descripción</h5>
                    <p className="text-muted desc-text">{property.description ?? "-"}</p>
                </Col>
            </Row>

            {/* Location map */}
            <Row>
                <Col md={12}>
                    <h5>Ubicación</h5>
                    <div className="map-card" style={{ height: 340 }}>
                        <MapComponent
                            center={center}
                            zoom={13}
                            markers={[
                                {
                                    id: property.id,
                                    latitude: Number(property.latitude ?? 0),
                                    longitude: Number(property.longitude ?? 0),
                                    title: property.address ?? undefined,
                                    price: property.price ?? undefined,
                                },
                            ]}
                            height="100%"
                        />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default PropertyDetailPage;