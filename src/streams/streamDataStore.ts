import { DataStore } from '../interfaces/datastore';
import { N1qlQuery, Cluster, Bucket } from 'couchbase';
import { v4 as uuid } from 'uuid';
import { Stream } from '../types/stream';
import * as util from 'util';
import { StreamErrors } from '../errors';

export default class CouchbaseDriver implements DataStore {

    private constructor(private bucket: Bucket) {
        this.mapCallbacksToPromises();
    }

    static async build(
        username: string,
        password: string,
        uri: string
    ): Promise<CouchbaseDriver> {
        try {
            const cluster = new Cluster(uri);
            cluster.authenticate(username, password);
            const bucket = cluster.openBucket('streams');
            return new CouchbaseDriver(bucket);
        } catch (error) {
            return Promise.reject(new Error(StreamErrors.INTERNAL_ERROR));
        }
    }

    async fetchStreams():Promise<Stream[]> {
        try {
            // const bucket = this.cluster.openBucket('streams');
            // let query = N1qlQuery.fromString('CREATE PRIMARY INDEX ON `streams`');
            // bucket.query(query);
            const query = N1qlQuery.fromString('SELECT meta(streams).id, title, description, streamKey FROM `streams`');
            const result = await this.bucket.query(query);
            if (result === null) {
                return Promise.reject(new Error(StreamErrors.RESOURCE_NOT_FOUND));
            }
            return result;
        } catch(error) {
            return Promise.reject(new Error(StreamErrors.INTERNAL_ERROR));
        }
    }

    async fetchStream(streamId: string): Promise<Stream> {
        try {
            const result = await this.bucket.get(streamId);
            return result;
        } catch (error) {
            if(error.message === 'The key does not exist on the server') {
                return Promise.reject(new Error(StreamErrors.RESOURCE_NOT_FOUND));
            }
            return Promise.reject(new Error(StreamErrors.INTERNAL_ERROR));
        }
    }

    async createStream(updates: Stream): Promise<void> {
        try {
            const streamId: string = uuid();
            const withStreamKey = {...updates, streamKey: uuid()};
            await this.bucket.insert(streamId, withStreamKey);
        } catch (error) {
            return Promise.reject(new Error(StreamErrors.INTERNAL_ERROR));
        }  
    }

    async updateStream(
        streamId: string,
        updates: Stream
    ): Promise<void> {
        try {
            await this.bucket.replace(streamId, updates);  
        } catch (error) {
            return Promise.reject(new Error(StreamErrors.INTERNAL_ERROR));
        }
    }

    async deleteStream(streamId: string): Promise<void> {
        try {
            await this.bucket.remove(streamId);  
        } catch (error) {
            return Promise.reject(new Error(StreamErrors.INTERNAL_ERROR));
        }
    }

    private mapCallbacksToPromises() {
        this.bucket.insert = util.promisify(this.bucket.insert);
        this.bucket.replace = util.promisify(this.bucket.replace);
        this.bucket.remove = util.promisify(this.bucket.remove);
        this.bucket.get = util.promisify(this.bucket.get);
        this.bucket.query = util.promisify(this.bucket.query);
    }        
}