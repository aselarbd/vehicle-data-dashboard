import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.URL.createObjectURL for file download tests
global.URL.createObjectURL = vi.fn(() => 'mocked-url');
global.URL.revokeObjectURL = vi.fn();

// Mock window.location for navigation tests
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    reload: vi.fn(),
  },
  writable: true,
});