import prisma from "../../utils/prisma";
import * as bcrypt from "bcrypt";
import { generateToken, verifyToken } from "./auth.utils";
import config from "../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  const isCorrectPassword = await bcrypt.compare(
    payload?.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED,"Invalid password");
  }
  const accessToken = generateToken(
    {
      email: userData?.email,
      id: userData?.id,
    },
    
    config.JWT.ACCESS_TOKEN_SECRET!,
    config.JWT.ACCESS_TOKEN_EXPIRES_IN!
  );
  const refreshToken = generateToken(
    {
      email: userData?.email,
      id: userData?.id,
    },
    config.JWT.REFRESH_TOKEN_SECRET!,
    config.JWT.REFRESH_TOKEN_EXPIRES_IN!
  );
  return {
    userData,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(token, "abcdefghjklmnopqrstuvwxyz");
    console.log(decodedData);
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED,"You are not authorized");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
    },
  });

  const accessToken = generateToken(
    {
      email: userData?.email,
      id: userData?.id,
    },
    config.JWT.ACCESS_TOKEN_SECRET!,
    config.JWT.ACCESS_TOKEN_EXPIRES_IN!
  );
  return {
    accessToken,
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
};
