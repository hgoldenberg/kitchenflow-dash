import { useState } from "react";
import { useDemoContext } from "@/context/DemoContext";
import { productos } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Minus, Plus, Zap } from "lucide-react";
import type { VentaItem } from "@/data/mockData";

export default function VentasPage() {
  const { registrarVenta, ingredientes } = useDemoContext();
  const [carrito, setCarrito] = useState<Record<string, number>>({});
  const [ventaRegistrada, setVentaRegistrada] = useState(false);

  const agregarAlCarrito = (productoId: string) => {
    setCarrito((prev) => ({ ...prev, [productoId]: (prev[productoId] || 0) + 1 }));
    setVentaRegistrada(false);
  };

  const quitarDelCarrito = (productoId: string) => {
    setCarrito((prev) => {
      const nuevo = { ...prev };
      if (nuevo[productoId] > 1) nuevo[productoId]--;
      else delete nuevo[productoId];
      return nuevo;
    });
  };

  const total = Object.entries(carrito).reduce((s, [id, qty]) => {
    const prod = productos.find((p) => p.id === id);
    return s + (prod?.precio || 0) * qty;
  }, 0);

  const handleRegistrarVenta = () => {
    const items: VentaItem[] = Object.entries(carrito).map(([id, qty]) => {
      const prod = productos.find((p) => p.id === id)!;
      return { productoId: id, cantidad: qty, subtotal: prod.precio * qty };
    });
    if (items.length === 0) return;
    registrarVenta(items);
    setCarrito({});
    setVentaRegistrada(true);
  };

  const cargarVentaDemo = () => {
    setCarrito({ pizza_muzz: 20, empanada_jyq: 6, gaseosa_500: 4 });
    setVentaRegistrada(false);
  };

  // Build consumption preview
  const consumoPreview: { nombre: string; cantidad: number; unidad: string; stockDespues: number; critico: boolean }[] = [];
  Object.entries(carrito).forEach(([prodId, qty]) => {
    const prod = productos.find((p) => p.id === prodId);
    if (!prod) return;
    prod.receta.forEach((r) => {
      const ing = ingredientes.find((i) => i.id === r.ingredienteId);
      if (!ing) return;
      const existing = consumoPreview.find((c) => c.nombre === ing.nombre);
      const consumo = r.cantidad * qty;
      if (existing) {
        existing.cantidad += consumo;
        existing.stockDespues -= consumo;
        existing.critico = existing.stockDespues <= ing.stockMinimo;
      } else {
        const stockDespues = ing.stockActual - consumo;
        consumoPreview.push({
          nombre: ing.nombre,
          cantidad: consumo,
          unidad: ing.unidad,
          stockDespues: parseFloat(stockDespues.toFixed(2)),
          critico: stockDespues <= ing.stockMinimo,
        });
      }
    });
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Venta / Caja</h1>
          <p className="text-muted-foreground text-sm mt-1">Registrar ventas y ver el impacto en stock por receta</p>
        </div>
        <Button variant="outline" size="sm" onClick={cargarVentaDemo} className="gap-2">
          <Zap className="h-3.5 w-3.5" />
          Cargar venta demo
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Product list */}
        <div className="lg:col-span-2 space-y-3">
          {productos.map((prod) => {
            const qty = carrito[prod.id] || 0;
            return (
              <Card key={prod.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{prod.nombre}</p>
                    <p className="text-xs text-muted-foreground">{prod.categoria} · ${prod.precio.toLocaleString("es-AR")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {qty > 0 && (
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => quitarDelCarrito(prod.id)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                    )}
                    {qty > 0 && <span className="w-8 text-center font-semibold">{qty}</span>}
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => agregarAlCarrito(prod.id)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Cart + Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Ticket
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(carrito).length === 0 ? (
                <p className="text-sm text-muted-foreground">Carrito vacío</p>
              ) : (
                <>
                  {Object.entries(carrito).map(([id, qty]) => {
                    const prod = productos.find((p) => p.id === id)!;
                    return (
                      <div key={id} className="flex justify-between text-sm">
                        <span>{prod.nombre} x{qty}</span>
                        <span className="font-medium">${(prod.precio * qty).toLocaleString("es-AR")}</span>
                      </div>
                    );
                  })}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toLocaleString("es-AR")}</span>
                  </div>
                </>
              )}
              <Button className="w-full mt-2" onClick={handleRegistrarVenta} disabled={Object.entries(carrito).length === 0}>
                Registrar venta
              </Button>
              {ventaRegistrada && (
                <p className="text-xs text-success font-medium text-center">✓ Venta registrada — stock actualizado automáticamente</p>
              )}
            </CardContent>
          </Card>

          {consumoPreview.length > 0 && (
            <Card className="border-accent/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Consumo automático por receta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {consumoPreview.map((c) => (
                  <div key={c.nombre} className="flex items-center justify-between text-xs">
                    <span>{c.nombre}</span>
                    <div className="flex items-center gap-2">
                      <span>-{c.cantidad.toFixed(2)} {c.unidad}</span>
                      <Badge variant={c.critico ? "destructive" : "secondary"} className="text-[10px]">
                        {c.critico ? "⚠ Crítico" : `Queda: ${c.stockDespues} ${c.unidad}`}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
