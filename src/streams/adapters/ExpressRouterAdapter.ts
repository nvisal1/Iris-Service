import {
    Router,
    Request,
    Response,
} from 'express';
import { 
    fetchOneStream,
    fetchAllStreams,
    createNewStream,
    updateStream,
    deleteStream,
    searchStreams
} from '../Interactor';
import { mapErrorToResponseData } from '../../errors';

export function buildPublicRouter(): Router {
    const router = Router();
    router.get('/streams', fetchStreams);
    router.get('/streams/:streamId', fetchStream);
    return router;
}

export function buildPrivateRouter(): Router {
    const router = Router();
    router.post('/streams', createStream);
    router.patch('/streams/:streamId', editStream);
    router.delete('/streams/:streamId', removeStream);
    return router;
}

async function fetchStream(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const streamId = req.params.streamId;
        const result = await fetchOneStream(streamId);
        res.status(200).json(result);
    } catch (error) {
        if(error instanceof Error) {
            const response = mapErrorToResponseData(error);
            res.status(response.code).json({ message: response.message });
        } else {
            res.sendStatus(500);
        }
    }
}

async function fetchStreams(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        let results;
        if (req.query.text) {
            results = await searchStreams(req.query.text);
            console.log(results);
        } else {
            results = await fetchAllStreams();
        }
        res.status(200).json(results);
    } catch (error) {
        if(error instanceof Error) {
            const response = mapErrorToResponseData(error);
            res.status(response.code).json({ message: response.message });
        } else {
            res.sendStatus(500);
        }
    }
}

async function createStream(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const streamTitle = req.body.title;
        const streamDescription = req.body.description;
        const streamThumbnail = req.body.thumbnail;
        await createNewStream(streamTitle, streamDescription, streamThumbnail);
        res.sendStatus(200);
    } catch (error) {
        if(error instanceof Error) {
            const response = mapErrorToResponseData(error);
            res.status(response.code).json({ message: response.message });
        } else {
            res.sendStatus(500);
        }
    }
}

async function editStream(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const streamId = req.params.streamId;
        const streamTitle = req.body.title;
        const streamDescription = req.body.description;
        const streamThumbnail = req.body.thumbnail;
        await updateStream(streamId, streamTitle, streamDescription, streamThumbnail);
        res.sendStatus(200);
    } catch (error) {
        if(error instanceof Error) {
            const response = mapErrorToResponseData(error);
            res.status(response.code).json({ message: response.message });
        } else {
            res.sendStatus(500);
        }
    }
}

async function removeStream(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const streamId = req.params.streamId;
        const result = await deleteStream(streamId);
        res.status(200).json({ id: streamId });
    } catch (error) {
        if(error instanceof Error) {
            const response = mapErrorToResponseData(error);
            res.status(response.code).json({ message: response.message });
        } else {
            res.sendStatus(500);
        }
    }
}