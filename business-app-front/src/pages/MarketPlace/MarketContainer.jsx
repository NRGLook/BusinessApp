import { useState, useEffect } from 'react';

// Данные монеты
const coinData = {
    id: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    change: '-%3.28',
    currency: 'TRY',
    exchange: 'BTC/TRY',
    weight: '104k',
    financialRate: '-0.0252%/hr',
    icon: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/Bitcoin-BTC-icon.png',
    amount: '18.783,33',
    description:
        'Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group using the name Satoshi Nakamoto...',
};

const MarketContainer = ({ children }) => {
    const [keyword, setKeyword] = useState('');
    const [coinInfo, setCoinInfo] = useState(null);

    useEffect(() => {
        setCoinInfo(coinData); // В будущем можно сделать API-запрос
    }, []);

    const handleSearchValue = (e) => {
        const { value } = e.target;
        setKeyword(value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // можно здесь реализовать фильтрацию
    };

    // Пробрасываем данные и хендлеры вниз
    return children({
        coinInfo,
        keyword,
        handleSearchValue,
        handleSearchSubmit,
    });
};

export default MarketContainer;
