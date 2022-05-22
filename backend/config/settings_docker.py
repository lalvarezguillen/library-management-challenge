import environ

from .settings import *


env = environ.Env()

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    "default": env.db(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/postgres",
    )
}
