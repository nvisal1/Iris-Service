import {
    Router,
    Request,
    Response,
} from 'express';
import { login, registerUser } from '../Interactor';
import { mapErrorToResponseData } from '../../errors';

export function buildPublicRouter(): Router {
    const router = Router();
    router.post('/users/login', signIn);
    router.post('/users', register);
    return router;
}

export function buildPrivateRouter(): Router {
    const router = Router();
    return router;
}

async function signIn(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const username = req.body.user.username;
        const password = req.body.user.password;
        const token = await login(username, password);
        res.status(200).json({token});
    } catch (error) {
        if(error instanceof Error) {
            const response = mapErrorToResponseData(error);
            res.status(response.code).json({ message: response.message });
        } else {
            res.sendStatus(500);
        }
    }
}

async function register(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const username = req.body.user.username;
        const password = req.body.user.password;
        const email = req.body.user.email;
        const token = await registerUser({username, email, password});
        res.status(200).json({token});
    } catch (error) {
        if(error instanceof Error) {
            const response = mapErrorToResponseData(error);
            res.status(response.code).json({ message: response.message });
        } else {
            res.sendStatus(500);
        }
    }
}