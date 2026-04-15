import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TableSearchInput } from "@/components/TableSearchInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useApproveDriverApplication,
  useDriverApplicationDetail,
  useDriverApplicationsList,
  useRejectDriverApplication,
  useSetVehicleVerified,
  useUpdateDriverDocument,
} from "@/hooks/useDriverApplications";
import type { PublicSchemaEnums } from "@/integrations/supabase/types";
import {
  DOC_LABELS,
  getDocumentSignedUrl,
  type DriverDocRow,
} from "@/lib/driverApplicationQueries";
import { rowMatchesSearch } from "@/lib/tableSearch";
import { ArrowLeft, Check, X } from "lucide-react";
import { toast } from "sonner";

type ListFilter = PublicSchemaEnums["driver_status"] | "all_review";

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    pending: "bg-warning/15 text-warning",
    approved: "bg-success/15 text-success",
    rejected: "bg-destructive/15 text-destructive",
    suspended: "bg-muted text-muted-foreground",
  };
  return map[s] ?? "bg-secondary text-foreground";
};

function DocumentPreview({ storagePath }: { storagePath: string }) {
  const [url, setUrl] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getDocumentSignedUrl(storagePath).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [storagePath]);

  if (url === undefined) return <Skeleton className="h-40 w-full max-w-xs" />;
  if (!url) return <p className="text-xs text-muted-foreground">Could not load image</p>;
  return (
    <a href={url} target="_blank" rel="noreferrer" className="block">
      <img src={url} alt="" className="max-h-48 rounded-sm brutal-border object-contain bg-card" />
    </a>
  );
}

