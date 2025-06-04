import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Box,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Card,
    CardContent,
    Tooltip,
    Alert,
    Snackbar,
    FormControlLabel,
    Switch,
    createTheme,
    ThemeProvider,
    CssBaseline,
    LinearProgress,
    Popover,
} from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GppBadIcon from '@mui/icons-material/GppBad';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CasinoIcon from '@mui/icons-material/Casino';
import CoffeeIcon from '@mui/icons-material/Coffee';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import StorefrontIcon from '@mui/icons-material/Storefront'; // Example for new icons
import CodeIcon from '@mui/icons-material/Code'; // Example for new icons
import PaletteIcon from '@mui/icons-material/Palette'; // Example
import MicIcon from '@mui/icons-material/Mic'; // Example
import FastfoodIcon from '@mui/icons-material/Fastfood'; // Example
import BuildIcon from '@mui/icons-material/Build'; // Example
import SchoolIcon from '@mui/icons-material/School'; // Example
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'; // Example
import HomeWorkIcon from '@mui/icons-material/HomeWork'; // Example
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy'; // Example
import DevicesIcon from '@mui/icons-material/Devices'; // Example
import PetsIcon from '@mui/icons-material/Pets'; // Example
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'; // Example
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'; // Example
import SecurityIcon from '@mui/icons-material/Security'; // Example
import BiotechIcon from '@mui/icons-material/Biotech'; // Example
import SmartToyIcon from '@mui/icons-material/SmartToy'; // Example
import HandymanIcon from '@mui/icons-material/Handyman'; // Example
import DesignServicesIcon from '@mui/icons-material/DesignServices'; // Example
import CameraAltIcon from '@mui/icons-material/CameraAlt'; // Example
import BookIcon from '@mui/icons-material/Book'; // Example
import MusicNoteIcon from '@mui/icons-material/MusicNote'; // Example
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'; // Example
import BakeryDiningIcon from '@mui/icons-material/BakeryDining'; // Example
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'; // Example
import EventIcon from '@mui/icons-material/Event'; // Example
import TranslateIcon from '@mui/icons-material/Translate'; // Example
import SpaIcon from '@mui/icons-material/Spa'; // Example
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler'; // Example
import ScienceIcon from '@mui/icons-material/Science'; // Example
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // Example
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'; // Example
import MuseumIcon from '@mui/icons-material/Museum'; // Example
import ParkIcon from '@mui/icons-material/Park'; // Example
import SolarPowerIcon from '@mui/icons-material/SolarPower'; // Example
import WaterDropIcon from '@mui/icons-material/WaterDrop'; // Example
import ForestIcon from '@mui/icons-material/Forest'; // Example
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService'; // Example
import ConstructionIcon from '@mui/icons-material/Construction'; // Example
import DiamondIcon from '@mui/icons-material/Diamond'; // Example
import AutoStoriesIcon from '@mui/icons-material/AutoStories'; // Example

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ChartTooltip,
    Legend
);

