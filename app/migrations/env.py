import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# Add the app directory to the path so we can import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the SQLAlchemy models
# Try both import paths
try:
    # Docker path
    from app.models.database import Base
    from app.models import client, pdf_template, tenant
    print("Using Docker import paths for migrations")
except ImportError:
    try:
        # Local path
        from models.database import Base
        from models import client, pdf_template, tenant
        print("Using local import paths for migrations")
    except ImportError:
        print("ERROR: Could not import models. Check your PYTHONPATH")
        sys.exit(1)

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Get DB connection info from environment variables
config.set_main_option("DB_USER", os.getenv("DB_USER", "documantis"))
config.set_main_option("DB_PASSWORD", os.getenv("DB_PASSWORD", "documantis"))
config.set_main_option("DB_HOST", os.getenv("DB_HOST", "localhost"))
config.set_main_option("DB_PORT", os.getenv("DB_PORT", "5432"))
config.set_main_option("DB_NAME", os.getenv("DB_NAME", "documantis"))

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
