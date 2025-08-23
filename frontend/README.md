# Volteras Frontend Application

A modern React-based frontend application for vehicle data management and visualization, built with TypeScript, Vite, and a robust API architecture.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (required for Vite 7+)
- npm or yarn
- Docker (for containerized deployment)

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Docker Deployment
```bash
# Build and run with docker-compose (from root directory)
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: CSS Modules with modern CSS features
- **HTTP Client**: Axios with custom API layer
- **Testing**: Vitest with Testing Library
- **Containerization**: Docker with Nginx (multi-stage build)

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── DatePicker.tsx
│   ├── LoadingSpinner.tsx
│   ├── ResultsPanel.tsx
│   ├── SearchFilters.tsx
│   ├── VehicleActions.tsx
│   └── VehicleDropdown.tsx
├── hooks/              # Custom React hooks
│   ├── useFormState.ts
│   ├── useVehicleData.ts
│   └── useVehicleIds.ts
├── services/           # API and external services
│   ├── api/
│   │   ├── client.ts         # HTTP client with interceptors
│   │   ├── error-handler.ts  # Centralized error handling
│   │   ├── vehicle.service.ts # Vehicle API service layer
│   │   └── index.ts
│   ├── api.ts          # Legacy API wrapper
│   └── index.ts
├── types/              # TypeScript type definitions
│   ├── api.types.ts
│   ├── component.types.ts
│   ├── vehicle.types.ts
│   └── index.ts
├── constants/          # Application constants
│   ├── api.constants.ts
│   ├── app.constants.ts
│   ├── ui.constants.ts
│   └── index.ts
├── utils/              # Utility functions
│   ├── data-formatters.ts
│   ├── data-processing.ts
│   ├── type-guards.ts
│   └── index.ts
└── __tests__/          # Test files
    ├── components/
    ├── hooks/
    ├── services/
    └── __helpers__/
```

## 🔧 API Architecture

### Modern API Layer
The application features a robust, layered API architecture:

```
Components → Custom Hooks → API Service → HTTP Client → Backend
                                ↓
                        Error Handler & Logging
```

#### Key Features:
- **Separation of Concerns**: Business logic separated from UI components
- **Centralized Error Handling**: Consistent error messaging and logging
- **Type Safety**: Full TypeScript support throughout the API layer
- **Request/Response Interceptors**: Automatic logging and error handling
- **Backward Compatibility**: Legacy API wrapper for gradual migration

### API Service Layer
```typescript
// Vehicle data with filtering and pagination
await vehicleApiService.getVehicleData({
  vehicle_id: 'abc123',
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  page: 1,
  limit: 10
});

// Export data in various formats
await vehicleApiService.exportData('vehicle_id', 'CSV');

// Populate database with sample data
await vehicleApiService.populateData();
```

## 🎨 Component Architecture

### Design Principles
- **Composition over Inheritance**: Small, reusable components
- **Custom Hooks**: Business logic separated into reusable hooks
- **Type Safety**: Comprehensive TypeScript interfaces
- **Accessibility**: ARIA labels and keyboard navigation support
- **Responsive Design**: Mobile-first approach

### Key Components

#### `VehicleDropdown`
- Multi-select vehicle selection
- Search/filter functionality
- Keyboard navigation support

#### `SearchFilters`
- Date range selection with validation
- Real-time filter updates
- Form state management

#### `ResultsPanel`
- Paginated data display
- Sorting capabilities
- Export functionality
- Loading and error states

#### `VehicleActions`
- Data population controls
- Export actions
- Bulk operations

## 🔗 Custom Hooks

### `useVehicleData`
Manages vehicle data fetching, filtering, and pagination:
```typescript
const {
  data,
  loading,
  error,
  refetch,
  updateFilters,
  exportData
} = useVehicleData();
```

### `useVehicleIds`
Handles vehicle ID fetching and selection:
```typescript
const {
  vehicleIds,
  loading,
  error,
  refetchVehicleIds
} = useVehicleIds();
```

### `useFormState`
Generic form state management with validation:
```typescript
const {
  formData,
  errors,
  handleChange,
  handleSubmit,
  resetForm
} = useFormState(initialData, validationSchema);
```

## 🧪 Testing Strategy

### Testing Stack
- **Test Runner**: Vitest
- **Testing Library**: @testing-library/react
- **DOM Environment**: jsdom
- **Coverage**: Built-in Vitest coverage

