import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
    initial?: { lat: number; lng: number } | null;
    height?: string;
    onSelect: (lat: number, lng: number) => void;
};

const LatLngPicker: React.FC<Props> = ({ initial = null, height = "300px", onSelect }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const map = new maplibregl.Map({
            container: containerRef.current,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: "raster",
                        tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
                        tileSize: 256,
                    },
                },
                layers: [{ id: "osm", type: "raster", source: "osm" }],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any,
            center: initial ? [initial.lng, initial.lat] : [-74.2973, 4.5709],
            zoom: initial ? 13 : 5,
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");

        map.on("click", (e) => {
            const lng = e.lngLat.lng;
            const lat = e.lngLat.lat;

            // mover/crear marker
            if (markerRef.current) {
                markerRef.current.setLngLat([lng, lat]);
            } else {
                const el = document.createElement("div");
                el.style.width = "18px";
                el.style.height = "18px";
                el.style.borderRadius = "50%";
                el.style.background = "#ff7a18";
                el.style.border = "2px solid #fff";
                el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
                markerRef.current = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
            }

            onSelect(lat, lng);
        });

        mapRef.current = map;

        return () => {
            markerRef.current?.remove();
            mapRef.current?.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (initial && mapRef.current) {
            mapRef.current.setCenter([initial.lng, initial.lat]);
            mapRef.current.setZoom(13);
            if (markerRef.current) markerRef.current.setLngLat([initial.lng, initial.lat]);
        }
    }, [initial]);

    return <div ref={containerRef} style={{ width: "100%", height, borderRadius: 8, overflow: "hidden" }} />;
};

export default LatLngPicker;