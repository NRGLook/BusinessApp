import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Alert,
    CircularProgress
} from "@mui/material";
import axios from "../../api/axios";

export default function BusinessCreatePage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        business_type: "PHYSICAL", // или "VIRTUAL"
        initial_investment: "",
        operational_costs: "",
        expected_revenue: "",
        break_even_months: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const userId = localStorage.getItem("user_id");

        const payload = {
            data: [
                {
                    ...form,
                    initial_investment: Number(form.initial_investment),
                    operational_costs: Number(form.operational_costs),
                    expected_revenue: Number(form.expected_revenue),
                    break_even_months: form.break_even_months ? Number(form.break_even_months) : null,
                    owner_id: userId,
                }
            ]
        };

        console.log("📤 Payload:", payload);

        try {
            const response = await axios.post("/business", payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // Проверим, что структура ответа верна
            console.log("✅ Response from server:", response.data);

            if (Array.isArray(response.data) && response.data.length > 0) {
                // Убедимся, что объект с id существует
                const business = response.data[0];
                if (business?.id) {
                    console.log(`🚀 Business created with ID: ${business.id}`);

                    // Навигация на страницу созданного бизнеса
                    navigate(`/business/${business.id}`);
                } else {
                    console.error("❌ No business ID found in the response data");
                    setError("Не удалось получить данные о бизнесе.");
                }
            } else {
                console.error("❌ Response data is not an array or is empty");
                setError("Не удалось получить данные о бизнесе.");
            }
        } catch (err) {
            console.error("❌ Error:", err.response?.data);
            const apiMessage = err.response?.data?.detail || err.response?.data?.message;
            setError(apiMessage || "Ошибка при создании бизнеса");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
            <Typography variant="h4" gutterBottom>
                Создание бизнеса
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Название бизнеса"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />

                <TextField
                    label="Описание"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                />

                <TextField
                    select
                    label="Тип бизнеса"
                    name="business_type"
                    value={form.business_type}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="PHYSICAL">Физический</MenuItem>
                    <MenuItem value="VIRTUAL">Виртуальный</MenuItem>
                </TextField>

                <TextField
                    label="Инвестиции (₽)"
                    name="initial_investment"
                    value={form.initial_investment}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Месячные расходы (₽)"
                    name="operational_costs"
                    value={form.operational_costs}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Ожидаемый доход (₽)"
                    name="expected_revenue"
                    value={form.expected_revenue}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Окупаемость (мес.)"
                    name="break_even_months"
                    value={form.break_even_months}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                />

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Создать"}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/business")}
                    >
                        Отмена
                    </Button>
                </Box>
            </form>
        </Box>
    );
}
