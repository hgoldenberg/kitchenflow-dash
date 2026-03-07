import { useDemoContext } from "@/context/DemoContext";
import { useDemoGuide } from "@/context/DemoGuideContext";
import { proveedores } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, PackageCheck, ShoppingCart, FileText, ArrowRight } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";

export default function ComprasPage() {
  const { ingredientes, alertas, ordenesCompra, generarOrdenCompra, recibirMercaderia, registrarFactura } = useDemoContext();
  const { isGuided, currentStep, nextStep } = useDemoGuide();

  const ingredientesCriticos = ingredientes.filter((i) => alertas.includes(i.id));
  const yaConOrden = new Set(ordenesCompra.flatMap((o) => o.items.map((i) => i.ingredienteId)));

  const handleGenerarOrden = (ingredienteId: string) => {
    const ing = ingredientes.find((i) => i.id === ingredienteId);
    if (!ing) return;
    const cantidad = Math.max(10, ing.stockMinimo * 5);
    generarOrdenCompra(ingredienteId, cantidad, proveedores[0].id);
  };

  const handleRecibir = (ordenId: string) => {
    recibirMercaderia(ordenId);
  };

  const handleRegistrarFactura = (ordenId: string) => {
    registrarFactura(ordenId);
    if (isGuided && currentStep === 3) {
      nextStep();
    }
  };

  // Determine flow state for each order
  const getOrderFlowState = (orden: typeof ordenesCompra[0]) => {
    const tieneFactura = false; // simplified for demo
    if (orden.estado === "emitida") return "emitida";
    return "recibida";
  };

  return (
    <div className="space-y-6">
      <StepIndicator />

      <div>
        <h1 className="font-display text-2xl font-bold">Compras y Recepción</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Flujo completo: detectar faltante → generar orden → recibir mercadería → registrar factura.
        </p>
      </div>

      {/* Suggestions */}
      {ingredientesCriticos.length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-warning">
              <ShoppingCart className="h-4 w-4" />
              Órdenes de compra sugeridas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ingredientesCriticos.map((ing) => {
              const tieneOrden = yaConOrden.has(ing.id);
              const cantidadSugerida = Math.max(10, ing.stockMinimo * 5);
              return (
                <div key={ing.id} className="flex items-center justify-between text-sm bg-card rounded-lg p-3 border">
                  <div>
                    <p className="font-medium">{ing.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      Stock: {Number(ing.stockActual.toFixed(2))} {ing.unidad} · Sugerido: {cantidadSugerida} {ing.unidad} · Proveedor: {proveedores[0].nombre}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={tieneOrden ? "secondary" : "default"}
                    disabled={tieneOrden}
                    onClick={() => handleGenerarOrden(ing.id)}
                  >
                    {tieneOrden ? "Orden creada" : "Generar orden"}
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Orders table */}
      {ordenesCompra.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Órdenes de compra
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Orden</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Proveedor</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ingrediente</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Cantidad</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Costo est.</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Estado</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Siguiente acción</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenesCompra.map((orden) => {
                    const prov = proveedores.find((p) => p.id === orden.proveedorId);
                    const item = orden.items[0];
                    const ing = ingredientes.find((i) => i.id === item.ingredienteId);
                    return (
                      <tr key={orden.id} className="border-t">
                        <td className="px-4 py-3 font-mono text-xs">{orden.id}</td>
                        <td className="px-4 py-3">{prov?.nombre}</td>
                        <td className="px-4 py-3">{ing?.nombre}</td>
                        <td className="px-4 py-3 text-right">{item.cantidad} {ing?.unidad}</td>
                        <td className="px-4 py-3 text-right">${item.costoEstimado.toLocaleString("es-AR")}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={orden.estado === "recibida" ? "secondary" : "outline"}>
                            {orden.estado === "recibida" ? "✓ Recibida" : "Emitida"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {orden.estado === "emitida" && (
                            <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => handleRecibir(orden.id)}>
                              <PackageCheck className="h-3 w-3" />
                              Registrar recepción
                            </Button>
                          )}
                          {orden.estado === "recibida" && (
                            <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => handleRegistrarFactura(orden.id)}>
                              <FileText className="h-3 w-3" />
                              Registrar factura proveedor
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {ordenesCompra.length === 0 && ingredientesCriticos.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Truck className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Sin órdenes de compra pendientes</p>
            <p className="text-sm">Registrá ventas en la sección Caja para activar el flujo de compras.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
