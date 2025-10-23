import React, { useEffect, useState } from "react";
import { Button, Spinner, Badge } from "react-bootstrap";
import { contractService } from "../../services/api";
import type { ContractWithRelations } from "../../types/contracts";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Props {
  propertyId: number;
}

const PropertyContracts: React.FC<Props> = ({ propertyId }) => {
  const [contracts, setContracts] = useState<ContractWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContracts = async () => {
      try {
        const data = await contractService.getContractsByProperty(propertyId);
        setContracts(data);
      } catch (error) {
        console.error("Error cargando contratos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContracts();
  }, [propertyId]);

  // 🧾 Generar PDF
  const generatePDF = (contract: ContractWithRelations) => {
    const doc = new jsPDF();
    doc.text("Contrato de Arrendamiento", 14, 20);
    doc.autoTable({
      startY: 30,
      head: [["Campo", "Valor"]],
      body: [
        ["Inquilino", contract.tenant?.name || `ID: ${contract.tenant_id}`],
        ["Propiedad", contract.property?.address || `ID: ${contract.property_id}`],
        ["Inicio", contract.start_date],
        ["Fin", contract.end_date],
        ["Renta mensual", `$${contract.monthly_rent.toLocaleString()}`],
        ["Estado", contract.status],
      ],
    });
    doc.save(`Contrato-${contract.id}.pdf`);
  };

  if (loading)
    return <Spinner animation="border" size="sm" className="d-block mx-auto" />;

  // 🟢 No hay contratos → propiedad disponible
  if (contracts.length === 0)
    return (
      <div className="text-center">
        <Badge bg="secondary">Disponible</Badge>
        <p className="text-muted small mb-2">Sin contratos activos</p>
        <Button
          size="sm"
          variant="primary-custom"
          onClick={() => (window.location.href = "/contratos")}
        >
          Crear Contrato
        </Button>
      </div>
    );

  // 📜 Hay contratos asociados
  return (
    <div>
      <h6 className="fw-bold text-primary-custom mb-2">Contratos asociados:</h6>
      {contracts.map((contract) => (
        <div
          key={contract.id}
          className="d-flex justify-content-between align-items-center border-bottom py-2"
        >
          <div>
            <strong>Inquilino:</strong>{" "}
            {contract.tenant?.name || `ID: ${contract.tenant_id}`} <br />
            <strong>Inicio:</strong> {contract.start_date} <br />
            <strong>Fin:</strong> {contract.end_date} <br />
            <Badge
              bg={
                contract.status === "active"
                  ? "success"
                  : contract.status === "finalized"
                  ? "danger"
                  : "secondary"
              }
            >
              {contract.status === "active"
                ? "Activo"
                : contract.status === "finalized"
                ? "Finalizado"
                : "Pendiente"}
            </Badge>
          </div>

          <div className="d-flex flex-column align-items-end">
            <Button
              size="sm"
              variant="outline-primary"
              className="mb-2"
              onClick={() => generatePDF(contract)}
            >
              Descargar PDF
            </Button>

            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => (window.location.href = `/contratos/${contract.id}/editar`)}
            >
              Actualizar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyContracts;
