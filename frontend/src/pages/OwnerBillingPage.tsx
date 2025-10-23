import React from "react";
import { Container } from "react-bootstrap";
import AddBillForm from "../components/Payment/AddBillForm";
import BillsList from "../components/Payment/BillsList";

const OwnerBillingPage: React.FC = () => {
  return (
    <Container className="py-5">
      <h3 className="fw-bold text-primary-custom mb-4 text-center">
        🧾 Gestión de Cuentas de Cobro (Propietario)
      </h3>
      <AddBillForm />
      <hr />
      <BillsList />
    </Container>
  );
};

export default OwnerBillingPage;
