/**
 * Tabs — page / local tabs.
 * Source: /design-system/components/tabs.md
 */
import { forwardRef, type ReactNode, type ComponentProps } from 'react';
import { Tabs as AntTabs } from 'antd';

export type TabsVariant = 'line' | 'pill' | 'card';

export interface TabsItem {
  key: string;
  label: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  content?: ReactNode;
}

type AntTabsLike = Omit<
  ComponentProps<typeof AntTabs>,
  'type' | 'tabPosition' | 'items' | 'size'
>;

export interface TabsProps extends AntTabsLike {
  variant?: TabsVariant;
  size?: 'sm' | 'md' | 'lg';
  items?: TabsItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
}

function resolveType(variant: TabsVariant): ComponentProps<typeof AntTabs>['type'] {
  if (variant === 'card') return 'card';
  return 'line';
}

export const Tabs = forwardRef<HTMLElement, TabsProps>(function Tabs(
  { variant = 'line', size = 'md', items = [], className, ...rest },
  _ref,
) {
  const antItems = items.map((it) => ({
    key: it.key,
    label: it.icon ? (
      <span className="cs-tab-label">
        {it.icon}
        <span>{it.label}</span>
        {it.badge && <span className="cs-tab-badge">{it.badge}</span>}
      </span>
    ) : it.badge ? (
      <span className="cs-tab-label">
        <span>{it.label}</span>
        <span className="cs-tab-badge">{it.badge}</span>
      </span>
    ) : (
      it.label
    ),
    disabled: it.disabled,
    children: it.content,
  }));

  const antSize = size === 'md' ? 'middle' : size === 'sm' ? 'small' : 'large';

  return (
    <AntTabs
      type={resolveType(variant)}
      size={antSize}
      items={antItems}
      className={['cs-tabs', `cs-tabs--${variant}`, className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
});

export default Tabs;
