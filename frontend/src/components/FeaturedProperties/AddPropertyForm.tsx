/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Card, Form, Button, Row, Col, Alert, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LatLngPicker from "../LatLngPicker";
import { propertyService } from "../../services/api";

type Props = {
  initial?: any; // si es edición, pasar objeto propiedad
  onSuccess?: (data: any) => void;
};

const PropertyForm: React.FC<Props> = ({ initial = {}, onSuccess }) => {
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);

  // Estado agrupado del formulario con todos los campos que mostraste en la tabla
  const [formData, setFormData] = useState<Record<string, any>>({
    owner_id: initial.owner_id ?? "",
    category_id: initial.category_id ?? "",
    // Nuevo campo: transaction_type ('rent' | 'sale')
    transaction_type: initial.transaction_type ?? "",
    address: initial.address ?? "",
    city: initial.city ?? "",
    area: initial.area ?? "",
    price: initial.price ?? "",
    latitude:
      initial.latitude !== undefined && initial.latitude !== null ? Number(initial.latitude) : "",
    longitude:
      initial.longitude !== undefined && initial.longitude !== null ? Number(initial.longitude) : "",
    description: initial.description ?? "",
    bedrooms: initial.bedrooms ?? "",
    bathrooms: initial.bathrooms ?? "",
  });

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // New: success message state (display span alert before redirect)
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingCategories(true);
        // Se asume que propertyService tiene getCategories(). Si no, ver nota al final.
        if (typeof propertyService.getCategories === "function") {
          const list = await propertyService.getCategories();
          if (!mounted) return;
          setCategories(list);
        } else {
          // Fallback: intenta obtener /categories con fetch si getCategories no existe
          const res = await fetch("/api/categories");
          const data = await res.json();
          const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
          if (!mounted) return;
          setCategories(list);
        }
      } catch (err) {
        console.warn("No se pudieron cargar categorías", err);
        if (mounted) setCategories([]);
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      // cleanup timer si existe
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // para los campos numéricos, dejamos como string y convertimos al enviar
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 8); // límite prudente
    setImages(files);

    // generar previews
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((results) => setPreviews(results));
  };

  const removePreview = (index: number) => {
    const newFiles = images.slice();
    newFiles.splice(index, 1);
    setImages(newFiles);

    const newPreviews = previews.slice();
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSelectOnMap = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: Number(lat.toFixed(6)), longitude: Number(lng.toFixed(6)) }));
    setShowPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: Record<string, any> = {
        owner_id: formData.owner_id || null,
        category_id: formData.category_id || null,
        transaction_type: formData.transaction_type || null, // <-- incluido en el payload
        address: formData.address || null,
        city: formData.city || null,
        area: formData.area !== "" ? Number(formData.area) : null,
        price: formData.price !== "" ? Number(formData.price) : null,
        latitude: formData.latitude !== "" ? Number(formData.latitude) : null,
        longitude: formData.longitude !== "" ? Number(formData.longitude) : null,
        description: formData.description || null,
        bedrooms: formData.bedrooms !== "" ? Number(formData.bedrooms) : null,
        bathrooms: formData.bathrooms !== "" ? Number(formData.bathrooms) : null,
      };

      // Si initial tiene id => update, si no => create
      let res;
      if (initial?.id) {
        res = await propertyService.updateProperty(initial.id, payload, images.length ? images : undefined);
        setSuccessMessage("Propiedad actualizada correctamente");
      } else {
        res = await propertyService.createProperty(payload, images.length ? images : undefined);
        setSuccessMessage("Propiedad creada correctamente");
      }

      // llamar callback externo si lo hay
      onSuccess?.(res);

      // esperar un momento para que el usuario vea el mensaje, luego redirigir
      timerRef.current = window.setTimeout(() => {
        // sustituye la ruta por la que uses en tu app si es diferente
        navigate("/mis-propiedades");
      }, 1400);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message ?? "Error al guardar la propiedad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <div style={{ width: "100%", maxWidth: 980 }}>
          <Card className="property-form-card shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">{initial?.id ? "Editar Propiedad" : "Crear Propiedad"}</Card.Title>

              {/* Success span alert */}
              {successMessage && (
                <div className="mb-3">
                  <span className="alert alert-success py-1 px-2 d-inline-block" role="alert">
                    {successMessage}
                  </span>
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}

                <Row className="g-3">
                  {/* LEFT: inputs principales */}
                  <Col xs={12} md={8}>
                    <Row className="g-3">
                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="form-label">Categoría *</Form.Label>
                          {loadingCategories ? (
                            <div style={{ paddingTop: 8 }}>
                              <Spinner animation="border" size="sm" /> Cargando...
                            </div>
                          ) : (
                            <Form.Select
                              name="category_id"
                              value={formData.category_id ?? ""}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Seleccione una categoría</option>
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </Form.Select>
                          )}
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="form-label">Tipo de transacción *</Form.Label>
                          <Form.Select
                            name="transaction_type"
                            value={formData.transaction_type ?? ""}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Seleccione una opción</option>
                            <option value="rent">Rent (Alquiler)</option>
                            <option value="sale">Sale (Venta)</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="form-label">Precio</Form.Label>
                          <Form.Control
                            type="number"
                            name="price"
                            value={formData.price as any}
                            onChange={handleChange}
                            placeholder="Ej: 120000"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="form-label">Dirección</Form.Label>
                          <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Calle #, barrio..."
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="form-label">Ciudad</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Ej: Bogotá"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="form-label">Área (m²)</Form.Label>
                          <Form.Control
                            type="number"
                            name="area"
                            value={formData.area as any}
                            onChange={handleChange}
                            placeholder="Ej: 120"
                            step="0.01"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="form-label">Descripción</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Descripción breve..."
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="form-label">Habitaciones</Form.Label>
                          <Form.Control
                            type="number"
                            name="bedrooms"
                            value={formData.bedrooms as any}
                            onChange={handleChange}
                            placeholder="Ej: 3"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="form-label">Baños</Form.Label>
                          <Form.Control
                            type="number"
                            name="bathrooms"
                            value={formData.bathrooms as any}
                            onChange={handleChange}
                            placeholder="Ej: 2"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  {/* RIGHT: imágenes, lat/lng, owner y acciones */}
                  <Col xs={12} md={4}>
                    <div className="d-flex flex-column h-100">
                      <div className="mb-3">
                        <Form.Label className="form-label">Imágenes</Form.Label>
                        <div className="mb-2">
                          <Form.Label className="file-label">
                            Seleccionar imágenes
                            <input type="file" accept="image/*" multiple hidden onChange={onFilesChange} />
                          </Form.Label>
                        </div>

                        <div className="preview-grid mb-2">
                          {previews.length > 0 ? (
                            previews.map((p, i) => (
                              <div key={i} className="preview-item">
                                <img src={p} alt={`preview-${i}`} />
                                <button type="button" className="btn btn-sm btn-light remove-btn" onClick={() => removePreview(i)}>
                                  ×
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="text-muted small">No hay imágenes seleccionadas</div>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <Form.Label className="form-label">Latitud / Longitud</Form.Label>
                        <Row className="g-2">
                          <Col xs={6}>
                            <Form.Control
                              type="number"
                              step="0.000001"
                              name="latitude"
                              value={formData.latitude as any}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, latitude: e.target.value === "" ? "" : Number(e.target.value) }))
                              }
                              placeholder="Latitud"
                            />
                          </Col>
                          <Col xs={6}>
                            <Form.Control
                              type="number"
                              step="0.000001"
                              name="longitude"
                              value={formData.longitude as any}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, longitude: e.target.value === "" ? "" : Number(e.target.value) }))
                              }
                              placeholder="Longitud"
                            />
                          </Col>
                        </Row>

                        <div className="mt-2 d-flex gap-2">
                          <Button variant="outline-secondary" onClick={() => setShowPicker(true)} className="flex-grow-1">
                            Elegir en mapa
                          </Button>
                          <Button
                            variant="outline-danger"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, latitude: "", longitude: "" }));
                            }}
                          >
                            Limpiar
                          </Button>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <Button type="submit" disabled={loading} variant="success" className="w-100">
                          {initial?.id ? (loading ? "Actualizando..." : "Actualizar propiedad") : loading ? "Creando..." : "Crear propiedad"}
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Modal show={showPicker} onHide={() => setShowPicker(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar ubicación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LatLngPicker
            initial={
              formData.latitude !== "" && formData.longitude !== "" ? { lat: Number(formData.latitude), lng: Number(formData.longitude) } : null
            }
            height="500px"
            onSelect={handleSelectOnMap}
          />
          <div className="text-muted mt-2">Haz click en el mapa para seleccionar la ubicación (lat/lng).</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPicker(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PropertyForm;