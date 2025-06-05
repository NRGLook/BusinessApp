from src.config.admin.categories import PAYMENT_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import Transaction


class TransactionAdmin(BaseAdmin, model=Transaction):  # type: ignore[call-arg]
    category = PAYMENT_CATEGORY
    name = "Транзакции"
    name_plural = "Транзакции"
    icon = "fa-solid fa-credit-card"

    column_list = [
        Transaction.id,
        Transaction.business_id,
        Transaction.amount,
        Transaction.transaction_type,
        Transaction.details,
        Transaction.business,
    ]
    column_details_list = [
        Transaction.id,
        Transaction.business_id,
        Transaction.amount,
        Transaction.transaction_type,
        Transaction.details,
        Transaction.business,
    ]
    form_columns = [
        Transaction.id,
        Transaction.business_id,
        Transaction.amount,
        Transaction.transaction_type,
        Transaction.details,
        Transaction.business,
    ]
    column_searchable_list = [
        Transaction.id,
        Transaction.business_id,
        Transaction.amount,
        Transaction.transaction_type,
        Transaction.details,
        Transaction.business,
    ]
