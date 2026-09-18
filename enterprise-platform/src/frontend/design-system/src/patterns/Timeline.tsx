/**
 * Timeline — sequential activity log.
 * Source: /design-system/patterns/data-display.md (Timeline)
 */
import { type ReactNode } from 'react';
import { StatusBadge, type Status } from './StatusBadge';

export interface TimelineItem {
  key?: string;
  timestamp?: ReactNode;
  actor?: ReactNode;
  action?: ReactNode;
  subject?: ReactNode;
  status?: Status;
  description?: ReactNode;
  /** Extra content (collapsible body). */
  details?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  groupBy?: (item: TimelineItem) => string;
  empty?: ReactNode;
}

const DEFAULT_EMPTY = 'No activity yet.';

export function Timeline({ items, groupBy, empty = DEFAULT_EMPTY }: TimelineProps) {
  if (items.length === 0) {
    return <div className="cs-timeline cs-timeline--empty">{empty}</div>;
  }

  const groups = groupBy
    ? groupByItems(items, groupBy)
    : [{ key: '', items }];

  return (
    <ol className="cs-timeline">
      {groups.map((group) => (
        <li key={group.key} className="cs-timeline__group">
          {group.key && <h4 className="cs-timeline__group-label">{group.key}</h4>}
          <ul className="cs-timeline__items">
            {group.items.map((it, idx) => (
              <li key={it.key ?? idx} className="cs-timeline__item">
                <div className="cs-timeline__dot" aria-hidden="true" />
                <div className="cs-timeline__content">
                  <div className="cs-timeline__head">
                    <span className="cs-timeline__time cs-tabular">{it.timestamp}</span>
                    {it.actor && <span className="cs-timeline__actor">{it.actor}</span>}
                    <span className="cs-timeline__action">{it.action}</span>
                    {it.subject && <span className="cs-timeline__subject">{it.subject}</span>}
                    {it.status && <StatusBadge status={it.status} />}
                  </div>
                  {it.description && (
                    <div className="cs-timeline__description">{it.description}</div>
                  )}
                  {it.details && <div className="cs-timeline__details">{it.details}</div>}
                </div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

function groupByItems(items: TimelineItem[], groupBy: (item: TimelineItem) => string) {
  const map = new Map<string, TimelineItem[]>();
  for (const item of items) {
    const key = groupBy(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return Array.from(map.entries()).map(([key, list]) => ({ key, items: list }));
}

export default Timeline;
