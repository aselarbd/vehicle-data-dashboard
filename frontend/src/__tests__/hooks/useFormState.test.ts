import { describe, it, expect } from 'vitest';
import { act } from '@testing-library/react';
import { renderHook } from '../__helpers__/test-utils';
import { useFormState } from '../../hooks/useFormState';

describe('useFormState', () => {
  it('should initialize with empty values', () => {
    const { result } = renderHook(() => useFormState());

    expect(result.current.selectedVehicleId).toBe('');
    expect(result.current.startDateTime).toBe('');
    expect(result.current.endDateTime).toBe('');
  });

  it('should update selectedVehicleId when setSelectedVehicleId is called', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.setSelectedVehicleId('test-vehicle-123');
    });

    expect(result.current.selectedVehicleId).toBe('test-vehicle-123');
    // Other values should remain unchanged
    expect(result.current.startDateTime).toBe('');
    expect(result.current.endDateTime).toBe('');
  });

  it('should update startDateTime when setStartDateTime is called', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.setStartDateTime('2023-01-01T10:00');
    });

    expect(result.current.startDateTime).toBe('2023-01-01T10:00');
    // Other values should remain unchanged
    expect(result.current.selectedVehicleId).toBe('');
    expect(result.current.endDateTime).toBe('');
  });

  it('should update endDateTime when setEndDateTime is called', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.setEndDateTime('2023-01-01T18:00');
    });

    expect(result.current.endDateTime).toBe('2023-01-01T18:00');
    // Other values should remain unchanged
    expect(result.current.selectedVehicleId).toBe('');
    expect(result.current.startDateTime).toBe('');
  });

  it('should allow updating multiple values independently', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.setSelectedVehicleId('vehicle-456');
      result.current.setStartDateTime('2023-02-01T09:00');
      result.current.setEndDateTime('2023-02-01T17:00');
    });

    expect(result.current.selectedVehicleId).toBe('vehicle-456');
    expect(result.current.startDateTime).toBe('2023-02-01T09:00');
    expect(result.current.endDateTime).toBe('2023-02-01T17:00');
  });

  it('should clear all form values when clearForm is called', () => {
    const { result } = renderHook(() => useFormState());

    // First, set some values
    act(() => {
      result.current.setSelectedVehicleId('vehicle-789');
      result.current.setStartDateTime('2023-03-01T08:00');
      result.current.setEndDateTime('2023-03-01T16:00');
    });

    // Verify values are set
    expect(result.current.selectedVehicleId).toBe('vehicle-789');
    expect(result.current.startDateTime).toBe('2023-03-01T08:00');
    expect(result.current.endDateTime).toBe('2023-03-01T16:00');

    // Clear the form
    act(() => {
      result.current.clearForm();
    });

    // Verify all values are cleared
    expect(result.current.selectedVehicleId).toBe('');
    expect(result.current.startDateTime).toBe('');
    expect(result.current.endDateTime).toBe('');
  });

  it('should handle edge cases with empty strings and special values', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.setSelectedVehicleId('');
      result.current.setStartDateTime('   '); // whitespace
      result.current.setEndDateTime('invalid-date');
    });

    expect(result.current.selectedVehicleId).toBe('');
    expect(result.current.startDateTime).toBe('   ');
    expect(result.current.endDateTime).toBe('invalid-date');
  });

  it('should maintain useState setter reference stability', () => {
    const { result, rerender } = renderHook(() => useFormState());

    const initialSetters = {
      setSelectedVehicleId: result.current.setSelectedVehicleId,
      setStartDateTime: result.current.setStartDateTime,
      setEndDateTime: result.current.setEndDateTime,
    };

    // Trigger a re-render by calling a setter
    act(() => {
      result.current.setSelectedVehicleId('test');
    });

    rerender();

    // useState setters should maintain reference stability
    expect(result.current.setSelectedVehicleId).toBe(initialSetters.setSelectedVehicleId);
    expect(result.current.setStartDateTime).toBe(initialSetters.setStartDateTime);
    expect(result.current.setEndDateTime).toBe(initialSetters.setEndDateTime);
    
    // Note: clearForm gets a new reference each render since it's not memoized
    // This is expected behavior for the current implementation
  });
});
