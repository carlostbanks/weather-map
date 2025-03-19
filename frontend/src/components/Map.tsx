import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, WMSTileLayer, LayersControl, FeatureGroup, Marker, Popup } from 'react-leaflet';
import { GeoLayer, UserLayer } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  geoLayers: GeoLayer[];
  userLayers: UserLayer[];
  onFeatureCreate?: (feature: GeoJSON.Feature) => void;
}

const Map: React.FC<MapProps> = ({ geoLayers, userLayers, onFeatureCreate }) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [selectedBaseLayer, setSelectedBaseLayer] = useState<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapKey, setMapKey] = useState(Date.now());

  useEffect(() => {
    return () => {
      if (map) {
        console.log("Cleaning up map instance");
        map.remove();
        setMap(null);
      }
    };
  }, [map, mapKey]);

  useEffect(() => {
    if (geoLayers.length > 0 && selectedBaseLayer === null) {
      const xyzLayer = geoLayers.find(layer => layer.layer_type === 'XYZ');
      if (xyzLayer) {
        setSelectedBaseLayer(xyzLayer.id);
      }
    }
  }, [geoLayers, selectedBaseLayer]);

  useEffect(() => {
    if (map && onFeatureCreate) {
      const handleMapClick = (e: L.LeafletMouseEvent) => {
        const feature: GeoJSON.Feature = {
          type: 'Feature',
          properties: {
            name: `Marker at ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`,
            timestamp: new Date().toISOString()
          },
          geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
          }
        };
        
        onFeatureCreate(feature);
      };
      
      map.on('click', handleMapClick);
      
      return () => {
        map.off('click', handleMapClick);
      };
    }
  }, [map, onFeatureCreate]);

  const renderLayer = (layer: GeoLayer) => {
    switch (layer.layer_type) {
      case 'XYZ':
        return (
          <TileLayer
            key={layer.id}
            url={layer.url}
            attribution={layer.params?.attribution || ''}
          />
        );
      case 'WMS':
        return (
          <WMSTileLayer
            key={layer.id}
            url={layer.url}
            layers={layer.params?.layers || ''}
            format={layer.params?.format || 'image/png'}
            transparent={layer.params?.transparent || true}
            attribution={layer.params?.attribution || ''}
          />
        );
      case 'WMTS':
        const wmtsUrl = layer.url
          .replace('{Time}', layer.params?.time || '')
          .replace('{TileMatrixSet}', layer.params?.tileMatrixSet || '')
          .replace('{TileMatrix}/{TileRow}/{TileCol}', '{z}/{y}/{x}');
          
        return (
          <TileLayer
            key={layer.id}
            url={wmtsUrl}
            attribution={layer.params?.attribution || ''}
          />
        );
      default:
        return null;
    }
  };

  if (!mapRef.current && typeof window !== 'undefined') {
    return <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>;
  }

  return (
    <div style={{ height: '100%', width: '100%' }} ref={mapRef}>
      <MapContainer
        key={mapKey}
        center={[39.8283, -98.5795]} // Center of United States
        zoom={4} // Zoom level to show most of the US
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
      >
        {/* Always include a default base layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <LayersControl position="topright">
          {/* Base Layers */}
          {geoLayers
            .filter(layer => layer.layer_type === 'XYZ')
            .map(layer => (
              <LayersControl.BaseLayer 
                key={layer.id} 
                name={layer.name}
                checked={selectedBaseLayer === layer.id}
              >
                {renderLayer(layer)}
              </LayersControl.BaseLayer>
            ))}
          
          {/* Overlay Layers */}
          {geoLayers
            .filter(layer => layer.layer_type !== 'XYZ')
            .map(layer => (
              <LayersControl.Overlay 
                key={layer.id} 
                name={layer.name}
              >
                {renderLayer(layer)}
              </LayersControl.Overlay>
            ))}
            
          {/* User Feature Layers */}
          {userLayers
            .filter(layer => layer.feature_collection)
            .map(layer => (
              <LayersControl.Overlay 
                key={layer.id} 
                name={layer.name}
              >
                <FeatureGroup>
                  {layer.feature_collection?.features.map((feature, index) => {
                    if (feature.geometry.type === 'Point') {
                      const coords = feature.geometry.coordinates;
                      return (
                        <Marker 
                          key={index} 
                          position={[coords[1], coords[0]]}
                        >
                          <Popup>
                            <div>
                              <h3 className="font-bold">{feature.properties?.name || 'Unnamed Point'}</h3>
                              {feature.properties?.description && <p>{feature.properties.description}</p>}
                            </div>
                          </Popup>
                        </Marker>
                      );
                    }
                    return null;
                  })}
                </FeatureGroup>
              </LayersControl.Overlay>
            ))}
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default Map;