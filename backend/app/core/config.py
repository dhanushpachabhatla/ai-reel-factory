from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    gemini_api_key: str | None = None
    gemini_api_key1: str | None = None
    gemini_api_key2: str | None = None
    gemini_api_key3: str | None = None
    gemini_model: str = "gemini-2.5-flash"
    allowed_origins: str = "http://localhost:3000,http://localhost:3001"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def gemini_api_keys(self) -> list[str]:
        keys = [
            self.gemini_api_key1,
            self.gemini_api_key2,
            self.gemini_api_key3,
            self.gemini_api_key,
        ]
        return [key.strip() for key in keys if key and key.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
