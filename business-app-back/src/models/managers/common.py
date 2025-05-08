from typing import Any, List, Optional, Type, TypeVar, Union, Generic
from uuid import UUID

from sqlalchemy import Select, case, cast, delete, func, select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.sqltypes import DECIMAL
from sqlalchemy.sql.sqltypes import String as StringType

from src.api.schemes import PaginationParams
from src.models.dbo.database_models import Base
from src.services.logger import LoggerProvider
from src.utils.helpers import get_paginated_query

T = TypeVar("T", bound=Base)

log = LoggerProvider().get_logger(__name__)


class DictToObject:
    def __init__(self, dictionary):
        for key, value in dictionary.items():
            setattr(self, key, value)


class BaseManager(Generic[T]):
    """
    A generic base manager for handling common database operations like
    creating, retrieving, updating, deleting, and filtering entities.
    """

    entity: Type[T]

    join_columns: Optional[dict] = None

    def __init__(self, db: AsyncSession):
        self.db = db

    def get_base_query(self) -> Select:
        """
        Returns a base query for the entity.

        It has to be overriden, if filter_by_related_entity_id
        method will be used for the certain manager.

        :return: A select query for the entity.
        """
        query = select(self.entity)
        return query

    async def create(self, payload: dict) -> T:
        """
        Creates a new entity and commits it to the database.

        :param payload: Dictionary of fields for the new entity.
        :return: The newly created entity.
        """

        new_entity = self.entity(**payload)
        self.db.add(new_entity)
        await self.db.commit()
        await self.db.refresh(new_entity)
        return new_entity

    async def get_by_id(self, entity_id: Union[int, UUID]) -> Optional[T]:
        """
        Fetches an entity by its ID.

        :param entity_id: ID of the entity.
        :return: The entity if found, else None.
        """

        return await self.db.get(self.entity, entity_id)

    async def update_by_id(self, entity_id: Union[int, UUID], payload: dict) -> Optional[T]:
        """
        Updates an entity with new data if it exists.

        :param entity_id: ID of the entity to update.
        :param payload: Dictionary of fields to update.
        :return: The updated entity or None if not found.
        """

        entity = await self.get_by_id(entity_id)
        if entity:
            for key, value in payload.items():
                setattr(entity, key, value)
            await self.db.commit()
            await self.db.refresh(entity)
        return entity

    async def delete_by_id(self, entity_id: Union[int, UUID]) -> None:
        """
        Deletes an entity by its ID.

        :param entity_id: ID of the entity to delete.
        """

        entity = await self.get_by_id(entity_id)
        if entity:
            await self.db.delete(entity)
            await self.db.commit()

    def _get_filter_bool_expression(self, filter_name: str, filter_value: Any, query: Select):
        """
        Constructs a boolean SQL expression for filtering based on the provided filter name and value.

        Args:
            filter_name (str): The name of the field to filter by, optionally including a condition
                               suffix (e.g., "work_date__gt" for greater than) separated by "__".
            filter_value (Any): The value to compare against the field in the filter.
            query (Query): The SQLAlchemy query object that contains the columns available for filtering.

        Returns:
            BinaryExpression: A SQLAlchemy expression representing the boolean condition for filtering.

        Raises:
            ValueError: If the filter suffix is unknown or unsupported.
        """

        if filter_name in query.columns or (self.join_columns and filter_name in self.join_columns.keys()):
            obj = self.join_columns if self.join_columns and filter_name in self.join_columns else self.entity
            if isinstance(obj, dict):
                obj = DictToObject(obj)  # type: ignore[assignment]

            if not hasattr(obj, filter_name):
                return None

            return getattr(obj, filter_name).__eq__(filter_value)

        split_by_double_underscore = filter_name.split("__")
        sign = split_by_double_underscore.pop()
        col_name = split_by_double_underscore[0]

        obj = self.join_columns if self.join_columns and col_name in self.join_columns else self.entity
        if isinstance(obj, dict):
            obj = DictToObject(obj)  # type: ignore[assignment]

        if sign in {"lt", "le", "gt", "ge", "ne"}:
            return getattr(getattr(obj, col_name), f"__{sign}__")(filter_value)
        elif sign == "gte":
            return getattr(obj, col_name) >= filter_value
        elif sign == "lte":
            return getattr(obj, col_name) <= filter_value
        elif sign == "in":
            return getattr(obj, col_name).in_(filter_value)
        elif sign == "notin":
            return ~getattr(obj, col_name).in_(filter_value)
        elif sign == "is":
            return getattr(obj, col_name).is_(filter_value)
        elif sign == "isnot":
            return getattr(obj, col_name).is_not(filter_value)
        elif sign == "like":
            return getattr(obj, col_name).like(filter_value)
        elif sign == "ilike":
            return getattr(obj, col_name).ilike(f"%{filter_value}%")
        elif sign == "isnotnull":
            return getattr(obj, col_name).is_not(None)
        elif sign == "isnull":
            return getattr(obj, col_name).is_(None)

        raise ValueError(f"Unknown filter name ({filter_name})")

    def apply_filters(self, query: Select, **filters) -> Select:
        """
        Applies multiple filters to an SQLAlchemy query, dynamically generating expressions
        based on the provided filters and chaining them with `.where()`.

        Args:
            query (Query): The SQLAlchemy query to which filters will be applied.
            **filters: Arbitrary keyword arguments where each key represents a field name with an optional
                       condition suffix (e.g., "work_date__lt") and the value represents the comparison value.

        Returns:
            Query: The modified SQLAlchemy query with the applied filters.
        """

        filters = {key: value for key, value in filters.items() if value is not None}
        for filter_name, filter_value in filters.items():
            query = query.where(
                self._get_filter_bool_expression(
                    filter_name=filter_name,
                    filter_value=filter_value,
                    query=query,
                )
            )

        return query

    def add_order_to_query(self, query: Select, order_by: str) -> Select:
        """
        Adds ordering to a SQLAlchemy query based on the specified column name.

        Args:
            query (Select): The SQLAlchemy query object to which the ordering is applied.
            order_by (str): The column name to order by. If the column name starts with '-',
                            ordering will be descending. Otherwise, it will be ascending.

        Returns:
            Select: The query object with the ordering applied.

        Notes:
            - If the `order_by` parameter specifies a column that is part of a joined entity
              and the column exists in `join_columns`, this method will apply ordering on
              the corresponding attribute from `join_columns`.
            - If `join_columns` is not specified or does not contain the `order_by` column,
              ordering will default to the `entity` attribute.
        """
        if order_by.startswith("-"):
            descending = True
            order_by = order_by[1:]
        else:
            descending = False

        obj = self.join_columns if self.join_columns and order_by in self.join_columns else self.entity
        if isinstance(obj, dict):
            obj = DictToObject(obj)  # type: ignore[assignment]

        apply_numeric_sorting_for_tables = ("floor", "section")
        if order_by in query.columns:
            order_by_column = getattr(obj, order_by)
            column_type = getattr(order_by_column, "type", None)
            if self.entity.__tablename__ in apply_numeric_sorting_for_tables and isinstance(column_type, StringType):
                numeric_part = cast(func.substring(order_by_column, r"([0-9]+)"), DECIMAL)
                sort_column = case(
                    (
                        func.regexp_match(order_by_column, r"[0-9]+") is not None,
                        numeric_part,
                    ),
                    else_=None,
                )
                if descending:
                    query = query.order_by(sort_column.desc(), order_by_column.desc())
                else:
                    query = query.order_by(sort_column.asc(), order_by_column.asc())
            else:
                if descending:
                    query = query.order_by(order_by_column.desc())
                else:
                    query = query.order_by(order_by_column.asc())
        return query

    def apply_ordering(self, query: Select, order_by) -> Select:
        """
        Applies multiple ordering parameters to a SQLAlchemy query.

        Args:
            query (Select): The SQLAlchemy query object to which ordering parameters are applied.
            order_by (list[str]): A list of column names to order by. Each item in the list can
                                  start with '-' to apply descending order; otherwise, ordering
                                  is ascending.

        Returns:
            Select: The query object with all specified ordering parameters applied.

        Notes:
            - This method iterates over each `order_by` parameter and applies it using
              `add_order_to_query`.
            - Allows for flexible multi-column ordering, where each column can be ordered
              individually as ascending or descending.
        """
        for order_by_param in order_by:
            query = self.add_order_to_query(query, order_by_param)
        return query

    async def count(
        self,
        query: Select = None,
        **filters,
    ) -> int:
        """
        Counts the number of entities in the database based on filters.

        :param query: Optional base query to count results from.
        :param filters: Additional filters to apply.
        :return: The number of entities matching the query.
        """

        if query is None:
            query = self.get_base_query()

        query = self.apply_filters(query, **filters)
        query = select(func.count()).select_from(query.subquery())

        result = await self.db.execute(query)
        return result.scalar()

    async def search(
        self,
        query: Select = None,
        order_by: Optional[list[str]] = None,
        pagination: Optional[PaginationParams] = None,
        with_scalars: bool = True,
        **filters,
    ) -> List[T]:
        """
        Perform a search for entities based on optional filters, sorting, pagination,
        and related model criteria.

        :param query: An optional SQLAlchemy query object to execute.
                      If None, a base query is generated.
        :param order_by: Ordering parameters, if specified, applied to the query results.
        :param pagination: Pagination parameters, if specified, used to limit the result set.
        :param with_scalars: If True, returns scalar results; if False, returns raw row data.
        :param filters: Additional keyword arguments used as filters in the query.
        :return: A list of entities matching the specified filters, sorted and paginated
                 according to the provided parameters.
        """

        if query is None:
            query = self.get_base_query()

        query = self.apply_filters(query, **filters)

        if order_by:
            query = self.apply_ordering(query, order_by)
        if pagination:
            query = get_paginated_query(query, pagination)
        result = await self.fetch(query, with_scalars)
        return result

    async def bulk_update(self, entities_to_update: list[dict[str, Union[int, UUID, str]]]):
        """
        Batch updates entities with new data if they exist.

        :param entities_to_update: A list of dictionaries where each dictionary has:
                        - 'id': the entity ID.
                        - extra fields: fields to update.
                        Example: [
                            {'id': 1,'field1': 'value1'},
                            {'id': 2, 'field1': 'value2', 'field2': 'value3'}
                        ]
        :return: A list of updated entities or None if an entity was not found.
        """

        updated_entities = await self.db.execute(
            update(self.entity),
            entities_to_update,
        )
        await self.db.commit()

        return updated_entities

    async def bulk_delete(self, entity_ids: list[Union[int, UUID]]) -> None:
        """
        Perform bulk deletion of entities by their IDs.

        :param entity_ids: List of entity IDs to delete.
        """
        if not entity_ids:
            return

        query = delete(self.entity).where(self.entity.id.in_(entity_ids))

        await self.db.execute(query)

    async def bulk_insert(self, entities_data: list[dict]) -> None:
        """
        Perform a bulk insert of entities.

        :param entities_data: List of dictionaries representing the data for each entity.
                              Example: [{"field1": "value1", "field2": "value2"}, {...}]
        """
        if not entities_data:
            return

        query = insert(self.entity).values(entities_data)

        await self.db.execute(query)

    async def create_or_update(self, entities: list):
        """
        Creates or updates entities in the database. If an entity has an ID, it is updated; otherwise,
        it is created as a new entry.

        Args:
            entities (list): A list of entity objects to be created or updated.

        Returns:
            list: A list of the updated or created entities, each representing the final state in the database.
        """

        updated_entities: list = []
        for entity in entities:
            if entity.id:
                log.info(f"Updating entity with ID {entity.id}")
                data_dict = {key: value for key, value in entity.model_dump().items() if key != "id"}
                log.info(f"Update payload: {data_dict}")
                updated_entity = await self.update_by_id(
                    entity_id=entity.id,
                    payload=data_dict,
                )  # type: ignore[func-returns-value]
                log.info(f"Updated entity: {updated_entity}")
                updated_entities.append(updated_entity)
            else:
                log.info("Creating new entity")
                payload = entity.model_dump()
                log.info(f"Create payload: {payload}")
                created_entity: T = await self.create(payload=payload)
                log.info(f"Created entity: {created_entity}")
                updated_entities.append(created_entity)

        log.info(f"Total entities processed: {len(updated_entities)}")
        return updated_entities

    async def fetch(self, query, with_scalars: bool = True):
        """
        Execute a database query and retrieve all matching results.

        :param query: The SQLAlchemy query to execute.
        :param with_scalars: If True, returns the scalar results of the query;
                             if False, returns the raw fetched rows.
        :return: A list of entities or rows based on `with_scalars`.
                 If `with_scalars` is True, returns a list of entity objects.
                 If False, returns a list of tuples representing raw row data.
        """
        result = await self.db.execute(query)
        if with_scalars:
            return list(result.scalars().unique().all())
        else:
            return list(result.unique().fetchall())

    async def bulk_upsert(
        self,
        data: list[dict],
        key_field: str | list[str],
        update_fields: list[str],
        batch_size: int = 5000,
    ):
        if len(data) == 0:
            return

        start, end = 0, batch_size
        while end < len(data):
            batch_data = data[start:end]
            await self._execute_upsert(batch_data, key_field, update_fields)

            start = end
            end = end + batch_size

        batch_data = data[start : len(data)]
        await self._execute_upsert(batch_data, key_field, update_fields)
        await self.db.commit()

    async def _execute_upsert(
        self,
        batch_data: list[dict],
        key_field: str | list[str],
        update_fields: list[str],
    ) -> None:
        if isinstance(key_field, list):
            index_elements = [getattr(self.entity, item) for item in key_field]
        else:
            index_elements = [getattr(self.entity, key_field)]

        insert_stmt = insert(self.entity).values(batch_data)
        update_stmt = insert_stmt.on_conflict_do_update(
            index_elements=index_elements,
            set_={col.name: col for col in insert_stmt.excluded if col.name in update_fields},
        )
        await self.db.execute(update_stmt)
