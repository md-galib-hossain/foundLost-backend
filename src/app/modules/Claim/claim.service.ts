import prisma from "../../utils/prisma";

import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../Auth/auth.utils";
import config from "../../config";
import { TClaim } from "./claim.interface";

const createClaimIntoDB = async (payload: TClaim, token: string) => {
  const checkexist = await prisma.claim.findUnique({
    where: {
      foundItemId: payload?.foundItemId,
    },
  });
  if (checkexist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "There is already and claim with the same Found Item ID"
    );
  }
  const decoded = verifyToken(token, config.JWT.ACCESS_TOKEN_SECRET as string);
  if (!decoded) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorised");
  }

  payload.userId = decoded?.id;

  const result = await prisma.claim.create({
    data: payload,
    select: {
      id: true,
      userId: true,
      foundItemId: true,
      distinguishingFeatures: true,
      lostDate: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const getClaimsfromDB = async (token: string) => {
  const decoded = verifyToken(token, config.JWT.ACCESS_TOKEN_SECRET as string);
  if (!decoded) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorised");
  }
  const result = await prisma.claim.findMany();

  return result;
};
const updateClaimIntoDB = async (
  token: string,
  id: string,
  payload: Partial<TClaim>
) => {
  await prisma.claim.findUniqueOrThrow({ where: { id: id } });
  const decoded = verifyToken(token, config.JWT.ACCESS_TOKEN_SECRET as string);
  if (!decoded) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorised");
  }
  const result = await prisma.claim.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

export const claimService = {
  createClaimIntoDB,
  getClaimsfromDB,
  updateClaimIntoDB,
};
