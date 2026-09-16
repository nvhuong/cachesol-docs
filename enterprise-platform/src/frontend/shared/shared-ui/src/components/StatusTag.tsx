import { Tag } from 'antd';

interface StatusTagProps {
  status: string;
  colorMap?: Record<string, string>;
  labelMap?: Record<string, string>;
  defaultColor?: string;
}

export const StatusTag = ({
  status,
  colorMap = {},
  labelMap = {},
  defaultColor = 'default',
}: StatusTagProps) => {
  const color = colorMap[status] ?? defaultColor;
  const label = labelMap[status] ?? status;

  return <Tag color={color}>{label}</Tag>;
};
