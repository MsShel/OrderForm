import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Typography, Box, DialogActions, Alert } from '@mui/material';
import axios from 'axios';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import {FormData, Order} from "./Order.ts";

interface CreateOrderFormProps {
    onSubmit: (newOrder: Order) => void;
    onClose: () => void;
}

const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState<FormData>({
        senderCity: '',
        senderAddress: '',
        recipientCity: '',
        recipientAddress: '',
        weight: '',
        pickupDate: '',
    });

    const [value, setValue] = useState<Dayjs | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success'); // Уровень алерта

    const today = dayjs().startOf('day');
    const maxDate = dayjs('2999-12-31');

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDateChange = (newValue: Dayjs | null) => {
        setValue(newValue);

        if (newValue?.isValid()) {
            setFormData((prevState) => ({
                ...prevState,
                pickupDate: newValue.toISOString(),
            }));
        }
    };

    const validateForm = (): boolean => {
        return (
            !!formData.senderCity &&
            !!formData.senderAddress &&
            !!formData.recipientCity &&
            !!formData.recipientAddress &&
            !!formData.weight &&
            !!formData.pickupDate
        );
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const preparedData = { ...formData };
                preparedData.pickupDate = new Date(preparedData.pickupDate).toISOString();

                const response = await axios.post('http://localhost/api/orders', preparedData);

                onSubmit(response.data);
                setAlertSeverity('success');
                setAlertMessage('Заказ успешно создан');
                setFormData({
                    senderCity: '',
                    senderAddress: '',
                    recipientCity: '',
                    recipientAddress: '',
                    weight: '',
                    pickupDate: '',
                });
                onClose();
            } catch (error) {
                console.error('Error creating order:', error);
                setAlertSeverity('error');
                setAlertMessage('Произошла ошибка при создании заказа');
            }
        } else {
            setAlertSeverity('error');
            setAlertMessage('Заполните обязательные поля');
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Создать новый заказ
            </Typography>
            {alertMessage && (
                <Alert severity={alertSeverity} sx={{ marginBottom: 2 }}>
                    {alertMessage}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Город отправителя"
                    name="senderCity"
                    value={formData.senderCity}
                    onChange={handleChange}
                    required
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    fullWidth
                    label="Адрес отправителя"
                    name="senderAddress"
                    value={formData.senderAddress}
                    onChange={handleChange}
                    required
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    fullWidth
                    label="Город получателя"
                    name="recipientCity"
                    value={formData.recipientCity}
                    onChange={handleChange}
                    required
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    fullWidth
                    label="Адрес получателя"
                    name="recipientAddress"
                    value={formData.recipientAddress}
                    onChange={handleChange}
                    required
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    fullWidth
                    type={'number'}
                    label="Вес (кг)"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    sx={{ marginBottom: 2 }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker
                            minDate={today}
                            maxDate={maxDate}
                            label="Дата забора"
                            value={value}
                            onChange={handleDateChange}
                        />
                    </DemoContainer>
                </LocalizationProvider>

                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Отменить
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Создать заказ
                    </Button>
                </DialogActions>
            </form>
        </Box>
    );
};

export default CreateOrderForm;
