import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Form, Button, Badge, Spinner, Alert } from "react-bootstrap";
import { billingService } from "../../services/api";
import type { BillWithRelations } from "../../types/bills";
interface BillsListProps {
  onSelectBill?: (bill: BillWithRelations) => void;
  refreshTrigger?: number;
}
const BillsList: React.FC<BillsListProps> = ({ onSelectBill, refreshTrigger }) => {
  const [bills, setBills] = useState<BillWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await billingService.getAllBills();
        setBills(data);
      } catch (error) {
        console.error("Error al cargar cuentas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, [refreshTrigger]);

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.billable?.tenant?.name?.toLowerCase().includes(search.toLowerCase()) ||
      bill.billable?.property?.address?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter ? bill.status === statusFilter : true;
    const matchesMonth = monthFilter
      ? bill.due_date.startsWith(monthFilter)
      : true;

    return matchesSearch && matchesStatus && matchesMonth;
  });


  return (
    <Container>
      <h5 className="fw-bold mb-3">📋 Cuentas de Cobro</h5>
      <Row className="mb-3 align-items-center">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Buscar por cliente o inmueble..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Buscar por cliente o inmueble..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Estado del pago</option>
            <option value="paid">Pagado</option>
            <option value="pending">Pendiente</option>
            <option value="overdue">Vencido</option>
          </Form.Select>

          <Form.Control
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          />
        </Col>
      </Row>

      {loading ? (
        <Spinner animation="border" />
      ) : (

        <Table hover bordered responsive className="align-middle">
          <thead className="table-primary">
            <tr>
              <th>Inmueble</th>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Fecha de vencimiento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted py-3">
                  No hay cuentas registradas
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill.billable?.property?.address || "N/A"}</td>
                  <td>{bill.billable?.tenant?.name || "N/A"}</td>
                  <td>€{bill.amount.toFixed(2)}</td>
                  <td>{bill.due_date}</td>
                  <td>
                    <Badge
                      bg={
                        bill.status === "paid"
                          ? "success"
                          : bill.status === "overdue"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {bill.status === "paid"
                        ? "Pagado"
                        : bill.status === "overdue"
                          ? "Vencido"
                          : "Pendiente"}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleViewBill(bill.id)}
                    >
                      Ver detalles
                    </Button>
                  </td>
                </tr>
              ))
            )}

          </tbody>
        </Table>

      )}
    </Container>
  );
};

export default BillsList;
