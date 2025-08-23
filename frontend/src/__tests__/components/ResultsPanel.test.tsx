import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../__helpers__/test-utils';
import ResultsPanel from '../../components/ResultsPanel';
import type { VehicleDataPoint } from '../../types';

// Mock LoadingSpinner component
vi.mock('../../components/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading vehicle data...</div>
}));

const mockVehicleData: VehicleDataPoint[] = [
  {
    id: 1,
    timestamp: '2023-01-01T10:00:00Z',
    speed: 25.5,
    odometer: 12345,
    soc: 85,
    elevation: 150,
    shift_state: 'D',
  },
  {
    id: 2,
    timestamp: '2023-01-01T10:01:00Z',
    speed: 30.2,
    odometer: 12346,
    soc: 84,
    elevation: 155,
    shift_state: 'D',
  },
  {
    id: 3,
    timestamp: '2023-01-01T10:02:00Z',
    speed: null,
    odometer: 12347,
    soc: 83,
    elevation: 160,
    shift_state: null,
  },
];

const defaultProps = {
  data: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  onPageChange: vi.fn(),
};

describe('ResultsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display loading spinner when loading is true', () => {
      render(<ResultsPanel {...defaultProps} loading={true} />);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.queryByText('📈 Vehicle Data Results')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when error is present', () => {
      const errorMessage = 'Failed to load data';
      render(<ResultsPanel {...defaultProps} error={errorMessage} />);

      expect(screen.getByText('⚠️ Error Loading Data')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByText('📈 Vehicle Data Results')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no data is available', () => {
      render(<ResultsPanel {...defaultProps} data={[]} />);

      expect(screen.getByText('📊 No Data Found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search criteria or select a different vehicle.')).toBeInTheDocument();
      expect(screen.queryByText('📈 Vehicle Data Results')).not.toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should display data table with correct headers', () => {
      render(<ResultsPanel 
        {...defaultProps} 
        data={mockVehicleData} 
        totalCount={3}
        currentPage={1}
      />);

      expect(screen.getByText('📈 Vehicle Data Results')).toBeInTheDocument();
      expect(screen.getByText('Showing page 1 of 1 (3 total records)')).toBeInTheDocument();

      // Check table headers
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Timestamp')).toBeInTheDocument();
      expect(screen.getByText('Speed (mph)')).toBeInTheDocument();
      expect(screen.getByText('Odometer')).toBeInTheDocument();
      expect(screen.getByText('SOC (%)')).toBeInTheDocument();
      expect(screen.getByText('Elevation (ft)')).toBeInTheDocument();
      expect(screen.getByText('Shift State')).toBeInTheDocument();
    });

    it('should format timestamps correctly', () => {
      render(<ResultsPanel 
        {...defaultProps} 
        data={mockVehicleData} 
        totalCount={3}
        currentPage={1}
      />);

      // Should format ISO timestamp to locale string
      const timestampRegex = /1\/1\/2023|2023/; // Flexible timestamp format
      const timestampElements = screen.getAllByText(timestampRegex);
      expect(timestampElements.length).toBeGreaterThan(0);
    });
  });

  describe('Sorting Functionality', () => {
    it('should display sort icons on all headers', () => {
      render(<ResultsPanel 
        {...defaultProps} 
        data={mockVehicleData} 
        totalCount={3}
        currentPage={1}
      />);

      // All headers should have sort icons (▲▼)
      const sortIcons = screen.getAllByText(/▲|▼/);
      expect(sortIcons.length).toBeGreaterThan(0);
    });

    it('should handle header clicks for sorting', () => {
      render(<ResultsPanel 
        {...defaultProps} 
        data={mockVehicleData} 
        totalCount={3}
        currentPage={1}
      />);

      // Click on ID header to sort
      const idHeader = screen.getByRole('button', { name: /ID/ });
      fireEvent.click(idHeader);

      // Should show active sort indicator
      const activeSort = document.querySelector('.sort-icons.active');
      expect(activeSort).toBeInTheDocument();
    });

    it('should handle keyboard navigation on sortable headers', () => {
      render(<ResultsPanel 
        {...defaultProps} 
        data={mockVehicleData} 
        totalCount={3}
        currentPage={1}
      />);

      const speedHeader = screen.getByRole('button', { name: /Speed/ });
      fireEvent.keyDown(speedHeader, { key: 'Enter' });

      // Should activate sorting (same as click)
      const activeSort = document.querySelector('.sort-icons.active');
      expect(activeSort).toBeInTheDocument();
    });

    it('should cycle through sort states: asc -> desc -> none', () => {
      render(<ResultsPanel 
        {...defaultProps} 
        data={mockVehicleData} 
        totalCount={3}
        currentPage={1}
      />);

      const odometerHeader = screen.getByRole('button', { name: /Odometer/ });
      
      // First click: ascending
      fireEvent.click(odometerHeader);
      let activeSort = document.querySelector('.sort-icons.active');
      expect(activeSort).toBeInTheDocument();

      // Second click: descending  
      fireEvent.click(odometerHeader);
      activeSort = document.querySelector('.sort-icons.active');
      expect(activeSort).toBeInTheDocument();

      // Third click: remove sorting
      fireEvent.click(odometerHeader);
      activeSort = document.querySelector('.sort-icons.active');
      expect(activeSort).toBeNull();
    });
  });

  describe('Pagination', () => {
    const paginationProps = {
      ...defaultProps,
      data: mockVehicleData,
      totalCount: 25,
      currentPage: 2,
    };

    it('should handle previous page click', () => {
      const mockOnPageChange = vi.fn();
      render(<ResultsPanel 
        {...paginationProps} 
        onPageChange={mockOnPageChange}
      />);

      const prevButton = screen.getByText('‹ Previous');
      fireEvent.click(prevButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(1); // currentPage - 1
    });

    it('should handle next page click', () => {
      const mockOnPageChange = vi.fn();
      render(<ResultsPanel 
        {...paginationProps} 
        onPageChange={mockOnPageChange}
      />);

      const nextButton = screen.getByText('Next ›');
      fireEvent.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(3); // currentPage + 1
    });

    it('should handle direct page number click', () => {
      const mockOnPageChange = vi.fn();
      render(<ResultsPanel 
        {...paginationProps} 
        onPageChange={mockOnPageChange}
      />);

      const pageButton = screen.getByRole('button', { name: '1' });
      fireEvent.click(pageButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });

    it('should disable previous button on first page', () => {
      render(<ResultsPanel 
        {...paginationProps} 
        currentPage={1}
      />);

      const prevButton = screen.getByText('‹ Previous');
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button on last page', () => {
      render(<ResultsPanel 
        {...paginationProps} 
        currentPage={3} // Last page (25 items / 10 per page = 3 pages)
      />);

      const nextButton = screen.getByText('Next ›');
      expect(nextButton).toBeDisabled();
    });

    it('should not display pagination for small datasets', () => {
      render(<ResultsPanel 
        {...defaultProps}
        data={mockVehicleData}
        totalCount={3}
        currentPage={1}
      />);

      expect(screen.queryByText('‹ Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next ›')).not.toBeInTheDocument();
    });
  });

  describe('Data Formatting', () => {
    it('should format numeric values with commas', () => {
      const dataWithLargeNumbers = [{
        ...mockVehicleData[0],
        odometer: 123456789,
      }];

      render(<ResultsPanel 
        {...defaultProps} 
        data={dataWithLargeNumbers} 
        totalCount={1}
      />);

      expect(screen.getByText('123,456,789')).toBeInTheDocument();
    });

    it('should display N/A for null values', () => {
      render(<ResultsPanel 
        {...defaultProps} 
        data={mockVehicleData} 
        totalCount={3}
      />);

      const naElements = screen.getAllByText('N/A');
      expect(naElements.length).toBeGreaterThan(0);
    });

    it('should handle timestamp formatting edge cases', () => {
      const dataWithBadTimestamp = [{
        ...mockVehicleData[0],
        timestamp: 'invalid-timestamp',
      }];

      render(<ResultsPanel 
        {...defaultProps} 
        data={dataWithBadTimestamp} 
        totalCount={1}
      />);

      expect(screen.getByText('invalid-timestamp')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<ResultsPanel 
        {...defaultProps} 
        data={mockVehicleData} 
        totalCount={3}
        currentPage={1}
      />);

      // Headers should be buttons with proper roles
      const sortableHeaders = screen.getAllByRole('button');
      expect(sortableHeaders.length).toBeGreaterThan(0);

      // Each header should have tabIndex
      sortableHeaders.forEach(header => {
        expect(header).toHaveAttribute('tabIndex', '0');
      });
    });

    it('should support keyboard navigation', () => {
      render(<ResultsPanel 
        {...defaultProps} 
        data={mockVehicleData} 
        totalCount={3}
        currentPage={1}
      />);

      const firstHeader = screen.getByRole('button', { name: /ID/ });
      firstHeader.focus();
      expect(document.activeElement).toBe(firstHeader);
    });
  });
});
