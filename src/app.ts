import { Express } from'./drivers/express';
import { Mongo } from './drivers/mongo';

import * as dotenv from 'dotenv';
import { Streams } from './streams';
import { Users } from './users';

dotenv.config();

/**
 * Initializes the application. 
 * Waits for connection to the database to be established and then starts the Express server.
 * @returns { Promise<void> }
 */
async function startApp(): Promise<void> {
    await Mongo.build(process.env.DB_URI);
    initModules();
    await Express.build();
}

/**
 * Initializes all Modules for the application
 */
function initModules() {
    Users.adapter;
    Streams.initialize();
    // Users.initialize();
}

console.log('start app');
startApp();
  
