from src.config.admin.categories import USER_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import Report


class ReportAdmin(BaseAdmin, model=Report):  # type: ignore[call-arg]
    category = USER_CATEGORY
    name = "Отчёт"
    name_plural = "Отчёт"
    icon = "fa-solid fa-file-lines"

    column_list = [
        Report.id,
        Report.business_id,
        Report.period_start,
        Report.period_end,
        Report.metrics,
        Report.business,
    ]
    column_details_list = [
        Report.id,
        Report.business_id,
        Report.period_start,
        Report.period_end,
        Report.metrics,
        Report.business,
    ]
    form_columns = [
        Report.id,
        Report.business_id,
        Report.period_start,
        Report.period_end,
        Report.metrics,
        Report.business,
    ]
    column_searchable_list = [
        Report.id,
        Report.business_id,
        Report.period_start,
        Report.period_end,
        Report.metrics,
        Report.business,
    ]
