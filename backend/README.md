# Volteras Vehicle Management Backend

A FastAPI-based backend service for managing vehicle data with MySQL database integration.

## Features

- RESTful API for vehicle data management
- MySQL database with SQLModel ORM
- Docker containerization
- Interactive API documentation with Swagger UI
- Comprehensive test suite
- CSV data import functionality
- Data export capabilities (CSV, JSON, Excel formats)

## Architecture

```
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database configuration and connection
│   ├── configs.py           # Application configurations
│   ├── vehicle/
│   │   ├── model.py         # Vehicle data models
│   │   ├── schema.py        # Pydantic schemas
│   │   ├── router.py        # API endpoints
│   │   ├── service.py       # Business logic
│   │   └── tests/           # Unit tests
│   └── Dockerfile           # Backend container configuration
├── init-db/
│   └── 01-init.sql          # Database initialization script
└── docker-compose.yml       # Multi-container orchestration
```

## Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)

## Quick Start with Docker

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Volteras-swe
```

### 2. Start the Services
```bash
docker-compose up -d
```

This will start:
- **MySQL Database** on port `3306`
- **Backend API** on port `8000`

### 3. Verify the Services
```bash
docker-compose ps
```

You should see both `volteras_db` and `voltears_backend` containers running.

## API Documentation

### Swagger UI
Once the backend is running, you can access the interactive API documentation at:

```
http://localhost:8000/docs
```

### ReDoc (Alternative Documentation)
```
http://localhost:8000/redoc
```

### OpenAPI JSON Schema
```
http://localhost:8000/openapi.json
```

## API Endpoints

### Base URL
```
http://localhost:8000
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check endpoint |
| `GET` | `/vehicles` | Get list of all vehicles with pagination |
| `GET` | `/vehicles/ids` | Get list of all vehicle IDs |
| `GET` | `/vehicles/{vehicle_id}` | Get specific vehicle by ID |
| `GET` | `/vehicles/{vehicle_id}/data` | Get vehicle data with optional date filtering |
| `GET` | `/vehicles/{vehicle_id}/export` | Export vehicle data in specified format (CSV, JSON, Excel) |
| `POST` | `/vehicles/populate` | Populate database from CSV files |

### Example API Usage

#### 1. Health Check
```bash
curl -X GET "http://localhost:8000/"
```

#### 2. Get All Vehicle IDs
```bash
curl -X GET "http://localhost:8000/vehicles/ids"
```

#### 3. Get Vehicle List (with pagination)
```bash
curl -X GET "http://localhost:8000/vehicles?skip=0&limit=10"
```

#### 4. Get Specific Vehicle
```bash
curl -X GET "http://localhost:8000/vehicles/{vehicle_id}"
```

#### 5. Get Vehicle Data with Date Range
```bash
curl -X GET "http://localhost:8000/vehicles/{vehicle_id}/data?start_date=2023-01-01&end_date=2023-12-31"
```

#### 6. Populate Database from CSV
```bash
curl -X POST "http://localhost:8000/vehicles/populate"
```

#### 7. Export Vehicle Data
```bash
# Export as CSV
curl -X GET "http://localhost:8000/vehicles/{vehicle_id}/export?format=csv&start_date=2023-01-01&end_date=2023-12-31" -o vehicle_data.csv

# Export as JSON
curl -X GET "http://localhost:8000/vehicles/{vehicle_id}/export?format=json&start_date=2023-01-01&end_date=2023-12-31" -o vehicle_data.json

# Export as Excel
curl -X GET "http://localhost:8000/vehicles/{vehicle_id}/export?format=excel&start_date=2023-01-01&end_date=2023-12-31" -o vehicle_data.xlsx
```

## Using Swagger UI

### 1. Open Swagger UI
Navigate to `http://localhost:8000/docs` in your web browser.

### 2. Explore Endpoints
- All available endpoints are listed with their HTTP methods
- Click on any endpoint to expand and see details
- Each endpoint shows parameters, request/response schemas, and example values

### 3. Test Endpoints Directly
- Click "Try it out" on any endpoint
- Fill in required parameters
- Click "Execute" to make the API call
- View the response directly in the browser

### 4. Authentication
Currently, the API doesn't require authentication, but you can see how to add it in the Swagger interface if needed.

## Database Schema

### Vehicle Model
```python
class Vehicle(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    vehicle_id: str = Field(index=True)
    # Additional fields as defined in your model
```

### VehicleData Model
```python
class VehicleData(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    vehicle_id: str = Field(foreign_key="vehicle.vehicle_id")
    timestamp: datetime
    # Additional sensor data fields
```

## Development Setup

### Local Development (without Docker)

1. **Set up Python environment:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables:**
```bash
export DATABASE_URL="mysql+pymysql://root:password@localhost:3306/volteras_db"
```

4. **Run the application:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Running Tests

#### With Docker
```bash
docker-compose exec voltears_backend python -m pytest vehicle/tests/ -v
```

#### Local Development
```bash
cd backend
python -m pytest vehicle/tests/ -v
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql+pymysql://root:password@volteras_db:3306/volteras_db` |
| `MYSQL_ROOT_PASSWORD` | MySQL root password | `password` |
| `MYSQL_DATABASE` | MySQL database name | `volteras_db` |

## Data Import

The system supports importing vehicle data from CSV files:

1. Place CSV files in `backend/vehicle/data/` directory
2. Call the populate endpoint: `POST /vehicles/populate`
3. The system will automatically process all CSV files in the data directory

