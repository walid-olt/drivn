import jwt, { type SignOptions } from "jsonwebtoken";
import { type User } from "@drivn/shared";
import { tryCatchSync } from "./result.ts";
import {
  InternalServerErrorException,
  toSignError,
  toUnauthorizedException,
  UnauthorizedException,
} from "../errors/http.exception.ts";
import type { Result } from "../types/result.ts";

export interface JwtPayload {
  id: string;
  email: string;
}

export class JwtManager {
  static sign = (user: User): Result<string, InternalServerErrorException> =>
    tryCatchSync(
      () =>
        jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRE_IN as SignOptions["expiresIn"],
            algorithm: "HS256",
          },
        ),
      toSignError,
    );

  static verify = (token: string): Result<JwtPayload, UnauthorizedException> =>
    tryCatchSync(
      () =>
        jwt.verify(token, process.env.JWT_SECRET, {
          algorithms: ["HS256"],
        }) as JwtPayload,
      toUnauthorizedException,
    );
}
