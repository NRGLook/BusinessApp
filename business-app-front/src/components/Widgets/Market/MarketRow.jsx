import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Sparklines, SparklinesLine } from 'react-sparklines';

const MarketRow = ({ item }) => {
    const [color, setColor] = useState('');

    useEffect(() => {
        setColor(item.status === 1 ? '#4caf50' : '#f44336'); // green or red
    }, [item.status]);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1,
                borderBottom: '1px solid #eee',
            }}
        >
            <div style={{width: '97%', display: 'flex', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent : 'center'}}>
                    <Avatar
                        src={item.icon}
                        alt={item.name}
                        sx={{ width: 40, height: 40, my : 1, mx : 1 }}
                    />
                </div>


                {/* Название и дата */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {item.date}
                    </Typography>
                </Box>

                {/* Линия графика */}
                <Box sx={{ width: 40, height: 40, mx: 2 }}>
                    <Sparklines data={item.lineChartData} width={40} height={40}>
                        <SparklinesLine style={{ strokeWidth: 2, fill: 'none' }} color={color} />
                    </Sparklines>
                </Box>

                {/* Сумма и изменение */}
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle2">
                        {item.amount} {item.currency}
                    </Typography>
                    <Typography variant="caption" sx={{ color }}>
                        {item.change}
                    </Typography>
                </Box>
            </div>
        </Box>
    );
};

export default MarketRow;