### CSV Format
Ensure your CSV files follow the expected schema with proper headers and data types.

## Data Export

The system provides flexible data export capabilities in multiple formats:

### Supported Export Formats

| Format | Extension | Content Type | Description |
|--------|-----------|--------------|-------------|
| **CSV** | `.csv` | `text/csv` | Comma-separated values for spreadsheet applications |
| **JSON** | `.json` | `application/json` | JavaScript Object Notation for API integration |
| **Excel** | `.xlsx` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | Microsoft Excel format |

### Export Endpoint

**URL:** `GET /vehicles/{vehicle_id}/export`

**Parameters:**
- `vehicle_id` (path): Vehicle ID to export data for
- `format` (query): Export format (`csv`, `json`, `excel`)
- `start_date` (query, optional): Start date for data filtering (YYYY-MM-DD)
- `end_date` (query, optional): End date for data filtering (YYYY-MM-DD)

### Export Examples

#### Using Swagger UI
1. Navigate to `http://localhost:8000/docs`
2. Find the `/vehicles/{vehicle_id}/export` endpoint
3. Click "Try it out"
4. Enter the vehicle ID and select your desired format
5. Optionally specify date range
6. Click "Execute" and download the file

#### Using cURL
```bash
# Export all data as CSV
curl -X GET "http://localhost:8000/vehicles/06ab31a9-b35d-4e47-8e44-9c35feb1bfae/export?format=csv" \
     -H "Accept: text/csv" \
     -o vehicle_data.csv

# Export filtered data as JSON
curl -X GET "http://localhost:8000/vehicles/06ab31a9-b35d-4e47-8e44-9c35feb1bfae/export?format=json&start_date=2023-01-01&end_date=2023-12-31" \
     -H "Accept: application/json" \
     -o vehicle_data.json

# Export as Excel with date filter
curl -X GET "http://localhost:8000/vehicles/06ab31a9-b35d-4e47-8e44-9c35feb1bfae/export?format=excel&start_date=2023-06-01&end_date=2023-06-30" \
     -H "Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" \
     -o vehicle_data.xlsx
```

#### Using Python Requests
```python
import requests

# Export as CSV
response = requests.get(
    "http://localhost:8000/vehicles/06ab31a9-b35d-4e47-8e44-9c35feb1bfae/export",
    params={
        "format": "csv",
        "start_date": "2023-01-01",
        "end_date": "2023-12-31"
    }
)

with open("vehicle_data.csv", "wb") as f:
    f.write(response.content)
```

#### Using JavaScript/Fetch
```javascript
// Export and download as Excel
fetch('http://localhost:8000/vehicles/06ab31a9-b35d-4e47-8e44-9c35feb1bfae/export?format=excel&start_date=2023-01-01&end_date=2023-12-31')
  .then(response => response.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vehicle_data.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
```

### Export Response Details

#### CSV Export
- Returns data in comma-separated format
- Headers included in first row
- Suitable for Excel, Google Sheets, and data analysis tools
- Content-Type: `text/csv`

#### JSON Export
- Returns structured JSON data
- Includes metadata and data arrays
- Perfect for API integration and web applications
- Content-Type: `application/json`

Example JSON structure:
```json
{
  "vehicle_id": "06ab31a9-b35d-4e47-8e44-9c35feb1bfae",
  "export_date": "2023-08-23T10:30:00Z",
  "date_range": {
    "start_date": "2023-01-01",
    "end_date": "2023-12-31"
  },
  "total_records": 1000,
  "data": [
    {
      "timestamp": "2023-01-01T00:00:00Z",
      "field1": "value1",
      "field2": "value2"
    }
  ]
}
```

#### Excel Export
- Returns .xlsx format compatible with Microsoft Excel
- Formatted with headers and proper data types
- Includes multiple sheets if applicable
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

### Export Limitations
- Maximum export size: 10MB per request
- Date range cannot exceed 1 year
- Large datasets are automatically paginated
- Concurrent export requests are limited per user

## Monitoring and Logs

### View Backend Logs
```bash
docker-compose logs voltears_backend
```

### View Database Logs
```bash
docker-compose logs volteras_db
```

### Follow Logs in Real-time
```bash
docker-compose logs -f voltears_backend
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change the port mapping in `docker-compose.yml`
   - Or stop the service using the port: `sudo lsof -ti:8000 | xargs kill -9`

2. **Database Connection Issues**
   - Ensure MySQL container is running: `docker-compose ps`
   - Check database logs: `docker-compose logs volteras_db`

3. **Backend Won't Start**
   - Check backend logs: `docker-compose logs voltears_backend`
   - Verify all dependencies are installed correctly

### Reset Everything
```bash
docker-compose down -v
docker-compose up -d --build
```

## API Response Examples

### GET /vehicles/ids
```json
[
  "06ab31a9-b35d-4e47-8e44-9c35feb1bfae",
  "1bbdf62b-4e52-48c4-8703-5a844d1da912",
  "f212b271-f033-444c-a445-560511f95e9c"
]
```

### GET /vehicles
```json
{
  "vehicles": [
    {
      "id": 1,
      "vehicle_id": "06ab31a9-b35d-4e47-8e44-9c35feb1bfae",
      "created_at": "2023-01-01T00:00:00"
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 10
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure everything works
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please create an issue in the repository or contact the development team.
