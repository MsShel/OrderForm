import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import {Order} from "./Order.ts";

interface OrderDetailsDialogProps {
    order: Order | null;
    open: boolean;
    onClose: () => void;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ order, open, onClose }) => {
    if (!order) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Детали заказа</DialogTitle>
            <DialogContent>
                <Typography variant="body1">Номер заказа: {order.orderNumber}</Typography>
                <Typography variant="body1">Город отправителя: {order.senderCity}</Typography>
                <Typography variant="body1">Адрес отправителя: {order.senderAddress}</Typography>
                <Typography variant="body1">Город получателя: {order.recipientCity}</Typography>
                <Typography variant="body1">Адрес получателя: {order.recipientAddress}</Typography>
                <Typography variant="body1">Вес груза: {order.weight} кг</Typography>
                <Typography variant="body1">Дата забора груза: {new Date(order.pickupDate).toLocaleDateString()}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetailsDialog;
