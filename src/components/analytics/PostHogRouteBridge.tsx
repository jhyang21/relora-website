"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { syncRouteAnalytics } from "@/lib/analytics/client";

export function PostHogRouteBridge(): null {
  const pathname = usePathname();

  useEffect(() => {
    syncRouteAnalytics(pathname || "/");
  }, [pathname]);

  return null;
}
