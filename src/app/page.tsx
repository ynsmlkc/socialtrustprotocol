"use client";

import { useAccount } from "wagmi";
import { DashboardView } from "@/components/views/DashboardView";
import { LandingView } from "@/components/views/LandingView";
import { useEffect, useState } from "react";

export default function Page() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return <LandingView />;

  if (!isConnected) {
    return <LandingView />;
  }

  return <DashboardView />;
}
