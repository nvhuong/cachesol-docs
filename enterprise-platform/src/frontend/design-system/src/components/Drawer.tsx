/**
 * Drawer — side panel for inline detail / quick forms.
 * Source: /design-system/components/drawer.md
 */
import { forwardRef, type ReactNode, type ComponentProps } from 'react';
import { Drawer as AntDrawer } from 'antd';

export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl';
export type DrawerSide = 'right' | 'left' | 'top' | 'bottom';

type AntDrawerLike = Omit<
  ComponentProps<typeof AntDrawer>,
  'width' | 'height' | 'placement' | 'size'
>;

export interface DrawerProps extends AntDrawerLike {
  side?: DrawerSide;
  size?: DrawerSize;
  persistent?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

const WIDTHS: Record<DrawerSize, number> = {
  sm: 360,
  md: 480,
  lg: 640,
  xl: 800,
};

export const Drawer = forwardRef<HTMLElement, DrawerProps>(function Drawer(
  {
    side = 'right',
    size = 'md',
    persistent,
    title,
    description,
    children,
    open,
    onClose,
    ...rest
  },
  _ref,
) {
  const isHorizontal = side === 'left' || side === 'right';
  return (
    <AntDrawer
      open={open}
      title={title}
      placement={side}
      width={isHorizontal ? WIDTHS[size] : undefined}
      height={!isHorizontal ? WIDTHS[size] : undefined}
      onClose={(e) => {
        if (persistent) return;
        onClose?.(e);
      }}
      maskClosable={!persistent}
      keyboard={!persistent}
      {...rest}
    >
      {description && <p className="cs-drawer__description">{description}</p>}
      {children}
    </AntDrawer>
  );
});

export default Drawer;
