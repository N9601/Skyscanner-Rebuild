import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { applyThemeClass, useTheme } from "@/stores/theme";

export function Layout() {
  const dark = useTheme((s) => s.dark);
  const { pathname } = useLocation();

  useEffect(() => {
    applyThemeClass(dark);
  }, [dark]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-surface dark:bg-surface-dark">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
