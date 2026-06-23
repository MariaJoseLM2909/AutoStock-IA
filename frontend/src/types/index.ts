export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'COMPRADOR' | 'ADMINISTRADOR';
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  marca: string;
  imagen?: string;
  imagenUrl?: string;
}

export interface Compatibilidad {
  id: number;
  marcaVehiculo: string;
  modeloVehiculo: string;
  anio: number;
}

export interface ItemCarrito {
  id: number;
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

export interface Carrito {
  id: number;
  items: ItemCarrito[];
  total: number;
}

export interface ReporteCategoria {
  categoria: string;
  totalProductos: number;
  totalUnidades: number;
}

export interface ReporteStock {
  id: number;
  nombre: string;
  stock: number;
  categoria: string;
  estado: 'OK' | 'BAJO' | 'CRITICO' | 'AGOTADO';
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
