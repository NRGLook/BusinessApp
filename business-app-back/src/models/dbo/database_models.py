from datetime import datetime
from enum import Enum
from typing import Optional, List

from sqlalchemy import ForeignKey, String, DateTime, Boolean, Integer, Float, Text, Enum as SqlEnum, JSON, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship, DeclarativeBase

from src.models.dbo.mixins import IDMixin, TimestampMixin

class Base(DeclarativeBase):
    pass


class BusinessType(str, Enum):
    PHYSICAL = "physical"
    VIRTUAL = "virtual"


class RoleType(str, Enum):
    USER = "user"
    ADMIN = "admin"
    MODERATOR = "moderator"


class TransactionType(str, Enum):
    INVESTMENT = "investment"
    WITHDRAWAL = "withdrawal"
    TRANSFER = "transfer"


# Таблицы ассоциаций
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", ForeignKey("user.id"), primary_key=True),
    Column("role_id", ForeignKey("role.id"), primary_key=True)
)

user_achievements = Table(
    "user_achievements",
    Base.metadata,
    Column("user_id", ForeignKey("user.id"), primary_key=True),
    Column("achievement_id", ForeignKey("achievement.id"), primary_key=True),
    Column("unlocked_at", DateTime(timezone=True), default=datetime.utcnow)
)


# Основные модели
class User(Base, IDMixin, TimestampMixin):
    __tablename__ = "user"

    username: Mapped[str] = mapped_column(String(50), unique=True, index=True,
                                          comment="Уникальный логин пользователя (например: 'john_doe_2024')")
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True,
                                       comment="Почтовый адрес пользователя (например: 'user@example.com')")
    password_hash: Mapped[str] = mapped_column(String(128),
                                               comment="Хэшированный пароль с использованием bcrypt")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True,
                                            comment="Флаг активности аккаунта (True/False)")

    profile: Mapped["UserProfile"] = relationship(back_populates="user")
    roles: Mapped[List["Role"]] = relationship(secondary=user_roles, back_populates="users")
    businesses: Mapped[List["Business"]] = relationship(back_populates="owner")
    stats: Mapped["UserStats"] = relationship(back_populates="user")
    messages: Mapped[List["Message"]] = relationship(back_populates="user")
    notifications: Mapped[List["Notification"]] = relationship(back_populates="user")
    achievements: Mapped[List["Achievement"]] = relationship(secondary=user_achievements, back_populates="users")


class Role(Base, IDMixin):
    __tablename__ = "role"

    name: Mapped[RoleType] = mapped_column(SqlEnum(RoleType), unique=True,
                                           comment="Название роли из предопределенного списка")
    description: Mapped[Optional[str]] = mapped_column(String(255),
    comment = "Описание роли (например: 'Администратор системы')")

    users: Mapped[List["User"]] = relationship(secondary=user_roles, back_populates="roles")


class UserProfile(Base, IDMixin, TimestampMixin):
    __tablename__ = "user_profile"

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), unique=True)
    first_name: Mapped[Optional[str]] = mapped_column(String(50),
    comment = "Имя пользователя (например: 'Иван')")
    last_name: Mapped[Optional[str]] = mapped_column(String(50),
                                                      comment="Фамилия пользователя (например: 'Петров')")
    avatar_url: Mapped[Optional[str]] = mapped_column(String(255),
                                                       comment="Ссылка на аватар (например: 'https://example.com/avatar.jpg')")
    bio: Mapped[Optional[str]] = mapped_column(Text(),
                                                comment="Краткая биография пользователя")

    user: Mapped["User"] = relationship(back_populates="profile")


class Business(Base, IDMixin, TimestampMixin):
    __tablename__ = "business"

    name: Mapped[str] = mapped_column(String(100),
                                      comment="Название бизнеса (например: 'Моя криптоферма')")
    description: Mapped[Optional[str]] = mapped_column(Text(),
    comment = "Подробное описание бизнеса")
    business_type: Mapped[BusinessType] = mapped_column(SqlEnum(BusinessType), comment = "Тип бизнеса: physical или virtual")
    owner_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    owner: Mapped["User"] = relationship(back_populates="businesses")
    physical_settings: Mapped["PhysicalBusinessSettings"] = relationship(back_populates="business")
    virtual_settings: Mapped["VirtualBusinessSettings"] = relationship(back_populates="business")
    reports: Mapped[List["Report"]] = relationship(back_populates="business")
    transactions: Mapped[List["Transaction"]] = relationship(back_populates="business")


