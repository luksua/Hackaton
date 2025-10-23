import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { contractService, propertyService } from "../../services/api";
import type { ContractFormData } from "../../types/contracts";
import type { Property } from "../../types/properties";
import type { User } from "../../types/users";
import { useAuth } from "../../Hooks/UseAuth";
import axios from "axios";

const AddContractForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ContractFormData>({
    property_id: 0,
    tenant_id: 0,
    start_date: "",
    end_date: "",
    monthly_rent: 0,
    security_deposit: 0,
    terms: "",
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📦 Cargar propiedades del propietario
  useEffect(() => {
    if (!user?.id) return; // 🛡 Evita que se ejecute sin usuario

    const fetchData = async () => {
      try {
        // 👇 Usa el nuevo método que devuelve solo el array de propiedades
        const props = await propertyService.getOwnerPropertiesList(user.id);
        setProperties(props);
      } catch (err) {
        console.error("Error cargando propiedades:", err);
      }
    };

    fetchData();
  }, [user]);

  // 👥 Cargar lista de inquilinos (tenants)
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await axios.get<User[]>(
          "http://localhost:8000/api/users?role=tenant"
        );
        setTenants(res.data);
      } catch (err) {
        console.error("Error cargando inquilinos:", err);
      }
    };
    fetchTenants();
  }, []);

  // 🔄 Cambiar inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "monthly_rent" || name === "security_deposit"
          ? parseFloat(value)
          : value,
    }));
  };

  // 📝 Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await contractService.createContract(formData);
      setSuccess(true);

      setTimeout(() => navigate("/contratos"), 2000);
    } catch (err) {
      console.error("Error creando contrato:", err);
      setError("No se pudo registrar el contrato. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h2 className="mb-4 fw-bold text-center text-primary-custom">
            Registrar Nuevo Contrato de Arrendamiento
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">
              ✅ Contrato registrado correctamente.
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Propiedad */}
            <Form.Group className="mb-3">
              <Form.Label>Propiedad</Form.Label>
              <Form.Select
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una propiedad</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.address} - {p.city}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Inquilino */}
            <Form.Group className="mb-3">
              <Form.Label>Inquilino</Form.Label>
              <Form.Select
                name="tenant_id"
                value={formData.tenant_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un inquilino</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.email})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Fechas */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de inicio</Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de finalización</Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Precio y depósito */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Renta mensual (USD)</Form.Label>
                  <Form.Control
                    type="number"
                    name="monthly_rent"
                    value={formData.monthly_rent}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Depósito de seguridad (USD)</Form.Label>
                  <Form.Control
                    type="number"
                    name="security_deposit"
                    value={formData.security_deposit ?? ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Términos */}
            <Form.Group className="mb-3">
              <Form.Label>Términos del contrato</Form.Label>
              <Form.Control
                as="textarea"
                name="terms"
                rows={4}
                value={formData.terms ?? ""}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Archivo */}
            <Form.Group className="mb-3">
              <Form.Label>Archivo del contrato (PDF)</Form.Label>
              <Form.Control
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    file: e.target.files?.[0] || null,
                  })
                }
              />
            </Form.Group>

            <div className="text-center mt-4">
              <Button
                type="submit"
                variant="primary-custom"
                size="lg"
                className="rounded-pill px-5"
                disabled={loading}
              >
                {loading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  "Registrar Contrato"
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddContractForm;
