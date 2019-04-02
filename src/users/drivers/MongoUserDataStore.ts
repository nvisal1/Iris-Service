import { UserDataStore } from "../interfaces/UserDataStore";
import { User } from "../../shared/types/user";
import { Mongo } from "../../drivers/mongo";
import { Db } from "mongodb";
import { WriteableUser } from "../../shared/types/WriteableUser";

const MONGO_COLLECTIONS = {
    USERS: 'users',
}

export class MongoUserDataStore implements UserDataStore{
    private db: Db;
    private static instance: MongoUserDataStore;

    constructor() {
        this.db = Mongo.getConnection();
    }

    static getInstance(): MongoUserDataStore {
        if (!this.instance) {
          this.instance = new MongoUserDataStore();
        }
        return this.instance;
    }

    async findUserByUsername(username: string): Promise<User> {
        const user = await this.db
            .collection(MONGO_COLLECTIONS.USERS)
            .findOne({
                username
            });
        return user;
    }

    async insertUser(user: WriteableUser): Promise<void> {
        await this.db
            .collection(MONGO_COLLECTIONS.USERS)
            .insertOne(user);
    }
}