import api from './api';
import { GeoLayer, UserLayer } from '../types';

export const getLayers = async (): Promise<GeoLayer[]> => {
  try {
    const response = await api.get('/maps/layers');
    return response.data;
  } catch (error) {
    console.error("Failed to get layers:", error);
    
    return [
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
      }
    ];
  }
};

export const getUserLayers = async (): Promise<UserLayer[]> => {
  try {
    const response = await api.get('/maps/user/layers');
    return response.data;
  } catch (error) {
    console.error("Failed to get user layers:", error);
    return [];
  }
};

export const addUserLayer = async (data: {
  geo_layer_id: number;
  name?: string;
  is_favorite?: boolean;
  feature_collection?: GeoJSON.FeatureCollection;
}): Promise<any> => {
  try {
    const response = await api.post('/maps/user/layers', data);
    return response.data;
  } catch (error) {
    console.error("Failed to add layer via API:", error);
    
    return {
      id: Date.now(),
      success: true,
      message: "Layer added (local mock)"
    };
  }
};

export const updateUserLayer = async (
  id: number,
  data: {
    name?: string;
    is_favorite?: boolean;
    feature_collection?: GeoJSON.FeatureCollection;
  }
): Promise<void> => {
  try {
    await api.put(`/maps/user/layers/${id}`, data);
  } catch (error) {
    console.error("Failed to update layer via API:", error);
  }
};

export const deleteUserLayer = async (id: number): Promise<void> => {
  try {
    await api.delete(`/maps/user/layers/${id}`);
  } catch (error) {
    console.error("Failed to delete layer via API:", error);
    throw error;
  }
};