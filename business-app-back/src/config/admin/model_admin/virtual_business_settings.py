from src.config.admin.categories import SETTINGS_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import VirtualBusinessSettings


class VirtualBusinessSettingsAdmin(BaseAdmin, model=VirtualBusinessSettings):  # type: ignore[call-arg]
    category = SETTINGS_CATEGORY
    name = "Виртуальные настройки бизнеса"
    name_plural = "Виртуальные настройки бизнеса"
    icon = "fa-solid fa-store"

    column_list = [
        VirtualBusinessSettings.id,
        VirtualBusinessSettings.business_id,
        VirtualBusinessSettings.electricity_cost,
        VirtualBusinessSettings.hardware_cost,
        VirtualBusinessSettings.hashrate,
        VirtualBusinessSettings.mining_difficulty,
        VirtualBusinessSettings.pool_fees,
        VirtualBusinessSettings.crypto_price,
        VirtualBusinessSettings.risk_multiplier,
        VirtualBusinessSettings.initial_capital,
        VirtualBusinessSettings.risk_level,
        VirtualBusinessSettings.portfolio,
        VirtualBusinessSettings.business,
        VirtualBusinessSettings.briefcase,
        VirtualBusinessSettings.profits,
    ]
    column_details_list = [
        VirtualBusinessSettings.id,
        VirtualBusinessSettings.business_id,
        VirtualBusinessSettings.electricity_cost,
        VirtualBusinessSettings.hardware_cost,
        VirtualBusinessSettings.hashrate,
        VirtualBusinessSettings.mining_difficulty,
        VirtualBusinessSettings.pool_fees,
        VirtualBusinessSettings.crypto_price,
        VirtualBusinessSettings.risk_multiplier,
        VirtualBusinessSettings.initial_capital,
        VirtualBusinessSettings.risk_level,
        VirtualBusinessSettings.portfolio,
        VirtualBusinessSettings.business,
        VirtualBusinessSettings.briefcase,
        VirtualBusinessSettings.profits,
    ]
    form_columns = [
        VirtualBusinessSettings.id,
        VirtualBusinessSettings.business_id,
        VirtualBusinessSettings.electricity_cost,
        VirtualBusinessSettings.hardware_cost,
        VirtualBusinessSettings.hashrate,
        VirtualBusinessSettings.mining_difficulty,
        VirtualBusinessSettings.pool_fees,
        VirtualBusinessSettings.crypto_price,
        VirtualBusinessSettings.risk_multiplier,
        VirtualBusinessSettings.initial_capital,
        VirtualBusinessSettings.risk_level,
        VirtualBusinessSettings.portfolio,
        VirtualBusinessSettings.business,
        VirtualBusinessSettings.briefcase,
        VirtualBusinessSettings.profits,
    ]
    column_searchable_list = [
        VirtualBusinessSettings.id,
        VirtualBusinessSettings.business_id,
        VirtualBusinessSettings.electricity_cost,
        VirtualBusinessSettings.hardware_cost,
        VirtualBusinessSettings.hashrate,
        VirtualBusinessSettings.mining_difficulty,
        VirtualBusinessSettings.pool_fees,
        VirtualBusinessSettings.crypto_price,
        VirtualBusinessSettings.risk_multiplier,
        VirtualBusinessSettings.initial_capital,
        VirtualBusinessSettings.risk_level,
        VirtualBusinessSettings.portfolio,
        VirtualBusinessSettings.business,
        VirtualBusinessSettings.briefcase,
        VirtualBusinessSettings.profits,
    ]
