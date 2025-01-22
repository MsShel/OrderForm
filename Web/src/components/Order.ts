export interface FormData {
    senderCity: string;
    senderAddress: string;
    recipientCity: string;
    recipientAddress: string;
    weight: string;
    pickupDate: string;
}

export interface Order extends FormData {
    id: number;
    orderNumber: string;
}
