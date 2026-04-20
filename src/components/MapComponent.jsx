import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + Vite
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Premium location pin icon
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

export default function MapComponent({ 
  center = [-7.3300, 108.7600], 
  zoom = 15, 
  title = "PMB Eli Hidayati",
  address = "Desa Bantarmangu, Kec. Cimanggu, Kab. Cilacap",
  height = "450px"
}) {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      scrollWheelZoom={false}
      style={{ height, width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} icon={customIcon}>
        <Popup>
          <div style={{ textAlign: 'center' }}>
            <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>{title}</strong>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{address}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
