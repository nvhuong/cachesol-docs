/**
 * Tree — hierarchical data display.
 * Source: /design-system/components/tree.md
 */
import { forwardRef, type ReactNode } from 'react';
import { Tree as AntTree } from 'antd';
import type { TreeProps as AntTreeProps } from 'antd';

export interface TreeNodeData {
  key: string;
  title: ReactNode;
  icon?: ReactNode;
  children?: TreeNodeData[];
  disabled?: boolean;
  /** Mark as leaf to skip the expand affordance. */
  isLeaf?: boolean;
}

export type TreeVariant = 'basic' | 'checkable' | 'draggable' | 'async';

export interface TreeProps extends Omit<AntTreeProps, 'treeData' | 'checkable' | 'draggable'> {
  variant?: TreeVariant;
  data: TreeNodeData[];
  showLine?: boolean;
  showIcon?: boolean;
}

function resolveTreeData(nodes: TreeNodeData[]): AntTreeProps['treeData'] {
  return nodes.map((n) => ({
    key: n.key,
    title: n.title,
    icon: n.icon,
    disabled: n.disabled,
    isLeaf: n.isLeaf,
    children: n.children ? resolveTreeData(n.children) : undefined,
  }));
}

export const Tree = forwardRef<HTMLElement, TreeProps>(function Tree(
  { variant = 'basic', data, className, ...rest },
  _ref,
) {
  const isCheckable = variant === 'checkable';
  const isDraggable = variant === 'draggable';

  return (
    <AntTree
      treeData={resolveTreeData(data)}
      checkable={isCheckable}
      draggable={isDraggable}
      className={['cs-tree', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
});

export default Tree;
