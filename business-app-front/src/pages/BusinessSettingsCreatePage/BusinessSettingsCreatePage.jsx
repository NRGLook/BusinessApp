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

const initialPhysicalSettings = {
    location: "",
    size_sq_meters: "",
    employee_count: "",
    average_salary: "",
    rent_cost: "",
    equipment_maintenance_cost: "",
    tax_rate: 0.15,
    utilities_cost: "",
    marketing_budget: "",
    equipment: "{}"
};

const initialVirtualSettings = {
    electricity_cost: "",
    hardware_cost: "",
    hashrate: "",
    mining_difficulty: "",
    pool_fees: 0.02,
    crypto_price: "",
    risk_multiplier: "",
    initial_capital: "",
    risk_level: 3,
    portfolio: "{}"
};

export default function BusinessSettingsCreatePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [business, setBusiness] = useState(null);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                console.error("Ошибка загрузки:", err);
                setError(err.response?.data?.detail
                    || err.message
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

            setError(formattedError || "Неизвестная ошибка сервера");
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
                    {error.toString()}
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
        <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
            <Typography variant="h4" gutterBottom>
                Настройки {business?.name}
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {business?.business_type === "PHYSICAL" ? (
                        <>
                            {/* Физические настройки */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Местоположение"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Площадь (кв. м)"
                                    name="size_sq_meters"
                                    type="number"
                                    value={form.size_sq_meters}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Количество сотрудников"
                                    name="employee_count"
                                    type="number"
                                    value={form.employee_count}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Средняя зарплата (₽)"
                                    name="average_salary"
                                    type="number"
                                    value={form.average_salary}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Аренда (₽)"
                                    name="rent_cost"
                                    type="number"
                                    value={form.rent_cost}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Обслуживание оборудования (₽)"
                                    name="equipment_maintenance_cost"
                                    type="number"
                                    value={form.equipment_maintenance_cost}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Налоговая ставка"
                                    name="tax_rate"
                                    type="number"
                                    step="0.01"
                                    value={form.tax_rate}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Коммунальные услуги (₽)"
                                    name="utilities_cost"
                                    type="number"
                                    value={form.utilities_cost}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Маркетинговый бюджет (₽)"
                                    name="marketing_budget"
                                    type="number"
                                    value={form.marketing_budget}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Оборудование (JSON)"
                                    name="equipment"
                                    value={form.equipment}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </>
                    ) : (
                        <>
                            {/* Виртуальные настройки */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Стоимость электроэнергии (₽)"
                                    name="electricity_cost"
                                    type="number"
                                    value={form.electricity_cost}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Стоимость оборудования (₽)"
                                    name="hardware_cost"
                                    type="number"
                                    value={form.hardware_cost}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Хешрейт"
                                    name="hashrate"
                                    type="number"
                                    value={form.hashrate}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Сложность майнинга"
                                    name="mining_difficulty"
                                    type="number"
                                    value={form.mining_difficulty}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Комиссия пула (%)"
                                    name="pool_fees"
                                    type="number"
                                    step="0.01"
                                    value={form.pool_fees}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Цена криптовалюты (₽)"
                                    name="crypto_price"
                                    type="number"
                                    value={form.crypto_price}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Множитель риска"
                                    name="risk_multiplier"
                                    type="number"
                                    value={form.risk_multiplier}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Начальный капитал (₽)"
                                    name="initial_capital"
                                    type="number"
                                    value={form.initial_capital}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Уровень риска</InputLabel>
                                    <Select
                                        name="risk_level"
                                        value={form.risk_level}
                                        onChange={handleChange}
                                        label="Уровень риска"
                                        required
                                    >
                                        <MenuItem value={1}>Низкий</MenuItem>
                                        <MenuItem value={2}>Средний</MenuItem>
                                        <MenuItem value={3}>Высокий</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Портфель (JSON)"
                                    name="portfolio"
                                    value={form.portfolio}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </>
                    )}

                    <Grid item xs={12}>
                        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
                                sx={{ width: 200 }}
                            >
                                {isSubmitting ? (
                                    <CircularProgress size={24} />
                                ) : "Сохранить"}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate(-1)}
                            >
                                Отмена
                            </Button>
                        </Box>
                    </Grid>

                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error">
                                {typeof error === 'string' ? error : JSON.stringify(error)}
                            </Alert>
                        </Grid>
                    )}
                </Grid>
            </form>
        </Box>
    );

}