import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";
import { TUser, TUserProfile } from "./user.interface";
import { TPaginationOptions } from "../../interface/interface";
import { paginationHelpers } from "../../utils/paginationHelper";
import { userSearchableFields } from "./user.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../Auth/auth.utils";
import config from "../../config";

const createUserIntoDB = async (payload: TUser) => {
  const { profile, ...userData } = payload;
  const hashedPassword: string = await bcrypt.hash(userData?.password, 10);
  const checkUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (checkUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }
  const result = await prisma.$transaction(async (transactionClient) => {
    userData.password = hashedPassword;
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });
    profile.userId = createdUserData.id;
    const createdUserProfileData = await transactionClient.userProfile.create({
      data: profile,
    });
    return createdUserData;
  });

  let user;
  if (result) {
    user = prisma.user.findUniqueOrThrow({
      where: {
        id: result?.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });
  }

  return user;
};

const getUsersfromDB = async (query: any, options: TPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const { searchTerm, ...remainingQueries } = query;
  const andConditions: Prisma.UserWhereInput[] = [];
  if (query.searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(remainingQueries).length > 0) {
    andConditions.push({
      AND: Object.keys(remainingQueries).map((key) => ({
        [key]: {
          equals: (remainingQueries as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.user.findMany({
    // where : {
    //     name :{
    //         contains : query.searchTerm as string,
    //         mode: 'insensitive'
    //     }
    // }
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    },
    // include:{admin:true,patient:true,doctor:true}
  });
  const total = await prisma.user.count({
    where: whereConditions,
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

const getMyProfilefromDB = async (token: string) => {
  const decoded = verifyToken(token, config.JWT.ACCESS_TOKEN_SECRET as string);
  if (!decoded) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorised");
  }
  const result = await prisma.userProfile.findUniqueOrThrow({
    where: {
      userId: decoded.id,
    },
    select: {
      id: true,
      userId: true,
      bio: true,
      age: true,
      createdAt: true,
      updatedAt: true,
      user: true,
    },
  });

  return result;
};
const updateMyProfileIntoDB = async (
  token: string,
  payload: Partial<TUserProfile>
) => {
  const decoded = verifyToken(token, config.JWT.ACCESS_TOKEN_SECRET as string);
  if (!decoded) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorised");
  }
  await prisma.userProfile.findUniqueOrThrow({
    where: { userId: decoded?.id },
  });
  const result = await prisma.userProfile.update({
    where: {
      userId: decoded?.id,
    },
    data: payload,

    select: {
      id: true,
      userId: true,
      bio: true,
      age: true,
      createdAt: true,
      updatedAt: true,
      user: true,
    },
  });

  return result;
};

export const userService = {
  createUserIntoDB,
  getUsersfromDB,
  getMyProfilefromDB,
  updateMyProfileIntoDB,
};
