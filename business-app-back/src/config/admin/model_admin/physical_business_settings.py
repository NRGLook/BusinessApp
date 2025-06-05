from src.config.admin.categories import BUSINESS_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import PhysicalBusinessSettings


class PhysicalBusinessSettingsAdmin(BaseAdmin, model=PhysicalBusinessSettings):  # type: ignore[call-arg]
    category = BUSINESS_CATEGORY
    name = "Физические настройки бизнеса"
    name_plural = "Физические настройки бизнеса"
    icon = "fa-solid fa-industry"

    column_list = [
        PhysicalBusinessSettings.id,
        PhysicalBusinessSettings.business_id,
        PhysicalBusinessSettings.location,
        PhysicalBusinessSettings.size_sq_meters,
        PhysicalBusinessSettings.employee_count,
        PhysicalBusinessSettings.average_salary,
        PhysicalBusinessSettings.rent_cost,
        PhysicalBusinessSettings.equipment_maintenance_cost,
        PhysicalBusinessSettings.tax_rate,
        PhysicalBusinessSettings.utilities_cost,
        PhysicalBusinessSettings.marketing_budget,
        PhysicalBusinessSettings.equipment,
        PhysicalBusinessSettings.business,
        PhysicalBusinessSettings.strategies,
        PhysicalBusinessSettings.profits,
    ]
    column_details_list = [
        PhysicalBusinessSettings.id,
        PhysicalBusinessSettings.business_id,
        PhysicalBusinessSettings.location,
        PhysicalBusinessSettings.size_sq_meters,
        PhysicalBusinessSettings.employee_count,
        PhysicalBusinessSettings.average_salary,
        PhysicalBusinessSettings.rent_cost,
        PhysicalBusinessSettings.equipment_maintenance_cost,
        PhysicalBusinessSettings.tax_rate,
        PhysicalBusinessSettings.utilities_cost,
        PhysicalBusinessSettings.marketing_budget,
        PhysicalBusinessSettings.equipment,
        PhysicalBusinessSettings.business,
        PhysicalBusinessSettings.strategies,
        PhysicalBusinessSettings.profits,
    ]
    form_columns = [
        PhysicalBusinessSettings.id,
        PhysicalBusinessSettings.business_id,
        PhysicalBusinessSettings.location,
        PhysicalBusinessSettings.size_sq_meters,
        PhysicalBusinessSettings.employee_count,
        PhysicalBusinessSettings.average_salary,
        PhysicalBusinessSettings.rent_cost,
        PhysicalBusinessSettings.equipment_maintenance_cost,
        PhysicalBusinessSettings.tax_rate,
        PhysicalBusinessSettings.utilities_cost,
        PhysicalBusinessSettings.marketing_budget,
        PhysicalBusinessSettings.equipment,
        PhysicalBusinessSettings.business,
        PhysicalBusinessSettings.strategies,
        PhysicalBusinessSettings.profits,
    ]
    column_searchable_list = [
        PhysicalBusinessSettings.id,
        PhysicalBusinessSettings.business_id,
        PhysicalBusinessSettings.location,
        PhysicalBusinessSettings.size_sq_meters,
        PhysicalBusinessSettings.employee_count,
        PhysicalBusinessSettings.average_salary,
        PhysicalBusinessSettings.rent_cost,
        PhysicalBusinessSettings.equipment_maintenance_cost,
        PhysicalBusinessSettings.tax_rate,
        PhysicalBusinessSettings.utilities_cost,
        PhysicalBusinessSettings.marketing_budget,
        PhysicalBusinessSettings.equipment,
        PhysicalBusinessSettings.business,
        PhysicalBusinessSettings.strategies,
        PhysicalBusinessSettings.profits,
    ]
