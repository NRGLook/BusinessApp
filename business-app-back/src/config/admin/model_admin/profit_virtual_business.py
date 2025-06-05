from src.config.admin.categories import RATING_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import ProfitVirtualBusiness


class ProfitVirtualBusinessAdmin(BaseAdmin, model=ProfitVirtualBusiness):  # type: ignore[call-arg]
    category = RATING_CATEGORY
    name = "Окупаемость виртуального бизнеса"
    name_plural = "Окупаемость виртуального бизнеса"
    icon = "fa-solid fa-hand-holding-dollar"

    column_list = [
        ProfitVirtualBusiness.id,
        ProfitVirtualBusiness.settings_id,
        ProfitVirtualBusiness.amount,
        ProfitVirtualBusiness.period,
        ProfitVirtualBusiness.settings,
    ]
    column_details_list = [
        ProfitVirtualBusiness.id,
        ProfitVirtualBusiness.settings_id,
        ProfitVirtualBusiness.amount,
        ProfitVirtualBusiness.period,
        ProfitVirtualBusiness.settings,
    ]
    form_columns = [
        ProfitVirtualBusiness.id,
        ProfitVirtualBusiness.settings_id,
        ProfitVirtualBusiness.amount,
        ProfitVirtualBusiness.period,
        ProfitVirtualBusiness.settings,
    ]
    column_searchable_list = [
        ProfitVirtualBusiness.id,
        ProfitVirtualBusiness.settings_id,
        ProfitVirtualBusiness.amount,
        ProfitVirtualBusiness.period,
        ProfitVirtualBusiness.settings,
    ]
