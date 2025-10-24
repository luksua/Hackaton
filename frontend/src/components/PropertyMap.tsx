/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* PropertyMap: markers as always-visible styled cards (image + info + "Ver más detalles" button)
   Click on the card or button navigates to detail route (detailPathPrefix/id).
   Built with DOM creation (safer than innerHTML for image src).
*/
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type MarkerItem = {
    id: number;
    latitude: number;
    longitude: number;
    title?: string;
    address?: string;
    price?: string | number;
    image_url?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    area?: number | null; // in m²
};

type Props = {
    center?: [number, number]; // [lng, lat]
    zoom?: number;
    markers: MarkerItem[];
    height?: string;
    detailPathPrefix?: string;
};

const PropertyMap: React.FC<Props> = ({
    center = [-74.2973, 4.5709],
    zoom = 11,
    markers = [],
    height = "70vh",
    detailPathPrefix = "/properties",
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const createdMarkersRef = useRef<maplibregl.Marker[]>([]);
    const navigate = useNavigate();

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
            } as any,
            center,
            zoom,
        });

        mapRef.current = map;

        const onResize = () => {
            map.resize();
        };
        window.addEventListener("resize", onResize);
        setTimeout(() => map.resize(), 200);

        return () => {
            window.removeEventListener("resize", onResize);
            createdMarkersRef.current.forEach((m) => {
                try {
                    const el = m.getElement();
                    el.onclick = null;
                } catch (e) { }
                m.remove();
            });
            createdMarkersRef.current = [];
            map.remove();
            mapRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        // Remove old markers
        createdMarkersRef.current.forEach((m) => {
            try {
                const el = m.getElement();
                el.onclick = null;
                // eslint-disable-next-line no-empty
            } catch (e) { }
            m.remove();
        });
        createdMarkersRef.current = [];

        // Create new card markers
        markers.forEach((mItem) => {
            const lng = Number(mItem.longitude);
            const lat = Number(mItem.latitude);
            if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;

            const card = document.createElement("div");
            card.className = "map-card-marker-styled";
            // ensure the marker is placed above coordinate
            card.style.transform = "translate(-50%, -100%)";

            // build inner structure programmatically (safer for image src)
            const contentWrap = document.createElement("div");
            contentWrap.className = "map-card-inner d-flex";

            const imgWrap = document.createElement("div");
            imgWrap.className = "map-card-image-wrap";

            const img = document.createElement("img");
            img.className = "map-card-image";
            // set src safely; fallback placeholder if not available
            img.src = mItem.image_url ?? "/placeholder-property.png";
            img.alt = mItem.title ? String(mItem.title) : `Propiedad ${mItem.id}`;
            img.loading = "lazy";
            imgWrap.appendChild(img);

            const body = document.createElement("div");
            body.className = "map-card-body";

            const header = document.createElement("div");
            header.className = "map-card-header";

            const titleEl = document.createElement("div");
            titleEl.className = "map-card-title";
            titleEl.textContent = String(mItem.title ?? `Propiedad ${mItem.id}`);

            const priceEl = document.createElement("div");
            priceEl.className = "map-card-price";
            priceEl.textContent = mItem.price ? String(mItem.price) : "";

            header.appendChild(titleEl);
            header.appendChild(priceEl);

            const meta = document.createElement("div");
            meta.className = "map-card-meta";

            // helper to create meta item (icon + text)
            const createMetaItem = (svg: string, text: string) => {
                const el = document.createElement("div");
                el.className = "map-card-meta-item";
                el.innerHTML = `<span class="meta-icon">${svg}</span><span class="meta-text">${escapeHtml(text)}</span>`;
                return el;
            };

            // small inline SVGs
            const bedSVG =
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18v7H3z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 14v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 14v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            const bathSVG =
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 13h20v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 9a4 4 0 0 1 8 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            const areaSVG =
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M7 7h10v10H7z" stroke="currentColor" stroke-width="1.2"/></svg>';

            if (mItem.bedrooms !== undefined && mItem.bedrooms !== null) {
                meta.appendChild(createMetaItem(bedSVG, `${mItem.bedrooms}`));
            }
            if (mItem.bathrooms !== undefined && mItem.bathrooms !== null) {
                meta.appendChild(createMetaItem(bathSVG, `${mItem.bathrooms}`));
            }
            if (mItem.area !== undefined && mItem.area !== null) {
                meta.appendChild(createMetaItem(areaSVG, `${mItem.area}m²`));
            }

            const footer = document.createElement("div");
            footer.className = "map-card-footer";

            const detailsBtn = document.createElement("button");
            detailsBtn.className = "map-card-btn";
            detailsBtn.type = "button";
            detailsBtn.textContent = "Ver más detalles";
            detailsBtn.addEventListener("click", (ev) => {
                ev.stopPropagation();
                const path = `${detailPathPrefix.replace(/\/$/, "")}/${mItem.id}`;
                navigate(path);
            });

            footer.appendChild(detailsBtn);

            body.appendChild(header);
            body.appendChild(meta);
            body.appendChild(footer);

            contentWrap.appendChild(imgWrap);
            contentWrap.appendChild(body);
            card.appendChild(contentWrap);

            // stop propagation on card clicks except button handled above
            card.addEventListener("click", (ev) => {
                ev.stopPropagation();
                // clicking the card (not button) will also navigate to detail
                const path = `${detailPathPrefix.replace(/\/$/, "")}/${mItem.id}`;
                navigate(path);
            });

            const marker = new maplibregl.Marker({ element: card })
                .setLngLat([lng, lat])
                .addTo(mapRef.current as maplibregl.Map);

            createdMarkersRef.current.push(marker);
        });

        if (createdMarkersRef.current.length > 0) {
            const bounds = new maplibregl.LngLatBounds();
            createdMarkersRef.current.forEach((mk) => {
                const lnglat = mk.getLngLat();
                bounds.extend([lnglat.lng, lnglat.lat]);
            });
            try {
                mapRef.current.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 600 });
            } catch (e) {
                mapRef.current.setCenter(center as [number, number]);
            }
        } else {
            mapRef.current.setCenter(center as [number, number]);
            mapRef.current.setZoom(zoom);
        }

        mapRef.current.resize();

        function escapeHtml(str: string) {
            return str
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    }, [markers, center, zoom, navigate, detailPathPrefix]);

    return <div ref={containerRef} style={{ width: "100%", height, position: "relative" }} />;
};

export default PropertyMap;