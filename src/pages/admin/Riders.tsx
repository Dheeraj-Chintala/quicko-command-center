import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TableSearchInput } from "@/components/TableSearchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { rowMatchesSearch } from "@/lib/tableSearch";

export default function Riders() {
  const [search, setSearch] = useState("");
  const q = useQuery({
    queryKey: ["admin", "riders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("riders")
        .select("id, name, phone, email, is_active, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const rows = q.data ?? [];
  const filtered = useMemo(
    () =>
      rows.filter((row) =>
        rowMatchesSearch(search, [
          row.name,
          row.phone,
          row.email,
          row.is_active ? "Yes" : "No",
          new Date(row.created_at).toLocaleDateString(),
        ]),
      ),
    [rows, search],
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Riders</h1>
          <p className="text-sm text-muted-foreground mt-1">Registered riders</p>
        </div>
        {q.isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : q.isError ? (
          <p className="text-destructive text-sm">{(q.error as Error).message}</p>
        ) : (
          <div className="brutal-card overflow-hidden">
            <div className="border-b border-foreground px-4 py-3">
              <TableSearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-foreground">
                    <TableHead className="font-heading font-bold">Name</TableHead>
                    <TableHead className="font-heading font-bold">Phone</TableHead>
                    <TableHead className="font-heading font-bold">Email</TableHead>
                    <TableHead className="font-heading font-bold">Active</TableHead>
                    <TableHead className="font-heading font-bold">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                        {rows.length === 0 ? "No riders yet." : "No matching rows."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((row) => (
                      <TableRow key={row.id} className="border-b border-muted">
                        <TableCell className="font-medium">{row.name ?? "—"}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell className="text-xs">{row.email ?? "—"}</TableCell>
                        <TableCell>{row.is_active ? "Yes" : "No"}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap">
                          {new Date(row.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
