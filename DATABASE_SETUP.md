# MySQL Database Setup with Docker

This project now uses MySQL instead of SQLite. The database runs in a Docker container for easy setup and management.

## Prerequisites

- Docker and Docker Compose installed on your system

## Setup Instructions

### 1. Start the MySQL Database

From the root directory of the project (where `docker-compose.yml` is located):

```bash
docker-compose up -d volteras-db
```

This will:
- Pull the MySQL 8.0 image
- Create a container named `volteras-db`
- Set up the database with the credentials specified in the compose file
- Make the database available on `localhost:3306`

### 2. Verify Database is Running

Check if the container is running:
```bash
docker-compose ps
```

Check the logs:
```bash
docker-compose logs volteras-db
```

### 3. Run Your FastAPI Application

Navigate to the backend directory and run your application:
```bash
cd backend
uvicorn main:app --reload
```

## Database Configuration

The database connection uses these default values (defined in `backend/.env`):
- **Host**: localhost
- **Port**: 3306
- **Database**: vehicle
- **Username**: fastapi_user
- **Password**: fastapi_password

## Useful Docker Commands

### Stop the database:
```bash
docker-compose down
```

### Stop and remove volumes (⚠️ this will delete all data):
```bash
docker-compose down -v
```

### Connect to MySQL directly:
```bash
docker exec -it volteras-db mysql -u fastapi_user -p
# Enter password: fastapi_password
```

### View container logs:
```bash
docker-compose logs -f volteras-db
```

## Environment Variables

You can override database settings by modifying the `.env` file in the `backend` directory:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=fastapi_user
DB_PASSWORD=fastapi_password
DB_NAME=vehicle
```

## Data Persistence

Database data is stored in a Docker volume named `mysql_data`, so your data will persist even if you stop and restart the container.

## Next Steps: Dockerizing the Backend

When you're ready to dockerize the FastAPI backend, you can extend the docker-compose.yml file to include your backend service that connects to the `volteras-db` container.
