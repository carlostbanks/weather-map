// In BasicMap.tsx, let's modify it to handle the weather layer

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface BasicMapProps {
  id: string;
  height: string;
}

const BasicMap: React.FC<BasicMapProps> = ({ id, height }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only create map if it doesn't exist yet and the container is ready
    if (!mapContainerRef.current) return;
    
    // Create the map instance
    const mapInstance = L.map(mapContainerRef.current).setView([39.8283, -98.5795], 4);
    
    // Add base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);
    
    // Add weather radar layer
    const weatherLayer = L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2', {
      attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
      opacity: 0.6
    });
    
    // Create layer control
    const baseLayers = {
      "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    };
    
    const overlays = {
      "Weather Radar": weatherLayer,
      "Temperature": L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2', {
        attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
        opacity: 0.5
      }),
      "Clouds": L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2', {
        attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
        opacity: 0.5
      })
    };
    
    L.control.layers(baseLayers, overlays).addTo(mapInstance);
    
    // Add a marker for a weather-related location
    const marker = L.marker([37.7749, -122.4194]).addTo(mapInstance);
    marker.bindPopup("<b>San Francisco</b><br>Current weather data available").openPopup();
    
    // Clean up on unmount
    return () => {
      mapInstance.remove();
    };
  }, []);
  
  return (
    <div 
      id={id} 
      ref={mapContainerRef} 
      style={{ height, width: '100%' }}
    ></div>
  );
};

export default BasicMap;