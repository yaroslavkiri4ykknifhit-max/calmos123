import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { DailyMetric } from "@/types/database";

interface MetricsContextValue {
  metrics: DailyMetric[];
  refreshMetrics: () => Promise<void>;
}

const MetricsContext = createContext<MetricsContextValue | null>(null);

export function MetricsProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<DailyMetric[]>([]);

  const refreshMetrics = async () => {
    const { data, error } = await supabase
      .from("metrics")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setMetrics(data ?? []);
  };

  useEffect(() => {
    refreshMetrics();
  }, []);

  return (
    <MetricsContext.Provider value={{ metrics, refreshMetrics }}>
      {children}
    </MetricsContext.Provider>
  );
}

export function useMetrics() {
  const ctx = useContext(MetricsContext);
  if (!ctx) throw new Error("useMetrics must be used inside MetricsProvider");
  return ctx;
}