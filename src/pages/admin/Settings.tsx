import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ExternalLink, LogOut } from "lucide-react";

const supabaseProjectHost = (() => {
  try {
    const u = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    if (!u) return null;
    return new URL(u).host;
  } catch {
    return null;
  }
})();

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-lg">
        <div>
          <h1 className="text-3xl font-heading font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin session and project</p>
        </div>

        <div className="brutal-card p-5 space-y-3 text-sm">
          <p>
            <span className="text-muted-foreground">Signed in as</span>
            <br />
            <span className="font-medium break-all">{user?.email ?? "—"}</span>
          </p>
          <p className="text-muted-foreground text-xs">
            API URL host: {supabaseProjectHost ?? "(not set)"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="gap-2"
            asChild
          >
            <a
              href={
                supabaseProjectHost
                  ? `https://supabase.com/dashboard/project/${supabaseProjectHost.split(".")[0]}`
                  : "https://supabase.com/dashboard"
              }
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              Supabase dashboard
            </a>
          </Button>
          <Button
            variant="destructive"
            className="gap-2"
            onClick={async () => {
              await signOut();
              navigate("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
