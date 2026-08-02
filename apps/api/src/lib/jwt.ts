import jwt, {
	JsonWebTokenError,
	NotBeforeError,
	TokenExpiredError,
	type SignOptions,
} from 'jsonwebtoken';
import { ApiErrorCode, type User } from '@drivn/shared';
import { tryCatchSync } from './result.ts';
import { InternalServerErrorException, UnauthorizedException } from '../errors/http.exception.ts';
import type { Result } from '../types/result.ts';

export interface JwtPayload {
	id: string;
	email: string;
}

const toUnauthorizedException = (err: unknown): UnauthorizedException => {
	if (err instanceof TokenExpiredError) {
		return new UnauthorizedException('Token has expired', ApiErrorCode.AUTH_EXPIRATION);
	}
	if (err instanceof JsonWebTokenError || err instanceof NotBeforeError) {
		return new UnauthorizedException(
			'Invalid or malformed token',
			ApiErrorCode.AUTH_INVALID_CREDENTIALS,
		);
	}
	return err instanceof UnauthorizedException
		? err
		: new UnauthorizedException('Authentication failed', ApiErrorCode.AUTH_INVALID_CREDENTIALS);
};

const toSignError = (err: unknown): InternalServerErrorException =>
	err instanceof InternalServerErrorException
		? err
		: new InternalServerErrorException('Failed to sign token');

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
						expiresIn: process.env.JWT_EXPIRE_IN as SignOptions['expiresIn'],
						algorithm: 'HS256',
					},
				),
			toSignError,
		);

	static verify = (token: string): Result<JwtPayload, UnauthorizedException> =>
		tryCatchSync(
			() =>
				jwt.verify(token, process.env.JWT_SECRET, {
					algorithms: ['HS256'],
				}) as JwtPayload,
			toUnauthorizedException,
		);
}



