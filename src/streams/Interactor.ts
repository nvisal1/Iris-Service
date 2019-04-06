import { Streams as Module } from '.';
import { StreamDataStore } from './interfaces/StreamDataStore';
import { Stream } from '../shared/types/stream';
import { WriteableStream } from '../shared/types/WriteableStream';

namespace Drivers {
    export const dataStore = () =>
      Module.resolveDependency(StreamDataStore);
}

/**
 * Initializes the application. 
 * Waits for connection to the database to be established and then starts the Express server.
 * Authorization:
 * *** Cannot assign if user already has a role in the given collection  ***
 * *** Must have curator relationship with specified collection to assign reviewer  ***
 * *** Admins can assign reviewers and curators to any collection ***
 * @export
 * @param params
 * @property { string } formattedAccessGroup accessGroup string formatted as `role@collection`
 * @property { UserDocument } userDocument user object fetched from database
 * @returns { Promise<void> }
 */
export async function createNewStream(
    owner: string,
    title: string,
    description: string,
    thumbnail: string,
): Promise<void> {  
    const stream = { owner, title, description, thumbnail };
    await Drivers.dataStore().createStream(stream);
}   

export async function fetchAllStreams(): Promise<Stream[]> {
    return await Drivers.dataStore().fetchStreams();
}

export async function searchStreams(query: string): Promise<Stream[]> {
    return await Drivers.dataStore().searchStreams(query);
}

export async function fetchOneStream(
    streamId: string
): Promise<Stream> {
    return await Drivers.dataStore().fetchStream(streamId);
}

export async function updateStream(
    id: string,
    streamTitle: string,
    streamDescription: string,
    streamThumbnail: string,
): Promise<void> {
    const updates: WriteableStream = {
        title: streamTitle,
        description: streamDescription,
        thumbnail: streamThumbnail,
    }
    await Drivers.dataStore().editStream(id, updates);
}

export async function deleteStream(
    streamId: string,
): Promise<void> {
    await Drivers.dataStore().removeStream(streamId);
}