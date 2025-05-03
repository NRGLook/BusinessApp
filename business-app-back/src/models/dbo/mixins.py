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
from sqlalchemy.ext.declarative import declared_attr


class IDMixin:
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )


class TimestampMixin:
    @declared_attr
    def created_at(cls) -> Mapped[datetime]:
        return mapped_column(
            DateTime(timezone=True),
            default=datetime.utcnow,
            nullable=False,
        )

    @declared_attr
    def updated_at(cls) -> Mapped[datetime]:
        return mapped_column(
            DateTime(timezone=True),
            default=datetime.utcnow,
            onupdate=datetime.utcnow,
            nullable=False,
        )


class ImageMixin:
    image_url: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="URL изображения",
    )
