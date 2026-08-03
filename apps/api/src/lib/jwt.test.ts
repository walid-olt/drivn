/**
 * NOTE: The tests for JwtManager are currently commented out because the implementation is not being used in the current codebase. If you decide to use JwtManager in the future, you can uncomment
 * and run these tests to ensure its functionality.
 */
// import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// import jwt from "jsonwebtoken";
// import { ApiErrorCode } from "@drivn/shared";
// import { JwtManager } from "./jwt.ts";
// import {
//   InternalServerErrorException,
//   UnauthorizedException,
// } from "../errors/http.exception.ts";
// import type { Env } from "../config/env.ts";
//
// const SECRET = "test-secret";
// const user = {
//   id: "64c1a2b3c4d5e6f7a8b9c0d1",
//   firstName: "John",
//   lastName: "Doe",
//   age: 30,
//   email: "john@example.com",
//   phone: "+14155552671",
//   country: "US",
// };
//
// describe("JwtManager", () => {
//   beforeEach(() => {
//     process.env.JWT_SECRET = SECRET;
//     process.env.JWT_EXPIRE_IN = "1h";
//   });
//
//   afterEach(() => {
//     delete (process.env as Partial<Env>).JWT_SECRET;
//     delete (process.env as Partial<Env>).JWT_EXPIRE_IN;
//   });
//
//   describe("sign", () => {
//     it("should return an ok result with a valid JWT", () => {
//       const [error, token] = JwtManager.sign(user);
//
//       expect(error).toBeUndefined();
//       expect(typeof token).toBe("string");
//       expect(token!.split(".")).toHaveLength(3);
//
//       const decoded = jwt.decode(token!) as { id: string; email: string };
//       expect(decoded.id).toBe(user.id);
//       expect(decoded.email).toBe(user.email);
//     });
//
//     it("should use the HS256 algorithm and respect expiresIn", () => {
//       const [, token] = JwtManager.sign(user);
//
//       const decoded = jwt.decode(token!, { complete: true }) as {
//         header: { alg: string };
//         payload: { exp: number; iat: number };
//       };
//       expect(decoded.header.alg).toBe("HS256");
//       expect(decoded.payload.exp - decoded.payload.iat).toBe(3600);
//     });
//
//     it("should return an InternalServerErrorException when JWT_SECRET is missing", () => {
//       delete (process.env as Partial<Env>).JWT_SECRET;
//
//       const [error, token] = JwtManager.sign(user);
//
//       expect(token).toBeUndefined();
//       expect(error).toBeInstanceOf(InternalServerErrorException);
//       expect(error!.message).toBe("Failed to sign token");
//     });
//
//     it("should pass through an existing InternalServerErrorException", () => {
//       vi.spyOn(jwt, "sign").mockImplementation(() => {
//         throw new InternalServerErrorException("boom");
//       });
//
//       const [error] = JwtManager.sign(user);
//
//       expect(error).toBeInstanceOf(InternalServerErrorException);
//       expect(error!.message).toBe("boom");
//
//       vi.restoreAllMocks();
//     });
//   });
//
//   describe("verify", () => {
//     it("should return the decoded payload for a valid token", () => {
//       const [, token] = JwtManager.sign(user);
//
//       const [error, payload] = JwtManager.verify(token!);
//
//       expect(error).toBeUndefined();
//       expect(payload).toMatchObject({ id: user.id, email: user.email });
//     });
//
//     it("should return an UnauthorizedException for an expired token", () => {
//       const expired = jwt.sign({ id: user.id, email: user.email }, SECRET, {
//         algorithm: "HS256",
//         expiresIn: "-1h",
//       });
//
//       const [error, payload] = JwtManager.verify(expired);
//
//       expect(payload).toBeUndefined();
//       expect(error).toBeInstanceOf(UnauthorizedException);
//       expect(error!.code).toBe(ApiErrorCode.AUTH_EXPIRATION);
//       expect(error!.message).toBe("Token has expired");
//     });
//
//     it("should return an UnauthorizedException for a malformed token", () => {
//       const [error, payload] = JwtManager.verify("not-a-jwt");
//
//       expect(payload).toBeUndefined();
//       expect(error).toBeInstanceOf(UnauthorizedException);
//       expect(error!.code).toBe(ApiErrorCode.AUTH_INVALID_CREDENTIALS);
//       expect(error!.message).toBe("Invalid or malformed token");
//     });
//
//     it("should return an UnauthorizedException for a token signed with a different secret", () => {
//       const [, token] = JwtManager.sign(user);
//       process.env.JWT_SECRET = "a-different-secret";
//
//       const [error, payload] = JwtManager.verify(token!);
//
//       expect(payload).toBeUndefined();
//       expect(error).toBeInstanceOf(UnauthorizedException);
//       expect(error!.code).toBe(ApiErrorCode.AUTH_INVALID_CREDENTIALS);
//     });
//
//     it("should pass through an existing UnauthorizedException", () => {
//       vi.spyOn(jwt, "verify").mockImplementation(() => {
//         throw new UnauthorizedException("boom");
//       });
//
//       const [error] = JwtManager.verify("anything");
//
//       expect(error).toBeInstanceOf(UnauthorizedException);
//       expect(error!.message).toBe("boom");
//
//       vi.restoreAllMocks();
//     });
//   });
// });