const projectsData = [
    {
        "id": "coffee_shop",
        "name": "Открыть кофейню",
        "description": "Классический бизнес с локальной клиентской базой. Высокая конкуренция, но при правильном подходе может принести стабильный доход.",
        "risk": 3,
        "potentialProfit": "medium",
        "intuitionHint": "Рынок кофеен насыщен, но уникальная концепция или локация могут изменить все. Ищите нишу.",
        "profitFactor": 0.5,
        "successThreshold": 60,
        "icon": CoffeeIcon, // Placeholder, replace with actual MUI icon
    },
    {
        "id": "app_development",
        "name": "Разработка мобильного приложения",
        "description": "Высокотехнологичный проект с потенциалом быстрого роста, но требующий значительных начальных инвестиций и подверженный изменениям рынка.",
        "risk": 4,
        "potentialProfit": "high",
        "intuitionHint": "Идея — лишь начало. Важна команда, маркетинг и готовность к изменениям. Юзабилити решает.",
        "profitFactor": 1.2,
        "successThreshold": 75,
        "icon": PhoneAndroidIcon, // Placeholder
    },
    {
        "id": "dropshipping",
        "name": "Дропшиппинг",
        "description": "Низкий порог входа, не требуется склад. Зависит от поставщиков, трендов и эффективной рекламы. Прибыль может быть нестабильной.",
        "risk": 3,
        "potentialProfit": "low",
        "intuitionHint": "Ключ к успеху в дропшиппинге — выбор ниши и надежные поставщики. Избегайте перенасыщенных рынков.",
        "profitFactor": 0.2,
        "successThreshold": 50,
        "icon": LocalShippingIcon, // Placeholder
    },
    {
        "id": "art_gallery",
        "name": "Арт-галерея",
        "description": "Культурный проект, требующий страсти к искусству и связей. Потенциал высокой прибыли, но с высоким риском и длительным сроком окупаемости.",
        "risk": 5,
        "potentialProfit": "high",
        "intuitionHint": "Искусство — это долгосрочная игра. Важна репутация, сеть контактов и понимание рынка. Не для быстрых денег.",
        "profitFactor": 1.5,
        "successThreshold": 85,
        "icon": ArtTrackIcon, // Placeholder
    },
    {
        "id": "local_farm",
        "name": "Локальная ферма",
        "description": "Экологически чистый продукт с растущим спросом. Зависит от погоды, земли и первоначальных затрат. Стабильный, но медленный рост.",
        "risk": 2,
        "potentialProfit": "medium",
        "intuitionHint": "Устойчивый рост и лояльные клиенты. Риски связаны с природой, но инвестиции окупаются стабильностью и репутацией.",
        "profitFactor": 0.4,
        "successThreshold": 40,
        "icon": AgricultureIcon, // Placeholder
    },
    {
        "id": "saas_platform",
        "name": "SaaS платформа для бизнеса",
        "description": "Разработка облачного ПО для решения конкретных бизнес-задач. Требует сильной тех. команды и маркетинга. Высокий потенциал масштабирования.",
        "risk": 4,
        "potentialProfit": "high",
        "intuitionHint": "Найдите боль клиентов и предложите элегантное решение. Удержание клиентов важнее привлечения новых.",
        "profitFactor": 1.3,
        "successThreshold": 70,
        "icon": CodeIcon, // Placeholder
    },
    {
        "id": "vr_arcade",
        "name": "VR-аркада",
        "description": "Развлекательный центр с играми и опытом в виртуальной реальности. Высокие начальные затраты на оборудование, зависимость от новизны контента.",
        "risk": 4,
        "potentialProfit": "medium",
        "intuitionHint": "Предлагайте уникальный опыт, который нельзя получить дома. Регулярно обновляйте игры.",
        "profitFactor": 0.6,
        "successThreshold": 65,
        "icon": SportsEsportsIcon, // Placeholder
    },
    {
        "id": "personal_chef_service",
        "name": "Услуги личного повара",
        "description": "Приготовление еды на дому для занятых людей или особых случаев. Требует кулинарного таланта и умения работать с клиентами.",
        "risk": 2,
        "potentialProfit": "medium",
        "intuitionHint": "Специализация на определенной кухне или диете может выделить вас.",
        "profitFactor": 0.55,
        "successThreshold": 50,
        "icon": FastfoodIcon, // Placeholder
    },
    {
        "id": "handmade_jewelry",
        "name": "Создание украшений ручной работы",
        "description": "Продажа уникальных ювелирных изделий через онлайн-платформы или ярмарки. Требует творческого подхода и навыков.",
        "risk": 3,
        "potentialProfit": "low",
        "intuitionHint": "Качественные фотографии и история бренда помогут продажам.",
        "profitFactor": 0.3,
        "successThreshold": 45,
        "icon": DiamondIcon, // Placeholder
    },
    {
        "id": "marketing_agency",
        "name": "Маркетинговое агентство",
        "description": "Предоставление услуг по продвижению брендов (SEO, SMM, контент). Высокая конкуренция, требует постоянного обучения.",
        "risk": 3,
        "potentialProfit": "medium",
        "intuitionHint": "Специализация на нише или конкретном инструменте может быть преимуществом.",
        "profitFactor": 0.65,
        "successThreshold": 60,
        "icon": DesignServicesIcon, // Placeholder
    },
    {
        "id": "language_school",
        "name": "Языковая школа (онлайн/офлайн)",
        "description": "Обучение иностранным языкам. Спрос стабилен, но требует квалифицированных преподавателей и методик.",
        "risk": 2,
        "potentialProfit": "medium",
        "intuitionHint": "Интерактивные методики и фокус на разговорной практике привлекают студентов.",
        "profitFactor": 0.4,
        "successThreshold": 58,
        "icon": SchoolIcon, // Placeholder
    },
    {
        "id": "food_truck",
        "name": "Фуд-трак",
        "description": "Мобильная точка продажи уличной еды. Гибкость в выборе локации, но зависимость от погоды и разрешений.",
        "risk": 3,
        "potentialProfit": "medium",
        "intuitionHint": "Уникальная концепция и активное использование соцсетей для анонсов локаций.",
        "profitFactor": 0.55,
        "successThreshold": 62,
        "icon": FastfoodIcon, // Placeholder
    },
    {
        "id": "escape_room",
        "name": "Квест-комната (Escape Room)",
        "description": "Тематическое развлечение, где игрокам нужно решать головоломки. Требует креативности и инвестиций в декорации.",
        "risk": 3,
        "potentialProfit": "medium",
        "intuitionHint": "Захватывающий сюжет и качественные загадки — залог успеха.",
        "profitFactor": 0.6,
        "successThreshold": 63,
        "icon": VpnKeyIcon, // Placeholder
    },
    {
        "id": "custom_software_dev",
        "name": "Разработка ПО на заказ",
        "description": "Создание уникальных программных решений для корпоративных клиентов. Требует высокой квалификации и управления проектами.",
        "risk": 4,
        "potentialProfit": "high",
        "intuitionHint": "Глубокое понимание бизнес-процессов клиента — ключ к успешному проекту.",
        "profitFactor": 1.1,
        "successThreshold": 72,
        "icon": CodeIcon, // Placeholder
    },
    {
        "id": "pet_sitting_walking",
        "name": "Услуги по уходу за животными",
        "description": "Выгул собак, присмотр за питомцами во время отсутствия хозяев. Растущий рынок, требует любви к животным и ответственности.",
        "risk": 1,
        "potentialProfit": "low",
        "intuitionHint": "Доверие и хорошие отзывы — ваша главная реклама.",
        "profitFactor": 0.25,
        "successThreshold": 35,
        "icon": PetsIcon, // Placeholder
    },
    {
        "id": "freelance_writing_editing",
        "name": "Фриланс: написание и редактура текстов",
        "description": "Создание контента для веб-сайтов, блогов, маркетинговых материалов. Гибкий график, но нестабильный доход.",
        "risk": 2,
        "potentialProfit": "low",
        "intuitionHint": "Портфолио и специализация на определенных темах помогут найти клиентов.",
        "profitFactor": 0.3,
        "successThreshold": 40,
        "icon": BookIcon, // Placeholder
    },
    {
        "id": "ai_consulting",
        "name": "Консалтинг по внедрению ИИ",
        "description": "Помощь компаниям в интеграции искусственного интеллекта в их процессы. Требует глубоких знаний и опыта.",
        "risk": 5,
        "potentialProfit": "high",
        "intuitionHint": "Фокусируйтесь на реальной бизнес-ценности, а не на хайпе.",
        "profitFactor": 1.4,
        "successThreshold": 80,
        "icon": SmartToyIcon, // Placeholder
    },
    {
        "id": "vintage_clothing_store",
        "name": "Магазин винтажной одежды",
        "description": "Продажа уникальной одежды из прошлого. Требует хорошего вкуса и умения находить редкие вещи.",
        "risk": 3,
        "potentialProfit": "medium",
        "intuitionHint": "Курируйте коллекции и создавайте атмосферу. Каждая вещь должна иметь историю.",
        "profitFactor": 0.45,
        "successThreshold": 55,
        "icon": StorefrontIcon, // Placeholder
    },
    {
        "id": "podcast_production",
        "name": "Студия производства подкастов",
        "description": "Помощь в создании, записи и продвижении подкастов. Растущий рынок, требует технических навыков и креативности.",
        "risk": 2,
        "potentialProfit": "medium",
        "intuitionHint": "Качество звука и интересный контент — основа успеха.",
        "profitFactor": 0.4,
        "successThreshold": 52,
        "icon": MicIcon, // Placeholder
    },
    {
        "id": "board_game_cafe",
        "name": "Кафе с настольными играми",
        "description": "Место, где можно поесть и поиграть в настольные игры. Требует большой коллекции игр и уютной атмосферы.",
        "risk": 3,
        "potentialProfit": "medium",
        "intuitionHint": "Регулярные игровые вечера и турниры привлекут постоянных клиентов.",
        "profitFactor": 0.5,
        "successThreshold": 60,
        "icon": CasinoIcon, // Placeholder
    },
    {
        "id": "3d_printing_service",
        "name": "Услуги 3D-печати",
        "description": "Создание прототипов, кастомных деталей или сувениров на 3D-принтере. Требует оборудования и навыков моделирования.",
        "risk": 3,
        "potentialProfit": "medium",
        "intuitionHint": "Специализация на определенных материалах или типах объектов может быть выгодной.",
        "profitFactor": 0.55,
        "successThreshold": 57,
        "icon": BuildIcon, // Placeholder
    },
    {
        "id": "event_planning_agency",
        "name": "Агентство по организации мероприятий",
        "description": "Планирование и проведение свадеб, корпоративов, фестивалей. Требует организаторских способностей и стрессоустойчивости.",
        "risk": 4,
        "potentialProfit": "medium",
        "intuitionHint": "Внимание к деталям и надежная сеть подрядчиков — залог успеха.",
        "profitFactor": 0.6,
        "successThreshold": 68,
        "icon": EventIcon, // Placeholder
    },
    {
        "id": "cybersecurity_consulting",
        "name": "Консалтинг по кибербезопасности",
        "description": "Защита компаний от киберугроз. Высокий спрос, требует глубоких технических знаний и постоянного обновления информации.",
        "risk": 4,
        "potentialProfit": "high",
        "intuitionHint": "Проактивный подход и обучение персонала клиента так же важны, как и технические решения.",
        "profitFactor": 1.25,
        "successThreshold": 78,
        "icon": SecurityIcon, // Placeholder
    },
    {
        "id": "niche_subscription_box",
        "name": "Тематическая подписная коробка",
        "description": "Ежемесячная доставка набора товаров по определенной тематике (косметика, книги, еда). Требует хорошего подбора товаров и логистики.",
        "risk": 3,
        "potentialProfit": "medium",
        "intuitionHint": "Эффект сюрприза и эксклюзивность товаров удерживают подписчиков.",
        "profitFactor": 0.45,
        "successThreshold": 59,
        "icon": CardGiftcardIcon, // Placeholder
    },
    {
        "id": "mobile_car_wash",
        "name": "Мобильная автомойка",
        "description": "Мойка автомобилей с выездом к клиенту. Удобство для клиентов, но требует оборудования и разрешений.",
        "risk": 2,
        "potentialProfit": "low",
        "intuitionHint": "Экологичные моющие средства и дополнительные услуги (полировка, химчистка) могут привлечь клиентов.",
        "profitFactor": 0.35,
        "successThreshold": 48,
        "icon": LocalLaundryServiceIcon, // Placeholder
    },
    {
        "id": "travel_blogging_vlogging",
        "name": "Тревел-блоггинг/влоггинг",
        "description": "Создание контента о путешествиях. Требует страсти к путешествиям, навыков съемки и монтажа. Монетизация через рекламу, спонсорство.",
        "risk": 4,
        "potentialProfit": "medium",
        "intuitionHint": "Уникальный стиль и регулярность публикаций помогут набрать аудиторию.",
        "profitFactor": 0.5, // Может быть высоким, но нестабильно
        "successThreshold": 65,
        "icon": FlightTakeoffIcon, // Placeholder
    },
    {
        "id": "personal_fitness_trainer",
        "name": "Персональный фитнес-тренер",
        "description": "Разработка индивидуальных программ тренировок и питания. Требует знаний в области фитнеса и анатомии.",
        "risk": 2,
        "potentialProfit": "medium",
        "intuitionHint": "Специализация (например, реабилитация, работа с беременными) может повысить спрос.",
        "profitFactor": 0.5,
        "successThreshold": 50,
        "icon": FitnessCenterIcon, // Placeholder
    },
    {
        "id": "real_estate_photography",
        "name": "Фотосъемка недвижимости",
        "description": "Создание качественных фотографий и видео объектов недвижимости для продажи или аренды. Требует фотооборудования и навыков.",
        "risk": 2,
        "potentialProfit": "medium",
        "intuitionHint": "Дрон-съемка и виртуальные туры — востребованные услуги.",
        "profitFactor": 0.45,
        "successThreshold": 53,
        "icon": CameraAltIcon, // Placeholder
    },
    {
        "id": "interior_design_studio",
        "name": "Студия дизайна интерьеров",
        "description": "Разработка дизайн-проектов для жилых и коммерческих помещений. Требует творческого видения и знаний в области материалов.",
        "risk": 3,
        "potentialProfit": "medium",
        "intuitionHint": "Портфолио и умение слышать клиента — ключ к успеху.",
        "profitFactor": 0.6,
        "successThreshold": 64,
        "icon": PaletteIcon, // Placeholder
    },
    {
        "id": "specialty_bakery",
        "name": "Специализированная пекарня (глютен-фри, веган)",
        "description": "Выпечка для людей с особыми диетическими потребностями. Растущий спрос, но требует знаний и сертификации.",
        "risk": 3,
        "potentialProfit": "medium",
        "intuitionHint": "Качество и вкус не должны уступать традиционной выпечке.",
        "profitFactor": 0.55,
        "successThreshold": 61,
        "icon": BakeryDiningIcon, // Placeholder
    },
    {
        "id": "translation_services",
        "name": "Бюро переводов",
        "description": "Письменные и устные переводы. Требует команды квалифицированных переводчиков и редакторов.",
        "risk": 2,
        "potentialProfit": "medium",
        "intuitionHint": "Специализация на редких языках или технических текстах может быть выгодной.",
        "profitFactor": 0.4,
        "successThreshold": 56,
        "icon": TranslateIcon, // Placeholder
    },
    {
        "id": "bicycle_repair_shop",
        "name": "Мастерская по ремонту велосипедов",
        "description": "Обслуживание и ремонт велосипедов. Сезонный спрос, требует технических навыков.",
        "risk": 2,
        "potentialProfit": "low",
        "intuitionHint": "Продажа аксессуаров и кастомизация могут увеличить доход.",
        "profitFactor": 0.3,
        "successThreshold": 47,
        "icon": TwoWheelerIcon, // Placeholder
    },
    {
        "id": "online_tutoring_platform",
        "name": "Платформа для онлайн-репетиторства",
        "description": "Соединяет учеников и репетиторов. Требует разработки платформы и привлечения пользователей с обеих сторон.",
        "risk": 4,
        "potentialProfit": "high",
        "intuitionHint": "Удобный интерфейс и система рейтингов важны для доверия.",
        "profitFactor": 0.9,
        "successThreshold": 70,
        "icon": SchoolIcon, // Placeholder
    },
    {
        "id": "handyman_services",
        "name": "Услуги 'Муж на час'",
        "description": "Мелкий бытовой ремонт. Стабильный спрос, требует разносторонних навыков.",
        "risk": 1,
        "potentialProfit": "low",
        "intuitionHint": "Пунктуальность и аккуратность — залог повторных обращений.",
        "profitFactor": 0.28,
        "successThreshold": 38,
        "icon": HandymanIcon, // Placeholder
    },
    {
        "id": "music_production_studio",
        "name": "Студия звукозаписи и музыкального продакшена",
        "description": "Запись вокала, инструментов, сведение и мастеринг. Требует дорогого оборудования и опыта.",
        "risk": 4,
        "potentialProfit": "medium",
        "intuitionHint": "Хорошая акустика помещения и качественное оборудование решают.",
        "profitFactor": 0.65,
        "successThreshold": 66,
        "icon": MusicNoteIcon, // Placeholder
    },
    {
        "id": "florist_shop_delivery",
        "name": "Цветочный магазин с доставкой",
        "description": "Продажа свежих цветов и букетов. Требует навыков флористики и логистики.",
        "risk": 2,
        "potentialProfit": "medium",
        "intuitionHint": "Креативные букеты и быстрая доставка в праздники принесут прибыль.",
        "profitFactor": 0.4,
        "successThreshold": 54,
        "icon": LocalFloristIcon, // Placeholder
    },
    {
        "id": "home_cleaning_service",
        "name": "Клининговые услуги на дому",
        "description": "Уборка квартир и домов. Стабильный спрос, требует надежного персонала.",
        "risk": 2,
        "potentialProfit": "low",
        "intuitionHint": "Использование эко-средств и предложение доп. услуг (мытье окон) может быть плюсом.",
        "profitFactor": 0.33,
        "successThreshold": 46,
        "icon": CleaningServicesIcon, // Placeholder
    },
    {
        "id": "wellness_retreat_center",
        "name": "Центр оздоровительных ретритов",
        "description": "Организация выездных программ (йога, медитация, детокс). Требует хорошей локации и команды специалистов.",
        "risk": 4,
        "potentialProfit": "high",
        "intuitionHint": "Уникальная программа и атмосфера полного расслабления привлекут клиентов.",
        "profitFactor": 0.8,
        "successThreshold": 73,
        "icon": SpaIcon, // Placeholder
    },
    {
        "id": "scientific_research_consulting",
        "name": "Консалтинг в области научных исследований",
        "description": "Помощь компаниям в проведении исследований, анализе данных. Требует высокой научной квалификации.",
        "risk": 5,
        "potentialProfit": "high",
        "intuitionHint": "Специализация в передовой области (биотех, ИИ) может быть очень прибыльной.",
        "profitFactor": 1.35,
        "successThreshold": 82,
        "icon": ScienceIcon, // Placeholder
    },
    {
        "id": "esports_team_management",
        "name": "Управление киберспортивной командой",
        "description": "Создание и менеджмент профессиональной команды игроков. Требует инвестиций, знаний индустрии и поиска талантов.",
        "risk": 5,
        "potentialProfit": "high", // Зависит от успехов команды
        "intuitionHint": "Сильный тренерский состав и спонсорские контракты — ключ к успеху.",
        "profitFactor": 1.0,
        "successThreshold": 77,
        "icon": SportsEsportsIcon, // Placeholder
    },
    {
        "id": "local_history_museum_private",
        "name": "Частный музей местной истории",
        "description": "Создание и управление музеем, посвященным истории региона. Требует коллекции экспонатов и энтузиазма.",
        "risk": 3,
        "potentialProfit": "low",
        "intuitionHint": "Интерактивные экспозиции и сотрудничество со школами привлекут посетителей.",
        "profitFactor": 0.2,
        "successThreshold": 44,
        "icon": MuseumIcon, // Placeholder
    },
    {
        "id": "adventure_tourism_company",
        "name": "Компания по организации экстремального туризма",
        "description": "Походы, рафтинг, альпинизм. Требует опытных инструкторов и мер безопасности.",
        "risk": 4,
        "potentialProfit": "medium",
        "intuitionHint": "Уникальные маршруты и высокий уровень безопасности — ваши главные активы.",
        "profitFactor": 0.7,
        "successThreshold": 69,
        "icon": ParkIcon, // Placeholder
    },
    {
        "id": "renewable_energy_installation",
        "name": "Установка систем возобновляемой энергии",
        "description": "Монтаж солнечных панелей, ветрогенераторов. Растущий рынок, требует технических знаний и лицензий.",
        "risk": 3,
        "potentialProfit": "high",
        "intuitionHint": "Государственные субсидии и рост тарифов на энергию стимулируют спрос.",
        "profitFactor": 0.85,
        "successThreshold": 67,
        "icon": SolarPowerIcon, // Placeholder
    },
    {
        "id": "water_purification_systems",
        "name": "Продажа и установка систем очистки воды",
        "description": "Обеспечение чистой питьевой водой для домов и офисов. Стабильный спрос, особенно в регионах с плохой водой.",
        "risk": 2,
        "potentialProfit": "medium",
        "intuitionHint": "Качественное оборудование и сервисное обслуживание обеспечат лояльность клиентов.",
        "profitFactor": 0.45,
        "successThreshold": 51,
        "icon": WaterDropIcon, // Placeholder
    },
    {
        "id": "sustainable_forestry_products",
        "name": "Производство изделий из устойчивой древесины",
        "description": "Мебель, стройматериалы из сертифицированной древесины. Требует ответственного подхода к закупкам.",
        "risk": 3,
        "potentialProfit": "medium",
        "intuitionHint": "Экологическая маркировка и уникальный дизайн привлекут покупателей.",
        "profitFactor": 0.5,
        "successThreshold": 59,
        "icon": ForestIcon, // Placeholder
    },
    {
        "id": "construction_company_small",
        "name": "Малая строительная фирма (ремонт, отделка)",
        "description": "Ремонт квартир, офисов, отделочные работы. Высокая конкуренция, требует квалифицированных рабочих.",
        "risk": 3,
        "potentialProfit": "medium",
        "intuitionHint": "Качество, сроки и прозрачная смета — залог хорошей репутации.",
        "profitFactor": 0.55,
        "successThreshold": 60,
        "icon": ConstructionIcon, // Placeholder
    },
    {
        "id": "luxury_concierge_service",
        "name": "Люксовые консьерж-услуги",
        "description": "Организация эксклюзивных услуг для состоятельных клиентов. Требует связей и безупречного сервиса.",
        "risk": 4,
        "potentialProfit": "high",
        "intuitionHint": "Конфиденциальность и способность достать невозможное — ваш ключ к успеху.",
        "profitFactor": 1.1,
        "successThreshold": 76,
        "icon": DiamondIcon, // Placeholder
    },
    {
        "id": "rare_book_dealer",
        "name": "Торговец редкими книгами",
        "description": "Поиск и продажа антикварных и редких изданий. Требует знаний, терпения и капитала.",
        "risk": 3,
        "potentialProfit": "medium", // Может быть высоким при удачных находках
        "intuitionHint": "Сеть контактов среди коллекционеров и экспертов бесценна.",
        "profitFactor": 0.7,
        "successThreshold": 65,
        "icon": AutoStoriesIcon, // Placeholder
    }
];

