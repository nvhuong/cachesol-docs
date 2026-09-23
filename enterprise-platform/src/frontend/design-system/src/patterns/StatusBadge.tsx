/**
 * StatusBadge — semantic status indicator with dot.
 * Source: /design-system/patterns/data-display.md (Status Badge)
 *
 * Same status → same color everywhere. Pair color with dot, never color alone.
 */
import { type ReactNode } from 'react';
import { Tag } from '../components/Tag';

export type Status =
  | 'draft'
  | 'pending'
  | 'in-review'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'inactive'
  | 'cancelled'
  | 'expired'
  | 'failed'
  | 'suspended'
  | 'processing'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'provisioning'
  | 'deleted';

interface StatusConfig {
  label: string;
  variant: 'default' | 'success' | 'warning' | 'error' | 'info' | 'processing';
}

const STATUS_MAP: Record<Status, StatusConfig> = {
  draft:       { label: 'Draft',       variant: 'default' },
  pending:     { label: 'Pending',     variant: 'warning' },
  'in-review': { label: 'In review',   variant: 'info' },
  approved:    { label: 'Approved',    variant: 'success' },
  rejected:    { label: 'Rejected',    variant: 'error' },
  active:      { label: 'Active',      variant: 'success' },
  inactive:    { label: 'Inactive',    variant: 'default' },
  cancelled:   { label: 'Cancelled',   variant: 'default' },
  expired:     { label: 'Expired',     variant: 'warning' },
  failed:      { label: 'Failed',      variant: 'error' },
  suspended:   { label: 'Suspended',   variant: 'error' },
  processing:  { label: 'Processing',  variant: 'processing' },
  success:     { label: 'Success',     variant: 'success' },
  error:       { label: 'Error',       variant: 'error' },
  warning:     { label: 'Warning',     variant: 'warning' },
  info:        { label: 'Info',        variant: 'info' },
  provisioning: { label: 'Provisioning', variant: 'processing' },
  deleted:     { label: 'Deleted',     variant: 'default' },
};

export interface StatusBadgeProps {
  status: Status;
  /** Override the label (otherwise looks up the canonical label). */
  label?: ReactNode;
  /** Show a dot indicator. Default true. */
  dot?: boolean;
}

export function StatusBadge({ status, label, dot = true }: StatusBadgeProps) {
  const cfg = STATUS_MAP[status];
  return (
    <Tag variant={cfg.variant} dot={dot}>
      {label ?? cfg.label}
    </Tag>
  );
}

export default StatusBadge;
