export const setToken = (token: string): void => {
    localStorage.setItem('geoexplorer_token', token);
    console.log('Token saved:', token.substring(0, 10) + '...');
  };
  
  export const getToken = (): string | null => {
    return localStorage.getItem('geoexplorer_token');
  };
  
  export const removeToken = (): void => {
    localStorage.removeItem('geoexplorer_token');
  };
  
  export const isAuthenticated = (): boolean => {
    const token = getToken();
    if (!token) return false;

    return true;
  };