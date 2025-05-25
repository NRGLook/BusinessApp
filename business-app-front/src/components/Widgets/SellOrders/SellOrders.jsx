import { useEffect, useState } from 'react';
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

const generateRealisticData = () => {
  const types = [1, 2, 3]; // 1 - success (зелёный), 2 - fail (красный), 3 - neutral
  const data = [];
  for (let i = 1; i <= 50; i++) {
    const price = (27000 + Math.random() * 1000).toFixed(2); // BTC в USDT
    const amount = (0.01 + Math.random() * 0.1).toFixed(4);
    const total = (parseFloat(price) * parseFloat(amount)).toFixed(2);
    data.push({
      id: i,
      price: price.replace('.', ','),
      amount: amount.replace('.', ','),
      total: total.replace('.', ','),
      currency: 'USDT',
      type: types[Math.floor(Math.random() * types.length)],
    });
  }
  return data;
};

const SellOrders = () => {
  const [data, setData] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const open = Boolean(menuAnchorEl);

  useEffect(() => {
    setData(generateRealisticData());
  }, []);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const getRowStyle = (type) => {
    switch (type) {
      case 1:
        return { backgroundColor: '#e8f5e9' }; // зелёный
      case 2:
        return { backgroundColor: '#ffebee' }; // красный
      default:
        return {};
    }
  };

  const visibleData = showAll ? data : data.slice(0, 10);

  return (
      <Paper elevation={3} sx={{ borderRadius: 3, maxWidth: 600, mx: 'auto' }}>
        <Box
            sx={{
              p: 2,
              borderBottom: '1px solid #ccc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Заказы на продажу
          </Typography>

          <ClickAwayListener onClickAway={handleMenuClose}>
            <Box>
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                  anchorEl={menuAnchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                  Настройки
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <FavoriteIcon fontSize="small" sx={{ mr: 1 }} />
                  Избранное
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <InfoIcon fontSize="small" sx={{ mr: 1 }} />
                  Инфо
                </MenuItem>
              </Menu>
            </Box>
          </ClickAwayListener>
        </Box>

        <Box sx={{ p: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="left">Цена (USDT)</TableCell>
                <TableCell align="center">Количество (BTC)</TableCell>
                <TableCell align="right">Итого (USDT)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleData.map((item) => (
                  <TableRow key={item.id} sx={getRowStyle(item.type)}>
                    <TableCell align="left">
                      {item.price} {item.currency}
                    </TableCell>
                    <TableCell align="center">{item.amount}</TableCell>
                    <TableCell align="right">{item.total}</TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>

          {data.length > 10 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowAll((prev) => !prev)}
                >
                  {showAll ? 'Скрыть' : `Показать все (${data.length})`}
                </Button>
              </Box>
          )}
        </Box>
      </Paper>
  );
};

export default SellOrders;
