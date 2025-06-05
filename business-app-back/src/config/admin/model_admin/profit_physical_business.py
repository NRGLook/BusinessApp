from src.config.admin.categories import RATING_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import ProfitPhysicalBusiness


class ProfitPhysicalBusinessAdmin(BaseAdmin, model=ProfitPhysicalBusiness):  # type: ignore[call-arg]
    category = RATING_CATEGORY
    name = "Окупаемость физического бизнеса"
    name_plural = "Окупаемость физического бизнеса"
    icon = "fa-solid fa-money-bill-trend-up"

    column_list = [
        ProfitPhysicalBusiness.id,
        ProfitPhysicalBusiness.settings_id,
        ProfitPhysicalBusiness.amount,
        ProfitPhysicalBusiness.period,
        ProfitPhysicalBusiness.settings,
    ]
    column_details_list = [
        ProfitPhysicalBusiness.id,
        ProfitPhysicalBusiness.settings_id,
        ProfitPhysicalBusiness.amount,
        ProfitPhysicalBusiness.period,
        ProfitPhysicalBusiness.settings,
    ]
    form_columns = [
        ProfitPhysicalBusiness.id,
        ProfitPhysicalBusiness.settings_id,
        ProfitPhysicalBusiness.amount,
        ProfitPhysicalBusiness.period,
        ProfitPhysicalBusiness.settings,
    ]
    column_searchable_list = [
        ProfitPhysicalBusiness.id,
        ProfitPhysicalBusiness.settings_id,
        ProfitPhysicalBusiness.amount,
        ProfitPhysicalBusiness.period,
        ProfitPhysicalBusiness.settings,
    ]
