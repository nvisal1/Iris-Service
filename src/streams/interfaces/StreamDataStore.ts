import { Stream } from "../../shared/types/stream";
import { WriteableStream } from "../../shared/types/WriteableStream";


export abstract class StreamDataStore {
    [x: string]: any;
    abstract fetchStream(id: string): Promise<Stream>;
    abstract fetchStreams(): Promise<Stream[]>;
    abstract createStream(writeable: WriteableStream): Promise<void>;
    abstract editStream(
        id: string,
        modifications: WriteableStream
    ): Promise<void>;
    abstract removeStream(id: string): Promise<void>;
    abstract searchStreams(query: string): Promise<Stream[]>;
}