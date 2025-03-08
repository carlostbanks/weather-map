// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { GeoLayer } from '../types';
import { getLayers } from '../services/map';
import Header from '../components/Header';
import { isAuthenticated } from '../utils/token';
import BasicMap from '../components/BasicMap';

const Home: React.FC = () => {
  const [featuredLayers, setFeaturedLayers] = useState<GeoLayer[]>([]);
  
  useEffect(() => {
    const fetchLayers = async () => {
      try {
        const layers = await getLayers();
        // Get all available layers
        setFeaturedLayers(layers);
      } catch (error) {
        console.error('Error fetching layers:', error);
        // Provide default layer if API fails
        setFeaturedLayers([{
          id: 999,
          name: 'OpenStreetMap',
          layer_type: 'XYZ',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          params: {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        }]);
      }
    };
    
    fetchLayers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
<Header 
  user={isAuthenticated() ? { id: 1, username: "DemoUser", email: "demo@example.com" } : null} 
  onLogout={() => {
    localStorage.removeItem('geoexplorer_token');
    window.location.href = '/login';
  }} 
/>    
      <div className="bg-blue-700 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to GeoExplorer</h1>
          <p className="text-xl mb-6">
            Discover and visualize geospatial data with powerful mapping tools
          </p>
          {isAuthenticated() ? (
            <a 
              href="/dashboard" 
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              Go to Dashboard
            </a>
          ) : (
            <a 
              href="/login" 
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              Get Started
            </a>
          )}
        </div>
      </div>
      
      {/* Map Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-4 mb-12">
          <h2 className="text-2xl font-bold mb-4">Explore Our Interactive Map</h2>
          <BasicMap id="home-map" height="500px" />
        </div>
      </div>
      
      {/* Available layers section */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Available Map Layers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredLayers.map(layer => (
            <div key={layer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2">{layer.name}</h3>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-3">
                  {layer.layer_type}
                </span>
                <p className="text-gray-600 mb-4">{layer.description || 'No description available'}</p>
                <a
                  href={isAuthenticated() ? '/dashboard' : '/login'}
                  className="text-blue-600 hover:underline"
                >
                  Explore this layer →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;