from datetime import datetime
from enum import Enum
from uuid import UUID
from decimal import Decimal
from typing import Optional, List, TYPE_CHECKING

from fastapi_users_db_sqlalchemy import (
    SQLAlchemyBaseUserTableUUID,
    SQLAlchemyUserDatabase,
)
from fastapi_users_db_sqlalchemy.access_token import (
    SQLAlchemyBaseAccessTokenTableUUID,
    SQLAlchemyAccessTokenDatabase,
)

from sqlalchemy import (
    ForeignKey,
    String,
    DateTime,
    Boolean,
    Integer,
    Text,
    Enum as SqlEnum,
    JSON,
    Table,
    Column,
    Numeric,
)
from sqlalchemy.orm import (
    Mapped,
    relationship,
    DeclarativeBase,
    mapped_column,
)

from src.models.dbo.mixins import (
    IDMixin,
    TimestampMixin,
    ImageMixin,
)


if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncSession


class Base(DeclarativeBase):
    pass


class BusinessType(str, Enum):
    PHYSICAL = "PHYSICAL"
    VIRTUAL = "VIRTUAL"


class RoleType(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"
    MODERATOR = "MODERATOR"


class TransactionType(str, Enum):
    INVESTMENT = "INVESTMENT"
    WITHDRAWAL = "WITHDRAWAL"
    TRANSFER = "TRANSFER"


user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", ForeignKey("user.id"), primary_key=True),
    Column("role_id", ForeignKey("role.id"), primary_key=True),
)

user_achievements = Table(
    "user_achievements",
    Base.metadata,
    Column("user_id", ForeignKey("user.id"), primary_key=True),
    Column("achievement_id", ForeignKey("achievement.id"), primary_key=True),
    Column("unlocked_at", DateTime(timezone=True), default=datetime.utcnow),
)


class User(Base, SQLAlchemyBaseUserTableUUID, IDMixin, TimestampMixin):
    profile: Mapped["UserProfile"] = relationship(back_populates="user")
    roles: Mapped[List["Role"]] = relationship(secondary=user_roles, back_populates="users")
    businesses: Mapped[List["Business"]] = relationship(back_populates="owner")
    stats: Mapped["UserStats"] = relationship(back_populates="user")
    messages: Mapped[List["Message"]] = relationship(back_populates="user")
    notifications: Mapped[List["Notification"]] = relationship(back_populates="user")
    achievements: Mapped[List["Achievement"]] = relationship(secondary=user_achievements, back_populates="users")

    @classmethod
    def get_db(cls, session: "AsyncSession"):
        return SQLAlchemyUserDatabase(session, cls)


class AccessToken(SQLAlchemyBaseAccessTokenTableUUID, Base):
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("user.id", ondelete="cascade"),
        nullable=False,
    )

    @classmethod
    def get_db(cls, session: "AsyncSession"):
        return SQLAlchemyAccessTokenDatabase(session, cls)


class Role(Base, IDMixin):
    __tablename__ = "role"

    name: Mapped[RoleType] = mapped_column(
        SqlEnum(RoleType),
        unique=True,
        comment="Название роли из предопределенного списка",
    )
    description: Mapped[Optional[str]] = mapped_column(
        String(255), comment="Описание роли (например: 'Администратор системы')"
    )

    users: Mapped[List["User"]] = relationship(secondary=user_roles, back_populates="roles")


class UserProfile(Base, IDMixin, TimestampMixin):
    __tablename__ = "user_profile"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), unique=True)
    first_name: Mapped[Optional[str]] = mapped_column(String(50), comment="Имя пользователя (например: 'Иван')")
    last_name: Mapped[Optional[str]] = mapped_column(String(50), comment="Фамилия пользователя (например: 'Петров')")
    avatar_url: Mapped[Optional[str]] = mapped_column(
        String(255),
        comment="Ссылка на аватар (например: 'https://example.com/avatar.jpg')",
    )
    bio: Mapped[Optional[str]] = mapped_column(
        Text(),
        comment="Краткая биография пользователя",
    )

    user: Mapped["User"] = relationship(back_populates="profile")


