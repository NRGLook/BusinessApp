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

// mock data (как у тебя)
const dataArray = [
  { id: 1, price: '28000.50', amount: '0.15', order: 'Buy', time: '06:22:15' },
  { id: 2, price: '27950.75', amount: '0.20', order: 'Sell', time: '06:45:33' },
  { id: 3, price: '28010.00', amount: '0.05', order: 'Buy', time: '07:12:48' },
  { id: 4, price: '27980.25', amount: '0.10', order: 'Sell', time: '07:30:10' },
  { id: 5, price: '28025.10', amount: '0.30', order: 'Buy', time: '07:59:05' },
  { id: 6, price: '28015.00', amount: '0.40', order: 'Sell', time: '08:22:15' },
  { id: 7, price: '28050.75', amount: '0.12', order: 'Buy', time: '08:45:22' },
  { id: 8, price: '27990.30', amount: '0.25', order: 'Sell', time: '09:05:18' },
  { id: 9, price: '28035.40', amount: '0.18', order: 'Buy', time: '09:30:01' },
  { id: 10, price: '27975.00', amount: '0.22', order: 'Sell', time: '09:55:47' },

  { id: 11, price: '1500.75', amount: '5', order: 'Buy', time: '10:10:11' },
  { id: 12, price: '1498.90', amount: '10', order: 'Sell', time: '10:25:50' },
  { id: 13, price: '1502.30', amount: '2', order: 'Buy', time: '10:45:20' },
  { id: 14, price: '1499.10', amount: '7', order: 'Sell', time: '11:00:05' },
  { id: 15, price: '1501.80', amount: '3.5', order: 'Buy', time: '11:15:33' },

  { id: 16, price: '75.20', amount: '100', order: 'Buy', time: '11:30:44' },
  { id: 17, price: '74.85', amount: '50', order: 'Sell', time: '11:45:55' },
  { id: 18, price: '75.00', amount: '75', order: 'Buy', time: '12:05:33' },
  { id: 19, price: '74.95', amount: '20', order: 'Sell', time: '12:22:10' },

  { id: 20, price: '345.10', amount: '8', order: 'Buy', time: '12:40:00' },
  { id: 21, price: '344.75', amount: '12', order: 'Sell', time: '12:55:12' },
  { id: 22, price: '345.50', amount: '6', order: 'Buy', time: '13:15:35' },
  { id: 23, price: '344.80', amount: '9', order: 'Sell', time: '13:35:47' },

  { id: 24, price: '250.00', amount: '15', order: 'Buy', time: '14:00:00' },
  { id: 25, price: '249.50', amount: '10', order: 'Sell', time: '14:20:20' },
  { id: 26, price: '250.25', amount: '20', order: 'Buy', time: '14:40:30' },
  { id: 27, price: '249.75', amount: '18', order: 'Sell', time: '15:00:40' },

  { id: 28, price: '3200.55', amount: '0.8', order: 'Buy', time: '15:30:00' },
  { id: 29, price: '3195.80', amount: '1.2', order: 'Sell', time: '15:50:15' },
  { id: 30, price: '3202.10', amount: '0.6', order: 'Buy', time: '16:10:25' },

  { id: 31, price: '400.30', amount: '3', order: 'Buy', time: '16:30:45' },
  { id: 32, price: '399.90', amount: '4', order: 'Sell', time: '16:50:50' },

  { id: 33, price: '60.75', amount: '25', order: 'Buy', time: '17:10:15' },
  { id: 34, price: '60.50', amount: '30', order: 'Sell', time: '17:30:20' },

  { id: 35, price: '1500.10', amount: '2.5', order: 'Buy', time: '17:50:35' },
  { id: 36, price: '1498.60', amount: '3', order: 'Sell', time: '18:10:40' },

  { id: 37, price: '700.00', amount: '1', order: 'Buy', time: '18:30:55' },
  { id: 38, price: '699.75', amount: '1.5', order: 'Sell', time: '18:50:00' },

  { id: 39, price: '100.10', amount: '50', order: 'Buy', time: '19:10:10' },
  { id: 40, price: '99.90', amount: '45', order: 'Sell', time: '19:30:25' },

  { id: 41, price: '52000.00', amount: '0.05', order: 'Buy', time: '20:00:00' },
  { id: 42, price: '51900.00', amount: '0.08', order: 'Sell', time: '20:20:15' },
  { id: 43, price: '52100.00', amount: '0.03', order: 'Buy', time: '20:40:30' },

  { id: 44, price: '3500.00', amount: '1', order: 'Buy', time: '21:00:45' },
  { id: 45, price: '3495.00', amount: '0.7', order: 'Sell', time: '21:20:50' },

  { id: 46, price: '200.25', amount: '10', order: 'Buy', time: '21:40:10' },
  { id: 47, price: '199.95', amount: '8', order: 'Sell', time: '22:00:30' },

  { id: 48, price: '130.50', amount: '12', order: 'Buy', time: '22:20:45' },
  { id: 49, price: '130.00', amount: '14', order: 'Sell', time: '22:40:55' },

  { id: 50, price: '2500.00', amount: '0.5', order: 'Buy', time: '23:00:00' },
  { id: 51, price: '2490.00', amount: '0.3', order: 'Sell', time: '23:20:15' },
];

const TradeHistory = () => {
  const [data, setData] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setData(dataArray);
  }, []);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const open = Boolean(menuAnchorEl);

  // Показываем либо все, либо первые 10
  const visibleData = showAll ? data : data.slice(0, 10);

  return (
      <Paper elevation={3} style={{ borderRadius: '15px', maxWidth: 900, margin: '40px auto' }}>
        {/* Заголовок + меню */}
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
            История рынка
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

        {/* Таблица */}
        <Box sx={{ p: 2 }}>
          <Table
              size="small"
              sx={{
                '& .MuiTableCell-root': {
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                },
                '& .MuiTableBody-root': {
                  '& .MuiTableRow-root:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                },
              }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Цена</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Количество</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Заказ</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Время</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleData.map(({ id, price, amount, order, time }) => (
                  <TableRow key={id}>
                    <TableCell>{price}</TableCell>
                    <TableCell>{amount}</TableCell>
                    <TableCell>{order}</TableCell>
                    <TableCell>{time}</TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Кнопка Показать все / Скрыть */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
                variant="outlined"
                size="small"
                onClick={() => setShowAll((prev) => !prev)}
                disabled={data.length <= 10}
            >
              {showAll ? 'Скрыть' : `Показать все (${data.length})`}
            </Button>
          </Box>
        </Box>
      </Paper>
  );
};

export default TradeHistory;
