import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import axios from "../../api/axios";
import { motion } from 'framer-motion';
import {Save, Cancel, Settings} from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';

const initialPhysicalSettings = {
    location: "",
    size_sq_meters: "",
    employee_count: "",
    average_salary: "",
    rent_cost: "",
    equipment_maintenance_cost: "",
    tax_rate: 0.1,
    utilities_cost: "",
    marketing_budget: "",
    equipment: "{}"
};

const initialVirtualSettings = {
    electricity_cost: "",
    hardware_cost: "",
    hashrate: "",
    mining_difficulty: "",
    pool_fees: 0.2,
    crypto_price: "",
    risk_multiplier: "",
    initial_capital: "",
    risk_level: 3,
    portfolio: "{}"
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const PhysicalSettingsForm = ({ form, handleChange, itemVariants }) => (
    <>
        {[
            { label: 'Местоположение', name: 'location', type: 'text' },
            { label: 'Площадь (кв. м)', name: 'size_sq_meters', type: 'number' },
            { label: 'Количество сотрудников', name: 'employee_count', type: 'number' },
            { label: 'Средняя зарплата (₽)', name: 'average_salary', type: 'number' },
            { label: 'Аренда (₽)', name: 'rent_cost', type: 'number' },
            { label: 'Обслуживание оборудования (₽)', name: 'equipment_maintenance_cost', type: 'number' },
            { label: 'Налоговая ставка', name: 'tax_rate', type: 'number', step: 0.01 },
            { label: 'Коммунальные услуги (₽)', name: 'utilities_cost', type: 'number' },
            { label: 'Маркетинговый бюджет (₽)', name: 'marketing_budget', type: 'number' },
        ].map((field, index) => (
            <Grid
                item
                xs={12}
                md={6}
                key={field.name}
                component={motion.div}
                variants={itemVariants}
            >
                <TextField
                    {...field}
                    value={form[field.name]}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '& fieldset': { borderWidth: 2 },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                        }
                    }}
                    InputProps={{
                        startAdornment: field.icon && (
                            <InputAdornment position="start">
                                {field.icon}
                            </InputAdornment>
                        )
                    }}
                />
            </Grid>
        ))}

        <Grid item xs={12} component={motion.div} variants={itemVariants}>
            <TextField
                label="Оборудование (JSON)"
                name="equipment"
                value={form.equipment}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                required
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& textarea': { fontFamily: 'monospace' }
                    }
                }}
            />
        </Grid>
    </>
);

const VirtualSettingsForm = ({ form, handleChange, itemVariants }) => (
    <>
        {[
            { label: 'Стоимость электроэнергии (₽)', name: 'electricity_cost', type: 'number' },
            { label: 'Стоимость оборудования (₽)', name: 'hardware_cost', type: 'number' },
            { label: 'Хешрейт', name: 'hashrate', type: 'number' },
            { label: 'Сложность майнинга', name: 'mining_difficulty', type: 'number' },
            { label: 'Комиссия пула (%)', name: 'pool_fees', type: 'number', step: 0.01, inputProps: { min: 0, max: 0.5, step: 0.01 },
                error: parseInt(form.pool_fees)> 0.5,
                helperText: parseInt(form.pool_fees) > 0.5 ? "Значение должно быть меньше либо равно 0.5" : ""},
            { label: 'Цена криптовалюты (₽)', name: 'crypto_price', type: 'number' },
            {
                label: 'Множитель риска',
                name: 'risk_multiplier',
                type: 'number',
                inputProps: { min: 0, max: 2, step: 0.01 },
                error: form.risk_multiplier > 2,
                helperText: form.risk_multiplier > 2 ? "Значение должно быть меньше либо равно 2.0" : ""
            },
            { label: 'Начальный капитал (₽)', name: 'initial_capital', type: 'number' },
        ].map((field) => (
            <Grid
                item
                xs={12}
                md={6}
                key={field.name}
                component={motion.div}
                variants={itemVariants}
            >
                <TextField
                    {...field}
                    value={form[field.name]}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '& fieldset': {
                                borderWidth: 2,
                                borderColor: field.error ? 'error.main' : undefined
                            },
                            '&:hover fieldset': {
                                borderColor: field.error ? 'error.main' : 'primary.main'
                            },
                        }
                    }}
                />
            </Grid>
        ))}

        <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}>
            <FormControl fullWidth>
                <InputLabel>Уровень риска</InputLabel>
                <Select
                    name="risk_level"
                    value={form.risk_level}
                    onChange={handleChange}
                    label="Уровень риска"
                    required
                    sx={{
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': { borderWidth: 2 }
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                borderRadius: 2,
                                mt: 1,
                                boxShadow: 3
                            }
                        }
                    }}
                >
                    <MenuItem value={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <FiberManualRecord fontSize="small" color="success" />
                            Низкий
                        </Box>
                    </MenuItem>
                    <MenuItem value={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <FiberManualRecord fontSize="small" color="warning" />
                            Средний
                        </Box>
                    </MenuItem>
                    <MenuItem value={3}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <FiberManualRecord fontSize="small" color="error" />
                            Высокий
                        </Box>
                    </MenuItem>
                </Select>
            </FormControl>
        </Grid>

        <Grid item xs={12} component={motion.div} variants={itemVariants}>
            <TextField
                label="Портфель (JSON)"
                name="portfolio"
                value={form.portfolio}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                required
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& textarea': { fontFamily: 'monospace' }
                    }
                }}
            />
        </Grid>
    </>
);

