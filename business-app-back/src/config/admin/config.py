from sqladmin import Admin

from src.config.admin import model_admin
from src.config.database_config import async_engine


def init_admin(app):
    admin = Admin(app, async_engine)

    views = [
        model_admin.UserAdmin,
        model_admin.UserStatsAdmin,
        model_admin.UserProfileAdmin,
        model_admin.UserBriefcaseAdmin,
        model_admin.BusinessAdmin,
        model_admin.CourseAdmin,
        model_admin.LessonAdmin,
        model_admin.CourseCategoryAdmin,
        model_admin.RoleAdmin,
        model_admin.StockAdmin,
        model_admin.StockExchangeAdmin,
        model_admin.ReportAdmin,
        model_admin.UserCourseProgressAdmin,
        model_admin.AchievementAdmin,
        model_admin.LevelAdmin,
        model_admin.AppSettingsAdmin,
        model_admin.MessageAdmin,
        model_admin.NotificationAdmin,
        model_admin.ProfitPhysicalBusinessAdmin,
        model_admin.ProfitVirtualBusinessAdmin,
        model_admin.TransactionAdmin,
        model_admin.StrategyPhysicalBusinessAdmin,
        model_admin.PhysicalBusinessSettingsAdmin,
        model_admin.VirtualBusinessSettingsAdmin,
    ]

    for view in views:
        admin.add_view(view)
