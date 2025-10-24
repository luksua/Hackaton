/* eslint-disable @typescript-eslint/no-explicit-any */
/* Updated: show alert when no results; keeps debounce + cancel handling */
import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import MapComponent from "../components/PropertyMap";
import MapSidebar from "../components/MapSidebar";
import { propertyService } from "../services/api";

type MarkerItem = {
    id: number;
    latitude: number;
    longitude: number;
    title?: string;
    address?: string;
    price?: string | number;
    image_url?: string | null;
};

const DEBOUNCE_MS = 300;

const PropertiesMapPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialFilters = {
        query: searchParams.get("query") ?? "",
        location: searchParams.get("location") ?? "",
        propertyType: searchParams.get("propertyType") ?? "",
        operationType: searchParams.get("operationType") ?? "",
    };

    const [filters, setFilters] = useState(initialFilters);
    const [markers, setMarkers] = useState<MarkerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [noResults, setNoResults] = useState(false); // NEW: track empty results

    // refs para debounce y controller
    const debounceRef = useRef<number | null>(null);
    const controllerRef = useRef<AbortController | null>(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            if (controllerRef.current) {
                controllerRef.current.abort();
                controllerRef.current = null;
            }
        };
    }, []);

    // cuando cambien filtros, buscar (con debounce y manejo de cancelaciones)
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }

        debounceRef.current = window.setTimeout(() => {
            // abortear petición anterior si la hay
            if (controllerRef.current) {
                controllerRef.current.abort();
                controllerRef.current = null;
            }

            const controller = new AbortController();
            controllerRef.current = controller;

            const fetch = async () => {
                try {
                    if (!mountedRef.current) return;
                    setLoading(true);
                    setError(null);
                    setNoResults(false);

                    // Llamada al servicio (asegúrate que acepta { signal })
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const res: any = await propertyService.getFilteredProperties(filters as any, { signal: controller.signal });

                    // Normalizar la respuesta
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const list: any[] = Array.isArray(res)
                        ? res
                        : Array.isArray(res?.data)
                            ? res.data
                            : Array.isArray(res?.properties)
                                ? res.properties
                                : [];

                    const mapped: MarkerItem[] = list
                        .map((p: any) => {
                            const lat = p.latitude ?? p.lat ?? null;
                            const lng = p.longitude ?? p.lng ?? null;
                            if (lat === null || lng === null || lat === undefined || lng === undefined) return null;
                            return {
                                id: p.id,
                                latitude: Number(lat),
                                longitude: Number(lng),
                                title: p.address ?? p.description ?? p.title,
                                address: p.city ?? "",
                                price: p.price ?? "",
                                image_url: p.images?.[0]?.image_url ? `http://127.0.0.1:8000/storage/${p.images[0].image_url}` : null,
                            } as MarkerItem;
                        })
                        .filter(Boolean) as MarkerItem[];

                    if (!mountedRef.current) return;
                    setMarkers(mapped);
                    setNoResults(mapped.length === 0); // NEW: set no results flag

                    // actualizar querystring también (opcional)
                    const params = new URLSearchParams();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    Object.entries(filters).forEach(([k, v]: any) => {
                        if (v) params.set(k, String(v));
                    });
                    setSearchParams(params, { replace: true });
                } catch (err: any) {
                    const isCanceled =
                        err?.name === "CanceledError" ||
                        err?.code === "ERR_CANCELED" ||
                        err?.name === "AbortError" ||
                        axios.isCancel?.(err);

                    if (isCanceled) {
                        // petición cancelada por debounce/desmontaje — no mostramos error
                        return;
                    }

                    console.error(err);
                    if (mountedRef.current) {
                        setError("No se pudieron cargar propiedades.");
                    }
                } finally {
                    if (mountedRef.current) setLoading(false);
                }
            };

            fetch();
        }, DEBOUNCE_MS);

        // cleanup del efecto: cancelar timeout si filters cambian rápido
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    // aplica filtros desde el sidebar
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleApply = (f: any) => {
        setFilters((prev) => ({ ...prev, ...f }));
    };

    return (
        <section className="map-page" style={{ minHeight: "75vh" }}>
            <Container fluid>
                <Row>
                    <Col md={3} style={{ padding: 16 }}>
                        <MapSidebar initial={filters} onApply={handleApply} />
                    </Col>

                    <Col md={9} style={{ height: "80vh", padding: 0 }}>
                        {loading ? (
                            <div className="d-flex align-items-center justify-content-center" style={{ height: "100%" }}>
                                <Spinner animation="border" />
                            </div>
                        ) : error ? (
                            <div className="p-4">
                                <Alert variant="danger">{error}</Alert>
                            </div>
                        ) : noResults ? (
                            <div className="p-4">
                                <Alert variant="warning">No se encontraron propiedades con esos filtros.</Alert>
                            </div>
                        ) : (
                            /* CENTER: [lng, lat] */
                            <MapComponent center={[-74.2973, 4.5709]} zoom={11} markers={markers} height="80vh" />
                        )}
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default PropertiesMapPage;