export default function BusinessSettingsCreatePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [business, setBusiness] = useState(null);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [hasExistingSettings, setHasExistingSettings] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        if (!business) return;

        const fetchSettings = async () => {
            const type = business.business_type;
            const endpoint =
                type === "PHYSICAL"
                    ? `/business/${id}/physical-settings`
                    : `/business/${id}/virtual-settings`;

            try {
                const response = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const settingsData = response.data;
                setHasExistingSettings(true)
                setForm(prev => ({
                    ...prev,
                    ...(business.business_type === "PHYSICAL" ? {
                        location: settingsData.location || "",
                        size_sq_meters: settingsData.size_sq_meters?.toString() || "",
                        employee_count: settingsData.employee_count?.toString() || "",
                        average_salary: settingsData.average_salary?.toString() || "",
                        rent_cost: settingsData.rent_cost?.toString() || "",
                        equipment_maintenance_cost: settingsData.equipment_maintenance_cost?.toString() || "",
                        tax_rate: settingsData.tax_rate?.toString() || "0.15",
                        utilities_cost: settingsData.utilities_cost?.toString() || "",
                        marketing_budget: settingsData.marketing_budget?.toString() || "",
                        equipment: JSON.stringify(settingsData.equipment || {}, null, 2)
                    } : {
                        electricity_cost: settingsData.electricity_cost?.toString() || "",
                        hardware_cost: settingsData.hardware_cost?.toString() || "",
                        hashrate: settingsData.hashrate?.toString() || "",
                        mining_difficulty: settingsData.mining_difficulty?.toString() || "",
                        pool_fees: settingsData.pool_fees?.toString() || "0.02",
                        crypto_price: settingsData.crypto_price?.toString() || "",
                        risk_multiplier: settingsData.risk_multiplier?.toString() || "",
                        initial_capital: settingsData.initial_capital?.toString() || "",
                        risk_level: settingsData.risk_level ?? 3,
                        portfolio: JSON.stringify(settingsData.portfolio || {}, null, 2)
                    })
                }));
            } catch (err) {
                if(err.status === 404){
                    setHasExistingSettings(false)
                    setForm(
                        business.business_type === "PHYSICAL"
                            ? { ...initialPhysicalSettings }
                            : { ...initialVirtualSettings }
                    );
                }else{
                    console.error("Ошибка при получении настроек:", err);
                    setError("Ошибка загрузки настроек бизнеса");
                }
            } finally {
            }
        };

        fetchSettings();
    }, [business, id]);
    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const response = await axios.get(`/business/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

                if (!response.data || typeof response.data !== 'object') {
                    throw new Error("Неверный формат данных бизнеса");
                }

                const businessData = {
                    id: response.data.id || id,
                    name: response.data.name || "Без названия",
                    business_type: response.data.business_type === "PHYSICAL"
                        ? "PHYSICAL"
                        : "VIRTUAL"
                };

                setBusiness(businessData);
                setForm(
                    businessData.business_type === "PHYSICAL"
                        ? { ...initialPhysicalSettings }
                        : { ...initialVirtualSettings }
                );

            } catch (err) {
                if(err.status === 401){
                    navigate("/auth");
                }
                console.error("Ошибка загрузки:", err);
                setError(JSON.stringify(err.response?.data?.detail ?? 'Error has occurred')
                    || JSON.stringify(err.message ?? 'Error has occurred')
                    || "Не удалось загрузить данные бизнеса");
            } finally {
                setLoading(false);
            }
        };

        fetchBusiness();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: typeof value === 'object' ? JSON.stringify(value) : value
        }));
    };

    const tryParseJSON = (str) => {
        if (typeof str === 'object') return str;
        try {
            return JSON.parse(str);
        } catch {
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            if (!business || !business.business_type) {
                throw new Error("Неверные данные бизнеса");
            }

            const endpoint = business.business_type === "PHYSICAL"
                ? "/business/physical-settings"
                : "/business/virtual-settings";

            const payload = {
                data: [{
                    business_id: id,
                    ...(business.business_type === "PHYSICAL" ? {
                        location: form.location || "",
                        size_sq_meters: Number(form.size_sq_meters) || 0,
                        employee_count: Number(form.employee_count) || 0,
                        average_salary: Number(form.average_salary) || 0,
                        rent_cost: Number(form.rent_cost) || 0,
                        equipment_maintenance_cost: Number(form.equipment_maintenance_cost) || 0,
                        tax_rate: Number(form.tax_rate) || 0.15,
                        utilities_cost: Number(form.utilities_cost) || 0,
                        marketing_budget: Number(form.marketing_budget) || 0,
                        equipment: tryParseJSON(form.equipment) || {}
                    } : {
                        electricity_cost: Number(form.electricity_cost) || 0,
                        hardware_cost: Number(form.hardware_cost) || 0,
                        hashrate: Number(form.hashrate) || 0,
                        mining_difficulty: Number(form.mining_difficulty) || 0,
                        pool_fees: Number(form.pool_fees) || 0.02,
                        crypto_price: Number(form.crypto_price) || 0,
                        risk_multiplier: Number(form.risk_multiplier) || 1,
                        initial_capital: Number(form.initial_capital) || 0,
                        risk_level: Number(form.risk_level) || 3,
                        portfolio: tryParseJSON(form.portfolio) || {}
                    })
                }]
            };

            console.log("Отправляемый payload:", JSON.stringify(payload, null, 2));

            const response = await axios.post(endpoint, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            console.log("Полный ответ сервера:", response.data);

            // Главное исправление - проверка статуса
            if (response.status >= 200 && response.status < 300) {
                navigate(`/business/${id}`);
            } else {
                throw new Error("Ошибка при создании настроек");
            }

        } catch (err) {
            console.error("Ошибка:", err);

            // Если сервер вернул 200, но фронт не обработал
            if (err.response?.status === 200) {
                navigate(`/business/${id}`);
                return;
            }

            const errorDetails = err.response?.data?.detail || err.message;
            const formattedError = Array.isArray(errorDetails)
                ? errorDetails.map(e => `Поле ${e.loc[1]}: ${e.msg}`).join('\n')
                : errorDetails;

            setError(JSON.stringify(formattedError ?? 'Error has occurred') || "Неизвестная ошибка сервера");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px"
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                p: 3,
                maxWidth: 600,
                mx: "auto",
                textAlign: "center"
            }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {JSON.stringify(error)}
                </Alert>
                <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                >
                    Назад
                </Button>
            </Box>
        );
    }

    return (
        <Box
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            sx={{
                p: 4,
                maxWidth: 800,
                mx: "auto",
                bgcolor: 'background.paper',
                borderRadius: 4,
                boxShadow: 3
            }}
        >
            <Typography
                variant="h3"
                gutterBottom
                component={motion.div}
                variants={itemVariants}
                sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <Settings fontSize="large" />
                Настройки {business?.name}
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid
                    container
                    spacing={3}
                    component={motion.div}
                    variants={containerVariants}
                >
                    {business?.business_type === "PHYSICAL" ? (
                        <PhysicalSettingsForm
                            form={form}
                            handleChange={handleChange}
                            itemVariants={itemVariants}
                        />
                    ) : (
                        <VirtualSettingsForm
                            form={form}
                            handleChange={handleChange}
                            itemVariants={itemVariants}
                        />
                    )}

                    {/* Кнопки управления */}
                    <Grid item xs={12} component={motion.div} variants={itemVariants}>
                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                mt: 4,
                                justifyContent: 'flex-end'
                            }}
                        >
                            {!hasExistingSettings && <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={20}/> : <Save/>}
                                sx={{
                                    width: 200,
                                    py: 1.5,
                                    borderRadius: 2,
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                Сохранить
                            </Button>}

                            <Button
                                variant="outlined"
                                onClick={() => navigate(-1)}
                                startIcon={<Cancel />}
                                sx={{
                                    width: 200,
                                    py: 1.5,
                                    borderRadius: 2,
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderWidth: 2
                                    }
                                }}
                            >
                                {hasExistingSettings ? 'Назад' : 'Отмена'}
                            </Button>
                        </Box>
                    </Grid>

                    {error && (
                        <Grid
                            item
                            xs={12}
                            component={motion.div}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            <Alert
                                severity="error"
                                sx={{
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    alignItems: 'center',
                                    fontSize: '1rem'
                                }}
                            >
                                {typeof error === 'string' ? error : JSON.stringify(error)}
                            </Alert>
                        </Grid>
                    )}
                </Grid>
            </form>
        </Box>
    );

}