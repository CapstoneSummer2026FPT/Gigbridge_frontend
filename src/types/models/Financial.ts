/**
 * Financial Models - WALLETS, SUBSCRIPTIONS, TRANSACTIONS tables
 */

export interface Wallet {
  wal_WalletsId: string;
  usr_UserId: string;
  Balance: number;
  Currency: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export enum SubscriptionType {
  Free = 'Free',
  Pro = 'Pro',
}

export enum SubscriptionDuration {
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export enum SubscriptionStatus {
  Active = 'active',
  Expired = 'expired',
  Cancelled = 'cancelled',
  Pending = 'pending',
}

export interface Subscription {
  SubscriptionId: string;
  Type: SubscriptionType;
  Amount: number;
  Duration: SubscriptionDuration;
  Status: SubscriptionStatus;
  Description: string;
  CreatedAt: string;
  CompletedAt?: string;
}

export enum TransactionType {
  Deposit = 'deposit',
  Withdrawal = 'withdrawal',
  Subscription = 'subscription',
  Refund = 'refund',
}

export enum TransactionStatus {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
  Cancelled = 'cancelled',
}

export interface Transaction {
  trans_TransactionsId: string;
  wal_WalletsId: string;
  SubscriptionId?: string;
  Type: TransactionType;
  Amount: number;
  Currency: string;
  Status: TransactionStatus;
  Description: string;
  CreatedAt: string;
  CompletedAt?: string;
}
