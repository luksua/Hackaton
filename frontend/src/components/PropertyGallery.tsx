import React from "react";
import { Carousel } from "react-bootstrap";

type Props = {
    images: (string | null | undefined)[];
    height?: number | string; // allow numeric px or CSS string
};

const PropertyGallery: React.FC<Props> = ({ images = [], height = 360 }) => {
    const safeImages = (images ?? []).filter(Boolean) as string[];

    const heightStyle = typeof height === "number" ? `${height}px` : height;

    if (safeImages.length === 0) {
        // placeholder
        return (
            <div
                style={{
                    width: "100%",
                    height: heightStyle,
                    background: "#f4f4f4",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div className="text-muted">No hay imágenes</div>
            </div>
        );
    }

    return (
        <Carousel variant="dark" indicators={safeImages.length > 1} controls={safeImages.length > 1}>
            {safeImages.map((src, idx) => (
                <Carousel.Item key={idx}>
                    <img
                        src={src}
                        alt={`imagen-${idx}`}
                        style={{
                            width: "100%",
                            height: heightStyle,
                            objectFit: "cover",
                            borderRadius: 12,
                            display: "block",
                        }}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default PropertyGallery;