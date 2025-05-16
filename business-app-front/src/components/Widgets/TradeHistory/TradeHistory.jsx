import { useState, useEffect, useRef } from 'react';
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
    Paper
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';

import TradeHistoryRow from './TradeHistoryRow';

// mock data
const dataArray = [
  { id: 1, amount: '146,70', currency: 'TRY', weight: 10, time: '06:22:15', type: 1 },
  { id: 2, amount: '146,70', currency: 'TRY', weight: 10, time: '07:30:30', type: 1 },
  { id: 3, amount: '146,70', currency: 'TRY', weight: 10, time: '09:15:42', type: 2 },
  { id: 4, amount: '146,70', currency: 'TRY', weight: 10, time: '11:12:50', type: 2 },
  { id: 5, amount: '146,70', currency: 'TRY', weight: 10, time: '13:30:01', type: 1 },
  { id: 6, amount: '146,70', currency: 'TRY', weight: 10, time: '14:20:36', type: 1 },
  { id: 7, amount: '146,70', currency: 'TRY', weight: 10, time: '17:45:58', type: 1 },
  { id: 8, amount: '146,70', currency: 'TRY', weight: 10, time: '20:05:54', type: 1 },
  { id: 9, amount: '146,70', currency: 'TRY', weight: 10, time: '22:30:45', type: 2 },
];

const TradeHistory = () => {
  const [data, setData] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

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

  return (
      <Paper elevation={3} style={{borderRadius : '15px'}}>
        <Box
            sx={{
              p: 2,
              borderBottom: '1px solid #ccc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
        >
          <Typography variant="subtitle1">Market History</Typography>
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

        <Box sx={{ p: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="left">Price</TableCell>
                <TableCell align="center">Amount</TableCell>
                <TableCell align="center">Order</TableCell>
                <TableCell align="right">Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                  <TradeHistoryRow key={item.id} item={item} />
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
  );
};

export default TradeHistory;
