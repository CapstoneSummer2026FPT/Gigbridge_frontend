/**
 * Dispute Model - DISPUTES table
 */

export interface Dispute {
  id: string;
  contract_id: string;
  raised_by: string;
  status: string;
  reason: string;
}
