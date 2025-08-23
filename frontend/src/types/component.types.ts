// Component prop types
import type { ReactNode } from 'react';
import type { VehicleDataPoint, SortDirection, SortableColumn } from './vehicle.types';

// Form component types
export interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

// Button component types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

// Table component types
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  formatter?: (value: any) => string;
  className?: string;
}

export interface SortConfig {
  column: SortableColumn | null;
  direction: SortDirection;
}

// Vehicle-specific component props
export interface VehicleDropdownProps {
  vehicleIds: string[];
  selectedVehicleId: string;
  onSelectVehicle: (vehicleId: string) => void;
  loading?: boolean;
  error?: string;
}

export interface DatePickerProps extends FormFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export interface ResultsPanelProps {
  data: VehicleDataPoint[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export interface VehicleActionsProps {
  onDataPopulated?: () => void;
  vehicleIds?: string[];
}
