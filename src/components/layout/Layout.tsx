import { useEffect, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";
import { CommandPalette } from "@/components/CommandPalette";
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
      <Header onOpenPalette={() => setPaletteOpen(true)} />
      <main className="flex-1 pb-16 md:pb-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BottomNav />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