class Business(Base, IDMixin, TimestampMixin):
    __tablename__ = "business"

    name: Mapped[str] = mapped_column(
        String(100),
        comment="Название бизнеса (например: 'Моя криптоферма')",
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text(),
        comment="Подробное описание бизнеса",
    )
    business_type: Mapped[BusinessType] = mapped_column(
        SqlEnum(BusinessType),
        comment="Тип бизнеса: physical или virtual",
    )
    initial_investment: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        comment="Первоначальные инвестиции в рублях/валюте",
    )
    operational_costs: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0.0,
        comment="Базовые операционные расходы в месяц",
    )
    expected_revenue: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        comment="Ожидаемый месячный доход",
    )
    break_even_months: Mapped[Optional[Decimal]] = mapped_column(
        Numeric,
        comment="Расчетный срок окупаемости в месяцах",
    )

    owner_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"))
    owner: Mapped["User"] = relationship(
        back_populates="businesses",
    )
    physical_settings: Mapped["PhysicalBusinessSettings"] = relationship(
        back_populates="business",
    )
    virtual_settings: Mapped["VirtualBusinessSettings"] = relationship(
        back_populates="business",
    )
    reports: Mapped[List["Report"]] = relationship(
        back_populates="business",
    )
    transactions: Mapped[List["Transaction"]] = relationship(
        back_populates="business",
    )


class PhysicalBusinessSettings(Base, IDMixin, TimestampMixin):
    __tablename__ = "physical_business_settings"

    business_id: Mapped[UUID] = mapped_column(
        ForeignKey("business.id"),
        unique=True,
    )
    location: Mapped[str] = mapped_column(
        String(255),
        comment="Координаты или адрес местоположения",
    )
    size_sq_meters: Mapped[Decimal] = mapped_column(
        Numeric(8, 2),
        comment="Площадь помещения (м²)",
    )
    employee_count: Mapped[int] = mapped_column(
        Integer,
        comment="Количество сотрудников",
    )
    average_salary: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        comment="Средняя зарплата сотрудника в месяц",
    )
    rent_cost: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        comment="Стоимость аренды в месяц",
    )
    equipment_maintenance_cost: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        comment="Расходы на обслуживание оборудования в месяц",
    )
    tax_rate: Mapped[Decimal] = mapped_column(
        Numeric(5, 3),
        default=0.15,
        comment="Налоговая ставка (0.15 для 15%)",
    )
    utilities_cost: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        comment="Коммунальные расходы в месяц",
    )
    marketing_budget: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        comment="Бюджет на маркетинг в месяц",
    )
    equipment: Mapped[JSON] = mapped_column(
        JSON,
        comment="Оборудование: {'тип': количество}",
    )

    business: Mapped["Business"] = relationship(
        back_populates="physical_settings",
    )
    strategies: Mapped[List["StrategyPhysicalBusiness"]] = relationship(
        back_populates="settings",
    )
    profits: Mapped[List["ProfitPhysicalBusiness"]] = relationship(
        back_populates="settings",
    )


class VirtualBusinessSettings(Base, IDMixin, TimestampMixin):
    __tablename__ = "virtual_business_settings"

    business_id: Mapped[UUID] = mapped_column(
        ForeignKey("business.id"),
        unique=True,
    )
    electricity_cost: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        comment="Стоимость электроэнергии в месяц",
    )
    hardware_cost: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        comment="Стоимость оборудования (амортизация в месяц)",
    )
    hashrate: Mapped[int] = mapped_column(
        Integer,
        comment="Хэшрейт оборудования (TH/s)",
    )
    mining_difficulty: Mapped[int] = mapped_column(
        Integer,
        comment="Текущая сложность майнинга",
    )
    pool_fees: Mapped[Decimal] = mapped_column(
        Numeric(5, 3),
        default=0.02,
        comment="Комиссия пула (0.02 для 2%)",
    )
    crypto_price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        comment="Текущая цена криптовалюты",
    )
    risk_multiplier: Mapped[Decimal] = mapped_column(
        Numeric(3, 2),
        default=1.0,
        comment="Множитель риска для расчетов",
    )

    initial_capital: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=100000.0,
    )
    risk_level: Mapped[int] = mapped_column(
        Integer,
        default=3,
    )
    portfolio: Mapped[JSON] = mapped_column(
        JSON,
        comment="Структура портфеля",
    )

    business: Mapped["Business"] = relationship(back_populates="virtual_settings")
    briefcase: Mapped["UserBriefcase"] = relationship(back_populates="settings")
    profits: Mapped[List["ProfitVirtualBusiness"]] = relationship(back_populates="settings")


class UserStats(Base, IDMixin):
    __tablename__ = "user_stats"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), unique=True)
    total_businesses: Mapped[Decimal] = mapped_column(
        Numeric, default=0, comment="Общее количество бизнесов пользователя"
    )
    total_capital: Mapped[Decimal] = mapped_column(Numeric, default=0.0, comment="Совокупный капитал во всех бизнесах")
    success_rate: Mapped[Decimal] = mapped_column(Numeric, default=0.0, comment="Рейтинг успешности от 0.0 до 1.0")

    user: Mapped["User"] = relationship(back_populates="stats")


