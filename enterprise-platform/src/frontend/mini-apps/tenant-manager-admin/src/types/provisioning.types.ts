/**
 * Provisioning + audit.
 */
export type ProvisioningState =
  | 'requested'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'rolled-back';

export interface ProvisioningJob {
  id: string;
  tenantId: string;
  miniAppId: string;
  state: ProvisioningState;
  startedAt: string;
  finishedAt?: string;
  /** Dùng cho retry. */
  attempts: number;
  errorMessage?: string;
  progress?: number; // 0..100
}

export interface AuditEntry {
  id: string;
  actor: { id: string; email: string; name?: string };
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  ip: string;
  timestamp: string;
}