### Test Categories
```bash
# Unit tests for components
npm run test -- components/

# Integration tests for hooks
npm run test -- hooks/

# API service tests
npm run test -- services/

# Run with coverage
npm run test:coverage

# Interactive UI
npm run test:ui
```

### Test Structure
- **Component Tests**: Render, user interactions, accessibility
- **Hook Tests**: State management, API calls, error handling
- **Service Tests**: API requests, error scenarios, data transformation
- **Integration Tests**: End-to-end user flows

## 🐳 Docker Configuration

### Multi-Stage Build
The application uses a multi-stage Docker build for optimal production deployment:

1. **Build Stage**: Node.js 20 Alpine for building the React application
2. **Production Stage**: Nginx Alpine for serving static files

### Nginx Configuration
- **SPA Routing**: Proper handling of client-side routing
- **Static Asset Caching**: Long-term caching for JS/CSS/images
- **Security Headers**: XSS protection, content type sniffing protection
- **Gzip Compression**: Reduced payload sizes
- **No-cache for HTML**: Ensures updates are served immediately

### Docker Compose Integration
The frontend integrates seamlessly with the backend and database services:
```yaml
services:
  volteras-frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - volteras_backend
    networks:
      - volteras-network
```

## 📊 Performance Optimizations

### Build Optimizations
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and bundle size optimization
- **Production Builds**: Minification and optimization for production

### Runtime Optimizations
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Preventing unnecessary re-renders
- **Efficient State Updates**: Optimized React state management
- **Debounced Search**: Reduced API calls during user input

## 🔧 Configuration

### Environment Variables
The application supports environment-based configuration:
```typescript
// Development
API_BASE_URL=http://localhost:8000

// Production (Docker)
API_BASE_URL=http://volteras_backend:8000
```

### Build Configuration
- **Vite Config**: Modern build tooling with HMR
- **TypeScript Config**: Strict type checking with project references
- **ESLint Config**: Code quality and consistency rules

## 🚀 Deployment

### Production Deployment
```bash
# Build the application
npm run build

# Preview production build locally
npm run preview

# Deploy with Docker
docker-compose up -d
```

### Environment Setup
1. **Development**: `npm run dev` - Full development server with HMR
2. **Preview**: `npm run preview` - Preview production build locally
3. **Production**: Docker container with Nginx serving optimized assets

## 📈 Monitoring & Debugging

### Development Tools
- **Vite DevTools**: Fast HMR and development server
- **React DevTools**: Component inspection and debugging
- **Network Logging**: API request/response logging via interceptors
- **TypeScript Diagnostics**: Compile-time error checking

### Error Handling
- **Centralized Error Handling**: Consistent error messages and logging
- **User-Friendly Messages**: Proper error states and user feedback
- **Error Boundaries**: React error boundaries for graceful fallbacks
- **API Error Recovery**: Retry mechanisms and fallback strategies

## 🔄 Migration & Compatibility

### API Migration Strategy
The application maintains backward compatibility during API refactoring:
- **Legacy Wrapper**: Existing components continue to work
- **Gradual Migration**: Components updated incrementally
- **Type Safety**: Full TypeScript support throughout migration

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **ES2022 Target**: Modern JavaScript features
- **Progressive Enhancement**: Graceful degradation for older browsers

## 📚 Development Guidelines

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Consistent code formatting and quality
- **Component Patterns**: Functional components with hooks
- **File Organization**: Feature-based organization

### Best Practices
- **Type Safety**: Comprehensive TypeScript interfaces
- **Error Handling**: Proper error boundaries and user feedback
- **Testing**: Comprehensive test coverage for critical paths
- **Performance**: Optimized renders and efficient state management
- **Accessibility**: ARIA labels and keyboard navigation
- **Security**: XSS protection and secure headers

## 🤝 Contributing

### Development Workflow
1. **Setup**: Clone and install dependencies
2. **Development**: Create feature branches
3. **Testing**: Write tests for new features
4. **Building**: Ensure production builds work
5. **Docker**: Test containerized deployment

### Code Quality
- All code must pass TypeScript compilation
- Tests must pass before merging
- ESLint rules must be followed
- Docker builds must succeed

---

## 📝 API Integration

The frontend communicates with the Volteras backend API for:
- **Vehicle Data Management**: CRUD operations for vehicle information
- **Data Filtering**: Advanced filtering and pagination
- **Data Export**: Multiple export formats (CSV, JSON, Excel)
- **Database Population**: Sample data generation for testing

For backend API documentation, see the [Backend README](../backend/README.md).

---

*Built with ❤️ using React, TypeScript, and modern web technologies.*
