from src.config.admin.categories import BUSINESS_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import StrategyPhysicalBusiness


class StrategyPhysicalBusinessAdmin(BaseAdmin, model=StrategyPhysicalBusiness):  # type: ignore[call-arg]
    category = BUSINESS_CATEGORY
    name = "Стратегия физического бизнеса"
    name_plural = "Стратегия физического бизнеса"
    icon = "fa-solid fa-handshake"

    column_list = [
        StrategyPhysicalBusiness.id,
        StrategyPhysicalBusiness.settings_id,
        StrategyPhysicalBusiness.name,
        StrategyPhysicalBusiness.description,
        StrategyPhysicalBusiness.parameters,
        StrategyPhysicalBusiness.settings,
    ]
    column_details_list = [
        StrategyPhysicalBusiness.id,
        StrategyPhysicalBusiness.settings_id,
        StrategyPhysicalBusiness.name,
        StrategyPhysicalBusiness.description,
        StrategyPhysicalBusiness.parameters,
        StrategyPhysicalBusiness.settings,
    ]
    form_columns = [
        StrategyPhysicalBusiness.id,
        StrategyPhysicalBusiness.settings_id,
        StrategyPhysicalBusiness.name,
        StrategyPhysicalBusiness.description,
        StrategyPhysicalBusiness.parameters,
        StrategyPhysicalBusiness.settings,
    ]
    column_searchable_list = [
        StrategyPhysicalBusiness.id,
        StrategyPhysicalBusiness.settings_id,
        StrategyPhysicalBusiness.name,
        StrategyPhysicalBusiness.description,
        StrategyPhysicalBusiness.parameters,
        StrategyPhysicalBusiness.settings,
    ]