class PhysicalBusinessSettings(Base, IDMixin):
    __tablename__ = "physical_business_settings"

    business_id: Mapped[int] = mapped_column(ForeignKey("business.id"), unique=True)
    location: Mapped[str] = mapped_column(String(255),
                                          comment="Координаты местоположения (например: '55.7558,37.6173')")
    size_sq_meters: Mapped[float] = mapped_column(Float,
                                                  comment="Площадь помещения в квадратных метрах")
    employee_count: Mapped[int] = mapped_column(Integer,
                                                comment="Количество сотрудников")
    equipment: Mapped[JSON] = mapped_column(JSON,
                                            comment="Оборудование в формате JSON (например: {'станки': 5, 'транспорт': 2})")

    business: Mapped["Business"] = relationship(back_populates="physical_settings")
    strategies: Mapped[List["StrategyPhysicalBusiness"]] = relationship(back_populates="settings")
    profits: Mapped[List["ProfitPhysicalBusiness"]] = relationship(back_populates="settings")


class VirtualBusinessSettings(Base, IDMixin):
    __tablename__ = "virtual_business_settings"

    business_id: Mapped[int] = mapped_column(ForeignKey("business.id"), unique=True)
    initial_capital: Mapped[float] = mapped_column(Float, default=100000.0,
                                                   comment="Начальный капитал в виртуальной валюте")
    risk_level: Mapped[int] = mapped_column(Integer, default=3,
                                            comment="Уровень риска от 1 (низкий) до 5 (высокий)")
    portfolio: Mapped[JSON] = mapped_column(JSON,
                                            comment="Структура портфеля (например: {'BTC': 60, 'ETH': 40})")

    business: Mapped["Business"] = relationship(back_populates="virtual_settings")
    briefcase: Mapped["UserBriefcase"] = relationship(back_populates="settings")
    profits: Mapped[List["ProfitVirtualBusiness"]] = relationship(back_populates="settings")


class UserStats(Base, IDMixin):
    __tablename__ = "user_stats"

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), unique=True)
    total_businesses: Mapped[int] = mapped_column(Integer, default=0,
                                                  comment="Общее количество бизнесов пользователя")
    total_capital: Mapped[float] = mapped_column(Float, default=0.0,
                                                 comment="Совокупный капитал во всех бизнесах")
    success_rate: Mapped[float] = mapped_column(Float, default=0.0,
                                                comment="Рейтинг успешности от 0.0 до 1.0")

    user: Mapped["User"] = relationship(back_populates="stats")


class StrategyPhysicalBusiness(Base, IDMixin):
    __tablename__ = "strategy_physical_business"

    settings_id: Mapped[int] = mapped_column(ForeignKey("physical_business_settings.id"))
    name: Mapped[str] = mapped_column(String(100),
                                      comment="Название стратегии (например: 'Оптимизация логистики')")
    description: Mapped[str] = mapped_column(Text(),
                                             comment="Подробное описание стратегии")
    parameters: Mapped[JSON] = mapped_column(JSON,
                                             comment="Параметры стратегии в JSON-формате")

    settings: Mapped["PhysicalBusinessSettings"] = relationship(back_populates="strategies")


class UserBriefcase(Base, IDMixin):
    __tablename__ = "user_briefcase"

    settings_id: Mapped[int] = mapped_column(ForeignKey("virtual_business_settings.id"))
    assets: Mapped[JSON] = mapped_column(JSON,
                                         comment="Активы в портфеле (например: {'акции': ['AAPL', 'TSLA']})")
    balance: Mapped[float] = mapped_column(Float,
                                           comment="Текущий баланс виртуальных средств")

    settings: Mapped["VirtualBusinessSettings"] = relationship(back_populates="briefcase")


class StockExchange(Base, IDMixin):
    __tablename__ = "stock_exchange"

    name: Mapped[str] = mapped_column(String(100), unique=True,
                                      comment="Название биржи (например: 'NASDAQ')")
    country: Mapped[str] = mapped_column(String(50),
                                         comment="Страна регистрации (например: 'США')")
    currency: Mapped[str] = mapped_column(String(3),
                                          comment="Основная валюта (например: 'USD')")


class Stock(Base, IDMixin):
    __tablename__ = "stock"

    exchange_id: Mapped[int] = mapped_column(ForeignKey("stock_exchange.id"))
    symbol: Mapped[str] = mapped_column(String(10), unique=True,
                                        comment="Тикер акции (например: 'AAPL')")
    name: Mapped[str] = mapped_column(String(100),
                                      comment="Полное название компании")
    current_price: Mapped[float] = mapped_column(Float,
                                                 comment="Текущая цена акции")

    exchange: Mapped["StockExchange"] = relationship(back_populates="stocks")