class StrategyPhysicalBusiness(Base, IDMixin):
    __tablename__ = "strategy_physical_business"

    settings_id: Mapped[UUID] = mapped_column(ForeignKey("physical_business_settings.id"))
    name: Mapped[str] = mapped_column(String(100), comment="Название стратегии (например: 'Оптимизация логистики')")
    description: Mapped[str] = mapped_column(Text(), comment="Подробное описание стратегии")
    parameters: Mapped[JSON] = mapped_column(JSON, comment="Параметры стратегии в JSON-формате")

    settings: Mapped["PhysicalBusinessSettings"] = relationship(back_populates="strategies")


class UserBriefcase(Base, IDMixin):
    __tablename__ = "user_briefcase"

    settings_id: Mapped[UUID] = mapped_column(ForeignKey("virtual_business_settings.id"))
    assets: Mapped[JSON] = mapped_column(JSON, comment="Активы в портфеле (например: {'акции': ['AAPL', 'TSLA']})")
    balance: Mapped[Decimal] = mapped_column(Numeric, comment="Текущий баланс виртуальных средств")

    settings: Mapped["VirtualBusinessSettings"] = relationship(back_populates="briefcase")


class StockExchange(Base, IDMixin):
    __tablename__ = "stock_exchange"

    name: Mapped[str] = mapped_column(String(100), unique=True, comment="Название биржи (например: 'NASDAQ')")
    country: Mapped[str] = mapped_column(String(50), comment="Страна регистрации (например: 'США')")
    currency: Mapped[str] = mapped_column(String(3), comment="Основная валюта (например: 'USD')")
    stocks: Mapped[List["Stock"]] = relationship(back_populates="exchange")


class Stock(Base, IDMixin):
    __tablename__ = "stock"

    exchange_id: Mapped[UUID] = mapped_column(ForeignKey("stock_exchange.id"))
    symbol: Mapped[str] = mapped_column(String(10), unique=True, comment="Тикер акции (например: 'AAPL')")
    name: Mapped[str] = mapped_column(String(100), comment="Полное название компании")
    current_price: Mapped[Decimal] = mapped_column(Numeric, comment="Текущая цена акции")

    exchange: Mapped["StockExchange"] = relationship(back_populates="stocks")


class Report(Base, IDMixin, TimestampMixin):
    __tablename__ = "report"

    business_id: Mapped[UUID] = mapped_column(ForeignKey("business.id"))
    period_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), comment="Начало отчетного периода")
    period_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), comment="Конец отчетного периода")
    metrics: Mapped[JSON] = mapped_column(JSON, comment="Метрики в формате JSON (например: {'прибыль': 5000})")

    business: Mapped["Business"] = relationship(back_populates="reports")


class Achievement(Base, IDMixin):
    __tablename__ = "achievement"

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        comment="Название достижения (например: 'Первый миллион')",
    )
    description: Mapped[str] = mapped_column(Text(), comment="Условие получения достижения")
    icon_url: Mapped[str] = mapped_column(String(255), comment="Ссылка на иконку достижения")

    users: Mapped[List["User"]] = relationship(secondary=user_achievements, back_populates="achievements")


class Level(Base, IDMixin):
    __tablename__ = "level"

    level_number: Mapped[Decimal] = mapped_column(Numeric, unique=True, comment="Номер уровня (например: 5)")
    required_xp: Mapped[Decimal] = mapped_column(Numeric, comment="Необходимый опыт для достижения уровня")
    title: Mapped[str] = mapped_column(String(50), comment="Название уровня (например: 'Новичок')")


class AppSettings(Base, IDMixin):
    __tablename__ = "app_settings"

    key: Mapped[str] = mapped_column(String(50), unique=True, comment="Ключ настройки (например: 'theme')")
    value: Mapped[JSON] = mapped_column(JSON, comment="Значение настройки в JSON-формате")
    description: Mapped[str] = mapped_column(Text(), comment="Описание назначения настройки")


class Message(Base, IDMixin, TimestampMixin):
    __tablename__ = "message"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"))
    content: Mapped[str] = mapped_column(Text(), comment="Текст сообщения")
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, comment="Флаг прочтения сообщения")

    user: Mapped["User"] = relationship(back_populates="messages")


class Notification(Base, IDMixin, TimestampMixin):
    __tablename__ = "notification"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"))
    title: Mapped[str] = mapped_column(String(100), comment="Заголовок уведомления")
    message: Mapped[str] = mapped_column(Text(), comment="Текст уведомления")
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, comment="Флаг прочтения уведомления")

    user: Mapped["User"] = relationship(back_populates="notifications")


