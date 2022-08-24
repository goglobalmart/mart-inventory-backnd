import { Types } from 'mongoose';

export interface productOnhandReportType {
    stock_Name: string,
    items: {
        product_Catagory: string,
        qty: number,
        purchas_Date: Date,
        product_Name: string
    }
}