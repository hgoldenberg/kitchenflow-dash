import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Database, Layout, Layers, Target, TrendingUp, Zap } from "lucide-react";

const Section = ({ title, children, accent }: { title: string; children: React.ReactNode; accent?: boolean }) => (
  <section className={`py-12 ${accent ? "bg-muted/30 -mx-6 lg:-mx-8 px-6 lg:px-8" : ""}`}>
    <h2 className="font-display text-xl font-bold mb-6">{title}</h2>
    {children}
  </section>
);

const flowSteps = [
  "Venta registrada",
  "Consumo por receta",
  "Baja de stock",
  "Alerta de faltante",
  "Orden de compra",
  "Recepción de mercadería",
  "Factura pendiente",
];

const modulos = [
  { name: "Dashboard", desc: "Vista ejecutiva de la operación diaria" },
  { name: "Venta / Caja", desc: "Registro rápido con impacto automático en stock" },
  { name: "Stock y Alertas", desc: "Inventario en tiempo real con alertas de mínimos" },
  { name: "Compras", desc: "Órdenes de compra sugeridas y recepción de mercadería" },
  { name: "Facturas", desc: "Cuentas a pagar asociadas a compras" },
];

const roadmap = [
  { etapa: "Validación", desc: "Demo visual + reunión con primer cliente", estado: "actual" },
  { etapa: "MVP Operativo", desc: "Base de datos real, autenticación, CRUD completo", estado: "próximo" },
  { etapa: "Consolidación", desc: "Reportes, múltiples usuarios, backup automático", estado: "futuro" },
  { etapa: "Expansión", desc: "Multi-sucursal, delivery, integraciones fiscales", estado: "futuro" },
];

const mvpIn = [
  "Dashboard operativo",
  "Registro de ventas",
  "Recetas y consumo automático",
  "Control de stock con alertas",
  "Órdenes de compra",
  "Recepción de mercadería",
  "Facturas pendientes",
];

const mvpOut = [
  "Contabilidad completa",
  "RRHH y nómina",
  "CRM / fidelización",
  "Delivery avanzado",
  "Facturación fiscal (AFIP)",
  "Multi-sucursal complejo",
];

export default function PresentacionPage() {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="py-16 text-center">
        <Badge variant="secondary" className="mb-4">Presentación Ejecutiva</Badge>
        <h1 className="font-display text-3xl lg:text-4xl font-bold mb-3">
          GastroERP <span className="text-gradient">Liviano</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Una solución incremental para ordenar la operación diaria de negocios gastronómicos. 
          Sin complejidad innecesaria. Con lógica de implementación real.
        </p>
      </section>

      <Section title="El problema actual">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Información fragmentada entre planillas, cuadernos y memoria",
            "Decisiones reactivas: se descubre el faltante cuando ya no hay stock",
            "Sin trazabilidad del flujo ventas → stock → compras → pagos",
          ].map((t, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive text-sm font-bold mb-3">{i + 1}</div>
                <p className="text-sm">{t}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="La oportunidad" accent>
        <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
          Muchos negocios gastronómicos medianos no necesitan un ERP gigante. Necesitan una herramienta que ordene 
          el circuito operativo más crítico: <strong>ventas, recetas, stock, compras y pagos</strong>.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="gap-1"><Target className="h-3 w-3" /> Foco operativo</Badge>
          <Badge variant="outline" className="gap-1"><Zap className="h-3 w-3" /> Implementación rápida</Badge>
          <Badge variant="outline" className="gap-1"><TrendingUp className="h-3 w-3" /> Escalable por etapas</Badge>
        </div>
      </Section>

      <Section title="Flujo operativo completo">
        <div className="flex flex-wrap items-center gap-2">
          {flowSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="bg-card border rounded-lg px-3 py-2 text-sm font-medium shadow-sm">{step}</div>
              {i < flowSteps.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Módulos principales" accent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {modulos.map((m) => (
            <Card key={m.name}>
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Arquitectura técnica">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-5 text-center">
              <Layout className="h-8 w-8 mx-auto mb-2 text-accent" />
              <p className="font-semibold text-sm">Lovable</p>
              <p className="text-xs text-muted-foreground mt-1">Frontend acelerado con React, TypeScript y diseño profesional</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <Database className="h-8 w-8 mx-auto mb-2 text-accent" />
              <p className="font-semibold text-sm">Supabase</p>
              <p className="text-xs text-muted-foreground mt-1">Base de datos PostgreSQL, autenticación y APIs en tiempo real</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <Layers className="h-8 w-8 mx-auto mb-2 text-accent" />
              <p className="font-semibold text-sm">Incremental</p>
              <p className="text-xs text-muted-foreground mt-1">Empezar con datos demo, migrar a operación real sin reescribir</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Alcance del MVP" accent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Incluido en MVP
            </p>
            <ul className="space-y-2">
              {mvpIn.map((item) => (
                <li key={item} className="text-sm flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-3">Fuera del MVP</p>
            <ul className="space-y-2">
              {mvpOut.map((item) => (
                <li key={item} className="text-sm flex items-center gap-2 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Roadmap por etapas">
        <div className="space-y-4">
          {roadmap.map((r, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                r.estado === "actual" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-sm">{r.etapa}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
                {r.estado === "actual" && <Badge className="mt-1 text-[10px]" variant="secondary">← Estamos acá</Badge>}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Próximos pasos" accent>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "Validar la propuesta con el primer cliente",
            "Definir prioridades y ajustes sobre esta demo",
            "Construir MVP operativo con datos reales",
            "Piloto en un local durante 30 días",
          ].map((t, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-center gap-3">
                <span className="h-6 w-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <p className="text-sm">{t}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <section className="py-12 text-center">
        <p className="text-muted-foreground text-sm">
          Demo construida con Lovable · Arquitectura lista para escalar con Supabase
        </p>
      </section>
    </div>
  );
}
