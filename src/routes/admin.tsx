import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — DATAZONe" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <AuthProvider>
      <ProtectedRoute>
        <AdminShell>
          <Outlet />
        </AdminShell>
      </ProtectedRoute>
    </AuthProvider>
  ),
});