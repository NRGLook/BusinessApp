import re
from typing import Any, Type

from pydantic import BaseModel


class BaseService:
    """
    A base service class with general service methods.
    """

    @staticmethod
    def map_obj_to_schema(obj, schema_cls: Type[BaseModel]) -> BaseModel:
        """
        Maps an object to a schema instance based on the schema's fields.

        :param obj: The object to map to the schema.
        :param schema_cls: The schema class to map the object to.
        :return: An instance of the schema populated with the object's data.
        """

        obj_dict = {key: getattr(obj, key) for key in schema_cls.model_fields.keys()}
        return schema_cls(**obj_dict)

    @staticmethod
    def map_nested_fields(
        obj: Any,
        schema_class: Type[BaseModel] | None,
        field_base: str,
    ) -> dict[str, Any] | None:
        """
        Maps nested fields from an object's attributes to a dictionary based on the specified schema.

        :param obj: The object containing attributes to map.
        :param schema_class: The schema class that defines the fields to map, typically a subclass of `BaseModel`.
        :param field_base: The base name for the nested field attributes in `obj` that will be mapped.
                           Each field in `schema_class` will be prefixed by `field_base` to retrieve the value.
        :return: A dictionary where keys are the field names from the schema, and values are
                 the corresponding attribute values from `obj` (prefixed by `field_base`).
        """
        if schema_class is None:
            return None
        mapped_data = {}
        filled = False
        for field, field_type in schema_class.model_fields.items():
            model_field_value = getattr(obj, f"{field_base}_{field}", None)

            mapped_data[field] = model_field_value
            if model_field_value is not None:
                filled = True

        return mapped_data if filled else None

    @staticmethod
    def _natural_sort_key(value):
        """
        Generates a key for natural sorting, handling text and numbers in a human-friendly order.
        Ensures numeric parts are compared as integers rather than strings.
        """

        def convert(text):
            return int(text) if text.isdigit() else text.lower()

        return [convert(chunk) for chunk in re.split(r"(\d+)", value)]
