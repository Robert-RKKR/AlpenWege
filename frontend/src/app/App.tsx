// Imports:
import { startTokenRefresh } from "../modules/profiles/api/refreshApi";
import { QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { queryClient } from "./providers/queryClient";
import { useAuthStore } from "../stores/authStore";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { AppRoutes } from "./routes";
import { useEffect } from "react";

// App component:
export function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const rememberMe = useAuthStore((s) => s.rememberMe);

  useEffect(() => {
    if (isAuthenticated && rememberMe) {
      startTokenRefresh();
    }
  }, [isAuthenticated, rememberMe]);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={{
          primaryColor: "teal",
          defaultRadius: "md",
        }}
      >

        {/* Mantine notifications */}
        <Notifications position="top-right" />

        {/* Browser router */}
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>

      </MantineProvider>
    </QueryClientProvider>
  );
}
