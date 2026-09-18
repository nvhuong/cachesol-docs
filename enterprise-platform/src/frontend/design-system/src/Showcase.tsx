/**
 * Example showcase — internal demo of every component.
 *
 * Mini apps and the web shell should NOT import this. It's here to:
 *  1. Document usage patterns.
 *  2. Allow visual verification of token bindings.
 *  3. Give frontend devs a copy-paste reference.
 *
 * Run:  npm run dev --workspace=@cachesol/design-system
 */
import { useState } from 'react';
import { ConfigProvider, Space, Divider } from 'antd';
import { cachesolTheme, Button, Input, Select, Tag, Avatar, Alert } from './index';
import {
  PageHeader,
  EmptyState,
  StatusBadge,
  KPI,
  DataCard,
  LoadingState,
  ErrorState,
  Toolbar,
  FormSection,
  DetailField,
  Timeline,
} from './patterns';
import { ListPage, DetailPage, FormPage, DashboardPage } from './templates';
import { useBreakpoint, useDensity } from './hooks';
import type { TimelineItem } from './patterns';

const SAMPLE_TIMELINE: TimelineItem[] = [
  { key: '1', timestamp: '14:30', actor: 'John Smith', action: 'approved', subject: 'invoice #1234', status: 'approved' },
  { key: '2', timestamp: '11:15', actor: 'Sarah Lee', action: 'requested approval for', subject: '$12,340', status: 'pending' },
  { key: '3', timestamp: '09:00', actor: 'System',    action: 'created',         subject: 'invoice #1234', status: 'success' },
];

export function Showcase() {
  const bp = useBreakpoint();
  const { density, setDensity } = useDensity();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <ConfigProvider theme={cachesolTheme}>
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Header */}
        <PageHeader
          title="@cachesol/design-system Showcase"
          description={`Current breakpoint: ${bp} · Density: ${density}`}
          actions={
            <Space>
              <Button variant="tertiary" size="sm" onClick={() => setDensity('comfortable')}>Comfortable</Button>
              <Button variant="tertiary" size="sm" onClick={() => setDensity('default')}>Default</Button>
              <Button variant="tertiary" size="sm" onClick={() => setDensity('compact')}>Compact</Button>
            </Space>
          }
        />

        {/* Buttons */}
        <DataCard title="Buttons" description="Six variants · three sizes · loading state">
          <Space wrap>
            <Button variant="primary">Save changes</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="tertiary">Learn more</Button>
            <Button variant="ghost">⋯</Button>
            <Button variant="destructive">Delete</Button>
            <Button variant="link">View details</Button>
          </Space>
          <Divider />
          <Space wrap>
            <Button size="sm" variant="primary">Small</Button>
            <Button size="md" variant="primary">Medium</Button>
            <Button size="lg" variant="primary">Large</Button>
            <Button variant="primary" loading>Saving…</Button>
          </Space>
        </DataCard>

        {/* Inputs */}
        <DataCard title="Inputs" description="Label · helper · error">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Email" placeholder="you@company.com" />
            <Input label="Phone" placeholder="+84 90 123 4567" required helperText="Include country code" />
            <Input label="Password" type="password" placeholder="••••••••" error errorMessage="Min 8 characters" />
            <Select
              label="Country"
              options={[
                { value: 'vn', label: 'Vietnam' },
                { value: 'us', label: 'United States' },
                { value: 'jp', label: 'Japan' },
              ]}
            />
          </div>
        </DataCard>

        {/* Status + Tag */}
        <DataCard title="Status & Tags" description="Same status → same color everywhere">
          <Space wrap>
            <StatusBadge status="active" />
            <StatusBadge status="pending" />
            <StatusBadge status="in-review" />
            <StatusBadge status="approved" />
            <StatusBadge status="rejected" />
            <StatusBadge status="draft" />
            <StatusBadge status="expired" />
            <StatusBadge status="failed" />
            <StatusBadge status="processing" />
          </Space>
          <Divider />
          <Space wrap>
            <Tag variant="info">Beta</Tag>
            <Tag variant="success">New</Tag>
            <Tag variant="warning">Deprecated</Tag>
            <Tag pill>42</Tag>
            <Tag pill removable>Filter ×</Tag>
            <Avatar name="John Smith" />
            <Avatar name="Jane Doe" size="lg" />
          </Space>
        </DataCard>

        {/* KPI */}
        <DataCard title="KPI row" description="2-6 KPIs · tabular numbers · trend direction">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <KPI label="Revenue"     value="$123.4K" trend="+12.4%" trendDirection="up"   comparison="vs last month" />
            <KPI label="Orders"      value="1,234"   trend="+8.2%"  trendDirection="up"   comparison="vs last month" />
            <KPI label="Churn"       value="2.1%"    trend="-0.3pp" trendDirection="down" comparison="vs last month" trendUpIsPositive={false} />
            <KPI label="NPS"         value="58"      trend="—"      trendDirection="flat" comparison="no change" />
          </div>
        </DataCard>

        {/* Empty + Error + Loading */}
        <DataCard title="Empty / Error / Loading states">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <EmptyState type="no-data" action={<Button variant="primary">Create customer</Button>} />
            <EmptyState type="no-results" />
            <ErrorState kind="server" onRetry={() => undefined} referenceId="abc-123" />
          </div>
        </DataCard>

        {/* Toolbar */}
        <DataCard title="Toolbar pattern">
          <Toolbar
            searchPlaceholder="Search customers…"
            searchValue={search}
            onSearchChange={setSearch}
            quickFilters={<Select options={[{ value: 'active', label: 'Active' }]} inputSize="md" />}
            activeFilters={[
              { key: 'status', label: 'Status: Active', onRemove: () => undefined },
              { key: 'region', label: 'Region: APAC',   onRemove: () => undefined },
            ]}
            onClearAllFilters={() => undefined}
            selectedCount={selected.length}
            bulkActions={<Button variant="destructive" size="sm">Delete selected</Button>}
            onClearSelection={() => setSelected([])}
          />
        </DataCard>

        {/* Form */}
        <DataCard title="Form section pattern">
          <FormSection
            title="Basic information"
            description="Tell us about the customer."
            columns={2}
          >
            <Input label="First name" required />
            <Input label="Last name" required />
            <Input label="Email" type="email" required />
            <Input label="Phone" placeholder="+84" />
          </FormSection>
        </DataCard>

        {/* Detail field */}
        <DataCard title="Detail field pattern">
          <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: 0 }}>
            <DetailField label="Email"     value="john@acme.com" copyable />
            <DetailField label="Phone"     value="+84 90 123 4567" />
            <DetailField label="Tax code"  value="0123456789" mono />
            <DetailField label="Status"    value={<StatusBadge status="active" />} />
          </dl>
        </DataCard>

        {/* Timeline */}
        <DataCard title="Timeline pattern">
          <Timeline items={SAMPLE_TIMELINE} />
        </DataCard>

        {/* Templates */}
        <DataCard title="Page templates">
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Alert
              variant="info"
              title="Templates live in src/templates — they're empty wrappers that compose patterns."
              description="Use ListPage, DetailPage, FormPage, DashboardPage directly in mini-apps."
            />
          </Space>
        </DataCard>
      </div>
    </ConfigProvider>
  );
}

export default Showcase;