class ProfitPhysicalBusiness(Base, IDMixin, TimestampMixin):
    __tablename__ = "profit_physical_business"

    settings_id: Mapped[UUID] = mapped_column(ForeignKey("physical_business_settings.id"))
    amount: Mapped[Decimal] = mapped_column(
        Numeric,
        comment="Сумма прибыли",
    )
    period: Mapped[str] = mapped_column(
        String(20),
        comment="Период (например: '2024-04')",
    )

    settings: Mapped["PhysicalBusinessSettings"] = relationship(
        back_populates="profits",
    )


class ProfitVirtualBusiness(Base, IDMixin, TimestampMixin):
    __tablename__ = "profit_virtual_business"

    settings_id: Mapped[UUID] = mapped_column(ForeignKey("virtual_business_settings.id"))
    amount: Mapped[Decimal] = mapped_column(
        Numeric,
        comment="Сумма прибыли в виртуальной валюте",
    )
    period: Mapped[str] = mapped_column(
        String(20),
        comment="Период (например: '2024-04')",
    )

    settings: Mapped["VirtualBusinessSettings"] = relationship(
        back_populates="profits",
    )


class Transaction(Base, IDMixin, TimestampMixin):
    __tablename__ = "transaction"

    business_id: Mapped[UUID] = mapped_column(ForeignKey("business.id"))
    amount: Mapped[Decimal] = mapped_column(
        Numeric,
        comment="Сумма транзакции",
    )
    transaction_type: Mapped[TransactionType] = mapped_column(
        SqlEnum(TransactionType),
        comment="Тип транзакции",
    )
    details: Mapped[JSON] = mapped_column(
        JSON,
        comment="Детали транзакции в JSON-формате",
    )

    business: Mapped["Business"] = relationship(
        back_populates="transactions",
    )


class CourseCategory(Base, IDMixin):
    __tablename__ = "course_category"

    name: Mapped[str] = mapped_column(String(100), unique=True, comment="Название категории курса")
    description: Mapped[Optional[str]] = mapped_column(Text(), comment="Описание категории")

    courses: Mapped[List["Course"]] = relationship(back_populates="category")


class Course(Base, IDMixin, TimestampMixin, ImageMixin):
    __tablename__ = "course"

    title: Mapped[str] = mapped_column(String(100), comment="Название курса")
    description: Mapped[Optional[str]] = mapped_column(Text(), comment="Описание курса")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, comment="Флаг активности курса")
    category_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("course_category.id", ondelete="SET NULL"), comment="Категория курса"
    )
    lesson_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, comment="Ссылка на видео по курсу")

    category: Mapped["CourseCategory"] = relationship(back_populates="courses")
    lessons: Mapped[List["Lesson"]] = relationship(back_populates="course", cascade="all, delete-orphan")
    progress: Mapped[List["UserCourseProgress"]] = relationship(back_populates="course")


class Lesson(Base, IDMixin, TimestampMixin, ImageMixin):
    __tablename__ = "lesson"

    course_id: Mapped[UUID] = mapped_column(ForeignKey("course.id"))
    title: Mapped[str] = mapped_column(String(100), comment="Название урока")
    content: Mapped[str] = mapped_column(Text(), comment="Контент урока")
    order: Mapped[int] = mapped_column(Integer, comment="Порядковый номер в курсе")
    lesson_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, comment="Ссылка на урок")

    course: Mapped["Course"] = relationship(back_populates="lessons")
    quizzes: Mapped[List["QuizQuestion"]] = relationship(back_populates="lesson", cascade="all, delete-orphan")


class QuizQuestion(Base, IDMixin):
    __tablename__ = "quiz_question"

    lesson_id: Mapped[UUID] = mapped_column(ForeignKey("lesson.id"))
    question_text: Mapped[str] = mapped_column(Text(), comment="Текст вопроса")
    choices: Mapped[JSON] = mapped_column(JSON, comment="Список вариантов ответов в формате JSON")
    correct_answer: Mapped[str] = mapped_column(String(100), comment="Правильный ответ")

    lesson: Mapped["Lesson"] = relationship(back_populates="quizzes")


class UserCourseProgress(Base, IDMixin, TimestampMixin):
    __tablename__ = "user_course_progress"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"))
    course_id: Mapped[UUID] = mapped_column(ForeignKey("course.id"))
    completed_lessons: Mapped[int] = mapped_column(Integer, default=0, comment="Количество завершенных уроков")
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False, comment="Флаг завершения курса")

    user: Mapped["User"] = relationship("User")
    course: Mapped["Course"] = relationship(back_populates="progress")
