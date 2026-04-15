import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TableSearchInput } from "@/components/TableSearchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { rowMatchesSearch } from "@/lib/tableSearch";

export default function RideRequests() {
  const [search, setSearch] = useState("");
  const q = useQuery({
    queryKey: ["admin", "ride_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ride_requests")
        .select(
          `
          id,
          status,
          vehicle_type,
          pickup_address,
          drop_address,
          estimated_fare,
          created_at,
          expires_at,
          riders ( name, phone )
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
        const r = row.riders as { name: string | null; phone: string } | null;
        const fareStr =
          row.estimated_fare != null
            ? `₹${Number(row.estimated_fare).toLocaleString("en-IN")}`
            : "—";
        return rowMatchesSearch(search, [
          new Date(row.created_at).toLocaleString(),
          row.status,
          row.vehicle_type,
          r?.name,
          r?.phone,
          row.pickup_address,
          row.drop_address,
          fareStr,
          row.estimated_fare != null ? String(row.estimated_fare) : "",
        ]);
      }),
    [rows, search],
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Ride requests</h1>
          <p className="text-sm text-muted-foreground mt-1">Open and historical requests</p>
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
                    <TableHead className="font-heading font-bold">Created</TableHead>
                    <TableHead className="font-heading font-bold">Status</TableHead>
                    <TableHead className="font-heading font-bold">Type</TableHead>
                    <TableHead className="font-heading font-bold">Rider</TableHead>
                    <TableHead className="font-heading font-bold">Pickup</TableHead>
                    <TableHead className="font-heading font-bold">Drop</TableHead>
                    <TableHead className="font-heading font-bold text-right">Est. fare</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                        {rows.length === 0 ? "No ride requests yet." : "No matching rows."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((row) => {
                      const r = row.riders as { name: string | null; phone: string } | null;
                      return (
                        <TableRow key={row.id} className="border-b border-muted">
                          <TableCell className="text-xs whitespace-nowrap">
                            {new Date(row.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-xs font-bold">{row.status}</TableCell>
                          <TableCell>{row.vehicle_type}</TableCell>
                          <TableCell className="text-xs">
                            {r?.name ?? "—"}
                            <br />
                            <span className="text-muted-foreground">{r?.phone}</span>
                          </TableCell>
                          <TableCell className="max-w-[120px] truncate text-xs">
                            {row.pickup_address ?? "—"}
                          </TableCell>
                          <TableCell className="max-w-[120px] truncate text-xs">
                            {row.drop_address ?? "—"}
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {row.estimated_fare != null
                              ? `₹${Number(row.estimated_fare).toLocaleString("en-IN")}`
                              : "—"}
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
