import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TableSearchInput } from "@/components/TableSearchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { rowMatchesSearch } from "@/lib/tableSearch";

export default function Trips() {
  const [search, setSearch] = useState("");
  const q = useQuery({
    queryKey: ["admin", "trips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select(
          `
          id,
          status,
          created_at,
          pickup_address,
          drop_address,
          final_fare,
          fare,
          payment_method,
          riders ( name ),
          drivers ( name )
        `,
        )
        .order("created_at", { ascending: false })
        .limit(300);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const rows = q.data ?? [];
  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        const r = row.riders as { name: string | null } | null;
        const d = row.drivers as { name: string } | null;
        const fare = row.final_fare ?? row.fare;
        const fareStr =
          fare != null ? `₹${Number(fare).toLocaleString("en-IN")}` : "—";
        return rowMatchesSearch(search, [
          new Date(row.created_at).toLocaleString(),
          row.status,
          r?.name,
          d?.name,
          row.pickup_address,
          row.drop_address,
          fareStr,
          String(fare ?? ""),
        ]);
      }),
    [rows, search],
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Trips</h1>
          <p className="text-sm text-muted-foreground mt-1">Recent trips (latest 300)</p>
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
                    <TableHead className="font-heading font-bold">When</TableHead>
                    <TableHead className="font-heading font-bold">Status</TableHead>
                    <TableHead className="font-heading font-bold">Rider</TableHead>
                    <TableHead className="font-heading font-bold">Driver</TableHead>
                    <TableHead className="font-heading font-bold">Pickup</TableHead>
                    <TableHead className="font-heading font-bold">Drop</TableHead>
                    <TableHead className="font-heading font-bold text-right">Fare</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                        {rows.length === 0 ? "No trips yet." : "No matching rows."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((row) => {
                      const r = row.riders as { name: string | null } | null;
                      const d = row.drivers as { name: string } | null;
                      const fare = row.final_fare ?? row.fare;
                      return (
                        <TableRow key={row.id} className="border-b border-muted">
                          <TableCell className="whitespace-nowrap text-xs">
                            {new Date(row.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-xs font-bold">{row.status}</TableCell>
                          <TableCell>{r?.name ?? "—"}</TableCell>
                          <TableCell>{d?.name ?? "—"}</TableCell>
                          <TableCell className="max-w-[140px] truncate text-xs">
                            {row.pickup_address ?? "—"}
                          </TableCell>
                          <TableCell className="max-w-[140px] truncate text-xs">
                            {row.drop_address ?? "—"}
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {fare != null ? `₹${Number(fare).toLocaleString("en-IN")}` : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })
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
