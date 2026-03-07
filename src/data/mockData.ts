export interface Ingrediente {
  id: string;
  nombre: string;
  unidad: string;
  stockActual: number;
  stockMinimo: number;
  costoUnitario: number;
}

export interface RecetaItem {
  ingredienteId: string;
  cantidad: number;
}

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  receta: RecetaItem[];
}

export interface VentaItem {
  productoId: string;
  cantidad: number;
  subtotal: number;
}

export interface Venta {
  id: string;
  fecha: string;
  items: VentaItem[];
  total: number;
}

export interface Proveedor {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
}

export interface OrdenCompraItem {
  ingredienteId: string;
  cantidad: number;
  costoEstimado: number;
}

export interface OrdenCompra {
  id: string;
  proveedorId: string;
  fecha: string;
  items: OrdenCompraItem[];
  estado: "emitida" | "recibida";
  total: number;
}

export interface Factura {
  id: string;
  proveedorId: string;
  ordenCompraId: string;
  monto: number;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: "pendiente" | "pagada";
}

export const ingredientesIniciales: Ingrediente[] = [
  { id: "muzz", nombre: "Muzzarella", unidad: "kg", stockActual: 5, stockMinimo: 2, costoUnitario: 1800 },
  { id: "harina", nombre: "Harina 000", unidad: "kg", stockActual: 25, stockMinimo: 5, costoUnitario: 450 },
  { id: "salsa", nombre: "Salsa de tomate", unidad: "kg", stockActual: 10, stockMinimo: 3, costoUnitario: 600 },
  { id: "jamon", nombre: "Jamón cocido", unidad: "kg", stockActual: 4, stockMinimo: 1.5, costoUnitario: 3200 },
  { id: "queso_crem", nombre: "Queso cremoso", unidad: "kg", stockActual: 3, stockMinimo: 1, costoUnitario: 2400 },
  { id: "gaseosa", nombre: "Gaseosa 500ml", unidad: "un", stockActual: 48, stockMinimo: 12, costoUnitario: 350 },
];

export const productos: Producto[] = [
  {
    id: "pizza_muzz",
    nombre: "Pizza Muzzarella",
    precio: 4500,
    categoria: "Pizzas",
    receta: [
      { ingredienteId: "muzz", cantidad: 0.20 },
      { ingredienteId: "harina", cantidad: 0.15 },
      { ingredienteId: "salsa", cantidad: 0.10 },
    ],
  },
  {
    id: "empanada_jyq",
    nombre: "Empanada Jamón y queso",
    precio: 1200,
    categoria: "Empanadas",
    receta: [
      { ingredienteId: "jamon", cantidad: 0.05 },
      { ingredienteId: "queso_crem", cantidad: 0.04 },
      { ingredienteId: "harina", cantidad: 0.03 },
    ],
  },
  {
    id: "gaseosa_500",
    nombre: "Gaseosa 500ml",
    precio: 900,
    categoria: "Bebidas",
    receta: [
      { ingredienteId: "gaseosa", cantidad: 1 },
    ],
  },
];

export const proveedores: Proveedor[] = [
  { id: "prov1", nombre: "Lácteos del Centro", telefono: "011-4555-8800", email: "ventas@lacteosdelcentro.com" },
  { id: "prov2", nombre: "Distribuidora Don Pedro", telefono: "011-4777-3200", email: "pedidos@donpedro.com" },
];

export const ventasIniciales: Venta[] = [
  {
    id: "v001",
    fecha: new Date().toISOString(),
    items: [
      { productoId: "pizza_muzz", cantidad: 3, subtotal: 13500 },
      { productoId: "gaseosa_500", cantidad: 2, subtotal: 1800 },
    ],
    total: 15300,
  },
];

export const ordenesCompraIniciales: OrdenCompra[] = [];

export const facturasIniciales: Factura[] = [];
