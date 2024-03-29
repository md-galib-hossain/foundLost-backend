import prisma from "../../utils/prisma";

import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../Auth/auth.utils";
import config from "../../config";


const createFoundItemCategoryIntoDB = async (payload: any, token: string) => {

  const checkexist = await prisma.foundItemCategory.findUnique({
    where: {
      name: payload.name,
    },
  });
  if (checkexist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already Exist with this name");
  }
  const decoded = verifyToken(
    token,
    config.JWT.ACCESS_TOKEN_SECRET as string,
  ) ;
  if (!decoded) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorised");
  }
  const result = await prisma.foundItemCategory.create({
    data: payload,
  });

  return result;

};

export const foundItemCategoryService = {
  createFoundItemCategoryIntoDB,
};
