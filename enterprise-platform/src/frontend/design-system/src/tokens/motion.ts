/**
 * Motion tokens.
 * Source of truth: /design-system/README.md (Interaction & Motion)
 */
export const motionDuration = {
  instant: 0,
  fast:    100,
  default: 150,
  slow:    200,
} as const;

export const motionEasing = {
  standard:   'cubic-bezier(0.4, 0, 0.2, 1)',
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

export type MotionDurationToken = keyof typeof motionDuration;
export type MotionEasingToken = keyof typeof motionEasing;
