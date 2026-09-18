/**
 * KPI — Key Performance Indicator card.
 * Source: /design-system/patterns/data-display.md (KPI)
 */
import { type ReactNode } from 'react';

export type TrendDirection = 'up' | 'down' | 'flat';

export interface KPIProps {
  label: ReactNode;
  value: ReactNode;
  /** Comparison value (e.g. "+12.4%"). */
  trend?: ReactNode;
  /** Trend direction (controls color). */
  trendDirection?: TrendDirection;
  /** Whether an upward trend is good (e.g. revenue ↑ = good). */
  trendUpIsPositive?: boolean;
  /** Helper text shown below (e.g. "vs last month"). */
  comparison?: ReactNode;
  /** Optional action in top-right. */
  action?: ReactNode;
}

function resolveTrendColor(dir: TrendDirection, upIsPositive: boolean): string {
  if (dir === 'flat') return 'cs-kpi__trend--neutral';
  const isUp = dir === 'up';
  const isPositive = isUp === upIsPositive;
  return isPositive ? 'cs-kpi__trend--positive' : 'cs-kpi__trend--negative';
}

const ARROW: Record<TrendDirection, string> = {
  up: '↑',
  down: '↓',
  flat: '→',
};

export function KPI({
  label,
  value,
  trend,
  trendDirection,
  trendUpIsPositive = true,
  comparison,
  action,
}: KPIProps) {
  return (
    <div className="cs-kpi">
      <div className="cs-kpi__head">
        <div className="cs-kpi__label">{label}</div>
        {action && <div className="cs-kpi__action">{action}</div>}
      </div>
      <div className="cs-kpi__value cs-tabular">{value}</div>
      {(trend || comparison) && (
        <div className="cs-kpi__footer">
          {trend && trendDirection && (
            <span
              className={`cs-kpi__trend ${resolveTrendColor(trendDirection, trendUpIsPositive)}`}
            >
              <span aria-hidden="true">{ARROW[trendDirection]}</span> {trend}
            </span>
          )}
          {comparison && <span className="cs-kpi__comparison">{comparison}</span>}
        </div>
      )}
    </div>
  );
}

export default KPI;
