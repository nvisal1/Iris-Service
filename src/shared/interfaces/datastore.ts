import { Stream } from "../types/stream";
import { User } from "../types/user";

export interface DataStore {
    fetchStreams():Promise<Stream[]>;
    fetchStream(streamId: string): Promise<Stream>;
    createStream(updates: Stream): Promise<void>;
    updateStream(streamId: string, updates: Stream): Promise<void>;
    deleteStream(streamId: string): Promise<void>;
    getUser(username: string): Promise<User>;
}