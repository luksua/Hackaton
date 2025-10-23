import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import BillsList from "../components/Payment/BillsList";
import PaymentForm from "../components/Payment/PaymentForm";
import type { BillWithRelations } from "../types/bills";

const TenantBillingPage: React.FC = () => {
  const [selectedBill, setSelectedBill] = useState<BillWithRelations | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <Container fluid className="py-5">
      <h3 className="fw-bold text-primary-custom mb-4 text-center">
        💳 Pagos y Cuentas del Inquilino
      </h3>
      <Row>
        <Col md={7}>
          <BillsList onSelectBill={setSelectedBill} refreshTrigger={refreshTrigger} />
        </Col>
        <Col md={5}>
          <PaymentForm
            selectedBill={selectedBill}
            onPaymentSuccess={() => setRefreshTrigger((p) => p + 1)}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default TenantBillingPage;
