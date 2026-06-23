import { Producto } from './types';

const API_URL = 'http://localhost:8081/api';

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error en la peticion');
  }
  
  return response.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) => 
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  
  register: (data: { nombre: string; apellido: string; email: string; password: string }) => 
    fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  
  // Productos
  getProductos: (params?: string) => 
    fetchAPI(`/productos${params ? '?' + params : ''}`),
  
  getProducto: (id: number) => 
    fetchAPI(`/productos/${id}`),
  
  getSugerencias: (id: number) => 
    fetchAPI(`/productos/${id}/sugerencias`),
  
  // Carrito
  getCarrito: (idUsuario: number) => 
    fetchAPI(`/carrito?idUsuario=${idUsuario}`),
  
  addToCarrito: (idUsuario: number, idProducto: number, cantidad: number = 1) => 
    fetchAPI(`/carrito/items?idUsuario=${idUsuario}&idProducto=${idProducto}&cantidad=${cantidad}`, { method: 'POST' }),
  
  updateCarritoItem: (idItem: number, cantidad: number) => 
    fetchAPI(`/carrito/items/${idItem}?cantidad=${cantidad}`, { method: 'PUT' }),
  
  removeFromCarrito: (idItem: number) => 
    fetchAPI(`/carrito/items/${idItem}`, { method: 'DELETE' }),
  
  // Admin
  getAdminStock: () => 
    fetchAPI('/admin/stock'),
  
  createProducto: (data: Partial<Producto>) => 
    fetchAPI('/admin/productos', { method: 'POST', body: JSON.stringify(data) }),
  
  updateProducto: (id: number, data: Partial<Producto>) => 
    fetchAPI(`/admin/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  deleteProducto: (id: number) => 
    fetchAPI(`/admin/productos/${id}`, { method: 'DELETE' }),
  
  updateStock: (id: number, cantidad: number) => 
    fetchAPI(`/admin/stock/${id}?cantidad=${cantidad}`, { method: 'PUT' }),
  
  getReporteCategorias: () => 
    fetchAPI('/admin/reportes/categorias'),
  
  getReporteStock: () => 
    fetchAPI('/admin/reportes/stock'),
};