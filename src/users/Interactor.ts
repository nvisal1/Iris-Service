import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Users as Module } from '.';
import { UserDataStore } from "./interfaces/UserDataStore";
import { ServiceError, ServiceErrorReason } from "../errors";

namespace Drivers {
    export const dataStore = () =>
      Module.resolveDependency(UserDataStore);
}

export async function login(
    username: string,
    password: string,
): Promise<string> {
    try {
        const user = await Drivers.dataStore().findUserByUsername(username);
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const { password, ...authUser } = user;
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    user: authUser
                  }, 'iris_secret');
                return token;
            }
        }
    } catch (error) {
        throw new ServiceError(ServiceErrorReason.INTERNAL);
    }
}


export async function registerUser(params: {
    username: string,
    email: string,
    password: string,
}): Promise<string> {
    try {
        const user = await Drivers.dataStore().findUserByUsername(params.username);
        if (!user) {
            const hash = await bcrypt.hash(params.password, 10);
            const newUser = {
                username: params.username,
                password: hash, 
                email: params.email
            };
            await Drivers.dataStore().insertUser(newUser);
            const { password, ...authUser } = newUser;
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                user: authUser
                }, 'iris_secret');
            return token;
        }
    } catch (error) {
        throw new ServiceError(ServiceErrorReason.INTERNAL);
    }
}

