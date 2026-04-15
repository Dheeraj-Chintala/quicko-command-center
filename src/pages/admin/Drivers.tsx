import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TableSearchInput } from "@/components/TableSearchInput";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { rowMatchesSearch } from "@/lib/tableSearch";

export default function Drivers() {
  const [search, setSearch] = useState("");
  const q = useQuery({
    queryKey: ["admin", "drivers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("id, name, phone, city, vehicle_type, status, duty_status, created_at")
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
          row.city,
          row.vehicle_type,
          row.status,
          row.duty_status,
        ]),
      ),
    [rows, search],
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Drivers</h1>
          <p className="text-sm text-muted-foreground mt-1">All registered drivers</p>
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
                    <TableHead className="font-heading font-bold">City</TableHead>
                    <TableHead className="font-heading font-bold">Type</TableHead>
                    <TableHead className="font-heading font-bold">Status</TableHead>
                    <TableHead className="font-heading font-bold">Duty</TableHead>
                    <TableHead className="font-heading font-bold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                        {rows.length === 0 ? "No drivers yet." : "No matching rows."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((row) => (
                      <TableRow key={row.id} className="border-b border-muted">
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>{row.city}</TableCell>
                        <TableCell>{row.vehicle_type}</TableCell>
                        <TableCell className="text-xs font-bold">{row.status}</TableCell>
                        <TableCell className="text-xs">{row.duty_status}</TableCell>
                        <TableCell className="text-right">
                          {row.status === "pending" || row.status === "rejected" ? (
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/driver-applications/${row.id}`}>Review</Link>
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/driver-applications/${row.id}`}>View</Link>
                            </Button>
                          )}
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
