import { useDemoContext } from "@/context/DemoContext";
import { useDemoGuide } from "@/context/DemoGuideContext";
import { proveedores } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2 } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import { useNavigate } from "react-router-dom";

export default function FacturasPage() {
  const { facturas } = useDemoContext();
  const { isGuided, stopGuide } = useDemoGuide();
  const navigate = useNavigate();

  const handleFinishGuide = () => {
    stopGuide();
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <StepIndicator />

      <div>
        <h1 className="font-display text-2xl font-bold">Facturas Pendientes</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Cuentas a pagar asociadas a órdenes de compra recibidas.
        </p>
      </div>

      <Card className="bg-muted/30 border-muted">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Cada factura se genera automáticamente al registrar la recepción de mercadería de una orden de compra. Refleja el monto y proveedor de la operación original.
          </p>
        </CardContent>
      </Card>

      {facturas.length > 0 ? (
        <>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Factura</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Proveedor</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Orden</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Monto</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Emisión</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Vencimiento</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Estado</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((f) => {
                  const prov = proveedores.find((p) => p.id === f.proveedorId);
                  return (
                    <tr key={f.id} className="border-t">
                      <td className="px-4 py-3 font-mono text-xs">{f.id}</td>
                      <td className="px-4 py-3">{prov?.nombre}</td>
                      <td className="px-4 py-3 font-mono text-xs">{f.ordenCompraId}</td>
                      <td className="px-4 py-3 text-right font-semibold">${f.monto.toLocaleString("es-AR")}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(f.fechaEmision).toLocaleDateString("es-AR")}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(f.fechaVencimiento).toLocaleDateString("es-AR")}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={f.estado === "pendiente" ? "outline" : "secondary"}>
                          {f.estado === "pendiente" ? "Pendiente de pago" : "Pagada"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {isGuided && (
            <Card className="border-success/30 bg-success/5">
              <CardContent className="p-6 text-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-success mx-auto" />
                <div>
                  <p className="font-display font-bold text-lg">¡Demo completada!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recorriste el flujo operativo completo: venta → stock → compra → factura.
                  </p>
                </div>
                <Button onClick={handleFinishGuide} className="gap-2">
                  Volver al Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Sin facturas pendientes</p>
            <p className="text-sm">Las facturas se generan al registrar la recepción de una orden de compra.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
