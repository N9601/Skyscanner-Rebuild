import { useEffect, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";
import { CommandPalette } from "@/components/CommandPalette";
import { Tour } from "@/components/Tour";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { applyThemeClass, useTheme } from "@/stores/theme";

export function Layout() {
  const dark = useTheme((s) => s.dark);
  const { pathname, search } = useLocation();
  const outlet = useOutlet();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    applyThemeClass(dark);
  }, [dark]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname, search]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-surface dark:bg-surface-dark">
      <ScrollProgress />
      <div className="aurora" aria-hidden>
        <span className="aurora-1" />
        <span className="aurora-2" />
        <span className="aurora-3" />
      </div>
      <Header onOpenPalette={() => setPaletteOpen(true)} />
      <main className="relative z-[1] flex-1 pb-16 md:pb-0">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {outlet}
        </motion.div>
      </main>
      <Footer />
      <BottomNav />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      {pathname === "/" && <Tour />}
    </div>
  );
}
