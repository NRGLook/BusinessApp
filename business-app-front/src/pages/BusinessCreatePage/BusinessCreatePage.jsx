import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Alert,
    CircularProgress,
    Fade
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

        try {
            const response = await axios.post("/business", payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (Array.isArray(response.data) && response.data.length > 0) {
                const business = response.data[0];
                if (business?.id) {
                    navigate(`/business/${business.id}`);
                } else {
                    setError("Не удалось получить данные о бизнесе.");
                }
            } else {
                setError("Не удалось получить данные о бизнесе.");
            }
        } catch (err) {
            const apiMessage = err.response?.data?.detail || err.response?.data?.message;
            setError(apiMessage || "Ошибка при создании бизнеса");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            p: 4,
            maxWidth: 600,
            mx: "auto",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: 3,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            {/* A subtle animated background effect */}
            <Fade in={true} timeout={2000}>
                <Typography variant="h4" sx={{
                    marginBottom: 4,
                    fontWeight: 700,
                    textAlign: "center",
                    color: "#333",
                    letterSpacing: "1px"
                }}>
                    Создание бизнеса
                </Typography>
            </Fade>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <TextField
                    label="Название бизнеса"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    helperText="Введите название вашего бизнеса"
                    sx={{
                        marginBottom: 3,
                        "& .MuiInputBase-root": { borderRadius: "8px" },
                        "& .MuiInputLabel-root": { fontSize: "14px" }
                    }}
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
                    helperText="Напишите краткое описание бизнеса"
                    sx={{
                        marginBottom: 3,
                        "& .MuiInputBase-root": { borderRadius: "8px" }
                    }}
                />

                <TextField
                    select
                    label="Тип бизнеса"
                    name="business_type"
                    value={form.business_type}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    helperText="Выберите тип бизнеса"
                    sx={{
                        marginBottom: 3,
                        "& .MuiInputBase-root": { borderRadius: "8px" }
                    }}
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
                    helperText="Введите начальные инвестиции"
                    sx={{
                        marginBottom: 3,
                        "& .MuiInputBase-root": { borderRadius: "8px" }
                    }}
                />

                <TextField
                    label="Месячные расходы (₽)"
                    name="operational_costs"
                    value={form.operational_costs}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                    helperText="Введите ежемесячные расходы"
                    sx={{
                        marginBottom: 3,
                        "& .MuiInputBase-root": { borderRadius: "8px" }
                    }}
                />

                <TextField
                    label="Ожидаемый доход (₽)"
                    name="expected_revenue"
                    value={form.expected_revenue}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                    helperText="Введите ожидаемый доход"
                    sx={{
                        marginBottom: 3,
                        "& .MuiInputBase-root": { borderRadius: "8px" }
                    }}
                />

                <TextField
                    label="Окупаемость (мес.)"
                    name="break_even_months"
                    value={form.break_even_months}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                    helperText="Введите время до окупаемости (в месяцах)"
                    sx={{
                        marginBottom: 3,
                        "& .MuiInputBase-root": { borderRadius: "8px" }
                    }}
                />

                {error && <Alert severity="error" sx={{ mt: 2, width: "100%" }}>{error}</Alert>}

                <Box sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    gap: "10px"
                }}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            height: "48px",
                            textTransform: "none",
                            fontSize: "16px",
                            backgroundColor: "#008000",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            "&:hover": { backgroundColor: "#008000" }
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Создать"}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/business")}
                        fullWidth
                        sx={{
                            height: "48px",
                            textTransform: "none",
                            fontSize: "16px",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderColor: "#008000",
                            color: "#008000",
                            "&:hover": { borderColor: "#008000", color: "#008000" }
                        }}
                    >
                        Отмена
                    </Button>
                </Box>
            </form>
        </Box>
    );
}
