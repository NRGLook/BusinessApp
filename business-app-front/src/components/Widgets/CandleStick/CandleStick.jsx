import { useState, useEffect, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';

// MUI
import { Box, Button, ButtonGroup, Typography } from '@mui/material';

// Max свечей
const MAX_CANDLES = 60;

// Генератор случайной свечи
const generateNextCandle = (lastCandle, interval) => {
  const lastClose = lastCandle.y[3];
  const timestamp = lastCandle.x.getTime() + interval;

  const open = lastClose;
  const high = open + Math.random() * 10;
  const low = open - Math.random() * 10;
  const close = low + Math.random() * (high - low);

  return {
    x: new Date(timestamp),
    y: [
      parseFloat(open.toFixed(2)),
      parseFloat(high.toFixed(2)),
      parseFloat(low.toFixed(2)),
      parseFloat(close.toFixed(2)),
    ],
  };
};

const CandleStick = () => {
  const [series, setSeries] = useState([]);
  const [intervalMs, setIntervalMs] = useState(2000); // по умолчанию 2с
  const [running, setRunning] = useState(true);
  const intervalRef = useRef(null);

  // Инициализация
  useEffect(() => {
    const initialTime = Date.now() - MAX_CANDLES * intervalMs;

    const initialSeries = Array.from({ length: MAX_CANDLES }, (_, i) => {
      const base = 6600 + Math.random() * 100;
      const open = parseFloat(base.toFixed(2));
      const high = parseFloat((base + Math.random() * 10).toFixed(2));
      const low = parseFloat((base - Math.random() * 10).toFixed(2));
      const close = parseFloat((low + Math.random() * (high - low)).toFixed(2));

      return {
        x: new Date(initialTime + i * intervalMs),
        y: [open, high, low, close],
      };
    });

    setSeries(initialSeries);
  }, []);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSeries(prev => {
        const last = prev[prev.length - 1];
        const newCandle = generateNextCandle(last, intervalMs);
        const updated = [...prev, newCandle];
        return updated.length > MAX_CANDLES ? updated.slice(-MAX_CANDLES) : updated;
      });
    }, intervalMs);

    return () => clearInterval(intervalRef.current);
  }, [running, intervalMs]);

  // Обновление данных с интервалом
  useEffect(() => {
    const now = Date.now();
    const startTime = now - MAX_CANDLES * intervalMs;

    let candles = [];
    // Стартуем с базового значения
    let base = 6600 + Math.random() * 100;

    for (let i = 0; i < MAX_CANDLES; i++) {
      const timestamp = startTime + i * intervalMs;

      if (i === 0) {
        candles.push({
          x: new Date(timestamp),
          y: [base, base + 5, base - 5, base + (Math.random() - 0.5) * 10],
        });
      } else {
        candles.push(generateNextCandle(candles[i - 1], intervalMs));
      }
    }

    setSeries(candles);
  }, [intervalMs]);


  // Опции графика
  const options = {
    chart: {
      type: 'candlestick',
      height: 470,
      animations: { enabled: false },
      toolbar: { show: false },
    },
    xaxis: {
      type: 'datetime',
      range: MAX_CANDLES * intervalMs,
    },
    yaxis: {
      tooltip: { enabled: true },
      labels: {
        formatter: function (val) {
          return val.toFixed(2); // форматируем до 2 знаков после запятой
        },
      },
    },
    plotOptions: {
      candlestick: {
        wick: {
          useFillColor: true,
        },
      },
    },
    stroke: {
      width: 1,
    },
  };


  return (
      <Box>
        <Typography variant="h6" sx={{ p: 2 }}>
          Отображение рынка
        </Typography>

        {/* Панель управления */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mb: 1, gap: 2, flexWrap: 'wrap' }}>
          <ButtonGroup variant="outlined" size="small">
            <Button onClick={() => setIntervalMs(1000)}>1s</Button>
            <Button onClick={() => setIntervalMs(2000)}>2s</Button>
            <Button onClick={() => setIntervalMs(5000)}>5s</Button>
          </ButtonGroup>

          <Button
              variant="contained"
              color={running ? 'error' : 'success'}
              onClick={() => setRunning(!running)}
          >
            {running ? 'Стоп' : 'Старт'}
          </Button>
        </Box>

        {/* Сам график */}
        <Box sx={{ px: 2 }}>
          <ReactApexChart
              height={470}
              type="candlestick"
              series={[{ data: series }]}
              options={options}
          />
        </Box>
      </Box>
  );
};

export default CandleStick;
