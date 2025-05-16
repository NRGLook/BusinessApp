import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
} from '@mui/material';

// Значения по умолчанию
const defaultCoinConfig = [
    {
        id: 'bitcoin',
        name: 'BTC/USD',
        icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
        financialRate: 'A',
        weight: '1.0',
    },
    {
        id: 'ethereum',
        name: 'ETH/USD',
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        financialRate: 'A',
        weight: '0.9',
    },
    {
        id: 'tether',
        name: 'USDT/USD',
        icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
        financialRate: 'B',
        weight: '0.8',
    },
    {
        id: 'ripple',
        name: 'XRP/USD',
        icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
        financialRate: 'B',
        weight: '0.7',
    },
    {
        id: 'polkadot',
        name: 'DOT/USD',
        icon: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
        financialRate: 'B-',
        weight: '0.6',
    },
    {
        id: 'dogecoin',
        name: 'DOGE/USD',
        icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
        financialRate: 'C+',
        weight: '0.5',
    },
];

const CoinHorizontal = ({
                            coins = defaultCoinConfig,
                            initialCoinId = defaultCoinConfig[0].id,
                            title = 'May 2025',
                        }) => {
    const [selectedCoinId, setSelectedCoinId] = useState(initialCoinId);
    const [coinData, setCoinData] = useState({});
    const [loading, setLoading] = useState(true);

    const selectedCoin = coins.find((c) => c.id === selectedCoinId) || coins[0];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const ids = coins.map((c) => c.id).join(',');
                const res = await axios.get(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=try&include_24hr_change=true`
                );
                setCoinData(res.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [coins]);

    const handleSelectChange = (event) => {
        setSelectedCoinId(event.target.value);
    };

    const price = coinData[selectedCoinId]?.try?.toLocaleString('tr-TR', {
        maximumFractionDigits: 2,
    }) || '—';

    const changeRaw = coinData[selectedCoinId]?.try_24h_change;
    const change = typeof changeRaw === 'number' ? `${changeRaw.toFixed(2)}%` : '—';

    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 1,
                marginBottom: '20px',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 5,
            }}
        >
            {/* Icon */}
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    backgroundImage: `url('${selectedCoin.icon}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '50%',
                }}
            />

            {/* Name and Exchange */}
            <Box>
                <Typography variant="subtitle1">{selectedCoin.name}</Typography>
                <Typography variant="body2" color="text.secondary">{title}</Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Price */}
            <Box>
                <Typography variant="body2" color="text.secondary">Стоимость</Typography>
                {loading ? (
                    <CircularProgress size={20} />
                ) : (
                    <Typography variant="subtitle1">
                        {price} TRY
                        <Box
                            component="em"
                            sx={{
                                color: parseFloat(change) >= 0 ? 'success.main' : 'error.main',
                                fontStyle: 'normal',
                                ml: 1,
                            }}
                        >
                            {change}
                        </Box>
                    </Typography>
                )}
            </Box>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

            {/* Financial Rating */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" color="text.secondary">Финансовый рейтинг</Typography>
                <Typography variant="subtitle1">{selectedCoin.financialRate}</Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

            {/* Weight */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" color="text.secondary">Вес</Typography>
                <Typography variant="subtitle1">{selectedCoin.weight}</Typography>
            </Box>

            {/* Select Dropdown */}
            <FormControl sx={{ minWidth: 150, ml: 'auto' }} size="small">
                <InputLabel id="coin-select-label">Валюта</InputLabel>
                <Select
                    labelId="coin-select-label"
                    value={selectedCoinId}
                    onChange={handleSelectChange}
                    label="Валюта"
                >
                    {coins.map((coin) => (
                        <MenuItem key={coin.id} value={coin.id}>
                            {coin.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default CoinHorizontal;
