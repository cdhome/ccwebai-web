import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useHashScroll(offsetId?: string) {
  const location = useLocation();

  useEffect(() => {
    const hash = String(location.hash || "");
    if (!hash || !hash.startsWith("#")) return;
    const id = hash.slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (offsetId) {
      document.getElementById(offsetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash, offsetId]);
}

