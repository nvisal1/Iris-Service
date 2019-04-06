import { Mongo } from '../../drivers/mongo';
import { Db, ObjectId } from 'mongodb';
import { StreamDataStore } from '../interfaces/StreamDataStore';
import { Stream } from '../../shared/types/stream';
import * as uuid from 'uuid';
import { WriteableStream } from '../../shared/types/WriteableStream';

const MONGO_COLLECTIONS = {
    STREAMS: 'streams',
}

export class MongoStreamDataStore implements StreamDataStore {
    private db: Db;
    private static instance: MongoStreamDataStore;

    constructor() {
        this.db = Mongo.getConnection();
    }


    static getInstance(): MongoStreamDataStore {
        if (!this.instance) {
          this.instance = new MongoStreamDataStore();
        }
        return this.instance;
    }
    
    async fetchStream(id: string): Promise<Stream> {
        const stream = await this.db
            .collection(MONGO_COLLECTIONS.STREAMS)
            .findOne({
                _id: new ObjectId(id),
            });
        console.log(stream);
        return stream;
    }

    async fetchStreams(): Promise<Stream[]> {
        const streams = await this.db
            .collection(MONGO_COLLECTIONS.STREAMS)
            .find()
            .toArray()
        return streams;
    }


    async searchStreams(query: string): Promise<Stream[]> {
        const streams = await this.db
            .collection(MONGO_COLLECTIONS.STREAMS)
            .find({
                title: { $regex: query  }
            })
            .toArray();
        return streams;
    }

    async createStream(writeable: WriteableStream): Promise<void> {
        const streamKey = uuid.v4()
        const stream = {
            ...writeable,
            streamKey,
        };
        await this.db
            .collection(MONGO_COLLECTIONS.STREAMS)
            .insert(stream);
    }

    async editStream(id: string, modifications: WriteableStream): Promise<void> {
        console.log(modifications)
        await this.db
            .collection(MONGO_COLLECTIONS.STREAMS)
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: { 
                    title: modifications.title,
                    description: modifications.description,
                    thumbnail: modifications.thumbnail,
                } },
            );
    }

    async removeStream(id: string): Promise<void> {
        await this.db
            .collection(MONGO_COLLECTIONS.STREAMS)
            .deleteOne({
                _id: new ObjectId(id),
            });
    }
}