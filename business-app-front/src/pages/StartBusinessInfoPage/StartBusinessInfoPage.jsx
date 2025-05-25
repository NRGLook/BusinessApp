import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { faker } from '@faker-js/faker';
import {
    TextField,
    Button,
    Box,
    Typography,
    Container,
    Paper,
    InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StraightenIcon from '@mui/icons-material/Straighten';
import TagIcon from '@mui/icons-material/Tag';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const PopupBox = styled(Box)(({ theme }) => ({
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    maxWidth: 300,
}));

const PopupTitleTypography = styled(Typography)(({ theme }) => ({
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.h6.fontSize,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
}));

const PopupInfoTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
}));

const propertyIcon = new L.Icon({
    iconUrl: 'https://img.icons8.com/color/48/000000/home.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const businessIcon = new L.Icon({
    iconUrl: 'https://img.icons8.com/color/48/000000/shop.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const generateRandomCoordinates = (centerLat, centerLng, radiusInKm) => {
    const y0 = centerLat;
    const x0 = centerLng;
    const rd = radiusInKm / 111.3;
    const u = Math.random();
    const v = Math.random();
    const w = rd * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);
    return { lat: y0 + y, lng: x0 + x };
};

const generateMockProperties = (count, centerLat, centerLng, radius) => {
    const reasons = [
        'Срочная продажа – владелец уезжает',
        'Нуждается в ремонте',
        'Находится в промзоне',
        'Отличная цена за квадратный метр',
        'Инвестиционный объект со скидкой',
    ];
    return Array.from({ length: count }, (_, index) => {
        const { lat, lng } = generateRandomCoordinates(centerLat, centerLng, radius);
        const price = faker.number.int({ min: 100000, max: 1000000 });
        return {
            id: `prop-${index}-${Date.now()}`,
            type: 'property',
            address: faker.location.streetAddress(),
            price,
            size: faker.number.int({ min: 50, max: 300 }),
            lat,
            lng,
            imageUrl: `https://source.unsplash.com/random/300x200?house&sig=${index}`,
            reason: faker.helpers.arrayElement(reasons),
        };
    });
};

const generateMockBusinesses = (count, centerLat, centerLng, radius) => {
    return Array.from({ length: count }, (_, index) => {
        const { lat, lng } = generateRandomCoordinates(centerLat, centerLng, radius);
        return {
            id: `biz-${index}-${Date.now()}`,
            type: 'business',
            name: faker.company.name(),
            category: faker.commerce.department(),
            address: faker.location.streetAddress(),
            lat,
            lng,
            imageUrl: `https://source.unsplash.com/random/300x200?business&sig=${index}`,
        };
    });
};

function MapView({ center, onBoundsChange }) {
    const map = useMapEvents({
        moveend: () => {
            onBoundsChange(map.getBounds());
        },
        click: () => {
            const center = map.getCenter();
            onBoundsChange(map.getBounds());
        },
    });

    useEffect(() => {
        if (center) map.setView(center, 10);
    }, [center, map]);

    return null;
}

const StyledMapContainer = styled(MapContainer)`
    height: calc(100vh - 220px);
    width: 100%;
    border-radius: 8px;
    z-index: 0;
`;

const RealEstatePage = () => {
    const [location, setLocation] = useState('');
    const [properties, setProperties] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapCenter, setMapCenter] = useState([53.9006, 27.5615]);
    const [filterType, setFilterType] = useState('all');

    const fetchCoordinatesFromNominatim = async (query) => {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`);
        const data = await response.json();
        if (data.length === 0) throw new Error('Местоположение не найдено');
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    };

    useEffect(() => {
        const initialProperties = generateMockProperties(50, mapCenter[0], mapCenter[1], 100);
        const initialBusinesses = generateMockBusinesses(30, mapCenter[0], mapCenter[1], 80);
        setProperties(initialProperties);
        setBusinesses(initialBusinesses);
    }, [mapCenter]);

    const handleBoundsChange = useCallback((bounds) => {
        setProperties((prev) => prev.filter(p => bounds.contains([p.lat, p.lng])));
        setBusinesses((prev) => prev.filter(b => bounds.contains([b.lat, b.lng])));
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const coords = await fetchCoordinatesFromNominatim(location);
            setMapCenter(coords);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredMarkers = filterType === 'all'
        ? [...properties, ...businesses]
        : filterType === 'property'
            ? properties
            : businesses;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', py: 2, bgcolor: '#f9fafb' }}>
            <Container maxWidth="lg" sx={{ mb: 3 }}>
                <Paper elevation={0} sx={{ p: 4, bgcolor: 'transparent', textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                            <LocationOnIcon sx={{ mr: 1 }} /> Исследуйте Недвижимость и Бизнесы
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Найдите лучшие предложения на карте
                        </Typography>
                    </motion.div>

                    <Box component="form" onSubmit={handleSearch} sx={{ mt: 3, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <TextField
                            fullWidth
                            label="Введите город или адрес"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Button type="submit" variant="contained" size="large">Поиск</Button>
                    </Box>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Button variant={filterType === 'all' ? 'contained' : 'outlined'} onClick={() => setFilterType('all')}>Все</Button>
                        <Button variant={filterType === 'property' ? 'contained' : 'outlined'} onClick={() => setFilterType('property')}>Недвижимость</Button>
                        <Button variant={filterType === 'business' ? 'contained' : 'outlined'} onClick={() => setFilterType('business')}>Бизнесы</Button>
                    </Box>

                    {loading && <Typography sx={{ mt: 2 }}>Загрузка...</Typography>}
                    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                </Paper>
            </Container>

            <Box sx={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
                <StyledMapContainer center={mapCenter} zoom={10} scrollWheelZoom>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    <MapView center={mapCenter} onBoundsChange={handleBoundsChange} />

                    {filteredMarkers.map((marker) => (
                        <Marker
                            key={marker.id}
                            position={[marker.lat, marker.lng]}
                            icon={marker.type === 'property' ? propertyIcon : businessIcon}
                        >
                            <Popup>
                                <PopupBox>
                                    <PopupTitleTypography>
                                        {marker.type === 'property' ? <HomeIcon sx={{ mr: 1 }} /> : <StoreIcon sx={{ mr: 1 }} />}
                                        {marker.type === 'property' ? marker.address : marker.name}
                                    </PopupTitleTypography>
                                    {marker.type === 'property' ? (
                                        <>
                                            <PopupInfoTypography>
                                                <AttachMoneyIcon sx={{ mr: 1, fontSize: 'inherit' }} /> Цена: ${marker.price.toLocaleString()}
                                            </PopupInfoTypography>
                                            <PopupInfoTypography>
                                                <StraightenIcon sx={{ mr: 1, fontSize: 'inherit' }} /> Площадь: {marker.size} м²
                                            </PopupInfoTypography>
                                            {marker.reason && (
                                                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <LightbulbIcon sx={{ fontSize: 16, mr: 0.5 }} /> {marker.reason}
                                                </Typography>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <PopupInfoTypography>
                                                <TagIcon sx={{ mr: 1, fontSize: 'inherit' }} /> Категория: {marker.category}
                                            </PopupInfoTypography>
                                            <PopupInfoTypography>
                                                <LocationOnIcon sx={{ mr: 1, fontSize: 'inherit' }} /> Адрес: {marker.address}
                                            </PopupInfoTypography>
                                        </>
                                    )}
                                </PopupBox>
                            </Popup>
                        </Marker>
                    ))}
                </StyledMapContainer>
            </Box>
        </Box>
    );
};

export default RealEstatePage;
