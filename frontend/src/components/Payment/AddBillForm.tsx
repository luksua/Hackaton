import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { billingService, contractService, saleService } from "../../services/api";
import type { BillFormData } from "../../types/bills";
import type { ContractWithRelations } from "../../types/contracts";
import type { SaleWithRelations } from "../../types/sales";

const AddBillForm: React.FC = () => {
  const [billType, setBillType] = useState("App\\Models\\Contract");
  const [entities, setEntities] = useState<(ContractWithRelations | SaleWithRelations)[]>([]);
  const [formData, setFormData] = useState<BillFormData>({
    billable_type: "App\\Models\\Contract",
    billable_id: 0,
    amount: 0,
    due_date: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);

  // 🔹 Cargar contratos o ventas según tipo
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        if (billType === "App\\Models\\Contract") {
          const data = await contractService.getAll(); // 👈 Llama tu endpoint de contratos
          setEntities(data);
        } else if (billType === "App\\Models\\Sale") {
          const data = await saleService.getAll(); // 👈 Llama tu endpoint de ventas
          setEntities(data);
        }
      } catch (err: any) {
        console.error(err);
        setError("No se pudieron cargar contratos o ventas.");
      }
    };

    fetchEntities();
  }, [billType]);

  // 🔹 Manejar cambios del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Crear nueva cuenta de cobro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await billingService.createBill(formData);
      alert("✅ Cuenta de cobro creada correctamente");
    } catch (err: any) {
      console.error(err);
      setError("Error al crear cuenta de cobro");
    }
  };
  // cargar propiedades para el select
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await propertyService.getAllProperties(1);
        setProperties(res.data || []);
      } catch (err) {
        console.error("Error cargando propiedades:", err);
      }
    };
    fetchProperties();
  }, []);

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Tipo de cuenta</Form.Label>
        <Form.Select
          value={billType}
          onChange={(e) => {
            const type = e.target.value;
            setBillType(type);
            setFormData((prev) => ({ ...prev, billable_type: type }));
          }}
        >
          <option value="App\\Models\\Contract">Contrato (Arriendo)</option>
          <option value="App\\Models\\Sale">Venta (Propiedad)</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Contrato / Venta</Form.Label>
        <Form.Select
          name="billable_id"
          value={formData.billable_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione...</option>
          {entities.map((entity) => (
            <option key={entity.id} value={entity.id}>
              {billType === "App\\Models\\Contract"
                ? `Contrato #${entity.id} - ${entity.property?.address}`
                : `Venta #${entity.id} - ${entity.property?.address}`}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Inmueble asociado</Form.Label>
        <Form.Select
          name="property_id"
          value={formData.property_id || ""}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un inmueble...</option>
          {properties.map((prop) => (
            <option key={prop.id} value={prop.id}>
              {prop.address} ({prop.city})
            </option>
          ))}
        </Form.Select>
      </Form.Group>


      <Form.Group className="mb-3">
        <Form.Label>Monto</Form.Label>
        <Form.Control
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Fecha de vencimiento</Form.Label>
        <Form.Control
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          rows={2}
          value={formData.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Button type="submit" variant="primary">
        Crear cuenta de cobro
      </Button>
    </Form>
  );
};

export default AddBillForm;
