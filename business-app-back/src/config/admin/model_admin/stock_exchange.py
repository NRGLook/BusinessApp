from src.config.admin.categories import BUSINESS_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import StockExchange


class StockExchangeAdmin(BaseAdmin, model=StockExchange):  # type: ignore[call-arg]
    category = BUSINESS_CATEGORY
    name = "Фондовая биржа"
    name_plural = "Фондовая биржа"
    icon = "fa-solid fa-chart-line"

    column_list = [
        StockExchange.id,
        StockExchange.name,
        StockExchange.country,
        StockExchange.currency,
        StockExchange.stocks,
    ]
    column_details_list = [
        StockExchange.id,
        StockExchange.name,
        StockExchange.country,
        StockExchange.currency,
        StockExchange.stocks,
    ]
    form_columns = [
        StockExchange.id,
        StockExchange.name,
        StockExchange.country,
        StockExchange.currency,
        StockExchange.stocks,
    ]
    column_searchable_list = [
        StockExchange.id,
        StockExchange.name,
        StockExchange.country,
        StockExchange.currency,
        StockExchange.stocks,
    ]
