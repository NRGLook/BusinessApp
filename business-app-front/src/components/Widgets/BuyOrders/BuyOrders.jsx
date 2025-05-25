import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ClickAwayListener,
  Paper,
  Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';

const fetchCryptoData = async () => {
  return [
    { id: 1, price: '27,321.45', amount: '0.5', total: '13,660.73', currency: 'BTC', type: 1 },
    { id: 2, price: '1,814.67', amount: '3.2', total: '5,806.94', currency: 'ETH', type: 2 },
    { id: 3, price: '0.45', amount: '1000', total: '450.00', currency: 'XRP', type: 1 },
    { id: 4, price: '0.56', amount: '800', total: '448.00', currency: 'ADA', type: 3 },
    { id: 5, price: '195.10', amount: '10', total: '1,951.00', currency: 'LTC', type: 2 },
    { id: 6, price: '0.031', amount: '15000', total: '465.00', currency: 'DOGE', type: 1 },
    { id: 7, price: '0.03', amount: '20000', total: '600.00', currency: 'SHIB', type: 3 },
    { id: 8, price: '49.99', amount: '25', total: '1,249.75', currency: 'SOL', type: 2 },
    { id: 9, price: '1.24', amount: '500', total: '620.00', currency: 'DOT', type: 1 },
    { id: 10, price: '1.12', amount: '400', total: '448.00', currency: 'AVAX', type: 3 },
  ];
};

const fetchStockData = async () => {
  return [
    { id: 1, price: '195.27', amount: '100', total: '19,527.00', currency: 'USD', type: 1, symbol: 'AAPL' },
    { id: 2, price: '339.34', amount: '50', total: '16,967.00', currency: 'USD', type: 2, symbol: 'TSLA' },
    { id: 3, price: '200.99', amount: '200', total: '40,198.00', currency: 'USD', type: 3, symbol: 'AMZN' },
    { id: 4, price: '124.76', amount: '150', total: '18,714.00', currency: 'USD', type: 1, symbol: 'MSFT' },
    { id: 5, price: '280.00', amount: '80', total: '22,400.00', currency: 'USD', type: 2, symbol: 'GOOGL' },
    { id: 6, price: '69.55', amount: '300', total: '20,865.00', currency: 'USD', type: 3, symbol: 'NFLX' },
    { id: 7, price: '175.44', amount: '120', total: '21,052.80', currency: 'USD', type: 1, symbol: 'NVDA' },
    { id: 8, price: '60.75', amount: '250', total: '15,187.50', currency: 'USD', type: 2, symbol: 'INTC' },
    { id: 9, price: '135.00', amount: '90', total: '12,150.00', currency: 'USD', type: 3, symbol: 'ADBE' },
    { id: 10, price: '305.50', amount: '40', total: '12,220.00', currency: 'USD', type: 1, symbol: 'CRM' },
  ];
};

const getRowStyle = (type) => {
  if (type === 1) return { backgroundColor: '#e8f5e9' }; // зеленый светлый
  if (type === 2) return { backgroundColor: '#ffebee' }; // красный светлый
  return {};
};

const BuyOrders = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [showAllCrypto, setShowAllCrypto] = useState(false);
  const [showAllStocks, setShowAllStocks] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const crypto = await fetchCryptoData();
      const stocks = await fetchStockData();
      setCryptoData(crypto);
      setStockData(stocks);
    };
    loadData();
  }, []);

  const handleMenuOpen = (event) => setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);
  const open = Boolean(menuAnchorEl);

  // Отображаем либо все, либо первые 10
  const visibleCrypto = showAllCrypto ? cryptoData : cryptoData.slice(0, 10);
  const visibleStocks = showAllStocks ? stockData : stockData.slice(0, 10);

  return (
      <Box>
        <Paper elevation={3} style={{ borderRadius: '15px', maxWidth: 900, margin: '40px auto' }}>
          {/* Заголовок и меню */}
          <Box
              sx={{
                p: 2,
                borderBottom: '1px solid #ccc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
          >
            <Typography variant="subtitle1" fontWeight={600}>Заказы на покупку</Typography>
            <ClickAwayListener onClickAway={handleMenuClose}>
              <Box>
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={menuAnchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                    Button 1
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <FavoriteIcon fontSize="small" sx={{ mr: 1 }} />
                    Button 2
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <InfoIcon fontSize="small" sx={{ mr: 1 }} />
                    Button 3
                  </MenuItem>
                </Menu>
              </Box>
            </ClickAwayListener>
          </Box>

          {/* Таблица Крипты */}
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Криптовалютные заказы</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Цена</TableCell>
                  <TableCell align="center">Количество</TableCell>
                  <TableCell align="right">Итого</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleCrypto.map((item) => (
                    <TableRow key={item.id} sx={getRowStyle(item.type)}>
                      <TableCell align="left">{item.price} {item.currency}</TableCell>
                      <TableCell align="center">{item.amount}</TableCell>
                      <TableCell align="right">{item.total}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowAllCrypto(prev => !prev)}
                  disabled={cryptoData.length <= 10}
              >
                {showAllCrypto ? 'Скрыть' : `Показать все (${cryptoData.length})`}
              </Button>
            </Box>
          </Box>

          {/* Таблица Акций */}
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Заказы на акции</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Символ</TableCell>
                  <TableCell align="left">Цена</TableCell>
                  <TableCell align="center">Количество</TableCell>
                  <TableCell align="right">Итого</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleStocks.map((item) => (
                    <TableRow key={item.id} sx={getRowStyle(item.type)}>
                      <TableCell align="left">{item.symbol}</TableCell>
                      <TableCell align="left">{item.price} {item.currency}</TableCell>
                      <TableCell align="center">{item.amount}</TableCell>
                      <TableCell align="right">{item.total}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowAllStocks(prev => !prev)}
                  disabled={stockData.length <= 10}
              >
                {showAllStocks ? 'Скрыть' : `Показать все (${stockData.length})`}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
  );
};

export default BuyOrders;
