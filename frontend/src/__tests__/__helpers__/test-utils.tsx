import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { renderHook, type RenderHookOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Custom render function for components (can be extended later with providers)
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

// Custom renderHook function for hooks
const customRenderHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props>
) => renderHook(render, options);

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, customRenderHook as renderHook };

// Common test utilities
export const createMockEvent = (value: string) => ({
  target: { value },
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
});

export const waitForLoadingToFinish = () => new Promise(resolve => setTimeout(resolve, 0));
