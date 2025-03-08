// Authentication types
export interface User {
    id: number;
    username: string;
    email: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
  }
  
  // Map and layer types
  export interface GeoLayerParams {
    attribution?: string;
    layers?: string;
    format?: string;
    transparent?: boolean;
    time?: string;
    tileMatrixSet?: string;
    [key: string]: any;
  }
  
  export interface GeoLayer {
    id: number;
    name: string;
    description?: string;
    layer_type: 'WMS' | 'WMTS' | 'XYZ';
    url: string;
    params?: GeoLayerParams;
  }
  
  export interface UserLayer {
    id: number;
    name: string;
    is_favorite: boolean;
    geo_layer: GeoLayer;
    feature_collection?: GeoJSON.FeatureCollection;
  }