const INITIAL_CAPITAL = 5000;
const GOAL_CAPITAL = 20000;
const STARTING_TURNS = 10;
const INTUITION_MODIFIER = 10;
const FAILURE_LOSS_FACTOR = 0.8;

const theme = createTheme();

const formatCurrency = (amount, currencySymbol = '€') => {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

const floatingSymbols = [
    { top: '20px', left: '30px', symbol: '€', color: '#ffc107', delay: 0, size: 70 },
    { top: '120px', right: '50px', symbol: '$', color: '#4caf50', delay: 1, size: 90 },
    { bottom: '100px', left: '100px', symbol: '₿', color: '#f57c00', delay: 2, size: 60 },
    { bottom: '180px', right: '150px', symbol: '€', color: '#1976d2', delay: 1.5, size: 80 },
    { top: '250px', left: '200px', symbol: '$', color: '#388e3c', delay: 0.7, size: 100 },
    { top: '80px', right: '200px', symbol: '₿', color: '#e65100', delay: 2.5, size: 75 },
    { bottom: '30px', right: '30px', symbol: '€', color: '#0288d1', delay: 3, size: 65 },
    { top: '300px', left: '50px', symbol: '$', color: '#2e7d32', delay: 0.3, size: 85 },
];

const BusinessGamePage = () => {
    const [currentCapital, setCurrentCapital] = useState(INITIAL_CAPITAL);
    const [turnsLeft, setTurnsLeft] = useState(STARTING_TURNS);
    const [winStreak, setWinStreak] = useState(0);
    const [highestWinStreak, setHighestWinStreak] = useState(0);
    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [gamesWon, setGamesWon] = useState(0);
    const [gamePhase, setGamePhase] = useState('playing');
    const [capitalHistory, setCapitalHistory] = useState([{ turn: 0, capital: INITIAL_CAPITAL }]);
    const [selectedProjectId, setSelectedProjectId] = useState(projectsData[0].id);
    const [investmentAmount, setInvestmentAmount] = useState(500);
    const [gameResult, setGameResult] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showIntuition, setShowIntuition] = useState(false);
    const [rollResult, setRollResult] = useState(null);
    const [rollExplanation, setRollExplanation] = useState('');
    const [capitalFlash, setCapitalFlash] = useState(false);
    const [isRolling, setIsRolling] = useState(false);
    const [displayedRoll, setDisplayedRoll] = useState(null);
    const [guideStep, setGuideStep] = useState(0);
    const [guideOpen, setGuideOpen] = useState(false);

    const capitalDisplayRef = useRef(null);
    const progressBarRef = useRef(null);
    const chartRef = useRef(null);
    const projectSelectRef = useRef(null);
    const investmentInputRef = useRef(null);
    const intuitionSwitchRef = useRef(null);
    const investButtonRef = useRef(null);

    const selectedProject = useMemo(() => {
        return projectsData.find(p => p.id === selectedProjectId);
    }, [selectedProjectId]);

    const resetGame = useCallback(() => {
        setCurrentCapital(INITIAL_CAPITAL);
        setTurnsLeft(STARTING_TURNS);
        setWinStreak(0);
        setGameResult(null);
        setSelectedProjectId(projectsData[0].id);
        setInvestmentAmount(500);
        setGamePhase('playing');
        setSnackbarOpen(false);
        setRollResult(null);
        setRollExplanation('');
        setGamesPlayed(0);
        setGamesWon(0);
        setHighestWinStreak(0);
        setCapitalHistory([{ turn: 0, capital: INITIAL_CAPITAL }]);
        setIsRolling(false);
    }, []);

    const handleInvest = () => {
        if (gamePhase !== 'playing') {
            setSnackbarMessage('Игра завершена. Начните новую игру.');
            setSnackbarOpen(true);
            return;
        }
        if (!selectedProject || investmentAmount <= 0 || investmentAmount > currentCapital) {
            setSnackbarMessage(
                !selectedProject
                    ? 'Пожалуйста, выберите проект для инвестирования.'
                    : investmentAmount <= 0
                        ? 'Сумма инвестиции должна быть больше нуля.'
                        : 'Недостаточно средств для этой инвестиции!'
            );
            setSnackbarOpen(true);
            return;
        }

        setIsRolling(true);
        setDisplayedRoll(Math.floor(Math.random() * 100) + 1);

        const animationInterval = setInterval(() => {
            setDisplayedRoll(Math.floor(Math.random() * 100) + 1);
        }, 50);

        setTimeout(() => {
            clearInterval(animationInterval);
            setGamesPlayed(prev => prev + 1);
            const newTurnsLeft = turnsLeft - 1;
            setTurnsLeft(newTurnsLeft);

            let explanation = [];
            let baseRoll = Math.floor(Math.random() * 100) + 1;
            explanation.push(`Вы бросили кубик: ${baseRoll}.`);

            let finalRoll = baseRoll;
            let riskModifier = 0;
            switch (selectedProject.risk) {
                case 1: riskModifier = 10; explanation.push(`(${selectedProject.name} имеет низкий риск: +${riskModifier} к броску).`); break;
                case 2: riskModifier = 5; explanation.push(`(${selectedProject.name} имеет умеренный риск: +${riskModifier} к броску).`); break;
                case 3: riskModifier = 0; explanation.push(`(${selectedProject.name} имеет средний риск: без изменений).`); break;
                case 4: riskModifier = -5; explanation.push(`(${selectedProject.name} имеет высокий риск: ${riskModifier} к броску).`); break;
                case 5: riskModifier = -15; explanation.push(`(${selectedProject.name} имеет очень высокий риск: ${riskModifier} к броску).`); break;
                default: break;
            }
            finalRoll += riskModifier;

            const intuitionBonus = showIntuition ? INTUITION_MODIFIER : 0;
            if (intuitionBonus > 0) {
                finalRoll += intuitionBonus;
                explanation.push(`(Интуиция активирована: +${intuitionBonus} к броску).`);
                setSnackbarMessage('Интуиция активирована: Ваши шансы немного увеличились!');
                setSnackbarOpen(true);
            }

            finalRoll = Math.max(1, Math.min(100, finalRoll));
            explanation.push(`Финальный результат броска: ${finalRoll}.`);

            const success = finalRoll >= selectedProject.successThreshold;
            let profitLossAmount = success
                ? investmentAmount * selectedProject.profitFactor
                : -investmentAmount * FAILURE_LOSS_FACTOR;
            const newCapital = currentCapital + profitLossAmount;

            setDisplayedRoll(finalRoll);
            setRollResult(finalRoll);
            setRollExplanation(explanation.join(' '));
            setCurrentCapital(newCapital);
            setGameResult({ success, profit: profitLossAmount });
            setWinStreak(prev => success ? prev + 1 : 0);
            setGamesWon(prev => success ? prev + 1 : prev);
            setHighestWinStreak(prev => Math.max(prev, success ? winStreak + 1 : winStreak));
            setCapitalHistory(prev => [...prev, { turn: prev.length, capital: newCapital }]);
            setCapitalFlash(true);
            setTimeout(() => setCapitalFlash(false), 500);
            setIsRolling(false);
        }, 1500);
    };

    useEffect(() => {
        if (gamePhase === 'playing') {
            if (currentCapital >= GOAL_CAPITAL) {
                setGamePhase('won');
                setSnackbarMessage(`Поздравляем! Вы достигли цели в ${formatCurrency(GOAL_CAPITAL)}!`);
                setSnackbarOpen(true);
            } else if (currentCapital <= 0 || turnsLeft <= 0) {
                setGamePhase('lost');
                setSnackbarMessage(`Игра окончена! Вы либо обанкротились, либо у вас закончились ходы.`);
                setSnackbarOpen(true);
            }
        }
    }, [currentCapital, turnsLeft, gamePhase]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const progress = Math.min(100, (currentCapital / GOAL_CAPITAL) * 100);

    const chartData = {
        labels: capitalHistory.map(entry => `Ход ${entry.turn}`),
        datasets: [
            {
                label: 'Ваш Капитал',
                data: capitalHistory.map(entry => entry.capital),
                fill: false,
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.light,
                tension: 0.1,
                pointRadius: 5,
                pointBackgroundColor: theme.palette.primary.dark,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Динамика Капитала' },
        },
        scales: {
            x: { title: { display: true, text: 'Ход Игры' }, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
            y: { title: { display: true, text: 'Капитал (€)' }, beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
        },
    };

    const guideSteps = useMemo(() => [
        { target: capitalDisplayRef, content: 'Это ваш текущий капитал. Ваша цель — достичь 20 000 €.' },
        { target: progressBarRef, content: 'Прогресс-бар показывает, как близко вы к цели.' },
        { target: chartRef, content: 'График отображает изменение вашего капитала с каждым ходом.' },
        { target: projectSelectRef, content: 'Выберите проект, в который хотите инвестировать.' },
        { target: investmentInputRef, content: 'Введите сумму инвестиции. Убедитесь, что она не превышает ваш капитал.' },
        { target: intuitionSwitchRef, content: 'Активируйте интуицию для получения подсказок и бонуса к броску.' },
        { target: investButtonRef, content: 'Нажмите, чтобы сделать инвестицию и бросить кубик.' },
    ], [
        capitalDisplayRef,
        progressBarRef,
        chartRef,
        projectSelectRef,
        investmentInputRef,
        intuitionSwitchRef,
        investButtonRef,
    ]);

    useEffect(() => {
        if (guideOpen && guideSteps[guideStep]?.target?.current) {
            guideSteps[guideStep].target.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
    }, [guideStep, guideOpen, guideSteps]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {floatingSymbols.map(({ top, left, right, bottom, symbol, color, delay, size }, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.25 }}
                    transition={{ duration: 2, delay }}
                    style={{
                        position: 'absolute',
                        top,
                        left,
                        right,
                        bottom,
                        zIndex: 0,
                        pointerEvents: 'none',
                    }}
                >
                    <svg width={size} height={size} viewBox="0 0 100 100">
                        <g>
                            <circle cx="50" cy="50" r="40" fill={color} stroke="#ffffffaa" strokeWidth="4" />
                            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="32" fill="#fff">{symbol}</text>
                            <animateTransform
                                attributeName="transform"
                                attributeType="XML"
                                type="rotate"
                                from="0 50 50"
                                to="360 50 50"
                                dur={`${18 + i * 2}s`}
                                repeatCount="indefinite"
                            />
                        </g>
                    </svg>
                </motion.div>
            ))}

            <Box sx={{ flexGrow: 1, p: 3, maxWidth: 1200, mx: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                        <BusinessCenterIcon sx={{ mr: 1, fontSize: 40 }} /> Игра в риск: Оцени проект
                    </Typography>
                    <Button variant="outlined" onClick={() => { setGuideStep(0); setGuideOpen(true); }}>Как играть</Button>
                </Box>

                <Card elevation={2} sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Ваш Капитал:{' '}
                            <Box
                                ref={capitalDisplayRef}
                                component="span"
                                fontWeight="bold"
                                sx={{
                                    transition: 'color 0.3s ease-in-out, transform 0.3s ease-in-out',
                                    color: currentCapital <= 0 ? 'error.main' : 'primary.main',
                                    transform: capitalFlash ? 'scale(1.05)' : 'scale(1)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '1.5rem',
                                }}
                            >
                                <AttachMoneyIcon sx={{ fontSize: 28 }} />
                                {formatCurrency(currentCapital)}
                            </Box>
                        </Typography>
                        <LinearProgress
                            ref={progressBarRef}
                            variant="determinate"
                            value={progress}
                            sx={{ height: 15, borderRadius: 5, mb: 1 }}
                            color={currentCapital >= GOAL_CAPITAL ? 'success' : currentCapital < INITIAL_CAPITAL / 2 ? 'warning' : 'primary'}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Цель: {formatCurrency(GOAL_CAPITAL)} | Ходов осталось: {turnsLeft}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <EmojiEventsIcon sx={{ mr: 0.5, fontSize: 24 }} color="warning" />
                                    Серия побед: <Box component="span" fontWeight="bold" sx={{ ml: 0.5 }}>{winStreak}</Box>
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <EmojiEventsIcon sx={{ mr: 0.5, fontSize: 24 }} color="info" />
                                    Лучшая серия: <Box component="span" fontWeight="bold" sx={{ ml: 0.5 }}>{highestWinStreak}</Box>
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2">Игр сыграно: {gamesPlayed}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2">Игр выиграно: {gamesWon}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {gamePhase !== 'playing' && (
                    <Alert
                        severity={gamePhase === 'won' ? 'success' : 'error'}
                        sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                            {gamePhase === 'won' ? 'ПОБЕДА В ИГРЕ!' : 'ИГРА ОКОНЧЕНА!'}
                        </Typography>
                        <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
                            {gamePhase === 'won'
                                ? `Вы успешно достигли цели и заработали ${formatCurrency(currentCapital)}!`
                                : `Ваш капитал: ${formatCurrency(currentCapital)}. Попробуйте снова!`}
                        </Typography>
                        <Button
                            variant="contained"
                            color={gamePhase === 'won' ? 'success' : 'error'}
                            startIcon={<RestartAltIcon />}
                            onClick={resetGame}
                        >
                            Начать новую игру
                        </Button>
                    </Alert>
                )}

                <Card elevation={2} sx={{ mb: 4 }}>
                    <CardContent>
                        <Box ref={chartRef} sx={{ height: 400 }}>
                            <Line data={chartData} options={chartOptions} />
                        </Box>
                    </CardContent>
                </Card>

                <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid item xs={12}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Выберите проект для инвестирования
                                </Typography>
                                <FormControl fullWidth sx={{ mb: 2 }} disabled={gamePhase !== 'playing'}>
                                    <InputLabel id="project-select-label">Проект</InputLabel>
                                    <Select
                                        ref={projectSelectRef}
                                        labelId="project-select-label"
                                        value={selectedProjectId}
                                        label="Проект"
                                        onChange={(e) => {
                                            setSelectedProjectId(e.target.value);
                                            setGameResult(null);
                                            setRollResult(null);
                                            setRollExplanation('');
                                        }}
                                        sx={{ fontSize: '1.2rem' }}
                                    >
                                        {projectsData.map((project) => (
                                            <MenuItem key={project.id} value={project.id}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <project.icon sx={{ fontSize: 24 }} />
                                                    {project.name}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {selectedProject && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">{selectedProject.name}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {selectedProject.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }} mb={1}>
                                            <GppBadIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">
                                                Риск: {selectedProject.risk} / 5
                                                <Tooltip title={`Высокий риск (${selectedProject.risk}/5) уменьшает ваш бросок кубика.`} arrow>
                                                    <InfoOutlinedIcon sx={{ ml: 0.5, fontSize: 16 }} />
                                                </Tooltip>
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">
                                                Потенциальная прибыль: {selectedProject.potentialProfit.charAt(0).toUpperCase() + selectedProject.potentialProfit.slice(1)}
                                                <Tooltip title={`Потенциальная прибыль: ${selectedProject.potentialProfit === 'low' ? 'Низкая (прибыль в 20%)' : selectedProject.potentialProfit === 'medium' ? 'Средняя (прибыль в 50%)' : 'Высокая (прибыль в 120%)'} от инвестиции.`} arrow>
                                                    <InfoOutlinedIcon sx={{ ml: 0.5, fontSize: 16 }} />
                                                </Tooltip>
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }} mt={1}>
                                            <CasinoIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">
                                                Порог успеха (бросок): {selectedProject.successThreshold} или выше
                                                <Tooltip title={`Для успеха вам нужно, чтобы финальный бросок кубика был равен или выше ${selectedProject.successThreshold}.`} arrow>
                                                    <InfoOutlinedIcon sx={{ ml: 0.5, fontSize: 16 }} />
                                                </Tooltip>
                                            </Typography>
                                        </Box>
                                        {showIntuition && selectedProject.intuitionHint && (
                                            <Alert severity="info" sx={{ mt: 2 }}>
                                                <Typography variant="body2" fontWeight="bold">
                                                    Подсказка интуиции:
                                                </Typography>
                                                <Typography variant="body2">{selectedProject.intuitionHint}</Typography>
                                            </Alert>
                                        )}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Ваша инвестиция
                                </Typography>
                                <TextField
                                    ref={investmentInputRef}
                                    fullWidth
                                    label="Сумма инвестиции"
                                    type="number"
                                    value={investmentAmount}
                                    onChange={(e) => setInvestmentAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                                    InputProps={{ startAdornment: <AttachMoneyIcon sx={{ mr: 1, fontSize: 24 }} /> }}
                                    sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: '1.2rem' } }}
                                    disabled={gamePhase !== 'playing'}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            ref={intuitionSwitchRef}
                                            checked={showIntuition}
                                            onChange={(e) => setShowIntuition(e.target.checked)}
                                            name="checkIntuition"
                                            disabled={gamePhase !== 'playing'}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            Активировать Интуицию
                                            <Tooltip title="Получите подсказки о проекте, а также небольшой бонус к броску кубика!" arrow>
                                                <InfoOutlinedIcon sx={{ ml: 0.5, fontSize: 16 }} />
                                            </Tooltip>
                                        </Box>
                                    }
                                    sx={{ mb: 2 }}
                                />
                                <Button
                                    ref={investButtonRef}
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleInvest}
                                    sx={{ py: 2, fontSize: '1.2rem' }}
                                    disabled={gamePhase !== 'playing' || investmentAmount === 0 || investmentAmount > currentCapital}
                                    startIcon={<PlayArrowIcon sx={{ fontSize: 24 }} />}
                                >
                                    Инвестировать
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {(isRolling || gameResult) && (
                        <Grid item xs={12}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Результат
                                    </Typography>
                                    {isRolling ? (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h5" color="text.secondary">
                                                Бросок кубика...
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                <CasinoIcon sx={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }} />
                                                <Typography sx={{ fontSize: '3rem', fontWeight: 'bold', color: 'text.secondary' }}>
                                                    {displayedRoll}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ) : gameResult ? (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h5" color="text.secondary">
                                                Ваш бросок:
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: '3rem',
                                                    fontWeight: 'bold',
                                                    color: gameResult.success ? 'success.main' : 'error.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                }}
                                            >
                                                <CasinoIcon sx={{ fontSize: 'inherit' }} /> {rollResult}
                                            </Typography>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    mt: 1,
                                                    fontWeight: 'bold',
                                                    color: gameResult.profit >= 0 ? 'success.main' : 'error.main',
                                                }}
                                            >
                                                {gameResult.profit >= 0 ? '+' : ''}{formatCurrency(gameResult.profit)}
                                            </Typography>
                                        </Box>
                                    ) : null}
                                    {gameResult && (
                                        <Alert severity={gameResult.success ? 'success' : 'error'}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {gameResult.success ? 'УСПЕХ!' : 'НЕУДАЧА!'}
                                            </Typography>
                                            <Typography variant="body1">
                                                {gameResult.success
                                                    ? `Ваши инвестиции в размере ${formatCurrency(investmentAmount)} принесли прибыль в ${formatCurrency(gameResult.profit)}. Ваш капитал теперь: ${formatCurrency(currentCapital)}.`
                                                    : `Вы потеряли ${formatCurrency(Math.abs(gameResult.profit))}. Ваш капитал теперь: ${formatCurrency(currentCapital)}.`}
                                            </Typography>
                                            <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
                                                **Почему так:** {rollExplanation}
                                            </Typography>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>

                {guideOpen && guideStep < guideSteps.length && (
                    <Popover
                        open={true}
                        anchorEl={guideSteps[guideStep].target.current}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                        onClose={() => setGuideOpen(false)}
                        disableScrollLock
                    >
                        <Box p={2}>
                            <Typography>Шаг {guideStep + 1}: {guideSteps[guideStep].content}</Typography>
                            {guideStep < guideSteps.length - 1 ? (
                                <Button onClick={() => setGuideStep(guideStep + 1)}>Далее</Button>
                            ) : (
                                <Button onClick={() => setGuideOpen(false)}>Закрыть</Button>
                            )}
                            <Button onClick={() => setGuideOpen(false)}>Пропустить</Button>
                        </Box>
                    </Popover>
                )}

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={handleSnackbarClose}
                    message={snackbarMessage}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />

                <style>
                    {`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}
                </style>
            </Box>
        </ThemeProvider>
    );
};

export default BusinessGamePage;