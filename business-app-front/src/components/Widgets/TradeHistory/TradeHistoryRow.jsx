import { TableRow, TableCell } from '@mui/material';

const TradeHistoryRow = ({ item }) => {
    return (
        <TableRow>
            <TableCell align="left">{item.amount} {item.currency}</TableCell>
            <TableCell align="center">{item.weight}</TableCell>
            <TableCell align="center">{item.type === 1 ? 'Buy' : 'Sell'}</TableCell>
            <TableCell align="right">{item.time}</TableCell>
        </TableRow>
    );
};

export default TradeHistoryRow;
