export interface RaffleItem {
    mint: string;
    raffleKey: string;
    collection: string;
    name: string;
    price: number;
    token: string;
    tokenDecimal: number;
    image: string;
    creator: string;
    endTimeStamp: number;
    createdTimeStamp: number;
    totalTickets: number;
    purchasedTickets: number;
    verified?: boolean
}