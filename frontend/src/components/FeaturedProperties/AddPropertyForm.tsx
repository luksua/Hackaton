import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { PropertyForm } from "../../types/properties";
import type { Category } from "../../types/categories";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  propertyService,
  propertyImageService,
  categoryService,
} from "../../services/api";
import { useAuth } from "../../Hooks/UseAuth";

const AddPropertyForm: React.FC = () => {
  const navigate = useNavigate();

  const { isAuthenticated, isOwner } = useAuth();


  const [formData, setFormData] = useState<PropertyForm>({
    category_id: 1,
    address: "",
    city: "",
    area: null,
    price: null,
    description: "",
    bedrooms: null,
    bathrooms: null,
    transaction_type: "rent",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔒 Redirección si no tiene permisos
  useEffect(() => {
    if (!isAuthenticated || !isOwner) navigate("/login");
  }, [isAuthenticated, isOwner, navigate]);

  // 📦 Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
        setError("No se pudieron cargar las categorías.");
      }
    };
    fetchCategories();
  }, []);

  // 🧩 Manejo de cambios en inputs
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: ["price", "area", "bedrooms", "bathrooms", "category_id"].includes(name)
          ? value === "" ? null : Number(value)
          : value,
      }));
    },
    []
  );

  // Manejo de imágenes seleccionadas
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setPreviewImages(files.map((f) => URL.createObjectURL(f)));
  };

  // Enviar formulario
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.address || !formData.city || !formData.price) {
    setError("Por favor, completa los campos obligatorios.");
    return;
  }

  setLoading(true);
  setError(null);
  setSuccess(false);

  try {
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value.toString());
      }
    });

    selectedFiles.forEach((file) => {
      data.append("images[]", file);
    });

    const createdProperty = await propertyService.createProperty(data);

    setSuccess(true);
    setTimeout(() => navigate("/propiedades"), 2000);
  } catch (err: any) {
    console.error("Error al crear propiedad:", err);
    setError(err?.response?.data?.message || "Error al crear la propiedad.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Container className="py-5 mt-5" style={{ minHeight: "100vh", paddingTop: "80px" }}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="fw-bold text-center mb-4 text-primary-custom">
            Agregar Nueva Propiedad
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success"> Propiedad creada correctamente.</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Categoría */}
            <Form.Group className="mb-3">
              <Form.Label>Categoría *</Form.Label>
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
            </Form.Group>

            {/* Dirección */}
            <Form.Group className="mb-3">
              <Form.Label>Dirección *</Form.Label>
              <Form.Control
                name="address"
                placeholder="Ej: Av. Siempre Viva 742"
                value={formData.address}
              />
            </Form.Group>

            {/* Dirección */}
            <Form.Group className="mb-3">
              <Form.Label>Dirección *</Form.Label>
              <Form.Control
                name="address"
                placeholder="Ej: Av. Siempre Viva 742"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Ciudad */}
            <Form.Group className="mb-3">
              <Form.Label>Ciudad *</Form.Label>
              <Form.Control
                name="city"
                placeholder="Ej: Springfield"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Área y Precio */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Área (m²)</Form.Label>
                  <Form.Control
                    type="number"
                    name="area"
                    placeholder="Ej: 120"
                    value={formData.area ?? ""}
                    onChange={handleChange}
                    min={0}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio (USD) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="Ej: 95000"
                    value={formData.price ?? ""}
                    onChange={handleChange}
                    min={0}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Habitaciones y Baños */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Habitaciones</Form.Label>
                  <Form.Control
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms ?? ""}
                    onChange={handleChange}
                    min={0}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Baños</Form.Label>
                  <Form.Control
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms ?? ""}
                    onChange={handleChange}
                    min={0}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Imágenes */}
            <Form.Group className="mb-3">
              <Form.Label>Imágenes del inmueble</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>

            {previewImages.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-3">
                {previewImages.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`preview-${idx}`}
                    width={100}
                    height={100}
                    className="rounded shadow-sm object-fit-cover"
                  />
                ))}
              </div>
            )}

            {/* Descripción */}
            <Form.Group className="mb-4">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Escribe una breve descripción de la propiedad..."
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Botones */}
            <div className="text-center">
              <Button
                variant="primary-custom"
                type="submit"
                disabled={loading}
                className="rounded-pill px-4"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" /> Guardando...
                  </>
                ) : (
                  "Guardar Propiedad"
                )}
              </Button>

              <Button
                variant="outline-secondary"
                className="ms-3 rounded-pill px-4"
                onClick={() => navigate("/mis-propiedades")}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddPropertyForm;
