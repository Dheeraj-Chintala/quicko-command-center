import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TableSearchInput } from "@/components/TableSearchInput";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { DOC_LABELS } from "@/lib/driverApplicationQueries";
import { rowMatchesSearch } from "@/lib/tableSearch";

export default function Documents() {
  const [search, setSearch] = useState("");
  const q = useQuery({
    queryKey: ["admin", "documents_pending"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("driver_documents")
        .select(
          `
          id,
          driver_id,
          doc_type,
          status,
          uploaded_at,
          drivers ( name, city )
        `,
        )
        .eq("status", "pending")
        .order("uploaded_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const rows = q.data ?? [];
  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        const d = row.drivers as { name: string; city: string } | null;
        return rowMatchesSearch(search, [
          d?.name,
          d?.city,
          DOC_LABELS[row.doc_type],
          new Date(row.uploaded_at).toLocaleString(),
        ]);
      }),
    [rows, search],
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pending document uploads — open a driver application to approve or reject with a note.
          </p>
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
                    <TableHead className="font-heading font-bold">Driver</TableHead>
                    <TableHead className="font-heading font-bold">City</TableHead>
                    <TableHead className="font-heading font-bold">Document</TableHead>
                    <TableHead className="font-heading font-bold">Uploaded</TableHead>
                    <TableHead className="font-heading font-bold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                        {rows.length === 0 ? "No pending documents." : "No matching rows."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((row) => {
                      const d = row.drivers as { name: string; city: string } | null;
                      return (
                        <TableRow key={row.id} className="border-b border-muted">
                          <TableCell className="font-medium">{d?.name ?? "—"}</TableCell>
                          <TableCell>{d?.city ?? "—"}</TableCell>
                          <TableCell className="text-xs">{DOC_LABELS[row.doc_type]}</TableCell>
                          <TableCell className="text-xs whitespace-nowrap">
                            {new Date(row.uploaded_at).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/driver-applications/${row.driver_id}`}>Review application</Link>
                            </Button>
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
