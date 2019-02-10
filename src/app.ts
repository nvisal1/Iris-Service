import { ExpressDriver } from "./drivers/express-driver";
import CouchbaseDriver from "./streams/streamDataStore";
import * as dotenv from 'dotenv';
dotenv.config();

CouchbaseDriver.build(process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_URI)
    .then(datastore => {
        ExpressDriver.buildServer(datastore);
    })
    .catch(error => {
        console.error(error);
    });
    
