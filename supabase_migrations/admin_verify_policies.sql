-- Admin JWT verification (app_metadata.role = 'admin' → is_admin())
-- Run after completeschema.sql. Allows dashboard to approve/reject drivers and documents.
-- Safe to re-run: drops policies by name before create.

DROP POLICY IF EXISTS drivers_admin_update ON drivers;
CREATE POLICY drivers_admin_update ON drivers FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS driver_documents_admin_update ON driver_documents;
CREATE POLICY driver_documents_admin_update ON driver_documents FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS vehicles_admin_update ON vehicles;
CREATE POLICY vehicles_admin_update ON vehicles FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());
