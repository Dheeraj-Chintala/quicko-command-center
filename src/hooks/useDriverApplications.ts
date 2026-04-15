import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PublicSchemaEnums } from "@/integrations/supabase/types";
import {
  approveDriverApplication,
  fetchDriverApplicationDetail,
  fetchDriverApplications,
  rejectDriverApplication,
  setVehicleVerified,
  updateDriverDocument,
} from "@/lib/driverApplicationQueries";

const qk = {
  list: (f: string) => ["driverApplications", f] as const,
  detail: (id: string) => ["driverApplication", id] as const,
};

export function useDriverApplicationsList(filter: PublicSchemaEnums["driver_status"] | "all_review") {
  return useQuery({
    queryKey: qk.list(filter),
    queryFn: () => fetchDriverApplications(filter === "all_review" ? "all_review" : filter),
  });
}

export function useDriverApplicationDetail(driverId: string | undefined) {
  return useQuery({
    queryKey: qk.detail(driverId ?? ""),
    queryFn: () => fetchDriverApplicationDetail(driverId!),
    enabled: Boolean(driverId),
  });
}

export function useApproveDriverApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: approveDriverApplication,
    onSuccess: (_, driverId) => {
      qc.invalidateQueries({ queryKey: ["driverApplications"] });
      qc.invalidateQueries({ queryKey: ["driverApplication", driverId] });
      qc.invalidateQueries({ queryKey: ["dashboard", "pendingApprovals"] });
      qc.invalidateQueries({ queryKey: ["admin", "drivers"] });
    },
  });
}

export function useRejectDriverApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ driverId, note }: { driverId: string; note: string }) =>
      rejectDriverApplication(driverId, note),
    onSuccess: (_, { driverId }) => {
      qc.invalidateQueries({ queryKey: ["driverApplications"] });
      qc.invalidateQueries({ queryKey: ["driverApplication", driverId] });
      qc.invalidateQueries({ queryKey: ["dashboard", "pendingApprovals"] });
      qc.invalidateQueries({ queryKey: ["admin", "drivers"] });
      qc.invalidateQueries({ queryKey: ["admin", "documents_pending"] });
    },
  });
}

export function useUpdateDriverDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      docId,
      driverId,
      status,
      adminNote,
    }: {
      docId: string;
      driverId: string;
      status: PublicSchemaEnums["doc_status"];
      adminNote: string | null;
    }) => updateDriverDocument(docId, status, adminNote),
    onSuccess: (_, { driverId }) => {
      qc.invalidateQueries({ queryKey: ["driverApplication", driverId] });
      qc.invalidateQueries({ queryKey: ["dashboard", "pendingApprovals"] });
      qc.invalidateQueries({ queryKey: ["admin", "documents_pending"] });
    },
  });
}

export function useSetVehicleVerified() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ vehicleId, driverId, isVerified }: { vehicleId: string; driverId: string; isVerified: boolean }) =>
      setVehicleVerified(vehicleId, isVerified),
    onSuccess: (_, { driverId }) => {
      qc.invalidateQueries({ queryKey: ["driverApplication", driverId] });
    },
  });
}
