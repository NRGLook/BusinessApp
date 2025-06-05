from sqladmin import Admin

from src.config.admin import model_admin
from src.config.database_config import async_engine


def init_admin(app):
    admin = Admin(app, async_engine)
    # USER_CATEGORY
    admin.add_view(model_admin.UserAdmin)
    admin.add_view(model_admin.UserStatsAdmin)
    admin.add_view(model_admin.UserProfileAdmin)
    admin.add_view(model_admin.UserBriefcaseAdmin)
    admin.add_view(model_admin.BusinessAdmin)
    admin.add_view(model_admin.RoleAdmin)
    admin.add_view(model_admin.StrategyPhysicalBusinessAdmin)
    admin.add_view(model_admin.PhysicalBusinessSettingsAdmin)
    admin.add_view(model_admin.VirtualBusinessSettingsAdmin)
