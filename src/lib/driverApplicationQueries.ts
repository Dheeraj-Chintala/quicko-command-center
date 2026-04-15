import { supabase } from "@/integrations/supabase/client";
import type { PublicSchemaEnums } from "@/integrations/supabase/types";

const BUCKET = "driver-documents";

export const DOC_LABELS: Record<PublicSchemaEnums["document_type"], string> = {
  dl_front: "DL Front",
  dl_back: "DL Back",
  rc_front: "RC Front",
  rc_back: "RC Back",
  aadhaar_front: "Aadhaar",
  aadhaar_back: "Aadhaar (back)",
  pan: "PAN Card",
};

export type DriverApplicationListRow = {
  id: string;
  name: string;
  phone: string;
  city: string;
  vehicle_type: PublicSchemaEnums["vehicle_type"];
  status: PublicSchemaEnums["driver_status"];
  created_at: string;
};

export async function fetchDriverApplications(
  statusFilter: PublicSchemaEnums["driver_status"] | "all_review" | null,
): Promise<DriverApplicationListRow[]> {
  let q = supabase
    .from("drivers")
    .select("id, name, phone, city, vehicle_type, status, created_at")
    .order("created_at", { ascending: false });

  if (statusFilter === "all_review") {
    q = q.in("status", ["pending", "rejected", "suspended"]);
  } else if (statusFilter) {
    q = q.eq("status", statusFilter);
  }

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as DriverApplicationListRow[];
}

export type DriverDocRow = {
  id: string;
  driver_id: string;
  doc_type: PublicSchemaEnums["document_type"];
  storage_path: string;
  public_url: string | null;
  status: PublicSchemaEnums["doc_status"];
  admin_note: string | null;
  reviewed_at: string | null;
};

export type VehicleRow = {
  id: string;
  vehicle_number: string;
  vehicle_type: PublicSchemaEnums["vehicle_type"];
  make: string | null;
  model: string | null;
  is_verified: boolean;
};

export type DriverDetail = {
  id: string;
  name: string;
  phone: string;
  city: string;
  vehicle_type: PublicSchemaEnums["vehicle_type"];
  status: PublicSchemaEnums["driver_status"];
  rejection_note: string | null;
  approved_at: string | null;
  created_at: string;
  date_of_birth: string | null;
  gender: string | null;
};

export async function fetchDriverApplicationDetail(driverId: string): Promise<{
  driver: DriverDetail;
  vehicle: VehicleRow | null;
  documents: DriverDocRow[];
}> {
  const { data: driver, error: dErr } = await supabase
    .from("drivers")
    .select(
      "id, name, phone, city, vehicle_type, status, rejection_note, approved_at, created_at, date_of_birth, gender",
    )
    .eq("id", driverId)
    .maybeSingle();

  if (dErr) throw new Error(dErr.message);
  if (!driver) throw new Error("Driver not found");

  const [{ data: vehicle, error: vErr }, { data: docs, error: docErr }] = await Promise.all([
    supabase
      .from("vehicles")
      .select("id, vehicle_number, vehicle_type, make, model, is_verified")
      .eq("driver_id", driverId)
      .maybeSingle(),
    supabase
      .from("driver_documents")
      .select("id, driver_id, doc_type, storage_path, public_url, status, admin_note, reviewed_at")
      .eq("driver_id", driverId)
      .order("uploaded_at", { ascending: true }),
  ]);

  if (vErr) throw new Error(vErr.message);
  if (docErr) throw new Error(docErr.message);

  return {
    driver: driver as DriverDetail,
    vehicle: vehicle as VehicleRow | null,
    documents: (docs ?? []) as DriverDocRow[],
  };
}

export async function getDocumentSignedUrl(storagePath: string, expiresSec = 3600): Promise<string | null> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, expiresSec);
  if (error) {
    console.warn(error.message);
    return null;
  }
  return data.signedUrl;
}

async function currentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Not authenticated");
  return data.user.id;
}

export async function approveDriverApplication(driverId: string): Promise<void> {
  const reviewer = await currentUserId();
  const now = new Date().toISOString();

  const { error: dErr } = await supabase
    .from("drivers")
    .update({
      status: "approved",
      approved_at: now,
      rejection_note: null,
      updated_at: now,
    })
    .eq("id", driverId);

  if (dErr) throw new Error(dErr.message);

  const { data: pendingDocs, error: pErr } = await supabase
    .from("driver_documents")
    .select("id")
    .eq("driver_id", driverId)
    .eq("status", "pending");

  if (pErr) throw new Error(pErr.message);

  for (const row of pendingDocs ?? []) {
    const { error: uErr } = await supabase
      .from("driver_documents")
      .update({
        status: "approved",
        admin_note: null,
        reviewed_by: reviewer,
        reviewed_at: now,
      })
      .eq("id", row.id);
    if (uErr) throw new Error(uErr.message);
  }
}

export async function rejectDriverApplication(driverId: string, rejectionNote: string): Promise<void> {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("drivers")
    .update({
      status: "rejected",
      rejection_note: rejectionNote.trim(),
      approved_at: null,
      updated_at: now,
    })
    .eq("id", driverId);

  if (error) throw new Error(error.message);
}

export async function updateDriverDocument(
  docId: string,
  status: PublicSchemaEnums["doc_status"],
  adminNote: string | null,
): Promise<void> {
  const reviewer = await currentUserId();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("driver_documents")
    .update({
      status,
      admin_note: adminNote?.trim() || null,
      reviewed_by: reviewer,
      reviewed_at: now,
    })
    .eq("id", docId);

  if (error) throw new Error(error.message);
}

export async function setVehicleVerified(vehicleId: string, isVerified: boolean): Promise<void> {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("vehicles")
    .update({ is_verified: isVerified, updated_at: now })
    .eq("id", vehicleId);

  if (error) throw new Error(error.message);
}
