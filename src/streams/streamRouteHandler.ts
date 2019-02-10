import { Router, Request, Response } from 'express';
import { DataStore } from '../interfaces/datastore';
import { fetchAllStreams, createNewStream, fetchOneStream, updateStream, deleteStream } from './streamInteractor';
import { mapErrorToStatus } from '../errors';

export function initialize({
    router,
    dataStore
}: {
    router: Router;
    dataStore: DataStore;
}): Router {

    const createStream = async(req: Request, res: Response) => {
        try {
            const streamTitle = req.body.title;
            const streamDescription = req.body.description;
            await createNewStream(dataStore, streamTitle, streamDescription);
            res.sendStatus(200);
        } catch (error) {
            if(error instanceof Error) {
                const response = mapErrorToStatus(error);
                res.status(response.code).json({ message: response.message });
            } else {
                res.sendStatus(500);
            }
        }
    }

    const fetchStreams = async(req: Request, res: Response) => {
        try {
            const result = await fetchAllStreams(dataStore);
            res.status(200).json(result);
        } catch (error) {
            if(error instanceof Error) {
                const response = mapErrorToStatus(error);
                res.status(response.code).json({ message: response.message });
            } else {
                res.sendStatus(500);
            }
        }
    }

    const fetchStream = async(req: Request, res: Response) => {
        try {
            const streamId = req.params.streamId;
            const result = await fetchOneStream(dataStore, streamId);
            res.status(200).json(result);
        } catch (error) {
            if(error instanceof Error) {
                const response = mapErrorToStatus(error);
                res.status(response.code).json({ message: response.message });
            } else {
                res.sendStatus(500);
            }
        }
    }

    const editStream = async(req: Request, res: Response) => {
        try {
            const streamId = req.params.streamId;
            const streamTitle = req.body.title;
            const streamDescription = req.body.description;
            await updateStream(dataStore, streamId, streamTitle, streamDescription);
            res.sendStatus(200);
        } catch (error) {
            if(error instanceof Error) {
                const response = mapErrorToStatus(error);
                res.status(response.code).json({ message: response.message });
            } else {
                res.sendStatus(500);
            }
        }
    }

    const removeStream = async(req: Request, res: Response) => {
        try {
            const streamId = req.params.streamId;
            const result = await deleteStream(dataStore, streamId);
            res.status(200).json({ value: result });
        } catch (error) {
            if(error instanceof Error) {
                const response = mapErrorToStatus(error);
                res.status(response.code).json({ message: response.message });
            } else {
                res.sendStatus(500);
            }
        }
    }

    router.get('/streams', fetchStreams);
    router.post('/streams', createStream);
    router.get('/streams/:streamId', fetchStream);
    router.patch('/streams/:streamId', editStream);
    router.delete('/streams/:streamId', removeStream);
    
    return router;
}

