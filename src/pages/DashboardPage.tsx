import { useDemoContext } from "@/context/DemoContext";
import { useDemoGuide } from "@/context/DemoGuideContext";
import { productos } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, ShoppingCart, AlertTriangle, Truck, FileText, TrendingUp, Play, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { ventas, ingredientes, alertas, ordenesCompra, facturas, resetDemo } = useDemoContext();
  const { startGuide } = useDemoGuide();

  const ventasHoy = ventas.reduce((s, v) => s + v.total, 0);
  const productosVendidos = ventas.reduce((s, v) => s + v.items.reduce((a, i) => a + i.cantidad, 0), 0);
  const ordenesAbiertas = ordenesCompra.filter((o) => o.estado === "emitida").length;
  const facturasPendientes = facturas.filter((f) => f.estado === "pendiente");
  const montoFacturas = facturasPendientes.reduce((s, f) => s + f.monto, 0);
  const ingredientesCriticos = ingredientes.filter((i) => i.stockActual <= i.stockMinimo);

  const stats = [
    { label: "Ventas del día", value: `$${ventasHoy.toLocaleString("es-AR")}`, icon: DollarSign, color: "text-success" },
    { label: "Productos vendidos", value: productosVendidos, icon: ShoppingCart, color: "text-accent" },
    { label: "Alertas de stock", value: alertas.length, icon: AlertTriangle, color: alertas.length > 0 ? "text-destructive" : "text-success" },
    { label: "Órdenes abiertas", value: ordenesAbiertas, icon: Truck, color: "text-accent" },
    { label: "Facturas pendientes", value: facturasPendientes.length, icon: FileText, color: "text-warning" },
    { label: "Total a pagar", value: `$${montoFacturas.toLocaleString("es-AR")}`, icon: TrendingUp, color: "text-muted-foreground" },
  ];

  // Build narrative summary
  const narrativeParts: string[] = [];
  if (productosVendidos > 0) {
    narrativeParts.push(`Hoy se registraron ${productosVendidos} productos vendidos`);
  }
  if (ingredientesCriticos.length > 0) {
    narrativeParts.push(`el sistema detectó ${ingredientesCriticos.length} insumo${ingredientesCriticos.length > 1 ? "s" : ""} crítico${ingredientesCriticos.length > 1 ? "s" : ""} y sugiere una compra para evitar quiebre de stock`);
  }
  if (ordenesAbiertas > 0) {
    narrativeParts.push(`hay ${ordenesAbiertas} orden${ordenesAbiertas > 1 ? "es" : ""} de compra pendiente${ordenesAbiertas > 1 ? "s" : ""} de recepción`);
  }
  if (facturasPendientes.length > 0) {
    narrativeParts.push(`${facturasPendientes.length} factura${facturasPendientes.length > 1 ? "s" : ""} pendiente${facturasPendientes.length > 1 ? "s" : ""} de pago por $${montoFacturas.toLocaleString("es-AR")}`);
  }

  const narrativeText = narrativeParts.length > 0
    ? narrativeParts.join(". ").replace(/\. (\w)/, (_, c) => `. ${c.toUpperCase()}`) + "."
    : "Sin actividad registrada aún. Iniciá la demo guiada para simular la operación del día.";

  const handleStartGuide = () => {
    resetDemo();
    startGuide();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Vista general de la operación del día</p>
      </div>

      {/* Guided Demo CTA */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <h2 className="font-display text-xl font-bold">Simular operación del día</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-medium text-xs">Venta demo</span>
                <ArrowRight className="h-3 w-3" />
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-medium text-xs">Stock crítico</span>
                <ArrowRight className="h-3 w-3" />
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-medium text-xs">Compra sugerida</span>
                <ArrowRight className="h-3 w-3" />
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-medium text-xs">Factura pendiente</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-lg">
                Recorré el flujo operativo principal en 4 pasos. Vas a ver cómo una venta impacta el stock, dispara una alerta y genera automáticamente una orden de compra con su factura.
              </p>
            </div>
            <Button size="lg" className="gap-2 shrink-0" onClick={handleStartGuide}>
              <Play className="h-4 w-4" />
              Iniciar demo guiada
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Narrative summary */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <p className="text-sm leading-relaxed text-foreground/80">
            <span className="font-semibold text-foreground">Resumen del día: </span>
            {narrativeText}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2.5 rounded-lg bg-muted ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold font-display">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ingredientesCriticos.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Insumos en stock crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ingredientesCriticos.map((i) => (
                <div key={i.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{i.nombre}</span>
                  <div className="flex items-center gap-2">
                    <span>{Number(i.stockActual.toFixed(2))} {i.unidad}</span>
                    <Badge variant="destructive" className="text-xs">Mínimo: {i.stockMinimo} {i.unidad}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {ventas.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Últimas ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ventas.slice(-5).reverse().map((v) => (
                <div key={v.id} className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs font-mono">{v.id}</Badge>
                    <span className="text-muted-foreground">
                      {v.items.map((i) => {
                        const prod = productos.find((p) => p.id === i.productoId);
                        return `${prod?.nombre} x${i.cantidad}`;
                      }).join(", ")}
                    </span>
                  </div>
                  <span className="font-semibold">${v.total.toLocaleString("es-AR")}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
