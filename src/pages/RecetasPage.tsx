import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Package, DollarSign, TrendingUp } from "lucide-react";

interface RecetaIngrediente {
  nombre: string;
  cantidad: number;
  unidad: string;
  costoUnitario: number;
}

interface Receta {
  id: string;
  nombre: string;
  tipo: "con_receta" | "sin_receta";
  rendimiento: string;
  ingredientes: RecetaIngrediente[];
  precioVenta: number;
}

const recetasDummy: Receta[] = [
  {
    id: "pizza_muzz",
    nombre: "Pizza Muzzarella",
    tipo: "con_receta",
    rendimiento: "1 unidad",
    ingredientes: [
      { nombre: "Harina 000", cantidad: 0.318, unidad: "kg", costoUnitario: 450 },
      { nombre: "Salsa de tomate", cantidad: 0.200, unidad: "kg", costoUnitario: 600 },
      { nombre: "Muzzarella", cantidad: 0.400, unidad: "kg", costoUnitario: 1800 },
    ],
    precioVenta: 4500,
  },
  {
    id: "empanada_jyq",
    nombre: "Empanada Jamón y queso",
    tipo: "con_receta",
    rendimiento: "1 unidad",
    ingredientes: [
      { nombre: "Masa / tapa", cantidad: 1, unidad: "un", costoUnitario: 80 },
      { nombre: "Jamón cocido", cantidad: 0.050, unidad: "kg", costoUnitario: 3200 },
      { nombre: "Queso cremoso", cantidad: 0.040, unidad: "kg", costoUnitario: 2400 },
    ],
    precioVenta: 1200,
  },
  {
    id: "gaseosa_500",
    nombre: "Gaseosa 500 ml",
    tipo: "sin_receta",
    rendimiento: "1 unidad",
    ingredientes: [],
    precioVenta: 900,
  },
];

// Costo directo para gaseosa (control por stock directo)
const costoGaseosa = 350;

function calcularCostoReceta(receta: Receta): number {
  if (receta.tipo === "sin_receta") return costoGaseosa;
  return receta.ingredientes.reduce((sum, ing) => sum + ing.cantidad * ing.costoUnitario, 0);
}

function calcularMargen(precioVenta: number, costo: number): number {
  return ((precioVenta - costo) / precioVenta) * 100;
}

export default function RecetasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Recetas y Costeo</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Recetas configuradas que determinan el consumo automático de ingredientes por cada venta.
        </p>
      </div>

      <Card className="bg-muted/30 border-muted">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Cada producto vendido descuenta automáticamente los ingredientes según la receta activa. 
            Los productos sin receta se controlan por stock directo (ej: bebidas).
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recetasDummy.map((receta) => {
          const costoTotal = calcularCostoReceta(receta);
          const margen = calcularMargen(receta.precioVenta, costoTotal);
          
          return (
            <Card key={receta.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <ChefHat className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{receta.nombre}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">Rinde: {receta.rendimiento}</p>
                    </div>
                  </div>
                  <Badge variant={receta.tipo === "con_receta" ? "secondary" : "outline"} className="text-[10px]">
                    {receta.tipo === "con_receta" ? "Con receta" : "Stock directo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Ingredientes */}
                {receta.tipo === "con_receta" ? (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Package className="h-3 w-3" />
                      Ingredientes
                    </p>
                    {receta.ingredientes.map((ing, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm bg-muted/50 rounded px-2 py-1.5">
                        <span>{ing.nombre}</span>
                        <span className="text-muted-foreground text-xs">
                          {ing.cantidad} {ing.unidad}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded px-3 py-2 text-sm text-muted-foreground">
                    Producto sin receta — control por stock directo
                  </div>
                )}

                {/* Costeo */}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      Costo estimado
                    </span>
                    <span className="font-semibold">${Math.round(costoTotal).toLocaleString("es-AR")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Precio de venta</span>
                    <span className="font-semibold">${receta.precioVenta.toLocaleString("es-AR")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      Margen bruto
                    </span>
                    <Badge variant={margen >= 50 ? "secondary" : "outline"} className="font-semibold">
                      {margen.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
