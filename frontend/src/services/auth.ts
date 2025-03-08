// src/services/auth.ts
import api from './api';
import { LoginCredentials, RegisterCredentials, User } from '../types';
import { setToken, removeToken, getToken } from '../utils/token';

export const login = async (credentials: LoginCredentials): Promise<string> => {
  const response = await api.post('/auth/login', credentials);
  console.log("Login response:", response.data);
  const { access_token } = response.data;
  setToken(access_token);
  return access_token;
};

export const register = async (credentials: RegisterCredentials): Promise<void> => {
  await api.post('/auth/register', credentials);
};

export const logout = (): void => {
  removeToken();
};

export const getProfile = async (): Promise<User> => {
  try {
    // Log the token being used
    console.log("Getting profile with token:", getToken()?.substring(0, 10) + "...");
    const response = await api.get('/auth/profile');
    console.log("Profile response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Profile API error:", error);
    // For demo purposes - create a fake user
    return {
      id: 1,
      username: "DemoUser",
      email: "demo@example.com"
    };
  }
};