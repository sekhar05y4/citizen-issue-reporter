import React from 'react';
import type { Complaint } from '../types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { StatusBadge } from '../components/StatusBadge';

interface Props {
  complaints: Complaint[];
  onSelectComplaint: (c: Complaint) => void;
}

const getMarkerIcon = (status: string) => {
  const color = status === 'RESOLVED' ? '#10b981' : status === 'IN_PROGRESS' ? '#f97316' : '#0288d1';
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export const MapPage: React.FC<Props> = ({ complaints, onSelectComplaint }) => {
  const complaintsWithLoc = complaints.filter((c) => c.latitude && c.longitude);
  const defaultCenter: [number, number] = complaintsWithLoc.length > 0
    ? [complaintsWithLoc[0].latitude!, complaintsWithLoc[0].longitude!]
    : [28.6139, 77.2090];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Civic Incident Map</h2>
          <p className="text-xs text-slate-500">Live geographic distribution of reported civic issues</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Submitted</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> In Progress</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved</span>
        </div>
      </div>

      <div className="h-[600px] w-full rounded-xl overflow-hidden border border-slate-200">
        <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={true} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {complaintsWithLoc.map((c) => (
            <Marker
              key={c.id}
              position={[c.latitude!, c.longitude!]}
              icon={getMarkerIcon(c.status)}
            >
              <Popup>
                <div className="p-1 space-y-1.5 max-w-xs text-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-600">{c.complaint_number}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <h4 className="font-bold text-sm leading-snug">{c.title}</h4>
                  <p className="text-xs text-slate-500">{c.address}</p>
                  <div className="pt-2">
                    <button
                      onClick={() => onSelectComplaint(c)}
                      className="w-full py-1 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700"
                    >
                      Triage Grievance
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
