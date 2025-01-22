import React, { useState, useEffect } from 'react';
import {
    Button,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogContent,
    Snackbar,
    Alert,
    Toolbar,
    AppBar,
}
    from '@mui/material';
import axios from 'axios';
import CreateOrderForm from './CreateOrderForm';
import OrderDetailsDialog from './OrderDetailsDialog';
import {Order} from './Order.ts';

const OrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [openOrderDialog, setOpenOrderDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost/api/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setOpenOrderDialog(true);
    };

    const handleCloseOrderDialog = () => {
        setOpenOrderDialog(false);
    };

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    };

    const handleOrderSubmit = (newOrder: Order) => {
        setOrders((prevOrders) => [...prevOrders, newOrder]);
        setSnackbar({ open: true, message: 'Заказ успешно создан!', severity: 'success' });
        handleCloseCreateDialog();
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box mx="auto" sx={{ height: '100vh', width: '80vw',  display: 'flex', flexDirection: 'column', backgroundColor: '#8d99f0' }}>
            {/* AppBar */}
            <AppBar position="static" sx={{ backgroundColor: '#283593', borderRadius: '4px' }}>
                <Toolbar sx={{ justifyContent: 'flex-start', paddingLeft: '200px' }}>
                    <Typography variant="h4" sx={{ textAlign: 'left'}}>
                        Список Заказов
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenCreateDialog}
                        sx={{ marginLeft: 'auto' }}
                    >
                        Создать заказ
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Таблица */}
            <TableContainer
                component={Paper}
                sx={{
                    overflow: 'auto',
                    width: '100%',
                    alignSelf: 'center',
                }}
            >
                <Table stickyHeader sx={{ tableLayout: 'fixed', width: '100%' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: '4%' }}>ID</TableCell>
                                <TableCell sx={{ width: '10%' }}>Номер заказа</TableCell>
                                <TableCell sx={{ width: '15%' }}>Город отправителя</TableCell>
                                <TableCell sx={{ width: '18%' }}>Адрес отправителя</TableCell>
                                <TableCell sx={{ width: '15%' }}>Город получателя</TableCell>
                                <TableCell sx={{ width: '18%' }}>Адрес получателя</TableCell>
                                <TableCell sx={{ width: '10%' }}>Вес груза</TableCell>
                                <TableCell sx={{ width: '10%' }}>Дата забора груза</TableCell>
                            </TableRow>
                        </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow
                                key={order.id}
                                onClick={() => handleViewOrder(order)}
                                onMouseEnter={() => setHoveredRowId(order.id)}
                                onMouseLeave={() => setHoveredRowId(null)}
                                sx={{
                                    backgroundColor: hoveredRowId === order.id ? '#e3f2fd' : 'inherit',
                                    cursor: 'pointer',
                                }}
                            >
                                <TableCell
                                    sx={{
                                        width: '10%',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {order.id}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        width: '10%',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {order.orderNumber}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        width: '20%',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {order.senderCity}
                                </TableCell><TableCell
                                    sx={{
                                        width: '20%',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {order.senderCity}
                                </TableCell><TableCell
                                    sx={{
                                        width: '20%',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {order.senderCity}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        width: '20%',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {order.recipientCity}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        width: '15%',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {order.weight} kg
                                </TableCell>
                                <TableCell
                                    sx={{
                                        width: '15%',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {new Date(order.pickupDate).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>

            </TableContainer>

            {/* Диалог с деталями заказа */}
            <OrderDetailsDialog
                order={selectedOrder}
                open={openOrderDialog}
                onClose={handleCloseOrderDialog}
            />

            {/* Диалог для создания нового заказа */}
            <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                <DialogContent>
                    <CreateOrderForm
                        onSubmit={handleOrderSubmit}
                        onClose={handleCloseCreateDialog}
                    />
                </DialogContent>
            </Dialog>

            {/* Snackbar для уведомлений */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OrderList;
