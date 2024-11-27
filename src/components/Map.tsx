import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useReportStore } from '../store/reportStore';
import { useAuthStore } from '../store/authStore';
import ReportForm from './ReportForm';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
}

export default function Map() {
  const [showReportForm, setShowReportForm] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([
    -25.4067, // Taltal latitude
    -70.4848, // Taltal longitude
  ]);
  const { reports } = useReportStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, []);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={userLocation}
        zoom={13}
        className="h-full w-full z-0"
      >
        <MapController center={userLocation} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports
          .filter((report) => report.status === 'ACTIVE')
          .map((report) => (
            <Marker
              key={report.id}
              position={[report.location.lat, report.location.lng]}
              icon={defaultIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{report.title}</h3>
                  <p className="text-sm text-gray-600">{report.crimeType}</p>
                  <p className="mt-2">{report.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {isAuthenticated && (
        <button
          onClick={() => setShowReportForm(true)}
          className="absolute bottom-4 right-4 z-[1000] bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          Haga su denuncia
        </button>
      )}

      {showReportForm && (
        <ReportForm
          location={userLocation}
          onClose={() => setShowReportForm(false)}
        />
      )}
    </div>
  );
}