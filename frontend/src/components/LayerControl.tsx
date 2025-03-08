// src/components/LayerControl.tsx
import React, { useState, useEffect } from 'react';
import { GeoLayer, UserLayer } from '../types';

interface LayerControlProps {
  geoLayers: GeoLayer[];
  userLayers: UserLayer[];
  onLayerAdd: (layerId: number) => void;
  onLayerRemove: (layerId: number) => void;
  onLayerFavorite: (layerId: number, isFavorite: boolean) => void;
}

const LayerControl: React.FC<LayerControlProps> = ({
  geoLayers,
  userLayers,
  onLayerAdd,
  onLayerRemove,
  onLayerFavorite
}) => {
  const [selectedLayerType, setSelectedLayerType] = useState<'all' | 'xyz' | 'wms' | 'wmts'>('all');

  useEffect(() => {
    console.log("LayerControl mounted/updated");
    console.log("Received geoLayers:", geoLayers);
    console.log("Received userLayers:", userLayers);
  }, [geoLayers, userLayers]);

  // Filter layers based on the selected type
  const filteredLayers = selectedLayerType === 'all'
    ? geoLayers
    : geoLayers.filter(layer => layer.layer_type.toLowerCase() === selectedLayerType);

  console.log("Selected layer type:", selectedLayerType);
  console.log("Filtered layers:", filteredLayers);

  // Check if a layer is already added to user layers
  const isLayerAdded = (layerId: number) => {
    const result = userLayers.some(ul => ul.geo_layer.id === layerId);
    console.log(`Checking if layer ${layerId} is added:`, result);
    return result;
  };

  const handleLayerTypeClick = (type: 'all' | 'xyz' | 'wms' | 'wmts') => {
    console.log("Setting layer type filter to:", type);
    setSelectedLayerType(type);
  };

  const handleAddLayer = (layerId: number) => {
    console.log("Add button clicked for layer:", layerId);
    onLayerAdd(layerId);
  };

  const handleRemoveLayer = (layerId: number) => {
    console.log("Remove button clicked for layer:", layerId);
    onLayerRemove(layerId);
  };

  const handleFavoriteToggle = (layerId: number, isFavorite: boolean) => {
    console.log("Favorite toggle clicked for layer:", layerId, "new state:", isFavorite);
    onLayerFavorite(layerId, isFavorite);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Available Map Layers</h2>
      
      {/* Layer type filter */}
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-3 py-1 text-sm rounded ${selectedLayerType === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleLayerTypeClick('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-1 text-sm rounded ${selectedLayerType === 'xyz' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleLayerTypeClick('xyz')}
        >
          XYZ Tiles
        </button>
        <button
          className={`px-3 py-1 text-sm rounded ${selectedLayerType === 'wms' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleLayerTypeClick('wms')}
        >
          WMS
        </button>
        <button
          className={`px-3 py-1 text-sm rounded ${selectedLayerType === 'wmts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleLayerTypeClick('wmts')}
        >
          WMTS
        </button>
      </div>
      
      {/* Layer list */}
      <div className="space-y-2">
        {filteredLayers.map(layer => {
          const added = isLayerAdded(layer.id);
          const userLayer = userLayers.find(ul => ul.geo_layer.id === layer.id);
          
          return (
            <div key={layer.id} className="border rounded p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{layer.name}</h3>
                  <p className="text-sm text-gray-600">{layer.layer_type}</p>
                  {layer.description && (
                    <p className="text-sm text-gray-500 mt-1">{layer.description}</p>
                  )}
                </div>
                <div>
                  {added ? (
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      onClick={() => userLayer && handleRemoveLayer(userLayer.id)}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      onClick={() => handleAddLayer(layer.id)}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
              
              {/* If layer is added and in user layers, show favorite toggle */}
              {added && userLayer && (
                <div className="mt-2 flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-500"
                      checked={userLayer.is_favorite}
                      onChange={() => handleFavoriteToggle(userLayer.id, !userLayer.is_favorite)}
                    />
                    <span className="ml-2 text-sm">Favorite</span>
                  </label>
                </div>
              )}
            </div>
          );
        })}
        
        {filteredLayers.length === 0 && (
          <p className="text-gray-500 text-center py-4">No layers available for the selected type.</p>
        )}
      </div>
      
      {/* User layers section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">My Layers ({userLayers.length})</h2>
        {userLayers.length > 0 ? (
          <div className="space-y-2">
            {userLayers.map(layer => (
              <div key={layer.id} className={`border rounded p-3 ${layer.is_favorite ? 'border-yellow-400' : ''}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{layer.name}</h3>
                    <p className="text-sm text-gray-600">{layer.geo_layer.layer_type}</p>
                  </div>
                  <div>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      onClick={() => handleRemoveLayer(layer.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-500"
                      checked={layer.is_favorite}
                      onChange={() => handleFavoriteToggle(layer.id, !layer.is_favorite)}
                    />
                    <span className="ml-2 text-sm">Favorite</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No layers added yet.</p>
        )}
      </div>
    </div>
  );
};

export default LayerControl;