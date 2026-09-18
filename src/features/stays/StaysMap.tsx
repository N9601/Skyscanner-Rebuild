import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { StayOffer } from "@/types";
import { formatINR } from "@/lib/mockApi";

interface StaysMapProps {
  stays: StayOffer[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export default function StaysMap({ stays, selectedId, onSelect }: StaysMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [stays[0]?.lon ?? 73.83, stays[0]?.lat ?? 15.38],
      zoom: 11,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || stays.length === 0) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = new maplibregl.LngLatBounds();
    stays.forEach((s) => {
      const el = document.createElement("button");
      el.type = "button";
      el.setAttribute("aria-label", `${s.name}, ${formatINR(s.pricePerNight)} per night`);
      el.className =
        "akv-pin rounded-full px-2.5 py-1 text-xs font-bold shadow-lg transition-transform cursor-pointer border";
      el.textContent = `₹${Math.round(s.pricePerNight / 1000)}k`;
      const active = s.id === selectedId;
      el.style.background = active ? "#0770E3" : "#ffffff";
      el.style.color = active ? "#ffffff" : "#0B1220";
      el.style.borderColor = active ? "#0770E3" : "rgba(0,0,0,0.12)";
      el.style.transform = active ? "scale(1.15)" : "scale(1)";
      el.addEventListener("click", () => onSelect(s.id));

      const marker = new maplibregl.Marker({ element: el }).setLngLat([s.lon, s.lat]).addTo(map);
      markersRef.current.push(marker);
      bounds.extend([s.lon, s.lat]);
    });
    map.fitBounds(bounds, { padding: 60, maxZoom: 13, duration: 500 });
  }, [stays, selectedId, onSelect]);

  return <div ref={containerRef} className="h-full w-full rounded-2xl" aria-label="Stays map" />;
}
