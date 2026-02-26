import { useEffect, useRef } from 'react';
import L from 'leaflet';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker from 'leaflet/dist/images/marker-icon.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { ORDER_STATUS } from '../../utils/constants';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: shadow,
});

const createDotIcon = (label, color) =>
  L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="display:flex;align-items:center;gap:6px;background:rgba(17,17,17,0.85);border:1px solid rgba(255,255,255,0.2);padding:6px 8px;border-radius:999px;color:#fff;font-size:12px;white-space:nowrap;">
      <span style="width:10px;height:10px;border-radius:999px;background:${color};display:inline-block;"></span>${label}
    </div>`,
    iconSize: [98, 30],
    iconAnchor: [20, 15],
  });

const animateLatLng = (markerRef, from, to, duration = 900) => {
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - progress) ** 3;
    const lat = from[0] + (to[0] - from[0]) * eased;
    const lng = from[1] + (to[1] - from[1]) * eased;
    markerRef.setLatLng([lat, lng]);
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const MapView = ({ restaurantLocation, customerLocation, partnerLocation, status }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const partnerMarkerRef = useRef(null);
  const routeRef = useRef(null);
  const prevPartnerRef = useRef(partnerLocation);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return undefined;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView(
      [
        (restaurantLocation[0] + customerLocation[0]) / 2,
        (restaurantLocation[1] + customerLocation[1]) / 2,
      ],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    const restaurantMarker = L.marker(restaurantLocation, {
      icon: createDotIcon('Restaurant', '#FF6B00'),
    }).addTo(map);
    const customerMarker = L.marker(customerLocation, {
      icon: createDotIcon('You', '#22C55E'),
    }).addTo(map);

    partnerMarkerRef.current = L.marker(partnerLocation, {
      icon: createDotIcon('Rider', '#3B82F6'),
    }).addTo(map);

    routeRef.current = L.polyline([partnerLocation, customerLocation], {
      color: '#3B82F6',
      weight: 4,
      opacity: 0.8,
      dashArray: '10 8',
    }).addTo(map);

    const bounds = L.latLngBounds([restaurantLocation, customerLocation, partnerLocation]);
    map.fitBounds(bounds, { padding: [40, 40] });

    mapRef.current = map;

    return () => {
      restaurantMarker.remove();
      customerMarker.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [customerLocation, partnerLocation, restaurantLocation]);

  useEffect(() => {
    if (!partnerMarkerRef.current || !routeRef.current) return;
    const prev = prevPartnerRef.current;
    animateLatLng(partnerMarkerRef.current, prev, partnerLocation, 1000);
    routeRef.current.setLatLngs([partnerLocation, customerLocation]);
    prevPartnerRef.current = partnerLocation;
  }, [customerLocation, partnerLocation]);

  useEffect(() => {
    if (!routeRef.current) return;
    if (status === ORDER_STATUS.DELIVERED) {
      routeRef.current.setStyle({ color: '#22C55E', dashArray: '' });
    }
  }, [status]);

  return (
    <div className="bg-zest-card border border-zest-muted/20 rounded-2xl shadow-lg overflow-hidden h-[320px] sm:h-[360px] md:h-[460px]">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default MapView;
