import datetime as dt
from zoneinfo import ZoneInfo
from tzlocal import get_localzone_name
from typing import Annotated
from pydantic import BeforeValidator

TZ_MOSCOW = ZoneInfo("Europe/Moscow")
TZ_LOCAL = ZoneInfo(get_localzone_name())
TZ_UTC = ZoneInfo("UTC")


def convert_timestamp_to_moscow_time(timestamp: dt.datetime) -> dt.datetime:
    ts = normalize_timestamp(timestamp)
    return ts.astimezone(TZ_MOSCOW).replace(tzinfo=None)


def normalize_timestamp(timestamp: dt.datetime, assume_tz: ZoneInfo = TZ_UTC) -> dt.datetime:
    """Normalizes timestamp.
    If it is not tz-aware, UTC will be assumed.
    If tz is not UTC, it will be converted to UTC.

    Returns a tz-aware datetime object in UTC.
    """
    if timestamp.tzinfo is None:
        timestamp = timestamp.replace(tzinfo=assume_tz)

    return timestamp.astimezone(TZ_UTC)


def convert_to_mssql_timestamp(timestamp: dt.datetime) -> str:
    # use format with three digits for milliseconds
    timestamp = convert_timestamp_to_moscow_time(timestamp)
    MSSQL_TIMESTAMP_FORMAT = "%Y-%m-%d %H:%M:%S"
    ts = timestamp.strftime(MSSQL_TIMESTAMP_FORMAT)
    ts += f".{timestamp.microsecond // 1000:03d}"
    return ts


def get_current_ts() -> dt.datetime:
    return dt.datetime.now(tz=TZ_UTC)


def ts_validator(v: dt.datetime | None) -> dt.datetime | None:
    if v is not None:
        return normalize_timestamp(v)
    return v


ts_field = Annotated[dt.datetime, BeforeValidator(ts_validator)]
