from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    supabase_url: str
    supabase_service_key: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expires_days: int = 7
    admin_email: str

    class Config:
        env_file = ".env"

settings = Settings()
