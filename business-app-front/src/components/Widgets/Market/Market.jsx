import { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, CircularProgress } from '@mui/material'; // добавим CircularProgress
import Box from '../../Common/Box';
import MarketRow from './MarketRow';

const initialData = [
    {
        id: 'bitcoin',
        name: 'BTC/USD',
        icon: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/Bitcoin-BTC-icon.png',
        status: 1,
        lineChartData: [10, 15, 10, 15, 15, 18],
    },
    {
        id: 'ethereum',
        name: 'ETH/USD',
        icon: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png',
        status: 2,
        lineChartData: [30, 20, 25, 35, 10, 8],
    },
    {
        id: 'tether',
        name: 'USDT/USD',
        icon: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Tether-USDT-icon.png',
        status: 1,
        lineChartData: [30, 20, 25, 35, 30, 35],
    },
    {
        id: 'ripple',
        name: 'XRP/USD',
        icon: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ripple-XRP-icon.png',
        status: 1,
        lineChartData: [30, 20, 25, 35, 30, 35],
    },
    {
        id: 'polkadot',
        name: 'DOT/USD',
        icon: 'data:image/png;base64,...', // оставь как есть
        status: 2,
        lineChartData: [30, 20, 25, 35, 20, 10],
    },
    {
        id: 'dogecoin',
        name: 'DOGE/USD',
        icon: 'https://www.kindpng.com/picc/m/202-2028344_dogecoin-doge-icon-metro-symbole-hd-png-download.png',
        status: 2,
        lineChartData: [30, 20, 25, 35, 25, 30],
    },
    {
        id: 'cardano',
        name: 'ADA/USD',
        icon: 'https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/cardano_ada-512.png',
        status: 1,
        lineChartData: [30, 20, 25, 35, 25, 30],
    },
];

const Market = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // состояние загрузки

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const ids = initialData.map((coin) => coin.id).join(',');
                const res = await axios.get(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=try&include_24hr_change=true`
                );

                const enrichedData = initialData.map((coin) => {
                    const priceInfo = res.data[coin.id];
                    return {
                        ...coin,
                        date: new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' }),
                        amount: priceInfo?.try?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                        currency: 'TRY',
                        change: `${priceInfo?.try_24h_change >= 0 ? '' : '-'}%${Math.abs(priceInfo?.try_24h_change).toFixed(2)}`,
                    };
                });

                setData(enrichedData);
            } catch (err) {
                console.error('Ошибка при загрузке данных:', err);
            } finally {
                setLoading(false); // выключаем лоадер в любом случае
            }
        };

        fetchPrices();
    }, []);

    return (
        <Box
            sx={{
                borderRadius: 1,
                boxShadow: 1,
                overflow: 'hidden',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ mx: 5, my: 5, borderBottom: '1px solid #eee' }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h6" sx={{ userSelect: 'none' }}>
                        Торги
                    </Typography>
                </div>
            </Box>

            <Box sx={{ maxHeight: 400, overflowY: 'auto', py: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {loading ? (
                    <CircularProgress /> // показываем спиннер, пока загружается
                ) : (
                    data.map((item) => <MarketRow key={item.id} item={item} />)
                )}
            </Box>
        </Box>
    );
};

export default Market;
