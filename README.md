# Vehicle Data Management System

A full-stack web application for managing and visualizing vehicle data with advanced filtering, pagination, and export capabilities. Built with modern technologies including FastAPI, React, TypeScript, and MySQL, all containerized with Docker.

## 🚀 How to Run the Application

### Prerequisites
- Docker and Docker Compose
- Git

### Quick Start
```bash
# Clone the repository
git clone https://github.com/aselarbd/Volteras-swe.git
cd Volteras-swe

# Start all services with Docker Compose
docker-compose up --build

# Wait for all services to start (database initialization may take a moment)
```

### Access the Application
Once all services are running, you can access:

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)
- **Database**: `localhost:3306` (MySQL)

### 🌐 Demo
**Demo URL**: *[https://www.loom.com/share/bf4b2bb9b1a5469db99ad9e1331114d5?sid=1e213bd1-4839-4cf7-a07c-0ed8bfd51e19]*

## 🏗️ High-Level Backend Architecture

The backend follows a clean architecture pattern with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FastAPI       │    │   Business      │    │   Data Layer    │
│   Router        │────│   Service       │────│   Repository    │
│   (HTTP Layer)  │    │   Layer         │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐             ┌────▼────┐             ┌────▼────┐
    │ Request │             │ Business│             │ SQLite/ │
    │ Routing │             │ Logic   │             │ MySQL   │
    │ Validation│           │ Data    │             │ Database│
    │ Response │            │ Transform│            │ Operations│
    └─────────┘             └─────────┘             └─────────┘
```

### Core Components:
- **FastAPI Framework**: Modern, fast web framework for building APIs
- **Pydantic Models**: Data validation and serialization
- **SQLAlchemy ORM**: Database abstraction and relationship management
- **MySQL Database**: Persistent data storage with Docker volume
- **Router-Service Pattern**: Clean separation of API routes and business logic

### Key Features:
- RESTful API endpoints for vehicle data management
- Advanced filtering and pagination
- Data export in multiple formats (CSV, JSON, Excel)
- Database seeding with sample data
- Comprehensive error handling and logging
- Docker containerization for easy deployment

### Available URLs

#### Core API Endpoints:
- `GET /api/v1/vehicle_data/` - Get paginated vehicle data with filtering
- `GET /api/v1/vehicle_data/vehicle_ids` - Get list of all vehicle IDs
- `POST /api/v1/vehicle_data/populate` - Populate database with sample data
- `GET /api/v1/vehicle_data/export` - Export vehicle data in various formats

#### Documentation & Health:
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)
- `GET /health` - Health check endpoint

#### Query Parameters:
- `vehicle_id`: Filter by specific vehicle ID
- `start_date` / `end_date`: Date range filtering
- `page` / `limit`: Pagination controls
- `export_type`: Export format (CSV, JSON, EXCEL)

## 🎨 High-Level Frontend Architecture

The frontend is built with modern React patterns and a layered architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                        │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Components    │   Custom Hooks  │    State Management     │
│   (UI Layer)    │  (Logic Layer)  │   (Data Handling)       │
├─────────────────┼─────────────────┼─────────────────────────┤
│                 │                 │                         │
│ • VehicleDropdown│ • useVehicleData│ • Form State           │
│ • SearchFilters │ • useVehicleIds │ • API Response Cache   │
│ • ResultsPanel  │ • useFormState  │ • Error States         │
│ • LoadingSpinner│                 │ • Loading States        │
└─────────────────┴─────────────────┴─────────────────────────┘
         │                 │                     │
         ▼                 ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Service Layer                        │
├─────────────────┬─────────────────┬─────────────────────────┤
│   HTTP Client   │ Error Handling  │    Type Definitions     │
│   (Axios)       │   (Centralized) │     (TypeScript)        │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### Technology Stack:
- **React 19**: Modern component-based UI framework
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool with Hot Module Replacement
- **Axios**: HTTP client for API communication
- **CSS Modules**: Scoped styling approach
- **Vitest**: Fast unit testing framework

### Architecture Patterns:
- **Component Composition**: Small, reusable UI components
- **Custom Hooks**: Business logic separated from UI
- **Service Layer**: Centralized API communication
- **Type Safety**: Comprehensive TypeScript interfaces
- **Error Boundaries**: Graceful error handling

## 🔗 Frontend-Backend Connection

The frontend and backend communicate through a well-defined REST API interface:

```
┌─────────────────┐     HTTP/JSON      ┌─────────────────┐
│   React App     │ ◄─────────────────► │   FastAPI       │
│   (Frontend)    │     over TCP       │   (Backend)     │
│   Port: 3000    │                    │   Port: 8000    │
└─────────────────┘                    └─────────────────┘
         │                                       │
         │ Docker Network                        │
         │ (volteras-network)                    │
         │                                       │
         ▼                                       ▼
┌─────────────────┐                    ┌─────────────────┐
│   Nginx         │                    │   MySQL         │
│   (Web Server)  │                    │   (Database)    │
│   Port: 80      │                    │   Port: 3306    │
└─────────────────┘                    └─────────────────┘
```

### Communication Flow:
1. **User Interaction**: User interacts with React components
2. **API Call**: Custom hooks trigger API service calls
3. **HTTP Request**: Axios sends structured HTTP requests to FastAPI
4. **Backend Processing**: FastAPI processes request, queries database
5. **Database Response**: MySQL returns data to FastAPI
6. **API Response**: FastAPI sends JSON response back to frontend
7. **State Update**: React hooks update component state
8. **UI Update**: Components re-render with new data

### Data Flow:
- **Authentication**: Future-ready authentication headers
- **Request/Response Logging**: Comprehensive API call logging
- **Error Handling**: Centralized error management across layers
- **Type Safety**: End-to-end TypeScript type checking
- **Real-time Updates**: Efficient state management for live data

## 🐳 Deployment Architecture

The application uses a containerized deployment strategy with Docker Compose:

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Host Environment                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Frontend      │  │    Backend      │  │    Database     │ │
│  │   Container     │  │   Container     │  │   Container     │ │
│  │                 │  │                 │  │                 │ │
│  │  Nginx:Alpine   │  │ Python:3.11     │  │  MySQL:8.0      │ │
│  │  Port: 80       │  │ Port: 8000      │  │  Port: 3306     │ │
│  │  (→ Host:3000)  │  │ (→ Host:8000)   │  │ (→ Host:3306)   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│           │                     │                     │        │
│           └─────────────────────┼─────────────────────┘        │
│                                 │                              │
│         ┌─────────────────────────────────────────┐            │
│         │        volteras-network                 │            │
│         │        (Bridge Network)                 │            │
│         └─────────────────────────────────────────┘            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    Persistent Storage                        │
│  ┌─────────────────┐  ┌─────────────────┐                    │
│  │  mysql_data     │  │  init-db        │                    │
│  │  (Volume)       │  │  (Bind Mount)   │                    │
│  └─────────────────┘  └─────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

### Container Details:

#### Frontend Container (`volteras-frontend`)
- **Base Image**: nginx:alpine (lightweight web server)
- **Build Process**: Multi-stage build with Node.js 20
- **Serves**: Static React application files
- **Features**: SPA routing, asset caching, gzip compression
- **Health Check**: HTTP response validation

#### Backend Container (`volteras_backend`)
- **Base Image**: python:3.11-slim
- **Framework**: FastAPI with Uvicorn ASGI server
- **Features**: Auto-reload, API documentation, CORS handling
- **Dependencies**: SQLAlchemy, Pydantic, MySQL client
- **Health Check**: Database connection validation

#### Database Container (`volteras-db`)
- **Base Image**: mysql:8.0
- **Persistence**: Named volume for data retention
- **Initialization**: SQL scripts for schema setup
- **Configuration**: Custom MySQL settings for performance
- **Health Check**: MySQL ping validation

### Network Architecture:
- **Custom Bridge Network**: Isolated container communication
- **Service Discovery**: Containers communicate using service names
- **Port Mapping**: External access through host port mapping
- **Security**: Internal network isolation with selective exposure

### Deployment Features:
- **Auto-restart**: Containers restart on failure
- **Health Checks**: Comprehensive service health monitoring
- **Dependency Management**: Proper startup order with health checks
- **Volume Persistence**: Data survival across container restarts
- **Environment Configuration**: Environment-specific settings

### Production Considerations:
- **Scalability**: Ready for horizontal scaling
- **Monitoring**: Built-in logging and health endpoints
- **Security**: Secure defaults and environment isolation
- **Backup**: Volume-based data persistence strategy

---

## 📚 Additional Documentation

For detailed information about specific components:

- **Backend Documentation**: [./backend/README.md](./backend/README.md)
- **Frontend Documentation**: [./frontend/README.md](./frontend/README.md)
- **Database Setup**: [./DATABASE_SETUP.md](./DATABASE_SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `docker-compose up --build`
5. Submit a pull request

---

*Built with modern technologies for scalable vehicle data management.*
