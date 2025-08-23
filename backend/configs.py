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