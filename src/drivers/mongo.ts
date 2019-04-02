import { MongoClient, Db } from 'mongodb';
import { ServiceError, ServiceErrorReason, ResourceError, ResourceErrorReason } from '../errors';

export class Mongo {
  private static db: Db;
  private static mongoClient: MongoClient;

  private constructor() {}

/**
 * Establishes a connection to MongoDB. 
 * Sets db and mongoClient
 * @param { string } dbURI MonogDB connection string
 * @property { number } retryAttempt optional parameter to allow for retry attempts
 * @returns { Promise<void> }
 */
  private async connect(dbURI: string, retryAttempt?: number): Promise<void> {
    try {
      Mongo.mongoClient = await MongoClient.connect(dbURI);
      Mongo.db = Mongo.mongoClient.db();
    } catch (error) {
      if (!retryAttempt) {
        this.connect(dbURI, 1);
      } else {
        console.error(error);
        throw new ServiceError(ServiceErrorReason.INTERNAL);
      }
    }
  }

  /**
   * Close the database. Note that this will affect all services
   * and scripts using the database, so only do this if it's very
   * important or if you are sure that *everything* is finished.
   */
  static disconnect(): void {
    Mongo.mongoClient.close();
  }

/**
 * Orchestrates `connect` function. 
 * Only create a connection if a connection does not already exist
 * @export
 * @param { string } dbURI MonogDB connection string
 * @returns { Promise<void> }
 */
  static async build(dburi: string): Promise<void> {
    try {
      if (!Mongo.mongoClient) {
        const driver = new Mongo();
        await driver.connect(dburi);
      } else {
        throw new ServiceError(ServiceErrorReason.INTERNAL);
      }
    } catch (error) {
      console.error(error);
      throw new ServiceError(ServiceErrorReason.INTERNAL);
    }
  }

/**
 * Getter function for database connection
 * @export
 * @returns { Db }
 */
  static getConnection(): Db {
    return this.db;
  }
}
