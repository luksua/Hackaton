import React, { useState } from "react";
import { Form, Button, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import { saleService } from "../../services/api";
import type { SaleFormData } from "../../types/sales";

const AddSaleForm: React.FC = () => {
  const [formData, setFormData] = useState<SaleFormData>({
    property_id: 0,
    tenant_id: 0,
    total_amount: 0,
    sale_type: "normal",
    installments: undefined,
    installment_amount: undefined,
    sale_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "property_id" ||
        name === "tenant_id" ||
        name === "installments" ||
        name === "total_amount" ||
        name === "installment_amount"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await saleService.create(formData);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Error al crear la venta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3 className="text-center fw-bold mb-4 text-primary-custom">💰 Registrar Venta</h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">✅ Venta registrada correctamente.</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>ID Propiedad</Form.Label>
              <Form.Control
                type="number"
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ID Inquilino (Comprador)</Form.Label>
              <Form.Control
                type="number"
                name="tenant_id"
                value={formData.tenant_id}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Monto Total</Form.Label>
              <Form.Control
                type="number"
                name="total_amount"
                value={formData.total_amount}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de Venta</Form.Label>
              <Form.Select name="sale_type" value={formData.sale_type} onChange={handleChange}>
                <option value="normal">Normal</option>
                <option value="installment">A crédito (cuotas)</option>
              </Form.Select>
            </Form.Group>

            {formData.sale_type === "installment" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Cuotas</Form.Label>
                  <Form.Control
                    type="number"
                    name="installments"
                    value={formData.installments ?? ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Valor por Cuota</Form.Label>
                  <Form.Control
                    type="number"
                    name="installment_amount"
                    value={formData.installment_amount ?? ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Fecha de Venta</Form.Label>
              <Form.Control
                type="date"
                name="sale_date"
                value={formData.sale_date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="text-center">
              <Button variant="primary-custom" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Guardando...
                  </>
                ) : (
                  "Registrar Venta"
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddSaleForm;
