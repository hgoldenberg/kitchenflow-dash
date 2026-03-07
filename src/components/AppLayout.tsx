import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Truck, FileText, RotateCcw, Presentation } from "lucide-react";
import { useDemoContext } from "@/context/DemoContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/ventas", label: "Venta / Caja", icon: ShoppingCart },
  { to: "/stock", label: "Stock y Alertas", icon: Package },
  { to: "/compras", label: "Compras", icon: Truck },
  { to: "/facturas", label: "Facturas", icon: FileText },
  { to: "/presentacion", label: "Presentación", icon: Presentation },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { resetDemo, alertas } = useDemoContext();

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-5 border-b border-sidebar-border">
          <h1 className="font-display text-lg font-bold text-sidebar-primary-foreground tracking-tight">
            🍕 <span className="text-gradient">GastroERP</span>
          </h1>
          <p className="text-xs text-sidebar-foreground/60 mt-0.5">Demo operativa</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.to === "/stock" && alertas.length > 0 && (
                <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {alertas.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-sidebar-foreground/70 border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={resetDemo}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reiniciar demo
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
