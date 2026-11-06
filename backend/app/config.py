import os

class Settings:
    PROJECT_NAME: str = "Finsight AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS: set = {".pdf", ".csv", ".xlsx", ".xls"}
    CORS_ORIGINS: list = [
        origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,*").split(",")
        if origin.strip()
    ]
    RATE_LIMIT_UPLOAD: str = os.getenv("RATE_LIMIT_UPLOAD", "30/minute")
    RATE_LIMIT_DEFAULT: str = os.getenv("RATE_LIMIT_DEFAULT", "100/minute")

settings = Settings()
