import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TableSearchInput } from "@/components/TableSearchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { rowMatchesSearch } from "@/lib/tableSearch";

export default function Earnings() {
  const [search, setSearch] = useState("");
  const q = useQuery({
    queryKey: ["admin", "earnings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("driver_earnings")
        .select(
          `
          id,
          gross_fare,
          commission_amt,
          net_earning,
          earned_at,
          drivers ( name )
        `,
        )
        .order("earned_at", { ascending: false })
        .limit(400);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const rows = q.data ?? [];
  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        const d = row.drivers as { name: string } | null;
        const gross = Number(row.gross_fare);
        const comm = Number(row.commission_amt);
        const net = Number(row.net_earning);
        return rowMatchesSearch(search, [
          new Date(row.earned_at).toLocaleString(),
          d?.name,
          `₹${gross.toLocaleString("en-IN")}`,
          `₹${comm.toLocaleString("en-IN")}`,
          `₹${net.toLocaleString("en-IN")}`,
          String(gross),
          String(comm),
          String(net),
        ]);
      }),
    [rows, search],
  );

  const totalNet = useMemo(
    () => filtered.reduce((s, r) => s + Number(r.net_earning), 0),
    [filtered],
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold">Earnings</h1>
            <p className="text-sm text-muted-foreground mt-1">Driver earnings from completed trips</p>
          </div>
          {q.data ? (
            <div className="brutal-card px-4 py-2 text-sm">
              <span className="text-muted-foreground">Net on page: </span>
              <span className="font-heading font-bold">₹{totalNet.toLocaleString("en-IN")}</span>
            </div>
          ) : null}
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
                    <TableHead className="font-heading font-bold">Driver</TableHead>
                    <TableHead className="font-heading font-bold text-right">Gross</TableHead>
                    <TableHead className="font-heading font-bold text-right">Commission</TableHead>
                    <TableHead className="font-heading font-bold text-right">Net</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                        {rows.length === 0 ? "No earnings yet." : "No matching rows."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((row) => {
                      const d = row.drivers as { name: string } | null;
                      return (
                        <TableRow key={row.id} className="border-b border-muted">
                          <TableCell className="text-xs whitespace-nowrap">
                            {new Date(row.earned_at).toLocaleString()}
                          </TableCell>
                          <TableCell>{d?.name ?? "—"}</TableCell>
                          <TableCell className="text-right">
                            ₹{Number(row.gross_fare).toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{Number(row.commission_amt).toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            ₹{Number(row.net_earning).toLocaleString("en-IN")}
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
