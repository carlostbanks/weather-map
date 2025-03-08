// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import BasicMap from '../components/BasicMap';
import LayerControl from '../components/LayerControl';
import { GeoLayer, UserLayer, User } from '../types';
import { getLayers, getUserLayers, addUserLayer, updateUserLayer, deleteUserLayer } from '../services/map';
import { getProfile } from '../services/auth';
import { isAuthenticated } from '../utils/token';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [geoLayers, setGeoLayers] = useState<GeoLayer[]>([]);
  const [userLayers, setUserLayers] = useState<UserLayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFeatureCollection, setActiveFeatureCollection] = useState<GeoJSON.FeatureCollection | null>(null);
  const [activeUserLayerId, setActiveUserLayerId] = useState<number | null>(null);

  // Define default layers
  const defaultLayers: GeoLayer[] = [
    {
      id: 1,
      name: 'OpenStreetMap',
      description: 'Standard OpenStreetMap tile layer',
      layer_type: 'XYZ' as 'XYZ',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      params: {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    },
    {
      id: 2,
      name: 'USGS Topo',
      description: 'USGS Topographic Map',
      layer_type: 'WMS' as 'WMS',
      url: 'https://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WMSServer',
      params: {
        layers: '0',
        format: 'image/png',
        transparent: true
      }
    },
    {
      id: 3,
      name: 'NASA GIBS ModisTerraTrueColor',
      description: 'NASA MODIS Terra True Color imagery',
      layer_type: 'WMTS' as 'WMTS',
      url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg',
      params: {
        format: 'image/jpeg',
        time: '2023-01-01',
        tileMatrixSet: 'GoogleMapsCompatible_Level9'
      }
    },
    // In Dashboard.tsx, add this to your defaultLayers array
{
    id: 4,
    name: 'Weather Radar',
    description: 'OpenWeatherMap precipitation and clouds',
    layer_type: 'XYZ' as 'XYZ',
    url: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2',
    params: {
      attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
    }
  }
  ];

  useEffect(() => {
    // Check if user is authenticated
    console.log("Dashboard: Checking authentication");
    console.log("isAuthenticated returns:", isAuthenticated());
    
    if (!isAuthenticated()) {
      console.log("Not authenticated, redirecting to login");
      window.location.href = '/login';
      return;
    }
  
    const fetchData = async () => {
      try {
        console.log("Dashboard: Fetching data from API");
        
        // Try to get the user profile
        try {
          const profileData = await getProfile();
          console.log("User profile:", profileData);
          setUser(profileData);
        } catch (error) {
          console.error("Failed to get profile:", error);
          // Create a fallback user in case the API fails
          setUser({
            id: 1,
            username: "DemoUser",
            email: "demo@example.com"
          });
        }
        
        // Try to get layers from API
        try {
          const layersData = await getLayers();
          console.log("API layers:", layersData);
          
          // If no layers returned, use default ones
          if (!layersData || layersData.length === 0) {
            console.log("Using default layers");
            setGeoLayers(defaultLayers);
          } else {
            setGeoLayers(layersData);
          }
        } catch (error) {
          console.error("Failed to get layers:", error);
          // Set default layers
          setGeoLayers(defaultLayers);
        }
        
        // Try to get user layers
        try {
          const userLayersData = await getUserLayers();
          console.log("User layers:", userLayersData);
          setUserLayers(userLayersData || []);
        } catch (error) {
          console.error("Failed to get user layers:", error);
          setUserLayers([]);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // In src/pages/Dashboard.tsx - update handleAddLayer
const handleAddLayer = async (layerId: number) => {
    console.log("Adding layer with ID:", layerId);
    try {
      const geoLayer = geoLayers.find(l => l.id === layerId);
      if (!geoLayer) {
        console.log("Layer not found in geoLayers");
        return;
      }
      
      console.log("Found layer to add:", geoLayer);
  
      try {
        const result = await addUserLayer({
          geo_layer_id: layerId,
          name: geoLayer.name,
          is_favorite: false
        });
        console.log("Add layer API response:", result);
        
        // If API call fails, create a mock user layer
        if (!result || result.error) {
          throw new Error("API returned error");
        }
        
        // Refresh user layers
        console.log("Refreshing user layers after add");
        const updatedUserLayers = await getUserLayers();
        
        // If getUserLayers fails, simulate adding the layer locally
        if (!updatedUserLayers || updatedUserLayers.length === 0) {
          console.log("Creating mock user layer");
          const mockUserLayer: UserLayer = {
            id: Date.now(),
            name: geoLayer.name,
            is_favorite: false,
            geo_layer: geoLayer,
            feature_collection: undefined
          };
          setUserLayers(prev => [...prev, mockUserLayer]);
        } else {
          console.log("Updated user layers:", updatedUserLayers);
          setUserLayers(updatedUserLayers);
        }
      } catch (error) {
        console.error("API error:", error);
        
        // Create a mock user layer when API fails
        console.log("Creating mock user layer after API error");
        const mockUserLayer: UserLayer = {
          id: Date.now(),
          name: geoLayer.name,
          is_favorite: false,
          geo_layer: geoLayer,
          feature_collection: undefined
        };
        setUserLayers(prev => [...prev, mockUserLayer]);
      }
    } catch (error) {
      console.error('Error adding layer:', error);
    }
  };

  // Updated handleRemoveLayer function for Dashboard.tsx
const handleRemoveLayer = async (userLayerId: number) => {
    console.log("Removing layer with ID:", userLayerId);
    try {
      try {
        await deleteUserLayer(userLayerId);
        console.log("Layer removed successfully via API");
      } catch (error) {
        console.error("Failed to remove layer via API, removing locally:", error);
      }
  
      // Whether the API call succeeds or fails, remove the layer from local state
      console.log("Removing layer from local state");
      setUserLayers(prevLayers => prevLayers.filter(layer => layer.id !== userLayerId));
  
      // If the active layer was removed, clear the active feature collection
      if (activeUserLayerId === userLayerId) {
        setActiveFeatureCollection(null);
        setActiveUserLayerId(null);
        console.log("Cleared active feature collection");
      }
    } catch (error) {
      console.error('Error removing layer:', error);
    }
  };

  const handleLayerFavorite = async (userLayerId: number, isFavorite: boolean) => {
    console.log("Toggling favorite for layer:", userLayerId, "to", isFavorite);
    try {
      await updateUserLayer(userLayerId, { is_favorite: isFavorite });
      console.log("Layer favorite status updated");

      // Update user layers locally
      setUserLayers(prevLayers =>
        prevLayers.map(layer =>
          layer.id === userLayerId ? { ...layer, is_favorite: isFavorite } : layer
        )
      );
      console.log("Local state updated");
    } catch (error) {
      console.error('Error updating layer:', error);
    }
  };

  const handleFeatureCreate = async (feature: GeoJSON.Feature) => {
    console.log("Creating feature:", feature);
    // If no active user layer is selected, ignore
    if (!activeUserLayerId) {
      console.log("No active user layer selected");
      return;
    }
  
    try {
      const userLayer = userLayers.find(l => l.id === activeUserLayerId);
      if (!userLayer) {
        console.log("Active user layer not found");
        return;
      }
      console.log("Found active user layer:", userLayer);
  
      // Initialize or update feature collection
      let featureCollection: GeoJSON.FeatureCollection;
      
      if (userLayer.feature_collection) {
        featureCollection = {
          ...userLayer.feature_collection,
          features: [...userLayer.feature_collection.features, feature]
        };
        console.log("Updated existing feature collection");
      } else {
        featureCollection = {
          type: 'FeatureCollection',
          features: [feature]
        };
        console.log("Created new feature collection");
      }
  
      // Update the layer
      await updateUserLayer(activeUserLayerId, { feature_collection: featureCollection });
      console.log("Feature collection saved to server");
      
      // Update local state
      setUserLayers(prevLayers =>
        prevLayers.map(layer =>
          layer.id === activeUserLayerId
            ? { ...layer, feature_collection: featureCollection }
            : layer
        )
      );
      console.log("Local state updated with new feature");
    } catch (error) {
      console.error('Error creating feature:', error);
    }
  };

  const handleLogout = () => {
    console.log("Logout triggered from Dashboard");
    setUser(null);
    window.location.href = '/login';
  };

  console.log("Dashboard render - user state:", user);
  console.log("Dashboard render - geoLayers count:", geoLayers.length);
  console.log("Dashboard render - userLayers count:", userLayers.length);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Interactive Map Dashboard</h1>
        
        {/* Main content area with map taking more space */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Layer control sidebar */}
          <div className="lg:col-span-1">
            <LayerControl
              geoLayers={geoLayers}
              userLayers={userLayers}
              onLayerAdd={handleAddLayer}
              onLayerRemove={handleRemoveLayer}
              onLayerFavorite={handleLayerFavorite}
            />
          </div>
          
          {/* Map container - increased height */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div style={{ height: '600px' }}>
                <BasicMap
                  id="dashboard-map"
                  height="600px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;