"""add additional column to lesson

Revision ID: c5ff0fe038d9
Revises: 1258b243fa83
Create Date: 2025-05-02 20:14:42.072945

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c5ff0fe038d9"
down_revision: Union[str, None] = "1258b243fa83"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("lesson", sa.Column("lesson_url", sa.String(length=255), nullable=True, comment="Ссылка на урок"))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("lesson", "lesson_url")
    # ### end Alembic commands ###
