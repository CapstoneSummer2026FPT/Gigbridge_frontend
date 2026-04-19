/**
 * Audit Log Model - AUDIT_LOGS table
 */

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  created_at: string;
}
