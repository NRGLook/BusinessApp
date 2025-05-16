import { useState, useEffect } from 'react';
import SellOrders from "../../components/Widgets/SellOrders/SellOrders.jsx";
import BuyOrders from "../../components/Widgets/BuyOrders/BuyOrders.jsx";
import TradeHistory from "../../components/Widgets/TradeHistory/TradeHistory.jsx";
import BuySell from "../../components/Widgets/BuySell/BuySell.jsx";
import CandleStick from "../../components/Widgets/CandleStick/CandleStick.jsx";
import CoinHorizontal from "../../components/Widgets/Coin/CoinHorizontal.jsx";
import CoinVertical from "../../components/Widgets/Coin/CoinVertical.jsx";
import Market from "../../components/Widgets/Market/Market.jsx";
import MainLayout from "../../layouts/MainLayout";
import MarketContainer from "../MarketContainer/MarketContainer";
import {Box, CircularProgress} from "@mui/material";

// variables
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
        'Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group using the name Satoshi Nakamoto. It was released as open-source software in 2009',
};

const MarketScreen = () => {
    const [keyword, setKeyword] = useState('');
    const [coinInfo, setCoinInfo] = useState(null);
    const [loading, setLoading] = useState(true); // новое состояние загрузки

    useEffect(() => {
        // имитируем задержку 500мс
        const timer = setTimeout(() => {
            setCoinInfo(coinData);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleSearchValue = (e) => {
        const { value } = e.target;
        setKeyword(value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    if (loading) {
        // Здесь можно вывести любой лоадер, например простой текст или спиннер
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <MainLayout>
            <div className="content">
                <div className="flex flex-destroy">
                    <div className="content-70 flex-1">
                        <MarketContainer>
                            {({ coinInfo, keyword, handleSearchValue, handleSearchSubmit }) => (
                                <>
                                    {coinInfo && (
                                        <CoinHorizontal
                                            item={coinInfo}
                                            searchValue={keyword}
                                            searchSubmit={handleSearchSubmit}
                                            searchOnChange={handleSearchValue}
                                        />
                                    )}

                                    <div className="flex flex-destroy">
                                        <div className="content-70 flex-1 box-right-padding">
                                            <CandleStick />
                                        </div>
                                        <div className="content-30 box-right-padding" style={{ height: '100%' }}>
                                            <Market item={coinInfo} />
                                        </div>
                                    </div>

                                    <div className="flex flex-destroy flex-space-between">
                                        <div className="flex-1 box-right-padding">
                                            <TradeHistory />
                                        </div>
                                        <div className="flex-1 box-right-padding">
                                            <BuyOrders />
                                        </div>
                                        <div className="flex-1">
                                            <SellOrders />
                                        </div>
                                    </div>
                                </>
                            )}
                        </MarketContainer>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default MarketScreen;
