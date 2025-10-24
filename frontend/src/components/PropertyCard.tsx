/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate } from "react-router-dom";

type PropertyCardProps = {
    property: {
        id: number;
        address?: string;
        city?: string;
        price?: string | number;
        image_url?: string | null;
        bedrooms?: number | null;
        bathrooms?: number | null;
        area?: number | null;
        transaction_type?: string | null;
    };
    // opcional: permitir override de la ruta de detalle
    detailPathPrefix?: string;
    // opcional: si true abre en nueva pestaña en vez de navegar internamente
    openInNewTab?: boolean;
    // opcional: clase adicional
    className?: string;
};

const PropertyCard: React.FC<PropertyCardProps> = ({
    property,
    detailPathPrefix = "/properties",
    openInNewTab = false,
    className = "",
}) => {
    const navigate = useNavigate();
    const path = `${detailPathPrefix.replace(/\/$/, "")}/${property.id}`;

    const onActivate = (ev?: React.MouseEvent | React.KeyboardEvent) => {
        // if user held ctrl/cmd or middle click on mouse, open new tab
        if (ev && "ctrlKey" in ev && (ev.ctrlKey || (ev as React.MouseEvent).metaKey)) {
            window.open(path, "_blank", "noopener");
            return;
        }
        if (openInNewTab) {
            window.open(path, "_blank", "noopener");
            return;
        }
        navigate(path);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onActivate(e);
        }
    };

    const imgSrc = property.image_url ?? "/placeholder-property.png";

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={onActivate}
            onKeyDown={onKeyDown}
            className={`property-card clickable-card ${className}`}
            aria-label={`Ver detalle de la propiedad ${property.address ?? `#${property.id}`}`}
        >
            <div className="property-card-image-wrap">
                <img src={imgSrc} alt={property.address ?? `Propiedad ${property.id}`} loading="lazy" />
            </div>

            <div className="property-card-body">
                <div className="property-card-row">
                    <h4 className="property-card-title">{property.address ?? "Sin dirección"}</h4>
                    <div className="property-card-price">{formatPrice(property.price)}</div>
                </div>

                <div className="property-card-sub">
                    <span className="text-muted">{property.city ?? ""}</span>
                    {property.transaction_type ? <span className="tx-mini">{String(property.transaction_type)}</span> : null}
                </div>

                <div className="property-card-meta">
                    <span>{property.bedrooms ?? "-"} 🛏</span>
                    <span>{property.bathrooms ?? "-"} 🛁</span>
                    <span>{property.area ? `${property.area} m²` : "-"}</span>
                </div>
            </div>
        </article>
    );
};

function formatPrice(value: any) {
    if (value === null || value === undefined || value === "") return "";
    const num = Number(value);
    if (!Number.isFinite(num)) return String(value);
    // muestra sin decimales; ajusta locale/currency si lo deseas
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(num);
}

export default PropertyCard;