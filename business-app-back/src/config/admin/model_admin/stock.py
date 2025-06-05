from src.config.admin.categories import BUSINESS_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import Stock


class StockAdmin(BaseAdmin, model=Stock):  # type: ignore[call-arg]
    category = BUSINESS_CATEGORY
    name = "Фонд"
    name_plural = "Фонд"
    icon = "fa-solid fa-sack-dollar"

    column_list = [
        Stock.id,
        Stock.exchange_id,
        Stock.symbol,
        Stock.name,
        Stock.current_price,
        Stock.exchange,
    ]
    column_details_list = [
        Stock.id,
        Stock.exchange_id,
        Stock.symbol,
        Stock.name,
        Stock.current_price,
        Stock.exchange,
    ]
    form_columns = [
        Stock.id,
        Stock.exchange_id,
        Stock.symbol,
        Stock.name,
        Stock.current_price,
        Stock.exchange,
    ]
    column_searchable_list = [
        Stock.id,
        Stock.exchange_id,
        Stock.symbol,
        Stock.name,
        Stock.current_price,
        Stock.exchange,
    ]
