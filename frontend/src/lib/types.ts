export interface Usuario {
  idUsuario: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'COMPRADOR' | 'ADMINISTRADOR';
}

export interface Compatibilidad {
  idCompatibilidad: number;
  marcaVehiculo: string;
  linea: string;
  modelo: string;
  anio: string;
}

export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoria: string;
  marca: string;
  compatibilidades: Compatibilidad[];
}

export interface ItemCarrito {
  idItemCarrito: number;
  idProducto: number;
  nombreProducto: string;
  imagenProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Carrito {
  idCarrito: number;
  idUsuario: number;
  items: ItemCarrito[];
  total: number;
}