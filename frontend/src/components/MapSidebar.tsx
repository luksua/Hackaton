import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";

type Filters = {
    query?: string;
    location?: string;
    propertyType?: string;
    operationType?: string;
    priceMin?: number | "";
    priceMax?: number | "";
};

type Props = {
    initial?: Filters;
    onApply: (filters: Filters) => void;
};

const MapSidebar: React.FC<Props> = ({ initial = {}, onApply }) => {
    const [filters, setFilters] = useState<Filters>(initial);

    useEffect(() => {
        setFilters(initial);
    }, [initial]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: name === "priceMin" || name === "priceMax" ? (value === "" ? "" : Number(value)) : value,
        }));
    };

    const handleApply = () => {
        onApply(filters);
    };

    const handleReset = () => {
        const reset: Filters = {
            query: "",
            location: "",
            propertyType: "",
            operationType: "",
            priceMin: "",
            priceMax: "",
        };
        setFilters(reset);
        onApply(reset);
    };

    return (
        <Card className="p-3" style={{ height: "100%", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <Card.Body>
                <h5 className="mb-3">Filtros de Propiedades</h5>

                <Form.Group className="mb-3">
                    <Form.Label>Tipo de operación</Form.Label>
                    <Form.Select name="operationType" value={filters.operationType || ""} onChange={handleChange}>
                        <option value="">Todas</option>
                        <option value="Arriendo">Arriendo</option>
                        <option value="Venta">Venta</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Tipo de propiedad</Form.Label>
                    <Form.Select name="propertyType" value={filters.propertyType || ""} onChange={handleChange}>
                        <option value="">Todas</option>
                        <option value="Casa">Casa</option>
                        <option value="Apartamento">Apartamento</option>
                        <option value="Local">Local</option>
                        <option value="Terreno">Terreno</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Ciudad / Búsqueda</Form.Label>
                    <Form.Control type="text" name="location" value={filters.location || ""} onChange={handleChange} placeholder="Ej: Bogotá" />
                </Form.Group>

                <Form.Label>Rango de precio</Form.Label>
                <div className="d-flex gap-2 mb-3">
                    <Form.Control type="number" name="priceMin" value={filters.priceMin ?? ""} onChange={handleChange} placeholder="Mín" />
                    <Form.Control type="number" name="priceMax" value={filters.priceMax ?? ""} onChange={handleChange} placeholder="Máx" />
                </div>

                <div className="d-grid">
                    <Button variant="warning" className="mb-2" onClick={handleApply}>
                        Aplicar Filtros
                    </Button>
                    <Button variant="outline-secondary" onClick={handleReset}>
                        Limpiar
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default MapSidebar;