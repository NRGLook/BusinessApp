import React, {useState, useEffect, useMemo} from "react";
import {
    Container,
    CircularProgress,
    Box,
    Typography,
    Button
} from "@mui/material";
import {useNavigate, useParams, Link} from "react-router-dom";
import axios from "../../api/axios";
import {ProfileForm} from "../../components/ProfileForm";

const EditProfilePage = ({isEditing}) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const {id} = useParams();
    const navigate = useNavigate();

    const getProfile = async () => {
        const token = localStorage.getItem("token");

        const response = await axios.get(`http://127.0.0.1:8000/user/${id}/profile`, {
            headers: {Authorization: `Bearer ${token}`},
        });

        return response.data
    }

    useEffect(() => {
        getProfile().then((res) => {
            const data = res.data[0];
            setUserData(data);
            setLoading(false)
            localStorage.setItem("profile_id", data.user_profile.id);
        }).catch((error) => {
            if (error.status === 401) {
                navigate('/auth')
                return
            }
            setError(error)
        }).finally(() => setLoading(false))
        // const fetchProfile = async () => {
        //     try {
        //         const token = localStorage.getItem("token");
        //
        //         const response = await axios.get(`http://127.0.0.1:8000/user/${id}/profile`, {
        //             headers: { Authorization: `Bearer ${token}` },
        //         });
        //         alert(JSON.stringify(response))
        //         if (response.data.data && response.data.data.length > 0) {
        //             const profileData = response.data.data[0];
        //
        //             setUserData(profileData);
        //             localStorage.setItem("profile_id", profileData.user_profile.id);
        //         } else {
        //             setError("Профиль не найден");
        //         }
        //     } catch (err) {
        //         console.error("Error fetching profile:", err);
        //         setError(err.response?.status === 401 ? "Неавторизованный доступ" : "Не удалось загрузить профиль");
        //         if (err.response?.status === 401) navigate("/auth");
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        //
        // fetchProfile(); // Убрал await здесь
    }, [id, navigate]);
    if (loading) {
        return (
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh"}}>
                <CircularProgress size={60}/>
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{mt: 4, textAlign: "center"}}>
                <Typography variant="h5" color="error">{error}</Typography>
                <Box mt={2}>
                    <Link to={`/user/${id}/profile`}>
                        <Button variant="contained">Перейти в профиль</Button>
                    </Link>
                </Box>
            </Container>
        );
    }


    return (
        <Container maxWidth="md" sx={{mt: 4, mb: 4}}>
            <ProfileForm initialValues={userData} isEditing={isEditing}/>
        </Container>
    );
};

export default EditProfilePage;
