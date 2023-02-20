import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { ErrorDTO } from '../types/errors-types';

export interface AuthenticatedRequest extends Request {
	user?: admin.auth.DecodedIdToken;
}

export function mandatoryAuthCheck(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const sessionCookie = req.cookies?.session;

	if (!sessionCookie) {
		return res
			.status(401)
			.send({ error: 'Unauthorized, no session cookie found' } as ErrorDTO);
	}

	admin
		.auth()
		.verifySessionCookie(sessionCookie, true)
		.then(decodedToken => {
			req.user = decodedToken; // store the user information in the request object
			next();
		})
		.catch(error => {
			console.error('Error verifying Firebase session cookie:', error);
			res.status(403).send({ error: 'Forbidden' } as ErrorDTO);
		});
}

export function optionalAuthCheck(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const sessionCookie = req.cookies?.session;

	if (!sessionCookie) {
		return next();
	} else {
		admin
			.auth()
			.verifySessionCookie(sessionCookie, true)
			.then(decodedToken => {
				req.user = decodedToken; // store the user information in the request object
				next();
			})
			.catch(error => {
				console.error('Error verifying Firebase session cookie:', error);
				res.status(403).send({ error: 'Forbidden' } as ErrorDTO);
			});
	}
}
