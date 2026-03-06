import { useDemoContext } from "@/context/DemoContext";
import { proveedores } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export default function FacturasPage() {
  const { facturas } = useDemoContext();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Facturas Pendientes</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Cuentas a pagar asociadas a órdenes de compra recibidas.
        </p>
      </div>

      {facturas.length > 0 ? (
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
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Sin facturas pendientes</p>
            <p className="text-sm">Las facturas se generan al recibir mercadería de una orden de compra.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
