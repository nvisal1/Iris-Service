import { DataStore } from "../interfaces/datastore";
import { Stream } from "../types/stream";
import { checkForExpctedError, StreamErrors } from "../errors";

export async function createNewStream(
    dataStore: DataStore,
    title: string,
    description: string
): Promise<void> {  
    try {
        const updates: Stream = { title, description };
        await dataStore.createStream(updates);
    } catch(error) {
        const isExpectedError = checkForExpctedError(error);
        if(!isExpectedError) {
            return Promise.reject(new Error(StreamErrors.INTERNAL_ERROR));
        }
        return Promise.reject(error);
    }
}   

export async function fetchAllStreams(dataStore: DataStore): Promise<Stream[]> {
    try {
        const results = await dataStore.fetchStreams();
        return results;
    } catch(error) {
        const isExpectedError = checkForExpctedError(error);
        if(!isExpectedError) {
            return Promise.reject(new Error(StreamErrors.INTERNAL_ERROR));
        }
        return Promise.reject(error);
    }
}

export async function fetchOneStream(
    dataStore: DataStore,
    streamId: string
): Promise<Stream> {
    try {
        const results = await dataStore.fetchStream(streamId);
        return results;
    } catch(error) {
        const isExpectedError = checkForExpctedError(error);
        if(!isExpectedError) {
            return Promise.reject(new Error(StreamErrors.INTERNAL_ERROR));
        }
        return Promise.reject(error);
    }
}

export async function updateStream(
    dataStore: DataStore,
    streamId: string,
    streamTitle: string,
    streamDescription: string
): Promise<void> {
    try {
        const updates: Stream = {
            title: streamTitle,
            description: streamDescription
        }
        await dataStore.updateStream(streamId, updates);
    } catch(error) {
        const isExpectedError = checkForExpctedError(error);
        if(!isExpectedError) {
            return Promise.reject(new Error(StreamErrors.INTERNAL_ERROR));
        }
        return Promise.reject(error);
    }
}

export async function deleteStream(
    dataStore: DataStore,
    streamId: string,
): Promise<void> {
    try {
        await dataStore.deleteStream(streamId);
    } catch(error) {
        const isExpectedError = checkForExpctedError(error);
        if(!isExpectedError) {
            return Promise.reject(new Error(StreamErrors.INTERNAL_ERROR));
        }
        return Promise.reject(error);
    }
}