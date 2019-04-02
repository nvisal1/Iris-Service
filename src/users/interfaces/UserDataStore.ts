import { User } from "../../shared/types/user";
import { WriteableUser } from "../../shared/types/WriteableUser";

export abstract class UserDataStore {
    abstract findUserByUsername(username: string): Promise<User>
    abstract insertUser(user: WriteableUser): Promise<void>;
}