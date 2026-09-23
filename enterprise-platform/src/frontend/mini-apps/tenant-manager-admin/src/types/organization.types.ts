/**
 * Organization entities — departments, positions, locations.
 */
export type OrganizationType = 'company' | 'department' | 'team' | 'location';

export interface Organization {
  id: string;
  type: OrganizationType;
  name: string;
  code: string;
  parentId?: string;
  description?: string;
  managerId?: string;
  /** For type='location'. */
  address?: string;
  employeeCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
