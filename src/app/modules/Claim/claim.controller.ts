import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppError";
import { claimService } from "./claim.service";

const createClaim = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization 
    if (!token) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Authentication token not found !');
      }
    const result = await claimService.createClaimIntoDB(req.body,token);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Claim created successfully",
      data: result,
     
    });
  }
);

const getClaims = catchAsync(async (req, res) => {
  const token = req.headers.authorization 
  if (!token) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Authentication token not found !');
    }
  const result = await claimService.getClaimsfromDB(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Claims  retrieved successfully",
    data: result,
  });
});
const updateClaim = catchAsync(async (req, res) => {
  const {claimId} = req.params
  const token = req.headers.authorization 
  if (!token) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Authentication token not found !');
    }
  const result = await claimService.updateClaimIntoDB(token,claimId,req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Claim updated successfully",
    data: result,
  });
});

export const claimController = {
  createClaim,getClaims,updateClaim

};
