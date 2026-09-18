/**
 * Avatar — user avatar with size + shape variants.
 * Source: /design-system/tokens/spacing.md (avatar sizes)
 */
import { forwardRef } from 'react';
import { Avatar as AntAvatar } from 'antd';
import type { AvatarProps as AntAvatarProps } from 'antd';
import { avatarSize } from '../tokens/spacing';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends Omit<AntAvatarProps, 'size'> {
  size?: AvatarSize | number;
  shape?: 'circle' | 'square';
  /** Initials shown when no image. */
  name?: string;
}

function resolveSize(size: AvatarSize | number | undefined): number {
  if (typeof size === 'number') return size;
  if (!size) return avatarSize.md;
  return avatarSize[size];
}

function initialsFromName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export const Avatar = forwardRef<HTMLElement, AvatarProps>(function Avatar(
  { size = 'md', shape = 'circle', name, src, alt, children, ...rest },
  _ref,
) {
  const resolvedSize = resolveSize(size);
  return (
    <AntAvatar
      size={resolvedSize}
      shape={shape}
      src={src}
      alt={alt ?? name ?? 'Avatar'}
      {...rest}
    >
      {!src && (children ?? (name ? initialsFromName(name) : '?'))}
    </AntAvatar>
  );
});

export default Avatar;
