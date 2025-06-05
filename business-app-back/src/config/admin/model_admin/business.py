from src.config.admin.categories import BUSINESS_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import Business


class BusinessAdmin(BaseAdmin, model=Business):  # type: ignore[call-arg]
    category = BUSINESS_CATEGORY
    name = "Бизнес"
    name_plural = "Бизнесы"
    icon = "fa-solid fa-briefcase"

    column_list = [
        Business.id,
        Business.name,
        Business.business_type,
        Business.description,
        Business.initial_investment,
        Business.operational_costs,
        Business.expected_revenue,
        Business.break_even_months,
        Business.owner_id,
        Business.physical_settings,
        Business.virtual_settings,
    ]
    column_details_list = [
        Business.id,
        Business.name,
        Business.business_type,
        Business.description,
        Business.initial_investment,
        Business.operational_costs,
        Business.expected_revenue,
        Business.break_even_months,
        Business.owner_id,
        Business.physical_settings,
        Business.virtual_settings,
    ]
    form_columns = [
        Business.id,
        Business.name,
        Business.business_type,
        Business.description,
        Business.initial_investment,
        Business.operational_costs,
        Business.expected_revenue,
        Business.break_even_months,
        Business.owner_id,
        Business.physical_settings,
        Business.virtual_settings,
    ]
    column_searchable_list = [
        Business.id,
        Business.name,
        Business.business_type,
        Business.description,
        Business.initial_investment,
        Business.operational_costs,
        Business.expected_revenue,
        Business.break_even_months,
        Business.owner_id,
        Business.physical_settings,
        Business.virtual_settings,
    ]
