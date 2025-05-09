from sqladmin import Admin

from src.config.admin import model_admin
from src.config.database_config import async_engine


def init_admin(app):
    admin = Admin(app, async_engine)
    # USER_CATEGORY
    admin.add_view(model_admin.UserAdmin)
