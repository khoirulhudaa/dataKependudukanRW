// components/MapPicker.tsx
import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// === FIX ICON MARKER (WAJIB!) ===
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Komponen untuk nangkap klik di peta
const LocationMarker: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Props utama
type MapPickerProps = {
  lat?: number;
  lng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
};

// Komponen utama
const MapPicker: React.FC<MapPickerProps> = ({ lat, lng, onLocationSelect }) => {
  const center: [number, number] = lat && lng ? [lat, lng] : [-6.2088, 106.8456]; // Jakarta

  return (
    <div className="h-96 w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      <MapContainer center={center} zoom={17} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marker kalau sudah ada koordinat */}
        {lat && lng && <Marker position={[lat, lng]} />}

        {/* Nangkap klik */}
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;