class Report(Base, IDMixin, TimestampMixin):
    __tablename__ = "report"

    business_id: Mapped[int] = mapped_column(ForeignKey("business.id"))
    period_start: Mapped[datetime] = mapped_column(DateTime(timezone=True),
                                                   comment="Начало отчетного периода")
    period_end: Mapped[datetime] = mapped_column(DateTime(timezone=True),
                                                 comment="Конец отчетного периода")
    metrics: Mapped[JSON] = mapped_column(JSON,
                                          comment="Метрики в формате JSON (например: {'прибыль': 5000})")

    business: Mapped["Business"] = relationship(back_populates="reports")


class Achievement(Base, IDMixin):
    __tablename__ = "achievement"

    name: Mapped[str] = mapped_column(String(100), unique=True,
                                      comment="Название достижения (например: 'Первый миллион')")
    description: Mapped[str] = mapped_column(Text(),
                                             comment="Условие получения достижения")
    icon_url: Mapped[str] = mapped_column(String(255),
                                          comment="Ссылка на иконку достижения")

    users: Mapped[List["User"]] = relationship(secondary=user_achievements, back_populates="achievements")


class Level(Base, IDMixin):
    __tablename__ = "level"

    level_number: Mapped[int] = mapped_column(Integer, unique=True,
                                              comment="Номер уровня (например: 5)")
    required_xp: Mapped[int] = mapped_column(Integer,
                                             comment="Необходимый опыт для достижения уровня")
    title: Mapped[str] = mapped_column(String(50),
                                       comment="Название уровня (например: 'Новичок')")


class AppSettings(Base, IDMixin):
    __tablename__ = "app_settings"

    key: Mapped[str] = mapped_column(String(50), unique=True,
                                     comment="Ключ настройки (например: 'theme')")
    value: Mapped[JSON] = mapped_column(JSON,
                                        comment="Значение настройки в JSON-формате")
    description: Mapped[str] = mapped_column(Text(),
                                             comment="Описание назначения настройки")


class Message(Base, IDMixin, TimestampMixin):
    __tablename__ = "message"

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    content: Mapped[str] = mapped_column(Text(),
                                         comment="Текст сообщения")
    is_read: Mapped[bool] = mapped_column(Boolean, default=False,
                                          comment="Флаг прочтения сообщения")

    user: Mapped["User"] = relationship(back_populates="messages")


class Notification(Base, IDMixin, TimestampMixin):
    __tablename__ = "notification"

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    title: Mapped[str] = mapped_column(String(100),
                                       comment="Заголовок уведомления")
    message: Mapped[str] = mapped_column(Text(),
                                         comment="Текст уведомления")
    is_read: Mapped[bool] = mapped_column(Boolean, default=False,
                                          comment="Флаг прочтения уведомления")

    user: Mapped["User"] = relationship(back_populates="notifications")


class ProfitPhysicalBusiness(Base, IDMixin, TimestampMixin):
    __tablename__ = "profit_physical_business"

    settings_id: Mapped[int] = mapped_column(ForeignKey("physical_business_settings.id"))
    amount: Mapped[float] = mapped_column(Float,
                                          comment="Сумма прибыли")
    period: Mapped[str] = mapped_column(String(20),
                                        comment="Период (например: '2024-04')")

    settings: Mapped["PhysicalBusinessSettings"] = relationship(back_populates="profits")


class ProfitVirtualBusiness(Base, IDMixin, TimestampMixin):
    __tablename__ = "profit_virtual_business"

    settings_id: Mapped[int] = mapped_column(ForeignKey("virtual_business_settings.id"))
    amount: Mapped[float] = mapped_column(Float,
                                          comment="Сумма прибыли в виртуальной валюте")
    period: Mapped[str] = mapped_column(String(20),
                                        comment="Период (например: '2024-04')")

    settings: Mapped["VirtualBusinessSettings"] = relationship(back_populates="profits")


class Transaction(Base, IDMixin, TimestampMixin):
    __tablename__ = "transaction"

    business_id: Mapped[int] = mapped_column(ForeignKey("business.id"))
    amount: Mapped[float] = mapped_column(Float,
                                          comment="Сумма транзакции")
    transaction_type: Mapped[TransactionType] = mapped_column(SqlEnum(TransactionType),
                                                              comment="Тип транзакции")
    details: Mapped[JSON] = mapped_column(JSON,
                                          comment="Детали транзакции в JSON-формате")

    business: Mapped["Business"] = relationship(back_populates="transactions")