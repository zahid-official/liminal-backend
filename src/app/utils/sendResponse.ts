import type { Response } from "express";

// Meta interface
export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// Payload interface
interface IPayload<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: IMeta;
}

// sendResponse Function
const sendResponse = <T>(res: Response, payload: IPayload<T>) => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data,
    meta: payload.meta,
  });
};

export default sendResponse;
