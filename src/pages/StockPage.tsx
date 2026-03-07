import { useDemoContext } from "@/context/DemoContext";
import { useDemoGuide } from "@/context/DemoGuideContext";
import { proveedores } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Package, ShoppingCart, ArrowRight } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import { useNavigate } from "react-router-dom";

export default function StockPage() {
  const { ingredientes, alertas, generarOrdenCompra, ordenesCompra } = useDemoContext();
  const { isGuided, currentStep, nextStep } = useDemoGuide();
  const navigate = useNavigate();

  const ingredientesCriticos = ingredientes.filter((i) => i.stockActual <= i.stockMinimo);
  const yaConOrden = new Set(ordenesCompra.flatMap((o) => o.items.map((i) => i.ingredienteId)));

  const getEstado = (ing: typeof ingredientes[0]) => {
    if (ing.stockActual <= 0) return { label: "Sin stock", variant: "destructive" as const };
    if (ing.stockActual <= ing.stockMinimo) return { label: "Stock crítico", variant: "destructive" as const };
    if (ing.stockActual <= ing.stockMinimo * 1.5) return { label: "Stock bajo", variant: "outline" as const };
    return { label: "OK", variant: "secondary" as const };
  };

  const handleGenerarOrdenes = () => {
    ingredientesCriticos.forEach((ing) => {
      if (!yaConOrden.has(ing.id)) {
        const cantidad = Math.max(10, ing.stockMinimo * 5);
        generarOrdenCompra(ing.id, cantidad, proveedores[0].id);
      }
    });
    if (isGuided && currentStep === 2) {
      nextStep();
    } else {
      navigate("/compras");
    }
  };

  return (
    <div className="space-y-6">
      <StepIndicator />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Stock y Alertas</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Estado de ingredientes en tiempo real. Los consumos se descuentan automáticamente al registrar ventas.
          </p>
        </div>
        {ingredientesCriticos.length > 0 && (
          <Button className="gap-2" onClick={handleGenerarOrdenes} disabled={ingredientesCriticos.every((i) => yaConOrden.has(i.id))}>
            <ShoppingCart className="h-4 w-4" />
            {ingredientesCriticos.every((i) => yaConOrden.has(i.id)) ? "Órdenes generadas" : "Generar orden de compra sugerida"}
          </Button>
        )}
      </div>

      {alertas.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="font-semibold text-sm text-destructive">Stock crítico detectado</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {alertas.length} ingrediente(s) por debajo del mínimo. Se recomienda generar una orden de compra.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ingrediente</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Stock actual</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Stock mínimo</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Costo unit.</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">Estado</th>
            </tr>
          </thead>
          <tbody>
            {ingredientes.map((ing) => {
              const estado = getEstado(ing);
              const isCritico = estado.variant === "destructive";
              return (
                <tr key={ing.id} className={`border-t ${isCritico ? "bg-destructive/5" : ""}`}>
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <Package className={`h-4 w-4 ${isCritico ? "text-destructive" : "text-muted-foreground"}`} />
                    {ing.nombre}
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${isCritico ? "text-destructive" : ""}`}>
                    {Number(ing.stockActual.toFixed(2))} {ing.unidad}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{ing.stockMinimo} {ing.unidad}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">${ing.costoUnitario.toLocaleString("es-AR")}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={estado.variant}>{estado.label}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
