import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    String,
    DateTime,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)
from sqlalchemy.dialects.postgresql import UUID


class IDMixin:
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


class ImageMixin:
    image_url: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="URL изображения",
    )
