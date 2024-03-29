import { Response } from "express";
import { TSendResponse } from "../interface/interface";

const sendResponse = <T>(res: Response, jsonData: TSendResponse<T>) => {
  res.status(jsonData?.statusCode).send({
    success: jsonData?.success,
    statusCode: jsonData?.statusCode,
    message: jsonData?.message,
    meta: jsonData?.meta || null || undefined,
    data: jsonData?.data || null || undefined,
  });
};
export default sendResponse