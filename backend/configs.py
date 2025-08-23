import os


API_BASE = '/api/v1'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "vehicle", "data")

# Database configuration
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_USER = os.getenv('DB_USER', 'fastapi_user')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'fastapi_password')
DB_NAME = os.getenv('DB_NAME', 'vehicle')

# CORS Origins
CORS_ORIGINS = [
    "http://localhost:3000",    # React default dev server
    "http://localhost:5173",    # Vite default dev server
    "http://localhost:4173",    # Vite preview server
    "http://localhost:8080",    # Alternative dev server port
    "http://127.0.0.1:3000",    # React default dev server (127.0.0.1)
    "http://127.0.0.1:5173",    # Vite default dev server (127.0.0.1)
    "http://127.0.0.1:4173",    # Vite preview server (127.0.0.1)
    "http://127.0.0.1:8080",    # Alternative dev server port (127.0.0.1)
]