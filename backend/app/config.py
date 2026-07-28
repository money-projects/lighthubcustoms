from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    supabase_url: str
    supabase_service_key: str
    jwt_secret: str = ""
    jwt_algorithm: str = "HS256"
    jwt_expires_days: int = 7
    admin_email: str = ""
    google_client_id: str = ""
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"
    cognito_user_pool_id: str = "us-east-1_u5OyE3UeB"
    cognito_client_id: str = "7tgmd5hqbjnfpteu3gn33g2u13"
    cognito_region: str = "us-east-1"

    @property
    def origins(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    @property
    def cognito_jwks_url(self) -> str:
        return f"https://cognito-idp.{self.cognito_region}.amazonaws.com/{self.cognito_user_pool_id}/.well-known/jwks.json"

    class Config:
        env_file = ".env"

settings = Settings()
