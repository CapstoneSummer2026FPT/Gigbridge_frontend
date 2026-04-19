/**
 * Message & Review Models - MESSAGES & REVIEWS tables
 */

export interface Message {
  id: string;
  contract_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
}

export interface Review {
  id: string;
  contract_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number; // 1-5
  comment: string;
}