function DriverApplicationDetail({ driverId }: { driverId: string }) {
  const q = useDriverApplicationDetail(driverId);
  const approveApp = useApproveDriverApplication();
  const rejectApp = useRejectDriverApplication();
  const updateDoc = useUpdateDriverDocument();
  const setVeh = useSetVehicleVerified();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [docDialog, setDocDialog] = useState<{
    doc: DriverDocRow;
    action: "approved" | "rejected";
    note: string;
  } | null>(null);

  if (q.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (q.isError || !q.data) {
    return (
      <div>
        <p className="text-destructive text-sm mb-4">Failed to load application.</p>
        <Button variant="outline" asChild>
          <Link to="/driver-applications">Back to list</Link>
        </Button>
      </div>
    );
  }

  const { driver, vehicle, documents } = q.data;

  const onApproveApp = async () => {
    try {
      await approveApp.mutateAsync(driverId);
      toast.success("Driver approved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Approve failed");
    }
  };

  const onRejectApp = async () => {
    if (!rejectNote.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    try {
      await rejectApp.mutateAsync({ driverId, note: rejectNote });
      toast.success("Application rejected");
      setRejectOpen(false);
      setRejectNote("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reject failed");
    }
  };

  const submitDocReview = async () => {
    if (!docDialog) return;
    if (docDialog.action === "rejected" && !docDialog.note.trim()) {
      toast.error("Add a note for rejection");
      return;
    }
    try {
      await updateDoc.mutateAsync({
        docId: docDialog.doc.id,
        driverId,
        status: docDialog.action,
        adminNote: docDialog.action === "rejected" ? docDialog.note.trim() : null,
      });
      toast.success(`Document ${docDialog.action}`);
      setDocDialog(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/driver-applications" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-heading font-bold">{driver.name}</h1>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-sm brutal-border ${statusBadge(driver.status)}`}>
          {driver.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="brutal-card p-5 space-y-2 text-sm">
          <h2 className="font-heading font-bold text-base mb-2">Profile</h2>
          <p>
            <span className="text-muted-foreground">Phone:</span> {driver.phone}
          </p>
          <p>
            <span className="text-muted-foreground">City:</span> {driver.city}
          </p>
          <p>
            <span className="text-muted-foreground">Vehicle type:</span> {driver.vehicle_type}
          </p>
          <p>
            <span className="text-muted-foreground">Applied:</span>{" "}
            {new Date(driver.created_at).toLocaleString()}
          </p>
          {driver.rejection_note ? (
            <p className="text-destructive">
              <span className="font-bold">Rejection note:</span> {driver.rejection_note}
            </p>
          ) : null}
        </div>

        <div className="brutal-card p-5 space-y-2 text-sm">
          <h2 className="font-heading font-bold text-base mb-2">Vehicle</h2>
          {vehicle ? (
            <>
              <p>
                {vehicle.make} {vehicle.model} · {vehicle.vehicle_number}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="veh-ver"
                  checked={vehicle.is_verified}
                  onCheckedChange={async (c) => {
                    try {
                      await setVeh.mutateAsync({
                        vehicleId: vehicle.id,
                        driverId,
                        isVerified: c === true,
                      });
                      toast.success("Vehicle updated");
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Failed");
                    }
                  }}
                />
                <Label htmlFor="veh-ver" className="cursor-pointer font-normal">
                  Mark vehicle verified
                </Label>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">No vehicle registered yet</p>
          )}
        </div>
      </div>

      {driver.status === "pending" ? (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="success"
            disabled={approveApp.isPending}
            onClick={() => void onApproveApp()}
          >
            <Check className="h-4 w-4 mr-1" />
            Approve application
          </Button>
          <Button variant="destructive" onClick={() => setRejectOpen(true)}>
            <X className="h-4 w-4 mr-1" />
            Reject application
          </Button>
        </div>
      ) : null}

      <div>
        <h2 className="font-heading font-bold text-lg mb-3">Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="brutal-card p-4 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="font-heading font-bold">{DOC_LABELS[doc.doc_type]}</p>
                  <p className={`text-xs font-bold ${statusBadge(doc.status)} inline-block mt-1 px-2 py-0.5 rounded-sm`}>
                    {doc.status}
                  </p>
                </div>
                {doc.status === "pending" ? (
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="success"
                      type="button"
                      onClick={() => setDocDialog({ doc, action: "approved", note: "" })}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      type="button"
                      onClick={() => setDocDialog({ doc, action: "rejected", note: "" })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : null}
              </div>
              <DocumentPreview storagePath={doc.storage_path} />
              {doc.admin_note ? (
                <p className="text-xs text-muted-foreground">Note: {doc.admin_note}</p>
              ) : null}
            </div>
          ))}
        </div>
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents uploaded.</p>
        ) : null}
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="brutal-border sm:rounded-sm">
          <DialogHeader>
            <DialogTitle className="font-heading">Reject application</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Reason (required)"
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            className="min-h-[100px] brutal-input"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" type="button" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={rejectApp.isPending} onClick={() => void onRejectApp()}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!docDialog} onOpenChange={(o) => !o && setDocDialog(null)}>
        <DialogContent className="brutal-border sm:rounded-sm">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {docDialog?.action === "approved" ? "Approve document" : "Reject document"}
            </DialogTitle>
          </DialogHeader>
          {docDialog?.action === "rejected" ? (
            <Textarea
              placeholder="Admin note (required)"
              value={docDialog.note}
              onChange={(e) => setDocDialog({ ...docDialog, note: e.target.value })}
              className="min-h-[80px] brutal-input"
            />
          ) : (
            <p className="text-sm text-muted-foreground">Confirm approval for this document.</p>
          )}
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setDocDialog(null)}>
              Cancel
            </Button>
            <Button disabled={updateDoc.isPending} onClick={() => void submitDocReview()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DriverApplications() {
  const { driverId } = useParams<{ driverId: string }>();
  const [listFilter, setListFilter] = useState<ListFilter>("pending");
  const [search, setSearch] = useState("");
  const listQ = useDriverApplicationsList(listFilter);

  const listRows = listQ.data ?? [];
  const filteredList = useMemo(
    () =>
      listRows.filter((row) =>
        rowMatchesSearch(search, [row.name, row.phone, row.city, row.vehicle_type, row.status]),
      ),
    [listRows, search],
  );

  if (driverId) {
    return (
      <DashboardLayout>
        <DriverApplicationDetail driverId={driverId} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Driver applications</h1>
          <p className="text-sm text-muted-foreground mt-1">Review drivers and documents</p>
        </div>

        <Tabs
          value={listFilter}
          onValueChange={(v) => setListFilter(v as ListFilter)}
          className="w-full"
        >
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="all_review">All open</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="suspended">Suspended</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>
        </Tabs>

        {listQ.isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : listQ.isError ? (
          <p className="text-destructive text-sm">Could not load drivers.</p>
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
                    <TableHead className="font-heading font-bold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                        {listRows.length === 0 ? "No applications in this view." : "No matching rows."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredList.map((row) => (
                      <TableRow key={row.id} className="border-b border-muted">
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>{row.city}</TableCell>
                        <TableCell>{row.vehicle_type}</TableCell>
                        <TableCell>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-sm brutal-border ${statusBadge(row.status)}`}
                          >
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/driver-applications/${row.id}`}>Review</Link>
                          </Button>
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
