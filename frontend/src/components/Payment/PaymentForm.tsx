import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { billingService } from "../../services/api";
import type { BillWithRelations } from "../../types/bills";
import type { PaymentFormData } from "../../types/payments";

interface PaymentFormProps {
  selectedBill: BillWithRelations | null;
  onPaymentSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  selectedBill,
  onPaymentSuccess,
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    bill_id: 0,
    amount: 0,
    payment_date: "",
    payment_method: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedBill) {
      setFormData({
        bill_id: selectedBill.id,
        amount: selectedBill.amount,
        payment_date: new Date().toISOString().split("T")[0],
        payment_method: "",
        notes: "",
      });
    }
  }, [selectedBill]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBill) return;

    setLoading(true);
    try {
      await billingService.createPayment(formData);
      onPaymentSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Error al registrar pago.");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedBill)
    return (
      <Alert variant="info" className="mt-4">
        Selecciona una cuenta de cobro para registrar un pago.
      </Alert>
    );

  return (
    <Container>
      <h5 className="fw-bold mb-3">💳 Registrar Pago</h5>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Monto</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha de pago</Form.Label>
          <Form.Control
            type="date"
            name="payment_date"
            value={formData.payment_date}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Método de pago</Form.Label>
          <Form.Control
            type="text"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            placeholder="Efectivo, transferencia..."
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Guardando..." : "Registrar Pago"}
        </Button>
      </Form>
    </Container>
  );
};

export default PaymentForm;
