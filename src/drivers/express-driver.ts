import * as express from 'express';
import { DataStore } from '../interfaces/datastore';
import { initialize } from '../streams/streamRouteHandler';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

export class ExpressDriver {

    private constructor(private dataStore: DataStore) {
        this.initExpress();
    }

    static buildServer(datastore: DataStore) {
        return new ExpressDriver(datastore);
    }

    private initExpress() {
        let app = express();
        let router = express.Router();

        app.use(
            bodyParser.urlencoded({
              extended: true,
            }),
          );
        app.use(bodyParser.json());

        app.use(
            cors({
              origin: true,
              credentials: true,
            }),
          );

        app.use(initialize({router, dataStore: this.dataStore}));

        app.listen(process.env.PORT, () => {
            console.log(`Iris API is listening on port ${process.env.PORT}`);
        });
    }
}