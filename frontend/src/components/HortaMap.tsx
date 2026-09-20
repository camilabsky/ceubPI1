import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface HortaMapProps {
  latitude?: number | string | null;
  longitude?: number | string | null;
  nome?: string;
  endereco?: string | null;
  height?: string;
}

export function HortaMap({
  latitude,
  longitude,
  nome,
  endereco,
  height = "260px",
}: HortaMapProps) {
  // MySQL DECIMAL chega como string via mysql2
  const lat = latitude != null ? Number(latitude) : NaN;
  const lng = longitude != null ? Number(longitude) : NaN;

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-dashed text-sm text-[#4a5565]"
        style={{ height }}
      >
        Localização ainda não cadastrada
      </div>
    );
  }

  return (
    <div className="relative z-0 overflow-hidden rounded-xl" style={{ height }}>
      {/* key força recentralizar quando as coordenadas mudam (center é imutável) */}
      <MapContainer
        key={`${lat}-${lng}`}
        center={[lat, lng]}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={defaultIcon}>
          <Popup>
            <strong>{nome ?? "Horta"}</strong>
            {endereco && (
              <>
                <br />
                {endereco}
              </>
            )}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}