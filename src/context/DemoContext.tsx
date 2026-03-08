import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  Ingrediente, Venta, OrdenCompra, Factura, VentaItem,
  ingredientesIniciales, productos, ventasIniciales,
  ordenesCompraIniciales, facturasIniciales, proveedores,
} from "@/data/mockData";

interface DemoState {
  ingredientes: Ingrediente[];
  ventas: Venta[];
  ordenesCompra: OrdenCompra[];
  facturas: Factura[];
  alertas: string[];
  demoVersion: number;
}

interface DemoContextType extends DemoState {
  registrarVenta: (items: VentaItem[]) => void;
  generarOrdenCompra: (ingredienteId: string, cantidad: number, proveedorId: string) => string;
  recibirMercaderia: (ordenId: string) => void;
  registrarFactura: (ordenId: string) => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextType | null>(null);

export function useDemoContext() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoContext must be used within DemoProvider");
  return ctx;
}

function calcularAlertas(ingredientes: Ingrediente[]): string[] {
  return ingredientes
    .filter((i) => i.stockActual <= i.stockMinimo)
    .map((i) => i.id);
}

function getInitialState(version: number = 0): DemoState {
  const ingredientes = ingredientesIniciales.map((i) => ({ ...i }));
  return {
    ingredientes,
    ventas: ventasIniciales.map((v) => ({ ...v, items: v.items.map((i) => ({ ...i })) })),
    ordenesCompra: ordenesCompraIniciales.map((o) => ({ ...o, items: o.items.map((i) => ({ ...i })) })),
    facturas: facturasIniciales.map((f) => ({ ...f })),
    alertas: calcularAlertas(ingredientes),
    demoVersion: version,
  };
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => getInitialState(0));

  const registrarVenta = useCallback((items: VentaItem[]) => {
    setState((prev) => {
      const nuevosIngredientes = prev.ingredientes.map((ing) => ({ ...ing }));

      items.forEach((item) => {
        const producto = productos.find((p) => p.id === item.productoId);
        if (!producto) return;
        producto.receta.forEach((r) => {
          const ing = nuevosIngredientes.find((i) => i.id === r.ingredienteId);
          if (ing) {
            ing.stockActual = Math.max(0, parseFloat((ing.stockActual - r.cantidad * item.cantidad).toFixed(2)));
          }
        });
      });

      const total = items.reduce((s, i) => s + i.subtotal, 0);
      const nuevaVenta: Venta = {
        id: `v${String(prev.ventas.length + 1).padStart(3, "0")}`,
        fecha: new Date().toISOString(),
        items,
        total,
      };

      return {
        ...prev,
        ingredientes: nuevosIngredientes,
        ventas: [...prev.ventas, nuevaVenta],
        alertas: calcularAlertas(nuevosIngredientes),
      };
    });
  }, []);

  const generarOrdenCompra = useCallback((ingredienteId: string, cantidad: number, proveedorId: string): string => {
    let ordenId = "";
    setState((prev) => {
      const ing = prev.ingredientes.find((i) => i.id === ingredienteId);
      if (!ing) return prev;
      // Prevent duplicate orders for same ingredient
      const yaExiste = prev.ordenesCompra.some((o) => o.items.some((i) => i.ingredienteId === ingredienteId));
      if (yaExiste) return prev;
      ordenId = `oc${String(prev.ordenesCompra.length + 1).padStart(3, "0")}`;
      const orden: OrdenCompra = {
        id: ordenId,
        proveedorId,
        fecha: new Date().toISOString(),
        items: [{ ingredienteId, cantidad, costoEstimado: ing.costoUnitario * cantidad }],
        estado: "emitida",
        total: ing.costoUnitario * cantidad,
      };
      return { ...prev, ordenesCompra: [...prev.ordenesCompra, orden] };
    });
    return ordenId;
  }, []);

  const recibirMercaderia = useCallback((ordenId: string) => {
    setState((prev) => {
      const orden = prev.ordenesCompra.find((o) => o.id === ordenId);
      if (!orden || orden.estado === "recibida") return prev;

      const ordenes = prev.ordenesCompra.map((o) => {
        if (o.id !== ordenId) return o;
        return { ...o, estado: "recibida" as const };
      });

      const nuevosIngredientes = prev.ingredientes.map((ing) => {
        const item = orden.items.find((i) => i.ingredienteId === ing.id);
        if (!item) return ing;
        return { ...ing, stockActual: parseFloat((ing.stockActual + item.cantidad).toFixed(2)) };
      });

      return {
        ...prev,
        ingredientes: nuevosIngredientes,
        ordenesCompra: ordenes,
        alertas: calcularAlertas(nuevosIngredientes),
      };
    });
  }, []);

  const registrarFactura = useCallback((ordenId: string) => {
    setState((prev) => {
      const orden = prev.ordenesCompra.find((o) => o.id === ordenId);
      if (!orden) return prev;
      const existe = prev.facturas.find((f) => f.ordenCompraId === ordenId);
      if (existe) return prev;

      const venc = new Date();
      venc.setDate(venc.getDate() + 30);

      const factura: Factura = {
        id: `f${String(prev.facturas.length + 1).padStart(3, "0")}`,
        proveedorId: orden.proveedorId,
        ordenCompraId: ordenId,
        monto: orden.total,
        fechaEmision: new Date().toISOString(),
        fechaVencimiento: venc.toISOString(),
        estado: "pendiente",
      };
      return { ...prev, facturas: [...prev.facturas, factura] };
    });
  }, []);

  const resetDemo = useCallback(() => {
    setState((prev) => getInitialState(prev.demoVersion + 1));
  }, []);

  return (
    <DemoContext.Provider
      value={{
        ...state,
        registrarVenta,
        generarOrdenCompra,
        recibirMercaderia,
        registrarFactura,
        resetDemo,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}
