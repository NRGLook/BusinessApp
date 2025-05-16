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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';

const dataArray = [
  { id: 1, price: '82,03', amount: '0,15', total: '237,31', currency: 'TRY', type: 3 },
  { id: 2, price: '82,03', amount: '0,15', total: '237,31', currency: 'TRY', type: 3 },
  { id: 3, price: '82,03', amount: '0,15', total: '237,31', currency: 'TRY', type: 1 },
  { id: 4, price: '82,03', amount: '0,15', total: '237,31', currency: 'TRY', type: 3 },
  { id: 5, price: '82,03', amount: '0,15', total: '237,31', currency: 'TRY', type: 2 },
  { id: 6, price: '82,03', amount: '0,15', total: '237,31', currency: 'TRY', type: 1 },
  { id: 7, price: '82,03', amount: '0,15', total: '237,31', currency: 'TRY', type: 1 },
  { id: 8, price: '82,03', amount: '0,15', total: '237,31', currency: 'TRY', type: 3 },
  { id: 9, price: '82,03', amount: '0,15', total: '237,31', currency: 'TRY', type: 2 },
];

const SellOrders = () => {
  const [data, setData] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const open = Boolean(menuAnchorEl);

  useEffect(() => {
    setData(dataArray);
  }, []);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const getRowStyle = (type) => {
    if (type === 1) return { backgroundColor: '#e8f5e9' }; // green for success
    if (type === 2) return { backgroundColor: '#ffebee' }; // red for failure
    return {}; // neutral
  };

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
          <Typography variant="subtitle1">Sell Orders</Typography>
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
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                  <TableRow key={item.id} sx={getRowStyle(item.type)}>
                    <TableCell align="left">{item.price} {item.currency}</TableCell>
                    <TableCell align="center">{item.amount}</TableCell>
                    <TableCell align="right">{item.total}</TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
  );
};

export default SellOrders;
