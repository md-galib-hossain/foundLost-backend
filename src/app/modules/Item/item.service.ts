import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { Prisma, User } from "@prisma/client";
import { TPaginationOptions } from "../../interface/interface";
import { paginationHelpers } from "../../utils/paginationHelper";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../Auth/auth.utils";
import config from "../../config";
import { TItem } from "./item.interface";
import { itemSearchableFields } from "./item.constant";

const createFoundItemIntoDB = async (payload: TItem, token: string) => {
  const checkexist = await prisma.foundItemCategory.findUnique({
    where: {
      id: payload?.categoryId,
    },
  });
  if (!checkexist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "There is no Item category with this id"
    );
  }
  const decoded = verifyToken(token, config.JWT.ACCESS_TOKEN_SECRET as string);
  if (!decoded) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorised");
  }

  payload.userId = decoded?.id;

  const result = await prisma.foundItem.create({
    data: payload,
    select: {
      id: true,
      userId: true,
      categoryId: true,
      foundItemName: true,
      description: true,
      location: true,
      createdAt: true,
      updatedAt: true,
      user: true,
      category: true,
    },
  });

  return result;
};

const getFoundItemsfromDB = async (
  params: any,
  options: TPaginationOptions
) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondions: Prisma.FoundItemWhereInput[] = [];
  
  //console.log(filterData);
  if (params.searchTerm) {
    andCondions.push({
      OR: itemSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  // console.dir(andCondions, { depth: null });


  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditons: Prisma.FoundItemWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const result = await prisma.foundItem.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      foundItemName: true,
      description: true,
      location: true,
      user: true,
      category: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.foundItem.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const foundItemService = {
  createFoundItemIntoDB,
  getFoundItemsfromDB,
};
